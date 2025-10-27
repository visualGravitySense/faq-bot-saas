import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    organization?: string;
  }) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await api.get('/api/v1/users/profile');
    return response.data;
  },

  updateProfile: async (userData: {
    full_name?: string;
    organization?: string;
  }) => {
    const response = await api.put('/api/v1/users/profile', userData);
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get('/api/v1/users/subscription');
    return response.data;
  },
};

// Bots API
export const botsAPI = {
  getBots: async () => {
    const response = await api.get('/api/v1/bots/');
    return response.data;
  },

  getBot: async (botId: number) => {
    const response = await api.get(`/api/v1/bots/${botId}`);
    return response.data;
  },

  createBot: async (botData: {
    name: string;
    website_url: string;
    description?: string;
    channels: string[];
    language: string;
  }) => {
    const response = await api.post('/api/v1/bots/', botData);
    return response.data;
  },

  updateBot: async (botId: number, botData: {
    name?: string;
    description?: string;
    channels?: string[];
    language?: string;
  }) => {
    const response = await api.put(`/api/v1/bots/${botId}`, botData);
    return response.data;
  },

  deleteBot: async (botId: number) => {
    const response = await api.delete(`/api/v1/bots/${botId}`);
    return response.data;
  },

  trainBot: async (botId: number) => {
    const response = await api.post(`/api/v1/bots/${botId}/train`);
    return response.data;
  },

  queryBot: async (botId: number, question: string) => {
    const response = await api.post(`/api/v1/bots/${botId}/query`, null, {
      params: { question }
    });
    return response.data;
  },

  getBotAnalytics: async (botId: number) => {
    const response = await api.get(`/api/v1/bots/${botId}/analytics`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    const response = await api.get('/api/v1/analytics/overview');
    return response.data;
  },

  getQueryTrends: async (days: number = 30) => {
    const response = await api.get('/api/v1/analytics/queries/trends', {
      params: { days }
    });
    return response.data;
  },

  getChannelStats: async () => {
    const response = await api.get('/api/v1/analytics/channels/stats');
    return response.data;
  },

  getTopQuestions: async (limit: number = 10) => {
    const response = await api.get('/api/v1/analytics/questions/top', {
      params: { limit }
    });
    return response.data;
  },

  getPerformance: async () => {
    const response = await api.get('/api/v1/analytics/performance');
    return response.data;
  },

  getRevenue: async () => {
    const response = await api.get('/api/v1/analytics/revenue');
    return response.data;
  },
};

// Telegram API
export const telegramAPI = {
  registerBot: async (botData: {
    bot_id: number;
    bot_name: string;
    bot_token?: string;
    webhook_url?: string;
  }) => {
    const response = await api.post('/api/v1/telegram/register', botData);
    return response.data;
  },

  unregisterBot: async (botId: number) => {
    const response = await api.delete(`/api/v1/telegram/${botId}`);
    return response.data;
  },

  getBots: async () => {
    const response = await api.get('/api/v1/telegram/bots');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/v1/telegram/stats');
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/api/v1/telegram/status');
    return response.data;
  },

  startService: async () => {
    const response = await api.post('/api/v1/telegram/start');
    return response.data;
  },

  stopService: async () => {
    const response = await api.post('/api/v1/telegram/stop');
    return response.data;
  },
};

export default api;
