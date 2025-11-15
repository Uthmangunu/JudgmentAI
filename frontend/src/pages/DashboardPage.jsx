import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import URLInputCard from '../components/dashboard/URLInputCard';
import AnalysisStatusCard from '../components/dashboard/AnalysisStatusCard';
import RecentAnalysesList from '../components/dashboard/RecentAnalysesList';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAnalysis } from '../hooks/useAnalysis';
import { analysisService } from '../services/analysis.service';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { startAnalysis, isAnalyzing, taskStatus, error } = useAnalysis();

  const { data: recentAnalyses, isLoading: isRecentLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => analysisService.getConversations(),
  });

  useEffect(() => {
    if (taskStatus?.status === 'success') {
      const conversationId = taskStatus.result?.conversation_id || taskStatus.result?.id;
      if (conversationId) {
        refetch();
        navigate(`/analysis/${conversationId}`);
      }
    }
  }, [taskStatus, navigate, refetch]);

  const statusMessage = useMemo(() => {
    if (!taskStatus) return null;
    if (taskStatus.status === 'failure') return taskStatus.error || 'Analysis failed. Try again.';
    return null;
  }, [taskStatus]);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-2">
        <p className="text-sm text-primary uppercase tracking-[0.6em]">Judgment Engine</p>
        <h1 className="text-4xl font-semibold">Paste a Reddit thread. Get aspect-based clarity.</h1>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Our ABSA pipeline extracts every argument, maps sentiment per aspect, and contextualizes rhetoric so you can make data-backed decisions.
        </p>
      </section>

      <URLInputCard
        onSubmit={(redditUrl) => startAnalysis({ redditUrl })}
        isLoading={isAnalyzing}
        error={statusMessage || error?.message}
      />

      {isAnalyzing && <AnalysisStatusCard status={taskStatus || { status: 'pending' }} />}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Analyses</h2>
        </div>
        {isRecentLoading ? (
          <LoadingSpinner message="Fetching past analyses" />
        ) : (
          <RecentAnalysesList items={recentAnalyses || []} onSelect={(id) => navigate(`/analysis/${id}`)} />
        )}
      </section>
    </div>
  );
}
