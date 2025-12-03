import axios from 'axios';

// baseURL is empty because your component calls already include "/api"
// e.g. api.post('/api/projects/run')
const api = axios.create({
  baseURL: '', 
});

// Interceptor to inject Clerk Token
export const setupInterceptors = (getToken: () => Promise<string | null>) => {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default api;