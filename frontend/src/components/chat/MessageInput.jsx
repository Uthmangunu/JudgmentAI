import { useState } from 'react';
import Button from '../common/Button';

export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 border border-border rounded-2xl px-3 py-2 bg-bg-tertiary">
      <textarea
        className="flex-1 bg-transparent border-none text-text-primary focus:outline-none resize-none"
        rows={2}
        placeholder="Ask a follow-up question..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <Button variant="primary" onClick={handleSend} disabled={!value.trim() || disabled}>
        Send
      </Button>
    </div>
  );
}
