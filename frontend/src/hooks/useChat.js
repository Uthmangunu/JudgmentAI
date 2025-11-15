import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';

export function useChat(conversationId) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: Boolean(conversationId),
  });

  const sendMutation = useMutation({
    mutationFn: (message) => chatService.sendMessage(conversationId, message),
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });
      const previousMessages = queryClient.getQueryData(['messages', conversationId]) || [];
      const optimisticMessage = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData(['messages', conversationId], [...previousMessages, optimisticMessage]);
      return { previousMessages };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversationId], context.previousMessages);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['messages', conversationId], (old = []) => {
        const filtered = old.filter((message) => !String(message.id).startsWith('optimistic-'));
        return [...filtered, data.user_message, data.assistant_message];
      });
    },
  });

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    isSending: sendMutation.isPending,
    sendMessage: sendMutation.mutate,
    error: messagesQuery.error || sendMutation.error,
  };
}
