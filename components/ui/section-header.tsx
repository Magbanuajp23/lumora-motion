export function SectionHeader({
  eyebrow,
  title,
  copy
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      <p className="text-sm uppercase tracking-[0.26em] text-plasma">{eyebrow}</p>
      <h2 className="mt-3 font-[var(--font-space)] text-3xl font-black text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">{copy}</p>
    </div>
  );
}
