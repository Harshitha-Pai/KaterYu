import axios from 'axios';

const API_URL = "https://kateryu.onrender.com"

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;