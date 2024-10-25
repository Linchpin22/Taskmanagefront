import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4001',
  headers: {"Content-Type": "application/json"}
  
});

// Add a request interceptor to include the token and email in all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Assuming you store the user's email in localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (email) {
      config.headers['x-user-email'] = email; // Add the email to headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
