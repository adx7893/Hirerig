
// This service handles all communication with your Laravel Backend
const API_BASE_URL = 'http://localhost/hirerig/api';
 // Update this to match your Laravel URL

// Helper to get the JWT token
const getToken = () => localStorage.getItem('auth_token');

// Helper to handle response and standard Laravel error formats
const handleResponse = async (response: Response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    // Handle 401 Unauthorized (Token expired/invalid)
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      // Optional: window.location.href = '/login'; 
    }
    
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }

  return data;
};

export const api = {
  // GET Request
  get: async (endpoint: string) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.warn(`API Fetch Error (${endpoint}):`, error);
      throw error;
    }
  },

  // POST Request
  post: async (endpoint: string, body: any) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    } catch (error) {
      console.warn(`API Post Error (${endpoint}):`, error);
      throw error;
    }
  },

  // PUT Request
  put: async (endpoint: string, body: any) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    } catch (error) {
       console.warn(`API Put Error (${endpoint}):`, error);
       throw error;
    }
  },

  // DELETE Request
  delete: async (endpoint: string) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.warn(`API Delete Error (${endpoint}):`, error);
      throw error;
    }
  }
};
