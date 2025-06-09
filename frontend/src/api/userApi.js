import axios from "axios";

const BASE_URL = "http://localhost:3001/api/users";

export const searchUsersAPI = async (query, token) => {
  const response = await axios.get(`${BASE_URL}/search?q=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllUsersAPI = async (token) => {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
