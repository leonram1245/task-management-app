import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchUsersAPI, fetchAllUsersAPI } from "../api/userApi";

export const searchUsers = createAsyncThunk(
  "users/search",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await searchUsersAPI(query, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await fetchAllUsersAPI(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "userSearch",
  initialState: {
    suggestions: [],
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSuggestions } = userSlice.actions;
export default userSlice.reducer;
