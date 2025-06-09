import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserTasksAPI,
  createTaskAPI,
  updateTaskAPI,
} from "../api/taskApi";

export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async (token, thunkAPI) => {
    try {
      const data = await fetchUserTasksAPI(token);
      if (!data.createdTasks || !data.assignedTasks) {
        throw new Error(
          "Expected 'createdTasks' and 'assignedTasks' in response"
        );
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch tasks");
    }
  }
);

export const createTaskThunk = createAsyncThunk(
  "tasks/createTask",
  async ({ taskData, token }, thunkAPI) => {
    try {
      return await createTaskAPI(taskData, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskData, token }, thunkAPI) => {
    try {
      return await updateTaskAPI(taskData, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    createdTasks: [],
    assignedTasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTasks = action.payload.createdTasks || [];
        state.assignedTasks = action.payload.assignedTasks || [];
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTasks.push(action.payload);
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;

        const createdIndex = state.createdTasks.findIndex(
          (t) => t.id === updatedTask.id
        );
        if (createdIndex !== -1) state.createdTasks[createdIndex] = updatedTask;
        const assignedIndex = state.assignedTasks.findIndex(
          (t) => t.id === updatedTask.id
        );
        if (assignedIndex !== -1)
          state.assignedTasks[assignedIndex] = updatedTask;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
