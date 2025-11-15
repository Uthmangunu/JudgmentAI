import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';

export default function RecentAnalysesList({ items = [], onSelect }) {
  if (!items.length) {
    return (
      <div className="border border-dashed border-border rounded-2xl p-6 text-center text-text-muted">
        No analyses yet. Start with your first Reddit URL.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((analysis) => (
        <div key={analysis.id} className="bg-bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-text-primary">{analysis.title || 'Untitled Thread'}</p>
            <span className="text-xs text-text-muted">{formatDate(analysis.created_at)}</span>
          </div>
          <Button variant="ghost" onClick={() => onSelect(analysis.id)}>
            View
          </Button>
        </div>
      ))}
    </div>
  );
}
