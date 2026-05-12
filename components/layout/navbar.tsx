import { Sparkles } from "lucide-react";
import { brand } from "@/lib/lumora-motion-data";

const navItems = ["Home", "Features", "Pricing", "Dashboard"];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#03050a]/70 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-plasma/40 bg-plasma/10 shadow-glow">
            <Sparkles className="h-5 w-5 text-plasma" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-[var(--font-space)] text-xl font-black text-white">
              {brand.name}
            </span>
            <span className="hidden text-xs uppercase tracking-[0.28em] text-slate-500 sm:block">
              {brand.tagline}
            </span>
          </span>
        </a>
        <div className="hidden items-center gap-5 text-sm font-medium text-slate-300 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#login"
            className="hidden rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-plasma/35 hover:bg-plasma/10 sm:inline-flex"
          >
            Login
          </a>
          <a
            href="#signup"
            className="rounded-lg bg-white px-4 py-2 text-sm font-black text-[#05070d] transition hover:-translate-y-0.5 hover:bg-slate-200"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
}
