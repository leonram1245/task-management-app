import axios from "axios";

export const loginUser = async (credentials) => {
  const response = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const signupUser = async ({ email, password, firstName, lastName }) => {
  const response = await axios.post("http://localhost:3001/api/auth/signup", {
    email,
    password,
    firstName,
    lastName,
  });
  return response.data;
};
