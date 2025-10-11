import axios from "axios";

const API_URL = "http://localhost:8000/api/";

// Konfiguracja axios z interceptors
const api = axios.create({
  baseURL: API_URL,
});
// Interceptor do dodawania tokena do requestów
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor do obsługi wygasłych tokenów
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
  window.location.href = '/login';
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

// Funkcje dla panelu użytkownika
export const authService = {
  // Logowanie
  async login(email, password) {
    try {
      const response = await api.post('http://localhost:8000/api/login/', { 
        username: email, // Django często używa username zamiast email
        password 
      });
      const { access, refresh } = response.data;
      if (response.data.access) {
        setTokens(access, refresh);
        window.dispatchEvent(new Event('authChange'));
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Błąd logowania');
    }
  },

  // Rejestracja
  async register(userData) {
    try {
      const response = await api.post('http://localhost:8000/api/register/', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Błąd rejestracji');
    }
  },

  // Pobieranie profilu użytkownika
  async getProfile() {
    try {
      const response = await api.get('http://localhost:8000/api/profile/');
      return response.data;
    } catch (error) {
      throw new Error('Błąd pobierania profilu');
    }
  },

  // Aktualizacja profilu użytkownika
  async updateProfile(userData) {
    try {
      const response = await api.patch('http://localhost:8000/api/profile/', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Błąd aktualizacji profilu');
    }
  },

  // Zmiana hasła
  async changePassword(passwordData) {
    try {
      const response = await api.post('http://localhost:8000/api/change-password/', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Błąd zmiany hasła');
    }
  },

  async refreshToken() {
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
  },

  // Wylogowanie
  logout() {
    logout();
  },

  // Sprawdzenie czy użytkownik jest zalogowany
  isAuthenticated() {
    return isAuthenticated();
  }
};

// Sprawdź autoryzację używając endpointu profile
export const checkAuthStatus = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    // Używamy endpointu profile do sprawdzenia autoryzacji
    const response = await api.get('http://localhost:8000/api/profile/');

    if (response.status === 200) {
      return { 
        isAuthenticated: true, 
        user: response.data 
      };
    } else {
      clearTokens();
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    if (error.response?.status === 401) {
      clearTokens();
    }
    return { isAuthenticated: false, user: null };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('http://localhost:8000/api/profile/');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Dodatkowe funkcje pomocnicze dla panelu użytkownika
export const userService = {
  // Pobierz pełne dane użytkownika
  async getUserData() {
    return await getCurrentUser();
  },

  // Aktualizuj dane użytkownika
  async updateUserData(userData) {
    return await authService.updateProfile(userData);
  },

  // Zmiana hasła użytkownika
  async changeUserPassword(oldPassword, newPassword) {
    return await authService.changePassword({
      old_password: oldPassword,
      new_password: newPassword
    });
  },

  // Upload awatara
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.patch('http://localhost:8000/api/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Błąd uploadu awatara');
    }
  }
};


export default authService;