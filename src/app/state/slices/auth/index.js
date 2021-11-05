import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../services/http";
import Constants from "../constants";
import { resetAllCachedBrandData } from "../data/brand";
import { resetAllCachedCourierData } from "../data/courier";
import { resetAllCachedCustomerData } from "../data/customer";
import { resetAllCachedProductData } from "../data/product";
import { clearAllNotifications, notify } from "../notification";
import { selectAuthRememberUser, selectAuthUserId } from "./selectors";

const http = HttpService();

const hardReset = (dispatch) => {
  dispatch(resetAllCachedProductData());
  dispatch(resetAllCachedBrandData());
  dispatch(resetAllCachedCourierData());
  dispatch(resetAllCachedCustomerData());
  dispatch(clearAllNotifications());
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

    await http.onAuthSignoffRequest(userId);

    hardReset(dispatch);
  }
);

export const getDatabaseStatus = createAsyncThunk(
  "AuthManager/getDatabaseStatus",
  async () => {
    const response = await http.onDatabasePing();

    if (response.status !== 200) throw new Error(response.data.message);

    return response.data;
  }
);

export const requestAuthToken = createAsyncThunk(
  "AuthManager/requestToken",
  async (_, { dispatch, getState }) => {
    const rememeberUser = selectAuthRememberUser(getState());
    const userId = selectAuthUserId(getState());

    const successMsg = "Successfully refreshed. You may resume operations.";

    const response = await http.onReAuthRequest(userId);

    if (!response.data.auth) {
      hardReset(dispatch);
      throw new Error(response.data.message);
    }

    rememeberUser && dispatch(notify(Constants.SUCCESS, successMsg));

    return response.data;
  }
);

const slice = createSlice({
  name: "AuthManager",
  initialState: {
    isLoggedIn: false,
    rememberUser: false,
    userId: null,
    access: null,
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
      .addCase(signIn.pending, (state) => {
        state.status = Constants.AuthManager.Sign.SIGNING_IN;
        state.error = null;

        state.database = { connected: false, status: Constants.IDLE };
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { userId, persist, adminAccess, userData } = action.payload;

        state.status = Constants.IDLE;

        /* Auth Information */
        state.isLoggedIn = true;
        state.userId = userId;
        state.access = adminAccess;
        state.rememberUser = persist;

        /* User Information */
        const { firstname, lastname, role } = userData;

        state.userData.firstname = firstname;
        state.userData.lastname = lastname;
        state.userData.role = role;
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
