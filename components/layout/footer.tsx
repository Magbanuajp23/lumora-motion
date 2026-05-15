import { brand } from "@/lib/lumora-motion-data";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/lumora-logo.png"
            alt={`${brand.name} logo`}
            className="h-10 w-auto max-w-[12rem] shrink-0 object-contain drop-shadow-[0_0_18px_rgba(32,217,255,0.4)]"
          />
          <div>
            <div className="text-sm text-slate-500">Premium AI motion editing for viral cinematic creators</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          {["Features", "Pricing", "Dashboard", "Login"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
