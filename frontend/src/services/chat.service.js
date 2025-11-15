import apiClient from './api';
import { demoMessages, demoQuickSummary, demoMetaAnalysis } from '../utils/demoData';

const buildDemoAssistantMessage = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes('structured summary')) {
    return JSON.stringify(demoQuickSummary);
  }
  if (lower.includes('academic researcher') || lower.includes('meta-analysis')) {
    return JSON.stringify(demoMetaAnalysis);
  }
  return 'Demo mode: Ask anything about the Orion X13 discussion.';
};

const buildDemoResponse = (conversationId, message) => {
  const timestamp = new Date().toISOString();
  const userMessage = {
    id: `demo-user-${Date.now()}`,
    conversation_id: conversationId,
    role: 'user',
    content: message,
    created_at: timestamp,
  };
  const assistantMessage = {
    id: `demo-assistant-${Date.now()}`,
    conversation_id: conversationId,
    role: 'assistant',
    content: buildDemoAssistantMessage(message),
    created_at: timestamp,
  };
  return {
    conversation_id: conversationId,
    user_message: userMessage,
    assistant_message: assistantMessage,
  };
};

export const chatService = {
  async getMessages(conversationId) {
    if (conversationId === 'demo') {
      return demoMessages;
    }
    try {
      const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      if (conversationId === 'demo') {
        return demoMessages;
      }
      throw error;
    }
  },

  async sendMessage(conversationId, message) {
    if (conversationId === 'demo') {
      return buildDemoResponse(conversationId, message);
    }
    try {
      const response = await apiClient.post('/chat', {
        conversation_id: conversationId,
        message,
      });
      return response.data;
    } catch (error) {
      if (conversationId === 'demo') {
        return buildDemoResponse(conversationId, message);
      }
      throw error;
    }
  },
};
