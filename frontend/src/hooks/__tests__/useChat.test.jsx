import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useChat } from '../useChat';

const { mockGetMessages, mockSendMessage } = vi.hoisted(() => ({
  mockGetMessages: vi.fn(() => Promise.resolve([])),
  mockSendMessage: vi.fn(() =>
    Promise.resolve({
      user_message: { id: 'u1', role: 'user', content: 'Hi', created_at: new Date().toISOString() },
      assistant_message: { id: 'a1', role: 'assistant', content: 'Hello', created_at: new Date().toISOString() },
    })
  ),
}));

vi.mock('../../services/chat.service.js', () => ({
  chatService: {
    getMessages: mockGetMessages,
    sendMessage: mockSendMessage,
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useChat', () => {
  it('sends messages via service', async () => {
    const { result } = renderHook(() => useChat('conversation-1'), { wrapper: createWrapper() });

    await waitFor(() => expect(mockGetMessages).toHaveBeenCalledWith('conversation-1'));

    await act(async () => {
      result.current.sendMessage('How is the sentiment?');
    });

    expect(mockSendMessage).toHaveBeenCalledWith('conversation-1', 'How is the sentiment?');
  });
});
