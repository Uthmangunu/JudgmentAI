import apiClient from './api';

export const chatService = {
  async getMessages(conversationId) {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(conversationId, message) {
    const response = await apiClient.post('/chat', {
      conversation_id: conversationId,
      message,
    });
    return response.data;
  },
};
