import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import URLInputCard from '../components/dashboard/URLInputCard';
import AnalysisStatusCard from '../components/dashboard/AnalysisStatusCard';
import RecentAnalysesList from '../components/dashboard/RecentAnalysesList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAnalysis } from '../hooks/useAnalysis';
import { analysisService } from '../services/analysis.service';
import AnimePanelGallery from '../components/layout/AnimePanelGallery';
import HeroWave from '../components/layout/HeroWave';

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
    <div className="space-y-10">
      <section className="grid gap-10 lg:grid-cols-[3fr_2fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-bg-tertiary/60 px-5 py-2 text-xs uppercase tracking-[0.4em] text-primary shadow-green-glow/20">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Live Reddit Intelligence
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white">
              Decode Reddit debates with <span className="text-primary">neon clarity</span>.
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Scrape entire threads, run aspect-based sentiment, and compare rhetoric like an academic. JudgmentAI outputs consensus, steelman arguments, and chat-ready insights.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 bg-bg-tertiary/40 border border-border rounded-3xl p-4">
            {[
              { label: 'Aspects tracked', value: '120K+' },
              { label: 'Meta insights', value: '9 sections' },
              { label: 'Chat latency', value: '<2s' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative rounded-[32px] border border-primary/40 bg-gradient-to-b from-bg-secondary/80 to-bg-tertiary/90 p-6 shadow-green-glow/40">
            <HeroWave />
            <AnimePanelGallery variant="hero" />
          </div>
        </div>
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
