import { createSlice } from "@reduxjs/toolkit";
import { customAlphabet } from "nanoid";
import Constants from "../constants";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20
);

const slice = createSlice({
  name: "NotifyService",
  initialState: {
    data: [],
    queue: [],
    archive: [],
    hasPendingNotifications: false,
    readCount: 0,
    autoDisable: true,
    status: Constants.IDLE,
    error: null,
  },
  reducers: {
    notify: {
      prepare: (
        type = Constants.NotifyService.INFO,
        title,
        message,
        opts = {}
      ) => {
        return {
          payload: {
            id: nanoid(),
            date: opts?.date || new Date().toISOString(),
            timeout: opts?.timeout || 5000,
            type,
            title,
            message,
            read: false,
          },
        };
      },
      reducer: (state, action) => {
        state.status = Constants.NotifyService.WORKING;

        state.queue.push(action.payload);
        state.hasPendingNotifications = true;
      },
    },

    seen: (state) => {
      let notification;

      if ((notification = state.queue.shift())) {
        state.archive.push(notification);
      }

      if (state.queue.length === 0) {
        state.hasPendingNotifications = false;
        state.status = Constants.IDLE;
      }
    },

    read: (state, action) => {
      state.archive.forEach((notification) => {
        if (notification.id === action.payload) {
          notification.read = true;
        }
      });
    },

    setAutoDisable: (state, action) => {
      state.autoDisable = action.payload;
    },

    setNotifyStatus: (state, action) => {
      state.status = action.payload;
    },

    clearAllNotifications: (state) => {
      state.data = [];
      state.queue = [];
      state.archive = [];
      state.hasPendingNotifications = false;
      state.autoDisable = true;
      state.status = Constants.IDLE;
      state.error = null;
    },
  },
});

export const { notify, seen, read, setNotifyStatus, clearAllNotifications } =
  slice.actions;

export default slice.reducer;
