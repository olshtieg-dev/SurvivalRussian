'use client';

// Presentational 8x8 board. Renders a chess.js board() array, handles square
// clicks, and paints selection / legal-move dots / last-move / check highlights.

import React from 'react';

const FILLED = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function Piece({ type, color }) {
  return (
    <span
      className="pointer-events-none select-none leading-none"
      style={{
        fontSize: '78%',
        color: color === 'w' ? '#f1f5f9' : '#0b1120',
        textShadow:
          color === 'w'
            ? '0 1px 2px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.9)'
            : '0 1px 1px rgba(255,255,255,0.25)',
      }}
    >
      {FILLED[type]}
    </span>
  );
}

export default function ChessBoardView({
  board,
  orientation = 'w',
  selected = null,
  legalTargets = [],
  lastMove = null,
  checkSquare = null,
  hintSquares = [],
  interactive = true,
  onSquareClick,
}) {
  if (!board) return null;

  const targets = new Set(legalTargets);
  const hints = new Set(hintSquares);
  const rows = orientation === 'w' ? board : [...board].reverse();

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {rows.map((row, rIdx) => {
          const cells = orientation === 'w' ? row : [...row].reverse();
          return cells.map((cell, cIdx) => {
            const fileIdx = orientation === 'w' ? cIdx : 7 - cIdx;
            const rankIdx = orientation === 'w' ? rIdx : 7 - rIdx;
            const square = FILES[fileIdx] + (8 - rankIdx);
            const isDark = (fileIdx + (8 - rankIdx)) % 2 === 1;
            const isSelected = selected === square;
            const isTarget = targets.has(square);
            const isCapture = isTarget && cell;
            const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheck = checkSquare === square;
            const isHint = hints.has(square);

            return (
              <button
                key={square}
                type="button"
                data-square={square}
                data-piece={cell ? cell.color + cell.type : ''}
                disabled={!interactive}
                onClick={() => onSquareClick?.(square)}
                className={`relative flex items-center justify-center text-[7vw] sm:text-[2.6rem] transition-colors ${
                  isDark ? 'bg-[#6b7280]' : 'bg-[#cbd5e1]'
                } ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ lineHeight: 0 }}
              >
                {/* highlight overlays */}
                {isLast && <span className="absolute inset-0 bg-yellow-400/30" />}
                {isCheck && <span className="absolute inset-0 bg-red-500/45" />}
                {isHint && <span className="absolute inset-0 ring-[3px] ring-inset ring-amber-400/90" />}
                {isSelected && <span className="absolute inset-0 ring-2 ring-inset ring-blue-400/90" />}

                {cell && <Piece type={cell.type} color={cell.color} />}

                {isTarget && !isCapture && (
                  <span className="absolute h-[26%] w-[26%] rounded-full bg-blue-500/55" />
                )}
                {isCapture && (
                  <span className="absolute inset-[8%] rounded-full border-[5px] border-blue-500/60" />
                )}

                {/* coordinate ticks on the edges */}
                {cIdx === 0 && (
                  <span className="absolute left-0.5 top-0.5 text-[9px] font-bold text-slate-900/40">
                    {8 - rankIdx}
                  </span>
                )}
                {rIdx === 7 && (
                  <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold text-slate-900/40">
                    {FILES[fileIdx]}
                  </span>
                )}
              </button>
            );
          });
        })}
      </div>
    </div>
  );
}
