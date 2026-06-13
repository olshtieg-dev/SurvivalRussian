'use client';

// Curriculum record — the learner's onboarding answers + progress, persisted client-side.
// The entire `state` object is a single JSON-serializable payload: today it lives in
// localStorage; when Google account sync ships, this same object is what gets stored
// server-side for premium users. Nothing here is kept on our servers.

import { useCallback, useEffect, useState } from 'react';
import { lessonSets } from '../data/lessons';
import { buildPlan, pickNext, stageProgress } from '../lib/curriculum/planner';

const STORAGE_KEY = 'survival-russian-curriculum-v1';
const VERSION = 1;

function freshState() {
  return {
    version: VERSION,
    onboarded: false,
    questionnaire: { qwertyTouchType: null, russianType: null, russianLevel: null, goal: null },
    plan: { stageIds: [], startIndex: 0 },
    stageIndex: 0,
    // records[lessonSetId] = { missions: { [missionId]: repCount }, lastSeen, firstSeen }
    records: {},
    updatedAt: 0,
  };
}

export function useCurriculum() {
  const [state, setState] = useState(freshState);
  const [ready, setReady] = useState(false);

  // Load once, post-mount (SSR-safe).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === VERSION) setState({ ...freshState(), ...parsed });
      }
    } catch {
      // corrupt / unavailable — keep defaults
    }
    setReady(true);
  }, []);

  // Persist after load.
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / unavailable
    }
  }, [state, ready]);

  const submitQuestionnaire = useCallback((answers) => {
    setState((prev) => {
      const plan = buildPlan(answers);
      return {
        ...prev,
        onboarded: true,
        questionnaire: { ...prev.questionnaire, ...answers },
        plan,
        stageIndex: plan.startIndex,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Record one typed mission. Idempotent-ish: bumps the rep count for that mission.
  const recordMission = useCallback((lessonSetId, missionId) => {
    if (!lessonSetId || !missionId) return;
    setState((prev) => {
      const rec = prev.records[lessonSetId] || { missions: {}, firstSeen: Date.now(), lastSeen: 0 };
      const missions = { ...rec.missions, [missionId]: (rec.missions[missionId] || 0) + 1 };
      return {
        ...prev,
        records: {
          ...prev.records,
          [lessonSetId]: { ...rec, missions, lastSeen: Date.now() },
        },
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Persist a forward jump of the stage pointer (called when the learner accepts a
  // recommendation that lives past the stored stageIndex — keeps us from rescanning
  // completed stages forever).
  const syncStageIndex = useCallback((resolvedIndex) => {
    setState((prev) =>
      typeof resolvedIndex === 'number' && resolvedIndex > prev.stageIndex
        ? { ...prev, stageIndex: resolvedIndex }
        : prev,
    );
  }, []);

  const resetCurriculum = useCallback(() => setState(freshState()), []);

  // Derived values are left unmemoized on purpose: the React Compiler memoizes them, and
  // a manual useMemo here trips its "could not preserve memoization" bailout. The work is
  // cheap (a scan over ~6 stages).

  // The single "what next" the learner sees — scans forward from the stored stage to the
  // first actionable pick, so stage boundaries are crossed transparently.
  let recommendation = null;
  if (state.onboarded && state.plan.stageIds.length) {
    for (let idx = state.stageIndex; idx < state.plan.stageIds.length; idx++) {
      const pick = pickNext({ plan: state.plan, stageIndex: idx, records: state.records }, lessonSets);
      if (pick && (pick.kind === 'typing' || pick.lessonSetId)) {
        recommendation = { ...pick, stageIndexResolved: idx };
        break;
      }
    }
    if (!recommendation) {
      // Whole plan finished — fall back to review of the least-recently-seen set.
      const lastIdx = state.plan.stageIds.length - 1;
      const rev = pickNext({ plan: state.plan, stageIndex: lastIdx, records: state.records }, lessonSets, { review: true });
      if (rev) recommendation = { ...rev, stageIndexResolved: lastIdx, allComplete: true };
    }
  }

  const reviewRecommendation = () => {
    if (!state.plan.stageIds.length) return null;
    const lastIdx = Math.min(state.stageIndex, state.plan.stageIds.length - 1);
    return pickNext({ plan: state.plan, stageIndex: lastIdx, records: state.records }, lessonSets, { review: true });
  };

  const progress = stageProgress(state.plan, state.records, lessonSets);

  return {
    ready,
    onboarded: state.onboarded,
    questionnaire: state.questionnaire,
    records: state.records,
    recommendation,
    reviewRecommendation,
    progress,
    submitQuestionnaire,
    recordMission,
    syncStageIndex,
    resetCurriculum,
  };
}
