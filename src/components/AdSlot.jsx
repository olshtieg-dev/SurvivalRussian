// Placeholder ad slot — reserves gutter space beside the active study zone.
// Not wired to any ad network yet; drop the AdSense/GPT markup inside when ready.
// Hidden below the `show` breakpoint so small screens keep the content full-width.
// Size is configurable: the main page uses the default 160x480 beside the gloss card,
// the module overlays (games, chat, passage reader) pass a taller 160x600 skyscraper
// and gate visibility at 2xl since their panels are much wider.

const SHOW_CLASSES = {
  lg: 'hidden lg:flex',
  xl: 'hidden xl:flex',
  '2xl': 'hidden 2xl:flex',
  always: 'flex',
};

export default function AdSlot({
  label = 'AD',
  width = 160,
  height = 480,
  show = 'lg',
  className = '',
}) {
  const showClass = SHOW_CLASSES[show] || SHOW_CLASSES.lg;

  return (
    <div
      data-ad-slot="true"
      aria-hidden="true"
      style={{ width, height }}
      className={`${showClass} shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-600/70 bg-slate-900/60 text-slate-500 select-none ${className}`}
    >
      <span className="text-[11px] font-black uppercase tracking-[0.4em]">{label}</span>
      <span className="text-[9px] uppercase tracking-[0.25em] text-slate-600">Google Ads</span>
      <span className="text-[9px] text-slate-600">{width} &times; {height}</span>
    </div>
  );
}
