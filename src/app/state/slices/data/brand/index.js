import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { notify } from "../../notification";
import { dynamicSort } from "../sort";

const http = HttpService();

export const fetchBrands = createAsyncThunk(
  "brands/fetch",
  async (_, { dispatch }) => {
    const response = await http.onDataFetch("brands");

    const errMsg = "Product fetch unsuccessful!";

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 403:
      case 404:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error();

      default:
        return response.data.sort(dynamicSort("name"));
    }
  }
);

export const pushBrands = createAsyncThunk(
  "brands/push",
  async (data, { dispatch }) => {
    const response = await http.onDataPush("brands", data);

    const errMsg = "Product fetch unsuccessful!";

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 403:
      case 404:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error();

      default:
        return response.data;
    }
  }
);

const slice = createSlice({
  name: "brands",
  initialState: {
    data: [],
    status: {
      fetch: Constants.IDLE,
      push: Constants.IDLE,
      modify: Constants.IDLE,
      delete: Constants.IDLE,
    },
    error: {
      fetch: null,
      push: null,
      modify: null,
      delete: null,
    },
    details: null,
    currentlyModifying: null,
    currentlySelected: [],
  },
  reducers: {
    viewBrandDetail: (state, action) => {
      state.details = action.payload;

      state.currentlyModifying = null;
    },

    addToBrandSelection: (state, action) => {
      state.currentlySelected = action.payload;
    },

    resetAllCachedBrandData: (state) => {
      // Empty datastore
      state.data = [];

      // Reset everything to defaults
      state.status = {
        fetch: Constants.IDLE,
        push: Constants.IDLE,
        modify: Constants.IDLE,
        delete: Constants.IDLE,
      };
      state.error = {
        fetch: null,
        push: null,
        modify: null,
        delete: null,
      };
      state.details = null;
      state.currentlyModifying = null;
      state.currentlySelected = [];
    },
  },

  extraReducers: (builder) => {
    /* Fetch product cases */
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status.fetch = Constants.LOADING;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status.fetch = Constants.SUCCESS;

        state.data = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status.fetch = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Push product cases */
    builder
      .addCase(pushBrands.pending, (state) => {
        state.status.fetch = Constants.LOADING;
      })
      .addCase(pushBrands.fulfilled, (state, action) => {
        state.status.fetch = Constants.SUCCESS;

        state.data.push(action.payload.brand);
      })
      .addCase(pushBrands.rejected, (state, action) => {
        state.status.fetch = Constants.FAILED;

        state.error = action.error.message;
      });
  },
});

export const { viewBrandDetail, addToBrandSelection, resetAllCachedBrandData } =
  slice.actions;

export const selectAllBrands = (state) => state.root.DataService.brands.data;

/* Fetch */
export const selectBrandFetchStatus = (state) =>
  state.root.DataService.brands.status.fetch;

export const selectBrandFetchError = (state) =>
  state.root.DataService.brands.error.fetch;

/* Fetch */
export const selectBrandPushStatus = (state) =>
  state.root.DataService.brands.status.push;

export const selectBrandPushError = (state) =>
  state.root.DataService.brands.error.push;

export default slice.reducer;
