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