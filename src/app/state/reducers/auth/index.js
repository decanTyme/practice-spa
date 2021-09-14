import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    rememberUser: false,
    userId: null,
    t_key: null,
    userData: { firstname: null, lastname: null, role: null },
    stale: false,
  },
  reducers: {
    signin: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload._id;
      state.t_key = action.payload.t_key;
      state.rememberUser = action.payload.rememberUser;

      if (
        !state.userData ||
        (state.userData &&
          state.userData.firstname !== action.payload.userData.firstname)
      ) {
        state.userData.firstname = action.payload.userData.firstname;
        state.userData.lastname = action.payload.userData.lastname;
        state.userData.role = action.payload.userData.role;
      }
    },

    signout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.t_key = null;
      state.stale = false;
    },

    setStale: (state, action) => {
      state.stale = action.payload;
    },
  },
});

export const { signin, signout, setStale } = slice.actions;

export const authState = (state) => state.auth;

export default slice.reducer;
