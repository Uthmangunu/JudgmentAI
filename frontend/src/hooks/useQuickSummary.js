import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import { QUICK_SUMMARY_PROMPT } from '../utils/constants';
import { safeJsonParse } from '../utils/helpers';

export function useQuickSummary(conversationId) {
  return useQuery({
    queryKey: ['quick-summary', conversationId],
    enabled: Boolean(conversationId),
    staleTime: Infinity,
    queryFn: async () => {
      const response = await chatService.sendMessage(conversationId, QUICK_SUMMARY_PROMPT);
      const summaryPayload = response.assistant_message?.content;
      return safeJsonParse(summaryPayload, {});
    },
  });
}
