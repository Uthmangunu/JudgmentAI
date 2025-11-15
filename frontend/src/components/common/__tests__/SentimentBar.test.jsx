import { render } from '@testing-library/react';
import SentimentBar from '../../analysis/SentimentBar';

describe('SentimentBar', () => {
  it('renders width based on percentage', () => {
    const { container } = render(<SentimentBar percentage={50} sentiment="positive" showLabel />);
    const bar = container.querySelector('.h-full');
    expect(bar.style.width).toBe('50%');
  });
});
