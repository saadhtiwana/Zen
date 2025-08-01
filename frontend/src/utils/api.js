import axios from 'axios'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // This ensures cookies (JWT) are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authorization header if token exists
api.interceptors.request.use(
  (config) => {
    // The JWT token is stored in cookies, so we don't need to manually add it
    // But we ensure credentials are included
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
}

// User API calls
export const userAPI = {
  getUsers: () => api.get('/users'),
}

// Message API calls
export const messageAPI = {
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (userId, message) => api.post(`/messages/send/${userId}`, { message }),
}

export default api
