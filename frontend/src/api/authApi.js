import axios from "axios";
import { API_URL } from "./config";

console.log("API_URL:", API_URL);

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
  return response.data;
};

export const signupUser = async ({ email, password, firstName, lastName }) => {
  const response = await axios.post(`${API_URL}/api/auth/signup`, {
    email,
    password,
    firstName,
    lastName,
  });
  return response.data;
};
