import { createSlice } from "@reduxjs/toolkit";
import { customAlphabet } from "nanoid";
import Constants from "../constants";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20
);

const slice = createSlice({
  name: "NotifyService",
  initialState: {
    data: [],
    queue: [],
    archive: [],
    hasPendingNotifications: false,
    autohide: true,
    status: Constants.IDLE,
    error: null,
  },
  reducers: {
    notify: {
      prepare: (
        type = Constants.NotifyService.INFO,
        title,
        message,
        { autohide = true, date = new Date().toISOString(), delay = 5000 } = {}
      ) => {
        return {
          payload: {
            id: nanoid(),
            autohide,
            type,
            delay,
            date,
            title,
            message,
            read: false,
          },
        };
      },
      reducer: (state, { payload: notification }) => {
        state.status = Constants.NotifyService.WORKING;

        state.queue.push(notification);
        state.hasPendingNotifications = true;
      },
    },

    seen: (state, { payload: seenNotifId }) => {
      state.queue = state.queue.filter((queuedNotif) => {
        if (queuedNotif.id === seenNotifId) {
          state.archive.push(queuedNotif);
          state.archive.sort((a, b) => b.date.localeCompare(a.date));
        }

        return queuedNotif.id !== seenNotifId;
      });

      if (state.queue.length === 0) {
        state.hasPendingNotifications = false;
        state.status = Constants.IDLE;
      }
    },

    read: (state, { payload: readNotifId }) => {
      state.archive.forEach((notification) => {
        if (notification.id === readNotifId) notification.read = true;
      });
    },

    setAutoHide: (state, action) => {
      state.autohide = action.payload;
    },

    setNotifyStatus: (state, action) => {
      state.status = action.payload;
    },

    clearAllNotifications: (state) => {
      state.data = [];
      state.queue = [];
      state.archive = [];
      state.hasPendingNotifications = false;
      state.autohide = true;
      state.status = Constants.IDLE;
      state.error = null;
    },
  },
});

export const { notify, seen, read, setNotifyStatus, clearAllNotifications } =
  slice.actions;

export default slice.reducer;
