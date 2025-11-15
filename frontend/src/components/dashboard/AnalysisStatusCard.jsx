import LoadingSpinner from '../common/LoadingSpinner';

export default function AnalysisStatusCard({ status }) {
  if (!status) return null;
  const { result = {}, status: taskStatus } = status;
  const { total_comments = 0, processed_comments = 0 } = result || {};
  const percentage = total_comments ? Math.round((processed_comments / total_comments) * 100) : 0;

  return (
    <div className="border border-border rounded-2xl bg-bg-tertiary/60 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-text-secondary">
        <LoadingSpinner size="sm" />
        <div>
          <p className="text-text-primary font-semibold">Analyzing Reddit discussion…</p>
          <p className="text-sm text-text-secondary">
            Status: {taskStatus || 'pending'} — {processed_comments}/{total_comments} comments processed
          </p>
        </div>
      </div>
      <div className="w-full bg-bg-secondary rounded-full h-3 overflow-hidden">
        <div className="bg-primary h-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-text-muted">This may take 2–5 minutes depending on comment volume.</p>
    </div>
  );
}
