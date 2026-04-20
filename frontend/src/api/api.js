// This file creates an Axios instance for API calls to the backend.
// It sets the base URL to the backend server (port 5000).
// This instance can be used throughout the app for making HTTP requests.
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default API;