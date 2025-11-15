import SentimentBar from './SentimentBar';

export default function ArgumentsSection({ type = 'for', items = [] }) {
  const title = type === 'for' ? '🔵 STRONGEST ARGUMENTS - FOR' : '🔴 STRONGEST ARGUMENTS - AGAINST';
  const sentiment = type === 'for' ? 'positive' : 'negative';

  return (
    <section className="bg-bg-secondary border border-border rounded-2xl p-6 space-y-4">
      <h3 className="text-text-primary font-semibold">{title}</h3>
      <div className="space-y-4">
        {items.map((arg) => (
          <div key={arg.aspect} className="rounded-xl border border-border px-4 py-3 bg-bg-tertiary/40">
            <div className="flex items-center justify-between">
              <p className="text-lg text-text-primary font-semibold">{arg.aspect}</p>
              <span className="text-xs text-text-muted">Mentioned {arg.count} times</span>
            </div>
            <p className="text-text-secondary italic">“{arg.topQuote}”</p>
            <SentimentBar percentage={arg.sentimentPercent} sentiment={sentiment} showLabel />
          </div>
        ))}
      </div>
    </section>
  );
}
