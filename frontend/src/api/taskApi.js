import axios from "axios";

const API_URL = "http://localhost:3001/api/tasks";

export const fetchUserTasksAPI = async (token) => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

export const createTaskAPI = async (taskData, token) => {
  const response = await axios.post(API_URL, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateTaskAPI = async (taskData, token) => {
  const response = await axios.put(`${API_URL}/${taskData.id}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
