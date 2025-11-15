import clsx from 'clsx';

export default function SentimentBar({ percentage = 0, sentiment = 'positive', showLabel = false, label }) {
  return (
    <div className="w-full">
      <div className="bg-bg-tertiary rounded-full h-3 overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-500', {
            'bg-positive': sentiment === 'positive',
            'bg-negative': sentiment === 'negative',
            'bg-neutral': sentiment === 'neutral',
          })}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-text-muted mt-1">{label || `${percentage}% ${sentiment}`}</p>}
    </div>
  );
}
