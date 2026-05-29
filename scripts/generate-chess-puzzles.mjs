// Fast offline puzzle generator for sparse K+pieces-vs-K endgames.
// Uses a purpose-built mate solver (no chess.js in the hot loop) to find minimal
// forced-mate depth, then VERIFIES every kept puzzle with chess.js so correctness
// is guaranteed by the trusted engine. Run:
//   node scripts/generate-chess-puzzles.mjs
import { Chess } from 'chess.js';
import fs from 'node:fs';
import path from 'node:path';

// --- board helpers: square = rank*8 + file, file/rank in 0..7 -------------
const fileOf = (s) => s & 7;
const rankOf = (s) => s >> 3;
const onBoard = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8;
const cheb = (a, b) => Math.max(Math.abs(fileOf(a) - fileOf(b)), Math.abs(rankOf(a) - rankOf(b)));
const sqName = (s) => String.fromCharCode(97 + fileOf(s)) + (rankOf(s) + 1);

const KING_VEC = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_VEC = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const QUEEN_VEC = KING_VEC;
const vecsFor = (t) => (t === 'R' ? ROOK_VEC : QUEEN_VEC);

// A position: { wk, bk, pieces: [{type:'Q'|'R', sq}] }
function occupiedMap(pos) {
  const occ = new Map();
  occ.set(pos.wk, { side: 'w', type: 'K' });
  occ.set(pos.bk, { side: 'b', type: 'K' });
  for (const p of pos.pieces) occ.set(p.sq, { side: 'w', type: p.type });
  return occ;
}

// Is `target` attacked by a white slider sitting at `from`? `blockers` is a Set of
// occupied squares to treat as blocking (should exclude `from` and `target`).
function sliderHits(from, target, vecs, blockers) {
  const ff = fileOf(from), fr = rankOf(from);
  for (const [df, dr] of vecs) {
    let f = ff + df, r = fr + dr;
    while (onBoard(f, r)) {
      const s = r * 8 + f;
      if (s === target) return true;
      if (blockers.has(s)) break;
      f += df; r += dr;
    }
  }
  return false;
}

// Is `target` attacked by white, given white king square and slider list, with a
// blocker set (occupied squares minus target)?
function attackedByWhite(target, wk, pieces, blockers) {
  if (cheb(target, wk) <= 1) return true;
  for (const p of pieces) {
    if (p.sq === target) continue;
    if (sliderHits(p.sq, target, vecsFor(p.type), blockers)) return true;
  }
  return false;
}

function whiteMoves(pos) {
  const occ = occupiedMap(pos);
  const moves = [];
  // king moves
  const wf = fileOf(pos.wk), wr = rankOf(pos.wk);
  for (const [df, dr] of KING_VEC) {
    const f = wf + df, r = wr + dr;
    if (!onBoard(f, r)) continue;
    const s = r * 8 + f;
    if (occ.has(s)) continue;                 // own piece or black king
    if (cheb(s, pos.bk) <= 1) continue;        // kings can't be adjacent
    moves.push({ piece: 'K', from: pos.wk, to: s });
  }
  // slider moves (to empty squares only — nothing to capture but the king)
  for (let i = 0; i < pos.pieces.length; i++) {
    const p = pos.pieces[i];
    const pf = fileOf(p.sq), pr = rankOf(p.sq);
    for (const [df, dr] of vecsFor(p.type)) {
      let f = pf + df, r = pr + dr;
      while (onBoard(f, r)) {
        const s = r * 8 + f;
        if (occ.has(s)) break;                 // blocked (own king / black king)
        moves.push({ piece: p.type, from: p.sq, to: s, idx: i });
        f += df; r += dr;
      }
    }
  }
  return moves;
}

function applyWhite(pos, m) {
  if (m.piece === 'K') return { wk: m.to, bk: pos.bk, pieces: pos.pieces };
  const pieces = pos.pieces.slice();
  pieces[m.idx] = { type: m.piece, sq: m.to };
  return { wk: pos.wk, bk: pos.bk, pieces };
}

function blackInCheck(pos) {
  const blockers = new Set([pos.wk, ...pos.pieces.map((p) => p.sq)]);
  return attackedByWhite(pos.bk, pos.wk, pos.pieces, blockers);
}

function blackKingMoves(pos) {
  const bf = fileOf(pos.bk), br = rankOf(pos.bk);
  const occWhitePieces = new Map(pos.pieces.map((p) => [p.sq, p.type]));
  const moves = [];
  for (const [df, dr] of KING_VEC) {
    const f = bf + df, r = br + dr;
    if (!onBoard(f, r)) continue;
    const s = r * 8 + f;
    if (cheb(s, pos.wk) <= 1) continue;        // adjacent to white king
    const capturesIdx = occWhitePieces.has(s)
      ? pos.pieces.findIndex((p) => p.sq === s)
      : -1;
    // resulting white pieces (minus captured) and blocker set (minus old bk, minus captured, +new bk)
    const remaining = capturesIdx >= 0 ? pos.pieces.filter((_, i) => i !== capturesIdx) : pos.pieces;
    const blockers = new Set([pos.wk, ...remaining.map((p) => p.sq), s]);
    blockers.delete(pos.bk); // old king square no longer blocks
    if (attackedByWhite(s, pos.wk, remaining, blockers)) continue;
    moves.push({ to: s, capturesIdx });
  }
  return moves;
}

