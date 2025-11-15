export default function SteelmanCard({ type = 'pro', payload = {} }) {
  if (!payload) return null;
  const title = type === 'pro' ? 'Best PRO Argument' : 'Best CON Argument';

  return (
    <div className="border border-border rounded-2xl p-4 bg-bg-tertiary/40 space-y-2">
      <h4 className="text-text-primary font-semibold">
        {title} (filtered from {payload.count || 0} variations)
      </h4>
      <p className="text-text-secondary">{payload.text}</p>
      <p className="text-sm text-text-muted">
        <span className="font-semibold text-text-primary">Strength:</span> {payload.strength}
      </p>
      <p className="text-sm text-text-muted">
        <span className="font-semibold text-text-primary">Weakness:</span> {payload.weakness}
      </p>
    </div>
  );
}
