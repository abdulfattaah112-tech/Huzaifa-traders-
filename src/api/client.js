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

  const response = await fetch(`/api/neon${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }

  return data;
};
