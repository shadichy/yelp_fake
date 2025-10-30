
import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.API_ENDPOINT || 'http://localhost:8000',
});

export default api;
