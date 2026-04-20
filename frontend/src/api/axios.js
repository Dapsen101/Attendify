// This file creates an Axios instance configured for authenticated API calls.
// It sets the base URL to the backend server (port 5001).
// The request interceptor automatically adds the JWT token from localStorage
// to the Authorization header for authenticated requests.
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // your backend base URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;