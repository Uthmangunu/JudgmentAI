import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import { isValidRedditUrl } from '../../utils/validators';

export default function URLInputCard({ onSubmit, isLoading, error }) {
  const [redditUrl, setRedditUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const isValid = isValidRedditUrl(redditUrl);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid || !redditUrl) return;
    onSubmit(redditUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border-green rounded-2xl p-6 shadow-green-glow space-y-4">
      <h2 className="text-2xl font-semibold text-text-primary">Analyze a Reddit Discussion</h2>
      <p className="text-text-secondary">
        Paste a Reddit thread URL. JudgmentAI will scrape every comment, perform aspect-based sentiment, and deliver a neutral verdict.
      </p>
      <Input
        type="url"
        value={redditUrl}
        onChange={(e) => setRedditUrl(e.target.value)}
        label="Reddit URL"
        placeholder="https://www.reddit.com/r/technology/comments/xyz..."
        required
        error={touched && !isValid ? 'Enter a valid Reddit URL' : undefined}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit" loading={isLoading} disabled={!redditUrl || !isValid} fullWidth>
        Run Judgment Analysis 🔍
      </Button>
    </form>
  );
}
