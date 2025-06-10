import axios from "axios";
import { API_URL } from "./config";

const USERS_URL = `${API_URL}/api/users`;

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const searchUsersAPI = async (query, token) => {
  try {
    const response = await axios.get(
      `${USERS_URL}/search?q=${encodeURIComponent(query)}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const fetchAllUsersAPI = async (token) => {
  try {
    const response = await axios.get(USERS_URL, authHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