function applyBlack(pos, m) {
  const pieces = m.capturesIdx >= 0 ? pos.pieces.filter((_, i) => i !== m.capturesIdx) : pos.pieces;
  return { wk: pos.wk, bk: m.to, pieces };
}

// White (to move) forces mate within n? Returns PV as [{from,to,piece}|{to}] or null.
function mateIn(pos, n) {
  for (const wm of whiteMoves(pos)) {
    const np = applyWhite(pos, wm);
    const inChk = blackInCheck(np);
    const bms = blackKingMoves(np);
    if (inChk && bms.length === 0) return [wm];
    if (n > 1 && inChk) {
      // only forcing lines (check now) to stay fast & clean
      if (bms.length === 0) continue;
      let all = true, pv = null;
      for (const bm of bms) {
        const sub = mateIn(applyBlack(np, bm), n - 1);
        if (!sub) { all = false; break; }
        if (!pv) pv = [bm, ...sub];
      }
      if (all && pv) return [wm, ...pv];
    }
  }
  return null;
}

function minimalMate(pos) {
  for (let n = 1; n <= 3; n++) {
    const pv = mateIn(pos, n);
    if (pv) return { depth: n, pv };
  }
  return null;
}

// PV (white move, black move, ...) -> UCI strings
function pvToUci(pv, pos) {
  const out = [];
  let cur = pos, whiteToMove = true;
  for (const m of pv) {
    if (whiteToMove) { out.push(sqName(m.from) + sqName(m.to)); cur = applyWhite(cur, m); }
    else { out.push(sqName(cur.bk) + sqName(m.to)); cur = applyBlack(cur, m); }
    whiteToMove = !whiteToMove;
  }
  return out;
}

function toFen(pos) {
  const place = {};
  place[sqName(pos.wk)] = 'K';
  place[sqName(pos.bk)] = 'k';
  for (const p of pos.pieces) place[sqName(p.sq)] = p.type;
  const rows = [];
  for (let r = 8; r >= 1; r--) {
    let row = '', e = 0;
    for (const f of 'abcdefgh') {
      const p = place[f + r];
      if (p) { if (e) { row += e; e = 0; } row += p; } else e++;
    }
    if (e) row += e;
    rows.push(row);
  }
  return rows.join('/') + ' w - - 0 1';
}

// chess.js verification: replay the PV; every move legal and the line ends in mate.
function verifyWithChessJs(fen, pvUci) {
  let c;
  try { c = new Chess(fen); } catch { return false; }
  if (c.isGameOver()) return false;
  for (const u of pvUci) {
    let mv;
    try { mv = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || 'q' }); } catch { return false; }
    if (!mv) return false;
  }
  return c.isCheckmate();
}

// --- generation -----------------------------------------------------------
const MATERIAL = [
  { theme: 'Queen mate', pieces: ['Q'] },
  { theme: 'Rook mate', pieces: ['R'] },
  { theme: 'Two-rook mate', pieces: ['R', 'R'] },
  { theme: 'Queen & rook mate', pieces: ['Q', 'R'] },
];
const RIM = (() => { const e = []; for (let s = 0; s < 64; s++) { const f = fileOf(s), r = rankOf(s); if (f === 0 || f === 7 || r === 0 || r === 7) e.push(s); } return e; })();
const rand = (n) => (Math.random() * n) | 0;

function randomPosition() {
  const mat = MATERIAL[rand(MATERIAL.length)];
  const used = new Set();
  const bk = RIM[rand(RIM.length)]; used.add(bk);
  let wk; do { wk = rand(64); } while (used.has(wk) || cheb(wk, bk) < 2 || cheb(wk, bk) > 4); used.add(wk);
  const pieces = [];
  for (const t of mat.pieces) { let s; do { s = rand(64); } while (used.has(s)); used.add(s); pieces.push({ type: t, sq: s }); }
  return { pos: { wk, bk, pieces }, theme: mat.theme };
}

const TARGET = Number(process.env.TARGET || 320);
const TIME_MS = Number(process.env.TIME_MS || 120000);
const pools = { 1: [], 2: [], 3: [] };
const targets = { 1: TARGET, 2: Math.round(TARGET * 1.6), 3: Math.round(TARGET * 2) };
const seen = new Set();
let attempts = 0, rejected = 0;
const start = Date.now();
const need = () => pools[1].length < targets[1] || pools[2].length < targets[2] || pools[3].length < targets[3];

while (need() && Date.now() - start < TIME_MS) {
  attempts++;
  const { pos, theme } = randomPosition();
  // legal white-to-move position: black king must not already be in check
  if (blackInCheck(pos)) continue;
  const fen = toFen(pos);
  if (seen.has(fen)) continue;
  const m = minimalMate(pos);
  if (!m) continue;
  if (pools[m.depth].length >= targets[m.depth]) continue;
  const pvUci = pvToUci(m.pv, pos);
  if (!verifyWithChessJs(fen, pvUci)) { rejected++; continue; }
  seen.add(fen);
  pools[m.depth].push({ fen, sideToMove: 'w', mateIn: m.depth, solution: pvUci, theme });
}

console.log(`attempts=${attempts} rejected_by_verify=${rejected} time=${((Date.now() - start) / 1000).toFixed(1)}s`);
console.log(`pools: d1=${pools[1].length} d2=${pools[2].length} d3=${pools[3].length}`);
fs.writeFileSync(path.join(process.cwd(), 'scripts', '_pools.json'), JSON.stringify(pools));
console.log('wrote scripts/_pools.json');
