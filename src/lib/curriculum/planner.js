// Curriculum planner — pure functions that turn the onboarding questionnaire + the
// learner's record into "what to drill next", so the learner never has to browse the
// catalogue. No React, no storage; all inputs passed in (unit-testable).

import { STAGES, STAGE_BY_ID } from './catalog';

// Does the learner need the typing-foundations stage at all?
export function needsTyping(q) {
  return (
    q?.qwertyTouchType === 'no' ||
    q?.qwertyTouchType === 'some' ||
    q?.russianType === 'no'
  );
}

// Which stage should this learner be dropped into first?
export function startStageId(q) {
  if (needsTyping(q)) return 'typing-foundations';
  if (q?.russianLevel === 'intermediate') return 'grammar-depth';
  if (q?.russianLevel === 'some') return 'building-blocks';
  return 'core-lexical';
}

// The learner's ordered plan: every stage in canonical order, dropping typing-foundations
// unless it's needed, with the entry point chosen from their level/typing answers.
export function buildPlan(q) {
  const include = needsTyping(q);
  const stageIds = STAGES.filter((s) => s.id !== 'typing-foundations' || include).map((s) => s.id);
  const startId = startStageId(q);
  const startIndex = Math.max(0, stageIds.indexOf(startId));
  return { stageIds, startIndex };
}

// Resolve a stage into an ordered list of concrete lessonSet ids, using the live registry.
// `ids` first (curated), then each `group`'s members in registry order.
export function stageSetIds(stage, lessonSets) {
  if (!stage || stage.kind !== 'lessons') return [];
  const out = [];
  for (const id of stage.ids || []) {
    if (lessonSets.some((s) => s.id === id)) out.push(id);
  }
  for (const g of stage.groups || []) {
    for (const s of lessonSets) if (s.groupId === g) out.push(s.id);
  }
  return out;
}

// Is a lessonSet "done"? Done = every mission in it has been typed at least once.
export function isSetDone(lessonSetId, records, lessonSets) {
  const rec = records?.[lessonSetId];
  if (!rec) return false;
  const set = lessonSets.find((s) => s.id === lessonSetId);
  const total = set?.missions?.length || 0;
  if (!total) return (rec.completions || 0) > 0;
  const seen = Object.keys(rec.missions || {}).length;
  return seen >= total;
}

// Pick the next thing to serve.
// Returns { stageId, kind:'typing' } OR { stageId, kind:'lessons', lessonSetId, reason }
// OR { stageId, stageComplete:true } when the current stage is exhausted.
export function pickNext({ plan, stageIndex, records }, lessonSets, opts = {}) {
  const review = !!opts.review;
  if (!plan?.stageIds?.length) return null;
  const idx = Math.min(Math.max(stageIndex || 0, 0), plan.stageIds.length - 1);
  const stageId = plan.stageIds[idx];
  const stage = STAGE_BY_ID[stageId];
  if (!stage) return null;

  if (review) {
    const seen = Object.entries(records || {})
      .filter(([, r]) => Object.keys(r.missions || {}).length > 0)
      .sort((a, b) => (a[1].lastSeen || 0) - (b[1].lastSeen || 0));
    if (seen.length) {
      return { stageId, kind: 'lessons', lessonSetId: seen[0][0], reason: 'Revisiting what needs reinforcing.' };
    }
  }

  if (stage.kind === 'typing') {
    return { stageId, kind: 'typing', reason: 'Build your typing foundation first.' };
  }

  const ids = stageSetIds(stage, lessonSets);
  const next = ids.find((id) => !isSetDone(id, records, lessonSets));
  if (next) return { stageId, kind: 'lessons', lessonSetId: next, reason: `Next in ${stage.label}.` };
  return { stageId, kind: 'lessons', lessonSetId: null, stageComplete: true, reason: `${stage.label} complete.` };
}

// Per-stage progress summary for the panel: { stageId, label, total, done }.
export function stageProgress(plan, records, lessonSets) {
  if (!plan?.stageIds) return [];
  return plan.stageIds.map((sid) => {
    const stage = STAGE_BY_ID[sid];
    if (!stage || stage.kind !== 'lessons') {
      return { stageId: sid, label: stage?.label || sid, kind: stage?.kind, total: 0, done: 0 };
    }
    const ids = stageSetIds(stage, lessonSets);
    const done = ids.filter((id) => isSetDone(id, records, lessonSets)).length;
    return { stageId: sid, label: stage.label, kind: 'lessons', total: ids.length, done };
  });
}
