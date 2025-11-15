import clsx from 'clsx';
import { formatTime } from '../../utils/formatters';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-3 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">AI</div>}
      <div className={clsx('max-w-xl rounded-2xl px-4 py-3 text-sm', isUser ? 'bg-primary text-black shadow-green-glow' : 'bg-bg-tertiary text-text-primary border border-border')}>
        <p>{message.content}</p>
        <span className="mt-2 block text-[11px] text-text-muted">
          {formatTime(message.created_at)}
        </span>
      </div>
      {isUser && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary">You</div>}
    </div>
  );
}
