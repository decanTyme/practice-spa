import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";

const LocalStorage = {
  getItem: (key) =>
    window.localStorage.getItem(key)
      ? JSON.parse(window.localStorage.getItem(key))
      : undefined,

  setItem: (key, value) =>
    window.localStorage.setItem(key, JSON.stringify(value)),

  removeKey: (key) => window.localStorage.removeItem(key),
};

const preloadedState = LocalStorage.getItem("__app_state_");

const store = configureStore({
  reducer: { auth: authReducer },
  preloadedState,
});

store.subscribe(() => LocalStorage.setItem("__app_state_", store.getState()));

export default store;
