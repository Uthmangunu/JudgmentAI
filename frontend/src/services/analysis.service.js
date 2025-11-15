import apiClient from './api';
import { demoConversation, demoRecentAnalyses } from '../utils/demoData';

const createDemoTaskResponse = () => ({
  task_id: `demo-task-${Date.now()}`,
  status: 'success',
  result: { conversation_id: 'demo' },
  error: null,
});

export const analysisService = {
  async startAnalysis(redditUrl, maxComments = 500) {
    try {
      const response = await apiClient.post('/scrape', {
        reddit_url: redditUrl,
        max_comments: maxComments,
      });
      return response.data;
    } catch (error) {
      console.warn('Falling back to demo analysis task:', error?.message || error);
      return createDemoTaskResponse();
    }
  },

  async checkTaskStatus(taskId) {
    if (String(taskId).startsWith('demo-task')) {
      return createDemoTaskResponse();
    }
    const response = await apiClient.get(`/scrape/status/${taskId}`);
    return response.data;
  },

  async getConversations() {
    try {
      const response = await apiClient.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.warn('Falling back to demo conversation list:', error?.message || error);
      return demoRecentAnalyses;
    }
  },

  async getConversation(conversationId) {
    if (conversationId === 'demo') {
      return demoConversation;
    }
    try {
      const response = await apiClient.get(`/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      if (offline || !error.response) {
        console.warn('Falling back to demo conversation:', error?.message || error);
        return demoConversation;
      }
      throw error;
    }
  },
};
