import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QuickSummary from '../components/analysis/QuickSummary';
import DeepMetaAnalysis from '../components/analysis/DeepMetaAnalysis';
import ChatPanel from '../components/chat/ChatPanel';
import { analysisService } from '../services/analysis.service';
import { ANALYSIS_MODES } from '../utils/constants';
import { useMetaAnalysis } from '../hooks/useMetaAnalysis';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AnalysisPage() {
  const { conversationId } = useParams();
  const [mode, setMode] = useState('quick');
  const metaAnalysis = useMetaAnalysis(conversationId);

  const { data: conversation, isLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => analysisService.getConversation(conversationId),
    enabled: Boolean(conversationId),
  });

  const handleModeChange = (modeId) => {
    setMode(modeId);
    if (modeId === 'meta' && !metaAnalysis.data && !metaAnalysis.isFetching) {
      metaAnalysis.trigger();
    }
  };

  const renderContent = () => {
    if (mode === 'quick') {
      return <QuickSummary conversationId={conversationId} />;
    }
    if (mode === 'meta') {
      return (
        <DeepMetaAnalysis
          data={metaAnalysis.data}
          isLoading={metaAnalysis.isFetching}
          error={metaAnalysis.error}
          onRetry={metaAnalysis.trigger}
        />
      );
    }
    return <ChatPanel conversationId={conversationId} />;
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading analysis" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← Dashboard
        </Button>
        <h1 className="text-3xl font-semibold">{conversation?.title || 'Analysis'}</h1>
        <p className="text-text-secondary text-sm">{conversation?.reddit_url}</p>
        <p className="text-text-muted text-sm">{conversation?.total_comments} comments analyzed</p>
      </div>
      <div className="flex flex-wrap gap-3 border border-border rounded-2xl p-2 bg-bg-secondary/70">
        {ANALYSIS_MODES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleModeChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              mode === tab.id ? 'bg-primary text-black shadow-green-glow' : 'text-text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}
