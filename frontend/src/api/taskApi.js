import axios from "axios";
import { API_URL } from "./config";

const TASKS_URL = `${API_URL}/api/tasks`;

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchUserTasksAPI = async (token) => {
  try {
    const response = await axios.get(TASKS_URL, authHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const createTaskAPI = async (taskData, token) => {
  try {
    const response = await axios.post(TASKS_URL, taskData, authHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateTaskAPI = async (taskData, token) => {
  try {
    const response = await axios.put(
      `${TASKS_URL}/${taskData.id}`,
      taskData,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteTaskAPI = async ({ taskId, token }) => {
  try {
    const response = await axios.delete(
      `${TASKS_URL}/${taskId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
