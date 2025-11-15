export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/60 py-6 text-center text-sm text-text-muted">
      © {new Date().getFullYear()} JudgmentAI. Aspect-based Reddit intelligence.
    </footer>
  );
}
