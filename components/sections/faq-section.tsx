import { faqs } from "@/lib/lumora-motion-data";
import { SectionHeader } from "@/components/ui/section-header";

export function FaqSection() {
  return (
    <section id="faq" className="relative px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="FAQ"
        title="Built for credit-aware AI editing"
        copy="A clear SaaS model for creators who need predictable monthly credits, premium exports, and a real render pipeline."
      />
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        {faqs.map(([question, answer]) => (
          <div key={question} className="glass-panel rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
            <h3 className="font-[var(--font-space)] text-xl font-bold text-white">{question}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
