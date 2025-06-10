import axios from "axios";

const BASE_URL = "http://localhost:3001/api/users";

export const searchUsersAPI = async (query, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAllUsersAPI = async (token) => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
