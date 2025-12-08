"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL nie jest ustawione w pliku .env");
}

// Tworzymy instancję axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor do dodawania tokena do requestów
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

// Interceptor do obsługi wygasłych tokenów
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await authService.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        authService.logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  async login(username, password) {
    try {
      const response = await api.post("/api/login/", {
        username: username, // Django często używa username zamiast email
        password,
      });

      const { access, refresh } = response.data;
      if (access) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Błąd logowania");
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/api/register/", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Błąd rejestracji");
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/api/profile/");
      return response.data;
    } catch (error) {
      throw new Error("Błąd pobierania profilu");
    }
  },

  async updateProfile(userData, isFormData = false) {
    try {
      const config = { headers: {} };
      if (!isFormData) config.headers["Content-Type"] = "application/json";

      const response = await api.patch("/api/profile/", userData, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Błąd aktualizacji profilu");
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.post("/api/change-password/", passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Błąd zmiany hasła");
    }
  },

  async refreshToken() {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) throw new Error("Brak refresh tokena");

      const response = await api.post("/api/token/refresh/", { refresh });
      localStorage.setItem("access_token", response.data.access);
      return response.data.access;
    } catch (error) {
      authService.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};

export default authService;
