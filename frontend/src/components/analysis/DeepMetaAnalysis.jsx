import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import MetaSection from './MetaSection';
import DiscourseAnalysis from './DiscourseAnalysis';
import RhetoricComparison from './RhetoricComparison';
import BiasDetection from './BiasDetection';
import SteelmanCard from './SteelmanCard';
import TimelineChart from './TimelineChart';

export default function DeepMetaAnalysis({ data = {}, isLoading, error, onRetry }) {
  if (isLoading) {
    return <LoadingSpinner message="Generating deep meta-analysis" />;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <ErrorMessage>Failed to load deep analysis.</ErrorMessage>
        <button className="text-primary underline" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (!Object.keys(data || {}).length) {
    return (
      <div className="text-text-secondary space-y-3">
        <p>This meta-analysis will run once you request it.</p>
        <button className="text-primary underline" onClick={onRetry}>
          Generate Deep Meta-Analysis
        </button>
      </div>
    );
  }

  const {
    discoursePatterns = [],
    proTactics = [],
    conTactics = [],
    rhetoricalBalance,
    biases = [],
    sentimentTimeline = [],
    timeline = [],
    sentimentPattern,
    assumptions = [],
    steelmanPro = {},
    steelmanCon = {},
    proCount,
    conCount,
    metaInsight = { keyPoints: [], absent: [] },
    methodology = { approach: [], limitations: [] },
  } = data;

  return (
    <div className="space-y-6">
      <MetaSection title="📊 DISCOURSE STRUCTURE ANALYSIS" description="Argumentative patterns and biases">
        <DiscourseAnalysis patterns={discoursePatterns} />
      </MetaSection>

      <MetaSection title="🧩 RHETORICAL STRATEGY COMPARISON">
        <RhetoricComparison proTactics={proTactics} conTactics={conTactics} balance={rhetoricalBalance} />
      </MetaSection>

      <MetaSection title="🎭 PSYCHOLOGICAL PATTERNS">
        <BiasDetection biases={biases} />
      </MetaSection>

      <MetaSection title="📈 SENTIMENT EVOLUTION TIMELINE">
        <TimelineChart data={sentimentTimeline} />
        <div className="grid gap-3 md:grid-cols-3">
          {timeline.map((segment) => (
            <div key={segment.range} className="border border-border rounded-xl p-3">
              <p className="text-text-primary font-semibold">{segment.range}</p>
              <p className="text-text-secondary text-sm">{segment.positivePercent}% positive</p>
              <p className="text-text-muted text-xs">{segment.note}</p>
            </div>
          ))}
        </div>
        {sentimentPattern && <p className="text-text-muted text-sm">→ Pattern: {sentimentPattern}</p>}
      </MetaSection>

      <MetaSection title="🔍 UNSPOKEN ASSUMPTIONS">
        <ul className="space-y-2">
          {assumptions.map((assumption) => (
            <li key={assumption.text} className="text-text-secondary">
              • “{assumption.text}” <span className="text-text-muted">({assumption.side})</span>
            </li>
          ))}
        </ul>
      </MetaSection>

      <MetaSection title="🎯 STEELMAN ANALYSIS">
        <div className="grid gap-4 md:grid-cols-2">
          <SteelmanCard type="pro" payload={{ ...steelmanPro, count: proCount }} />
          <SteelmanCard type="con" payload={{ ...steelmanCon, count: conCount }} />
        </div>
      </MetaSection>

      <MetaSection title="💡 META-INSIGHT: WHAT THIS DISCUSSION REVEALS">
        <p className="text-text-primary font-semibold">{metaInsight.mainPoint}</p>
        <ul className="list-disc list-inside text-text-secondary">
          {(metaInsight.keyPoints || []).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {metaInsight.absent?.length > 0 && (
          <div>
            <p className="text-text-muted text-sm">Notably absent:</p>
            <ul className="list-disc list-inside text-text-secondary">
              {metaInsight.absent.map((item) => (
                <li key={item.topic}>
                  {item.topic} ({item.percentage}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </MetaSection>

      <MetaSection title="🎓 RESEARCH METHODOLOGY NOTE">
        <div className="grid gap-4 md:grid-cols-2 text-text-secondary">
          <div>
            <p className="text-text-primary font-semibold mb-2">Analysis Approach</p>
            <ul className="list-disc list-inside">
              {(methodology.approach || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-text-primary font-semibold mb-2">Limitations</p>
            <ul className="list-disc list-inside">
              {(methodology.limitations || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </MetaSection>
    </div>
  );
}
