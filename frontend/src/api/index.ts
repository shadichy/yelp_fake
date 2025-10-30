
import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export default api;
