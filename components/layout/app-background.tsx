export function AppBackground() {
  return (
    <>
      <div className="aurora-field pointer-events-none fixed inset-0" />
      <div className="mesh pointer-events-none fixed inset-0 opacity-70" />
      <div className="orbital-ring pointer-events-none fixed right-[-14rem] top-[-12rem] h-[36rem] w-[36rem] rounded-full border border-plasma/20" />
      <div className="orbital-ring pointer-events-none fixed bottom-[12%] left-[-18rem] h-[42rem] w-[42rem] rounded-full border border-aurora/20 [animation-delay:-3s]" />
    </>
  );
}
