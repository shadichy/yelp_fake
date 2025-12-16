const BASE_URL = 'http://localhost:8000';

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<{ data: T }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    ...options.headers,
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // If body is FormData, let the browser set Content-Type (it adds boundary)
  // If user passed 'multipart/form-data' explicitly (common axios habit), remove it to let browser do it correctly
  if (options.body instanceof FormData && headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type'];
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    // Fallback for non-JSON responses or empty responses
    const text = await response.text();
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = text;
    }
  }

  if (!response.ok) {
    // Mimic axios error structure
    const error: any = new Error(data?.detail || 'API request failed');
    error.response = {
        data: data,
        status: response.status,
        statusText: response.statusText
    };
    throw error;
  }

  return { data };
}

const api = {
  get: <T>(url: string, options?: FetchOptions) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: FetchOptions) => request<T>(url, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }), 
  put: <T>(url: string, body?: any, options?: FetchOptions) => request<T>(url, { ...options, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: <T>(url: string, body?: any, options?: FetchOptions) => request<T>(url, { ...options, method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: <T>(url: string, options?: FetchOptions) => request<T>(url, { ...options, method: 'DELETE' }),
};

export default api;