// Placeholder ad slot — reserves the gutter space beside the interlinear gloss box.
// Not wired to any ad network yet; drop the AdSense/GPT markup inside when ready.
// Visible from lg up; hidden on small screens so phones keep the gloss full-width.
// Height matches the gloss card's ~480px floor; the slot may shift or clip as the
// card's content width changes — that's accepted behavior, not a bug.

export default function AdSlot({ label = 'AD', className = '' }) {
  return (
    <div
      data-ad-slot="true"
      aria-hidden="true"
      className={`hidden lg:flex shrink-0 w-40 h-[480px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-600/70 bg-slate-900/60 text-slate-500 select-none ${className}`}
    >
      <span className="text-[11px] font-black uppercase tracking-[0.4em]">{label}</span>
      <span className="text-[9px] uppercase tracking-[0.25em] text-slate-600">Google Ads</span>
      <span className="text-[9px] text-slate-600">160 &times; 480</span>
    </div>
  );
}
