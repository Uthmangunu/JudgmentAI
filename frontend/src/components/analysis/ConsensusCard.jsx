import SentimentBar from './SentimentBar';

export default function ConsensusCard({ verdict, highlights = [] }) {
  return (
    <div className="bg-bg-secondary border border-border-green rounded-2xl p-6 shadow-green-glow space-y-4">
      <span className="text-xs tracking-widest text-primary">CONSENSUS VERDICT</span>
      <p className="text-2xl font-semibold text-text-primary">{verdict || 'Awaiting analysis...'}</p>
      <div className="space-y-3">
        {highlights.map((item) => (
          <div
            key={item.text}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
          >
            <div className="flex items-center gap-3 text-text-secondary">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <SentimentBar percentage={item.percentage} sentiment={item.sentiment} />
              <span>{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
