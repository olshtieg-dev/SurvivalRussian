'use client';

import dynamic from 'next/dynamic';

const DurakBoardClient = dynamic(() => import('./DurakBoardClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-8 text-sm text-slate-400">
      Loading Durak...
    </div>
  ),
});

export default function DurakBoard() {
  return (
    <div className="h-full min-h-0">
      <DurakBoardClient />
    </div>
  );
}
