import apiClient from './api';

export const analysisService = {
  async startAnalysis(redditUrl, maxComments = 500) {
    const response = await apiClient.post('/scrape', {
      reddit_url: redditUrl,
      max_comments: maxComments,
    });
    return response.data;
  },

  async checkTaskStatus(taskId) {
    const response = await apiClient.get(`/scrape/status/${taskId}`);
    return response.data;
  },

  async getConversations() {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },

  async getConversation(conversationId) {
    const response = await apiClient.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },
};
