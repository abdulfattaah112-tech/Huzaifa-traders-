export const fetchApi = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  // Merge options safely
  const config = { ...defaultOptions, ...options };
  if (options.headers) {
    config.headers = { ...defaultOptions.headers, ...options.headers };
  }
  
  // Include CSRF token for mutations
  if (config.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
    const csrfToken = localStorage.getItem('csrf_token') || sessionStorage.getItem('csrf_token');
    if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken;
    }
  }
  // Use absolute Vercel URL in production since frontend is on Hostinger
  const API_BASE_URL = import.meta.env.PROD ? 'https://huzaifa-traders-two-seven.vercel.app' : '';
  const response = await fetch(`${API_BASE_URL}/api/neon${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }

  return data;
};
