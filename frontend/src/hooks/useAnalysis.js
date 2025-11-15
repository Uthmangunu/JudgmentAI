import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { analysisService } from '../services/analysis.service';

export function useAnalysis() {
  const [taskId, setTaskId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const startMutation = useMutation({
    mutationFn: ({ redditUrl, maxComments = 500 }) => analysisService.startAnalysis(redditUrl, maxComments),
    onSuccess: (data) => {
      setTaskId(data.task_id);
      setIsPolling(true);
    },
  });

  const statusQuery = useQuery({
    queryKey: ['task-status', taskId],
    queryFn: () => analysisService.checkTaskStatus(taskId),
    enabled: isPolling && Boolean(taskId),
    refetchInterval: 5000,
    onSuccess: (data) => {
      if (data.status === 'success' || data.status === 'failure') {
        setIsPolling(false);
      }
    },
  });

  useEffect(() => {
    if (!isPolling) {
      setTaskId((current) => current);
    }
  }, [isPolling]);

  return {
    startAnalysis: startMutation.mutate,
    isAnalyzing: isPolling,
    taskStatus: statusQuery.data,
    isStatusLoading: statusQuery.isLoading,
    error: startMutation.error || statusQuery.error,
    reset: () => {
      setIsPolling(false);
      setTaskId(null);
    },
  };
}
