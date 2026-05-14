import { testimonials } from "@/lib/lumora-motion-data";
import { SectionHeader } from "@/components/ui/section-header";

export function TestimonialsSection() {
  return (
    <section className="relative border-y border-white/10 bg-[#03050a]/90 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Sample creators" title="Demo social proof for modern video teams" copy="Placeholder creator reactions styled as sample content while Lumora Motion moves toward real customer proof." />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {testimonials.map(([name, role, quote]) => (
          <div key={name} className="glass-panel rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
            <div className="mb-5 flex gap-1 text-plasma" aria-label="Five star sample rating">
              {"*****".split("").map((star, index) => (
                <span key={`${name}-${index}`}>{star}</span>
              ))}
            </div>
            <p className="text-base leading-7 text-slate-300">&ldquo;{quote}&rdquo;</p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="font-bold text-white">{name}</div>
              <div className="text-sm text-slate-500">{role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
