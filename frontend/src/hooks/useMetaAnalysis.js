import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import { META_ANALYSIS_PROMPT } from '../utils/constants';
import { safeJsonParse } from '../utils/helpers';

export function useMetaAnalysis(conversationId) {
  const query = useQuery({
    queryKey: ['meta-analysis', conversationId],
    enabled: false,
    staleTime: Infinity,
    queryFn: async () => {
      const response = await chatService.sendMessage(conversationId, META_ANALYSIS_PROMPT);
      const payload = response.assistant_message?.content;
      return safeJsonParse(payload, {});
    },
  });

  return { ...query, trigger: query.refetch };
}
