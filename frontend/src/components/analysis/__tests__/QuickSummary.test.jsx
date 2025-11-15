import { render, screen } from '@testing-library/react';
import QuickSummary from '../QuickSummary';

vi.mock('../../../hooks/useQuickSummary', () => ({
  useQuickSummary: () => ({
    data: {
      verdict: 'Positive consensus',
      highlights: [
        { sentiment: 'positive', icon: '✅', percentage: 70, text: 'Camera praise' },
      ],
      argumentsFor: [
        { aspect: 'Camera', count: 10, topQuote: 'Great', sentimentPercent: 80 },
      ],
      argumentsAgainst: [
        { aspect: 'Battery', count: 5, topQuote: 'Weak', sentimentPercent: 30 },
      ],
      topics: [{ name: 'Camera', positivePercent: 80 }],
    },
    isLoading: false,
    error: null,
  }),
}));

describe('QuickSummary', () => {
  it('renders verdict and sections', () => {
    render(<QuickSummary conversationId="123" />);
    expect(screen.getByText('Positive consensus')).toBeInTheDocument();
    expect(screen.getAllByText('Camera').length).toBeGreaterThan(0);
  });
});
