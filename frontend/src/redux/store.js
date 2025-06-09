// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import uiReducer from "../features/uiSlice";
import taskReducer from "../features/taskSlice";
import userSearchReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    tasks: taskReducer,
    userSearch: userSearchReducer,
  },
});
