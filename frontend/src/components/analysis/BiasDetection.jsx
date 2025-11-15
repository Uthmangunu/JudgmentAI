export default function BiasDetection({ biases = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {biases.map((bias) => (
        <div key={bias.name} className="border border-border rounded-2xl p-4 bg-bg-tertiary/50">
          <div className="flex items-center justify-between">
            <span className="text-primary font-semibold">#{bias.number}</span>
            <span className="text-xs text-text-muted">{bias.side}: {bias.percentage}%</span>
          </div>
          <p className="text-lg text-text-primary font-semibold">{bias.name}</p>
          <p className="text-sm text-text-secondary">“{bias.quote}”</p>
        </div>
      ))}
    </div>
  );
}
