import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../services/http";

const http = HttpService();

export const Constants = {
  IDLE: "IDLE",
  Auth: {
    SIGNING_IN: "SIGNING_IN",
    SIGNING_OFF: "SIGNING_OFF",
    SIGNED_OFF: "SIGNED_OFF",
    SIGNED_OFF_WITH_ERROR: "SIGNED_OFF_FORCED",
    ERROR: "ERROR",
    Token: {
      REFRESHING: "TOKEN_REFRESHING",
      REFRESH_SUCCESS: "TOKEN_REFRESH_SUCCESS",
      REFRESH_FAIL: "TOKEN_REFRESH_FAIL",
    },
  },
  Database: {
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    ERROR: "FAILED",
  },
};

export const signIn = createAsyncThunk(
  "authManager/signin",
  async (credentials, { dispatch }) => {
    const response = await http.onAuthLoginRequest(credentials);

    if (response.status === 401) throw new Error(response.data);

    dispatch(setRememberUser(credentials.rememberUser));

    return response.data;
  }
);

export const signOut = createAsyncThunk(
  "authManager/signout",
  async (_, { getState }) => {
    const userId = selectAuthUserId(getState());
    const refToken = selectAuthRefToken(getState());

    const response = await http.onAuthSignoffRequest(userId, refToken);

    return response.data;
  }
);

export const getDatabaseStatus = createAsyncThunk(
  "authManager/getDatabaseStatus",
  async () => {
    const response = await http.onDatabasePing();

    if (response.status !== 200) {
      throw new Error();
    }

    return response.data;
  }
);

export const requestAuthToken = createAsyncThunk(
  "authManager/requestToken",
  async (_, { dispatch, getState }) => {
    const refToken = selectAuthRefToken(getState());
    const userId = selectAuthUserId(getState());

    const response = await http.onReAuthRequest(userId, refToken);

    if (!response.data.auth) {
      await http.onAuthSignoffRequest(userId, refToken);
      throw new Error(response.data.message);
    }

    dispatch(setStatus(Constants.Auth.Token.REFRESH_SUCCESS));

    return response.data;
  }
);

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
  extraReducers: (builder) => {
    /* Signin */
    builder
      .addCase(signIn.pending, (state, action) => {
        state.status = Constants.Auth.SIGNING_IN;

        state.database = { connected: false, status: Constants.IDLE };
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { userId, refToken, userData } = action.payload;

        state.status = Constants.IDLE;

        state.isLoggedIn = true;
        state.userId = userId;
        state.t_key = refToken;

        if (
          !state.userData ||
          (state.userData && state.userData.firstname !== userData.firstname)
        ) {
          const { firstname, lastname, role } = userData;

          state.userData.firstname = firstname;
          state.userData.lastname = lastname;
          state.userData.role = role;
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = Constants.Auth.ERROR;
        state.error = action.error.message;
      });

    /* Signoff */
    builder
      .addCase(signOut.pending, (state) => {
        state.status = Constants.Auth.SIGNING_OFF;

        state.isLoggedIn = false;
        state.rememberUser = false;
        state.userData = { firstname: null, lastname: null, role: null };
        state.stale = false;
        state.database = { connected: false, status: Constants.IDLE };
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = Constants.Auth.SIGNED_OFF;
        state.userId = null;
        state.t_key = null;
      });

    /* Database */
    builder
      .addCase(getDatabaseStatus.pending, (state) => {
        state.database.status = Constants.Database.CONNECTING;
      })
      .addCase(getDatabaseStatus.fulfilled, (state) => {
        state.database.status = Constants.IDLE;

        state.database.connected = true;
      })
      .addCase(getDatabaseStatus.rejected, (state, action) => {
        state.database.status = Constants.Database.ERROR;

        state.stale = true;
        state.database.connected = false;
      });

    /* Auth token request */
    builder
      .addCase(requestAuthToken.pending, (state) => {
        state.status = Constants.Auth.Token.REFRESHING;
        state.error = null;
      })
      .addCase(requestAuthToken.fulfilled, (state) => {
        state.status = Constants.IDLE;
        state.error = null;
        state.stale = false;
        state.database = { connected: false, status: Constants.IDLE };
      })
      .addCase(requestAuthToken.rejected, (state, action) => {
        state.status = Constants.Auth.Token.REFRESH_FAIL;
        state.error = action.error.message;

        state.isLoggedIn = false;
        state.rememberUser = false;
        state.userId = null;
        state.t_key = null;
        state.userData = { firstname: null, lastname: null, role: null };
        state.stale = false;
        state.database = { connected: false, status: Constants.IDLE };
      });
  },
});

export const { signin, signout, setStale } = slice.actions;

export const selectAuthCurrentState = (state) => state.root.auth;
export const selectAuthStatus = (state) => state.root.auth.isLoggedIn;
export const selectAuthRefToken = (state) => state.root.auth.t_key;
export const selectAuthUserId = (state) => state.root.auth.userId;
export const selectAuthUserData = (state) => state.root.auth.userData;
export const selectAuthRememberUser = (state) => state.root.auth.rememberUser;
export const selectAuthDatabaseStatus = (state) => state.root.auth.database;
export const selectAuthStaleStatus = (state) => state.root.auth.stale;

export default slice.reducer;
