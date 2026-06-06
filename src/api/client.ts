export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('toybox_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const text = await res.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = typeof data === 'string' ? data : (data?.error || 'Something went wrong');
    throw new Error(message);
  }

  return data;
};
