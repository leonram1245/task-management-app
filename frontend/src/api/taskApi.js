import axios from "axios";

export const fetchUserTasks = async (token) => {
  const res = await axios.get("http://localhost:3001/api/tasks/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
