import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      {messages.map((message) => (
        <MessageBubble key={message.id || message.created_at} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
