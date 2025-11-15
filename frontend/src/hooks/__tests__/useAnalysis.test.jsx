import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAnalysis } from '../useAnalysis';

const { mockStartAnalysis, mockCheckTaskStatus } = vi.hoisted(() => ({
  mockStartAnalysis: vi.fn(() => Promise.resolve({ task_id: 'task-1' })),
  mockCheckTaskStatus: vi.fn(() => Promise.resolve({ status: 'pending' })),
}));

vi.mock('../../services/analysis.service.js', () => ({
  analysisService: {
    startAnalysis: mockStartAnalysis,
    checkTaskStatus: mockCheckTaskStatus,
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useAnalysis', () => {
  it('starts an analysis', async () => {
    const { result } = renderHook(() => useAnalysis(), { wrapper: createWrapper() });
    await act(async () => {
      result.current.startAnalysis({ redditUrl: 'https://reddit.com' });
    });
    expect(mockStartAnalysis).toHaveBeenCalledWith('https://reddit.com', 500);
  });
});
