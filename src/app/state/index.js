import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const LocalStorage = {
  getItem: (key) =>
    window.localStorage.getItem(key)
      ? JSON.parse(window.localStorage.getItem(key))
      : undefined,

  setItem: (key, value) =>
    window.localStorage.setItem(key, JSON.stringify(value)),

  removeKey: (key) => window.localStorage.removeItem(key),
};

const preloadedState = { root: { auth: LocalStorage.getItem("__app_state_") } };

const store = configureStore({
  reducer: { root: rootReducer },
  preloadedState,
});

store.subscribe(() =>
  LocalStorage.setItem("__app_state_", store.getState().root.auth)
);

export default store;
