import { createSlice, nanoid } from "@reduxjs/toolkit";
import Constants from "../constants";

const slice = createSlice({
  name: "NotifyService",
  initialState: {
    data: [],
    queue: [],
    archive: [],
    hasPendingNotifications: false,
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
            date: opts?.date || Date.now(),
            timeout: opts?.timeout || 5000,
            type,
            title,
            message,
          },
        };
      },
      reducer: (state, action) => {
        state.hasPendingNotifications = true;
        state.status = Constants.NotifyService.WORKING;
        state.queue.push(action.payload);
      },
    },

    seen: (state, action) => {
      let notif;

      if ((notif = state.queue.shift())) {
        state.archive.push(notif);
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

export const { notify, seen, setNotifyStatus, clearAllNotifications } =
  slice.actions;

export default slice.reducer;