// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import taskReducer from "../features/ui/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    tasks: taskReducer,
  },
});
