import { Sparkles } from "lucide-react";
import { brand } from "@/lib/lumora-motion-data";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-plasma/40 bg-plasma/10">
            <Sparkles className="h-5 w-5 text-plasma" aria-hidden="true" />
          </span>
          <div>
            <div className="font-[var(--font-space)] text-xl font-black text-white">{brand.name}</div>
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
