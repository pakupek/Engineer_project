"use client";

import axios from "axios";

const API_URL = "http://localhost:8000/api/";

// Funkcja odświeżania tokenu
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token found");

    const response = await axios.post(API_URL + "token/refresh/", { refresh });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (err) {
    logout();
    return null;
  }
};

// Tworzymy instancję axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor do dodawania access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor do automatycznego odświeżania tokenu
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Funkcje do rejestracji i logowania
export const register = async (userData) => {
  return await axios.post(API_URL + "register/", userData);
};

export const login = async (userData) => {
  const response = await axios.post(API_URL + "login/", userData);
  if (response.data.access) {
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Funkcja do tworzenia dyskusji używająca api z interceptorami
export const createDiscussion = async (discussionData) => {
  return await api.post("discussions/", discussionData);
};

// Funkcja do pobierania dyskusji
export const getDiscussions = async () => {
  return await api.get("discussions/");
};
