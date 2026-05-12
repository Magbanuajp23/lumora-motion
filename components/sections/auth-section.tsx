import { Lock, Mail } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { brand } from "@/lib/lumora-motion-data";

export function AuthSection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Auth" title="Futuristic login and sign up" copy="Frontend-only mock authentication cards with email/password inputs and social login buttons." />
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {[
          ["login", "Welcome back", "Login"],
          ["signup", "Create your studio", "Sign Up"]
        ].map(([id, title, action]) => (
          <div key={id} id={id} className="glass-panel rounded-3xl p-6">
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">{title}</h3>
            <div className="mt-6 space-y-3">
              <label className="block rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Mail className="h-4 w-4" />Email</span>
                <input className="mt-2 w-full bg-transparent text-white outline-none" placeholder={brand.emailPlaceholder} />
              </label>
              <label className="block rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Lock className="h-4 w-4" />Password</span>
                <input type="password" className="mt-2 w-full bg-transparent text-white outline-none" placeholder="Password" />
              </label>
            </div>
            <button className="mt-5 h-12 w-full rounded-xl bg-white text-sm font-black text-[#05070d]">{action}</button>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["Google", "Apple"].map((provider) => (
                <button key={provider} className="h-11 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white">{provider}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
