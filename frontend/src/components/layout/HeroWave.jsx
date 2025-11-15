export default function HeroWave() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      <div className="relative w-full max-w-lg aspect-[4/3]">
        <div className="absolute inset-0 rounded-full border border-primary/40 opacity-80 animate-pulse" />
        <div className="absolute inset-6 rounded-full border border-primary/30 opacity-70" />
        <div className="absolute inset-12 rounded-full border border-primary/20 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-[40%]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-primary/20 border border-primary/50 shadow-green-glow flex flex-col items-center justify-center text-center">
            <span className="text-primary text-xs uppercase tracking-[0.4em]">ABSA</span>
            <p className="text-sm text-text-primary font-semibold">Aspect Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
}
