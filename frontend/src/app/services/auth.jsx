import axios from "axios";

const API_URL = "http://localhost:8000/api/";

export const refreshToken = async () => {
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

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

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

// Sprawdź autoryzację używając endpointu users
export const checkAuthStatus = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    // Używamy endpointu users do sprawdzenia autoryzacji
    const response = await fetch('http://localhost:8000/api/users/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      // Jeśli request się powiódł, użytkownik jest zalogowany
      // Możemy pobrać dane użytkownika z innego endpointu lub użyć domyślnych
      return { 
        isAuthenticated: true, 
        user: {
          id: 1, // Tymczasowe dane - w praktyce pobierzesz z API
          username: 'Użytkownik'
        } 
      };
    } else {
      clearTokens();
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    clearTokens();
    return { isAuthenticated: false, user: null };
  }
};

export const getCurrentUser = async () => {
  const status = await checkAuthStatus();
  return status.user;
};