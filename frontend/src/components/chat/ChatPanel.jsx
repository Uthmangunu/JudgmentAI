import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useChat } from '../../hooks/useChat';

export default function ChatPanel({ conversationId }) {
  const { messages, isLoading, isSending, sendMessage, error } = useChat(conversationId);

  return (
    <div className="flex flex-col h-[600px] border border-border rounded-2xl bg-bg-secondary p-4">
      <div className="mb-4">
        <h3 className="text-primary font-semibold">💬 CHAT WITH AI ANALYST</h3>
        <p className="text-text-muted text-sm">
          Ask follow-up questions about the analysis. The AI remains neutral and cites discussion data.
        </p>
      </div>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {isLoading ? <LoadingSpinner message="Loading messages" /> : <MessageList messages={messages} />}
      {isSending && <p className="text-xs text-text-muted">AI is typing…</p>}
      <MessageInput onSend={sendMessage} disabled={isSending} />
    </div>
  );
}
