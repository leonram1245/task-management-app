import axios from "axios";

const API_URL = "http://localhost:3001/api/tasks";

export const fetchUserTasksAPI = async (token) => {
  try {
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
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createTaskAPI = async (taskData, token) => {
  try {
    const response = await axios.post(API_URL, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateTaskAPI = async (taskData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${taskData.id}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTaskAPI = async ({ taskId, token }) => {
  try {
    const res = await axios.delete(`${API_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
