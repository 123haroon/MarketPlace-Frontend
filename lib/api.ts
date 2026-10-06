import axios from "axios";

const api = axios.create({
  baseURL: "https://marketplace-backend-cyan.vercel.app/api",
  withCredentials: true,
});

export default api;
