'use client';

// Curriculum record — the learner's onboarding answers + progress, persisted client-side.
// The entire `state` object is a single JSON-serializable payload: today it lives in
// localStorage; when Google account sync ships, this same object is what gets stored
// server-side for premium users. Nothing here is kept on our servers.

import { useCallback, useEffect, useState } from 'react';
import { lessonSets } from '../data/lessons';
import {
  buildPlan,
  pickNext,
  stageProgress,
  dueReviews,
  intervalForBox,
  REVIEW_INTERVALS_MS,
} from '../lib/curriculum/planner';
import { readTypingGraduated } from '../lib/curriculum/typingStatus';

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
  // A coarse clock kept in state so due-review checks stay pure during render (no
  // Date.now() in the render body). Day-scale intervals don't need finer than a minute.
  const [now, setNow] = useState(0);
  // Mirror of the typing tutor's "graduated" status (read from its localStorage). Lets the
  // curriculum shove the learner out of the typing-foundations stage the moment they finish.
  const [typingGraduated, setTypingGraduated] = useState(false);

  const refreshTypingStatus = useCallback(() => setTypingGraduated(readTypingGraduated()), []);

  useEffect(() => {
    setNow(Date.now());
    setTypingGraduated(readTypingGraduated());
    const t = setInterval(() => {
      setNow(Date.now());
      setTypingGraduated(readTypingGraduated());
    }, 60000);
    // Catch the tutor finishing in another tab.
    const onStorage = (e) => {
      if (e.key === 'survival-russian-typing-v1') setTypingGraduated(readTypingGraduated());
    };
    if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(t);
      if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
    };
  }, []);

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

  // Record one typed mission. Bumps the lifetime rep count and tracks the current pass;
  // when a full pass over the set completes, promote it a Leitner box and schedule the
  // next review.
  const recordMission = useCallback((lessonSetId, missionId) => {
    if (!lessonSetId || !missionId) return;
    setState((prev) => {
      const now = Date.now();
      const set = lessonSets.find((s) => s.id === lessonSetId);
      const total = set?.missions?.length || 0;
      const rec = prev.records[lessonSetId] || {
        missions: {}, round: {}, box: 0, dueAt: 0, firstSeen: now, lastSeen: 0,
      };
      const missions = { ...rec.missions, [missionId]: (rec.missions[missionId] || 0) + 1 };
      const round = { ...rec.round, [missionId]: true };

      let { box = 0, dueAt = 0 } = rec;
      let nextRound = round;
      if (total > 0 && Object.keys(round).length >= total) {
        // Full pass complete — promote and schedule the next review; start a fresh pass.
        box = Math.min(box + 1, REVIEW_INTERVALS_MS.length - 1);
        dueAt = now + intervalForBox(box);
        nextRound = {};
      }

      return {
        ...prev,
        records: {
          ...prev.records,
          [lessonSetId]: { ...rec, missions, round: nextRound, box, dueAt, lastSeen: now },
        },
        updatedAt: now,
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

  // Shove them out of the nest: once the typing tutor is finished, advance the stored
  // stage pointer past typing-foundations so they land in the lessons (persisted).
  useEffect(() => {
    if (!typingGraduated || !state.plan.stageIds.length) return;
    if (state.plan.stageIds[state.stageIndex] !== 'typing-foundations') return;
    const nextIdx = state.plan.stageIds.findIndex((id) => id !== 'typing-foundations');
    if (nextIdx > state.stageIndex) {
      setState((prev) => ({ ...prev, stageIndex: nextIdx, updatedAt: Date.now() }));
    }
  }, [typingGraduated, state.plan, state.stageIndex]);

  // Derived values are left unmemoized on purpose: the React Compiler memoizes them, and
  // a manual useMemo here trips its "could not preserve memoization" bailout. The work is
  // cheap (a scan over ~6 stages).

  // The single "what next" the learner sees — scans forward from the stored stage to the
  // first actionable pick, so stage boundaries are crossed transparently.
  let recommendation = null;
  if (state.onboarded && state.plan.stageIds.length) {
    for (let idx = state.stageIndex; idx < state.plan.stageIds.length; idx++) {
      const pick = pickNext({ plan: state.plan, stageIndex: idx, records: state.records }, lessonSets);
      // Finished the typing tutor? Skip the typing stage and drop into the lessons.
      if (pick?.kind === 'typing' && typingGraduated) continue;
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

  // Interval-based review: prefer the most-overdue due set; otherwise fall back to the
  // least-recently-seen completed set so "Review" always has something useful.
  const due = dueReviews(state.records, now, lessonSets);
  const dueCount = due.length;

  const reviewRecommendation = () => {
    if (due.length) return { kind: 'lessons', lessonSetId: due[0], reason: 'Due for review.' };
    const seen = Object.entries(state.records)
      .filter(([, r]) => (r.box || 0) > 0)
      .sort((a, b) => (a[1].lastSeen || 0) - (b[1].lastSeen || 0));
    return seen.length
      ? { kind: 'lessons', lessonSetId: seen[0][0], reason: 'Keeping it fresh.' }
      : null;
  };

  const progress = stageProgress(state.plan, state.records, lessonSets);

  return {
    ready,
    onboarded: state.onboarded,
    questionnaire: state.questionnaire,
    records: state.records,
    recommendation,
    reviewRecommendation,
    dueCount,
    progress,
    submitQuestionnaire,
    recordMission,
    syncStageIndex,
    resetCurriculum,
    refreshTypingStatus,
    typingGraduated,
  };
}
