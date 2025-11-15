import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConsensusCard from './ConsensusCard';
import ArgumentsSection from './ArgumentsSection';
import SentimentBar from './SentimentBar';
import { useQuickSummary } from '../../hooks/useQuickSummary';

const fallbackData = {
  verdict: 'Collecting insights…',
  highlights: [],
  argumentsFor: [],
  argumentsAgainst: [],
  topics: [],
};

export default function QuickSummary({ conversationId }) {
  const { data, isLoading, error } = useQuickSummary(conversationId);
  const summary = data || fallbackData;

  if (isLoading) {
    return <LoadingSpinner message="Generating quick summary" />;
  }

  if (error) {
    return <ErrorMessage>Failed to load summary.</ErrorMessage>;
  }

  return (
    <div className="space-y-6">
      <ConsensusCard verdict={summary.verdict} highlights={summary.highlights || []} />
      <div className="grid gap-6 md:grid-cols-2">
        <ArgumentsSection type="for" items={summary.argumentsFor || []} />
        <ArgumentsSection type="against" items={summary.argumentsAgainst || []} />
      </div>
      <section className="bg-bg-secondary border border-border rounded-2xl p-6 space-y-3">
        <h3 className="text-text-primary font-semibold">💡 GENERAL VIEWS BY TOPIC</h3>
        <div className="space-y-3">
          {(summary.topics || []).map((topic) => (
            <div key={topic.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">{topic.name}</span>
                <span className="text-text-primary">{topic.positivePercent}% positive</span>
              </div>
              <SentimentBar percentage={topic.positivePercent} sentiment="positive" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
