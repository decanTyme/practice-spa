import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { dynamicSort } from "../sort";

const http = HttpService();

export const fetchCouriers = createAsyncThunk(
  "couriers/fetch",
  async (_, { dispatch }) => {
    const response = await http.onDataFetch("couriers");

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }

    return response.data.sort(dynamicSort("name"));
  }
);

const slice = createSlice({
  name: "couriers",
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
    viewCourierDetail: (state, action) => {
      state.details = action.payload;

      state.currentlyModifying = null;
    },

    addToCourierSelection: (state, action) => {
      state.currentlySelected = action.payload;
    },

    resetAllCachedCourierData: (state) => {
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
      .addCase(fetchCouriers.pending, (state) => {
        state.status.fetch = Constants.LOADING;
      })
      .addCase(fetchCouriers.fulfilled, (state, action) => {
        state.status.fetch = Constants.SUCCESS;

        state.data = action.payload;
      })
      .addCase(fetchCouriers.rejected, (state, action) => {
        state.status.fetch = Constants.FAILED;

        state.error = action.error.message;
      });
  },
});

export const {
  viewCourierDetail,
  addToCourierSelection,
  resetAllCachedCourierData,
} = slice.actions;

export const selectAllCouriers = (state) =>
  state.root.DataService.couriers.data;

/* Fetch */
export const selectCourierFetchStatus = (state) =>
  state.root.DataService.couriers.status.fetch;

export const selectCourierFetchError = (state) =>
  state.root.DataService.couriers.error.fetch;

export default slice.reducer;
