import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../services/http";
import Constants from "../constants";
import { resetAllCachedCustomerData } from "../data/customer";
import { resetAllCachedProductData } from "../data/product";
import { selectAuthRefToken, selectAuthUserId } from "./selectors";

const http = HttpService();

const hardReset = (dispatch) => {
  dispatch(resetAllCachedProductData());
  dispatch(resetAllCachedCustomerData());
};

export const signIn = createAsyncThunk(
  "AuthManager/signin",
  async (credentials) => {
    const response = await http.onAuthLoginRequest(credentials);

    if (response.status === 401) throw new Error(response.data);

    return response.data;
  }
);

export const signOut = createAsyncThunk(
  "AuthManager/signout",
  async (_, { dispatch, getState }) => {
    const userId = selectAuthUserId(getState());
    const refToken = selectAuthRefToken(getState());

    const response = await http.onAuthSignoffRequest(userId, refToken);

    hardReset(dispatch);

    return response.data;
  }
);

export const getDatabaseStatus = createAsyncThunk(
  "AuthManager/getDatabaseStatus",
  async () => {
    const response = await http.onDatabasePing();

    if (response.status !== 200) {
      throw new Error();
    }

    return response.data;
  }
);

export const requestAuthToken = createAsyncThunk(
  "AuthManager/requestToken",
  async (_, { dispatch, getState }) => {
    const refToken = selectAuthRefToken(getState());
    const userId = selectAuthUserId(getState());

    const response = await http.onReAuthRequest(userId, refToken);

    if (!response.data.auth) {
      hardReset(dispatch);
      throw new Error(response.data.message);
    }

    dispatch(setStatus(Constants.AuthManager.Sign.Token.REFRESH_SUCCESS));

    return response.data;
  }
);

const slice = createSlice({
  name: "AuthManager",
  initialState: {
    isLoggedIn: false,
    rememberUser: false,
    userId: null,
    t_key: null,
    userData: { firstname: null, lastname: null, role: null },
    stale: false,
    database: { connected: false, status: Constants.IDLE },
    status: Constants.IDLE,
    error: null,
  },
  reducers: {
    forceSignOff: (state) => {
      state.status = Constants.AuthManager.Sign.SIGNED_OFF_WITH_ERROR;

      state.isLoggedIn = false;
      state.rememberUser = false;
      state.userId = null;
      state.t_key = null;
      state.userData = { firstname: null, lastname: null, role: null };
      state.stale = false;
      state.database = { connected: false, status: Constants.IDLE };
    },

    setRememberUser: (state, action) => {
      state.rememberUser = action.payload;
    },

    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
    },

    setStale: (state, action) => {
      state.stale = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* Signin */
    builder
      .addCase(signIn.pending, (state, action) => {
        state.status = Constants.AuthManager.Sign.SIGNING_IN;
        state.error = null;

        state.database = { connected: false, status: Constants.IDLE };
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { userId, refToken, userData } = action.payload;

        state.status = Constants.IDLE;

        state.isLoggedIn = true;
        state.userId = userId;

        if (refToken) {
          state.t_key = refToken;
          state.rememberUser = true;
        }

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
        state.status = Constants.AuthManager.Sign.ERROR;
        state.error = action.error.message;
      });

    /* Signoff */
    builder
      .addCase(signOut.pending, (state) => {
        state.status = Constants.AuthManager.Sign.SIGNING_OFF;

        state.isLoggedIn = false;
        state.rememberUser = false;
        state.userData = { firstname: null, lastname: null, role: null };
        state.stale = false;
        state.database = { connected: false, status: Constants.IDLE };
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = Constants.AuthManager.Sign.SIGNED_OFF;

        state.userId = null;
        state.t_key = null;
      });

    /* Database */
    builder
      .addCase(getDatabaseStatus.pending, (state) => {
        state.database.status = Constants.AuthManager.Database.CONNECTING;
      })
      .addCase(getDatabaseStatus.fulfilled, (state) => {
        state.database.status = Constants.IDLE;

        state.database.connected = true;
      })
      .addCase(getDatabaseStatus.rejected, (state) => {
        state.database.status = Constants.AuthManager.Database.ERROR;

        state.stale = true;
        state.database.connected = false;
      });

    /* Auth token request */
    builder
      .addCase(requestAuthToken.pending, (state) => {
        state.status = Constants.AuthManager.Sign.Token.REFRESHING;
        state.error = null;
      })
      .addCase(requestAuthToken.fulfilled, (state) => {
        state.status = Constants.IDLE;
        state.error = null;

        state.stale = false;
        state.database = { connected: false, status: Constants.IDLE };
      })
      .addCase(requestAuthToken.rejected, (state, action) => {
        state.status = Constants.AuthManager.Sign.Token.REFRESH_FAIL;
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

export const {
  setStale,
  setRememberUser,
  setAuthError,
  setStatus,
  forceSignOff,
} = slice.actions;

export default slice.reducer;