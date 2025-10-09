"use client";

import axios from "axios";

const API_URL = "http://localhost:8000/api/";


// Tworzymy instancję axios
const api = axios.create({
  baseURL: API_URL,
});


// Funkcja do tworzenia dyskusji używająca api z interceptorami
export const createDiscussion = async (discussionData) => {
  return await api.post("discussions/", discussionData);
};

// Funkcja do pobierania dyskusji
export const getDiscussions = async () => {
  return await api.get("discussions/");
};

export default api;