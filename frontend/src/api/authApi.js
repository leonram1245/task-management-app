import axios from "axios";

export const loginUser = async (credentials) => {
  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  console.log(data);
  return {
    token: data.token,
    user: data.user,
  };
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
