import axios from "axios";

const API = axios.create({
  // Phải có VITE_ ở đầu
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export default API;