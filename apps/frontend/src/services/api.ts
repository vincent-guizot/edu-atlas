import axios, { AxiosError } from 'axios';

// Get API URL from Vite environment or default fallback
const envApiUrl = (import.meta as any).env?.VITE_API_URL;
export const API_BASE_URL = (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim() !== '') 
  ? envApiUrl.trim() 
  : 'http://localhost:4000/api/v1';

export const isBackendConfigured = Boolean(envApiUrl && envApiUrl.trim() !== '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Graceful offline detection
    if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      console.warn(
        `[EduAtlas Flow] Backend is offline or unreachable at ${API_BASE_URL}. Falling back to snapshot constants data.`
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
