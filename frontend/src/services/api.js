import axios from "axios";

const API = axios.create({
  // Viết cứng link Render vào đây để bỏ qua mọi lỗi biến môi trường
  baseURL: "https://himass-backend.onrender.com", 
});

export default API;