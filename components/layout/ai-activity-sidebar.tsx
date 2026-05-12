export function AiActivitySidebar() {
  return (
    <aside className="pointer-events-none fixed right-4 top-28 z-40 hidden w-64 xl:block">
      <div className="glass-panel rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">AI activity</p>
        <div className="mt-4 space-y-3 text-sm">
          {["Scene detector online", "Credit meter synced", "4K render node ready"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_16px_rgba(124,255,196,.8)]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
