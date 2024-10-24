import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4001', // Change to your API base URL
});

// Add a request interceptor to include the token in all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
