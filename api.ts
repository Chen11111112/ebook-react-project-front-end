// lib/api/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

const API = axios.create({ 'baseURL': process.env.NEXT_PUBLIC_API_URL });
API.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  if (!config.headers) {
    config.headers = new axios.AxiosHeaders();
  }
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

API.interceptors.response.use(
  (response) => {return response.data},
  (error) => {
    if (error.response) {
      // 伺服器有回應 (例如 400, 404, 500)
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 請求發送了但沒回應 (網路錯誤、CORS、伺服器掛了)
      return Promise.reject("No response from server");
    } else {
      // 其他錯誤 (設定錯誤等)
      return Promise.reject(error.message);
    }
  }
);

export default API;
