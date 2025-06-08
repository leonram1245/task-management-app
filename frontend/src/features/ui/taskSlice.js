import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async (token) => {
    const res = await axios.get("http://localhost:3001/api/tasks/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
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
        state.createdTasks = action.payload.createdTasks;
        state.assignedTasks = action.payload.assignedTasks;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;
