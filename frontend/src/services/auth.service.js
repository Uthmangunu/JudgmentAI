import apiClient from './api';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    return { token: access_token, user };
  },

  async signup(email, password) {
    const response = await apiClient.post('/auth/signup', { email, password });
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    return { token: access_token, user };
  },

  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('access_token'));
  },
};
