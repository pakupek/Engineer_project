import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000/api/";

export const refreshToken = async () => {
  try {
    const refresh = Cookies.get("refresh_token");
    if (!refresh) throw new Error("No refresh token found");
    
    const response = await axios.post(API_URL + "token/refresh/", { refresh });
    Cookies.set("access_token", response.data.access);
    return response.data.access;
  } catch (err) {
    logout(); // usuń tokeny jeśli refresh nie działa
    return null;
  }
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};

// utils/auth.js
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('access_token');
  }
  return false;
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setTokens = (access, refresh) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};