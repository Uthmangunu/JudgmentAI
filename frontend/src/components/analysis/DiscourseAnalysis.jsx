export default function DiscourseAnalysis({ patterns = [] }) {
  if (!patterns.length) return null;

  return (
    <div className="space-y-4">
      {patterns.map((pattern) => (
        <div key={pattern.number} className="border border-border rounded-2xl p-4 bg-bg-tertiary/40">
          <div className="flex items-center justify-between">
            <span className="text-primary font-semibold">#{pattern.number}</span>
            <span className="text-xs text-text-muted">{pattern.percentage}% of {pattern.group}</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{pattern.name}</p>
          <p className="text-text-secondary text-sm">{pattern.description}</p>
          <p className="text-text-muted text-sm">→ Quote: “{pattern.exampleQuote}”</p>
          <p className="text-text-muted text-sm">→ Analysis: {pattern.analysis}</p>
        </div>
      ))}
    </div>
  );
}
