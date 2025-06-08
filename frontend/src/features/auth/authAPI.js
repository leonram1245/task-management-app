import axios from "axios";

export const loginUser = async ({ email, password }) => {
  const response = await axios.post("http://localhost:3001/api/auth/login", {
    email,
    password,
  });
  return response.data;
};
export const signupUser = async ({ email, password }) => {
  const response = await axios.post("http://localhost:3001/api/auth/signup", {
    email,
    password,
  });
  return response.data;
};
