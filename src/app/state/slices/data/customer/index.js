import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { dynamicSort } from "../sort";

const http = HttpService();

export const fetchCustomers = createAsyncThunk(
  "customers/fetch",
  async (_, { dispatch }) => {
    const response = await http.onDataFetch("customers", { populated: true });

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }

    return response.data.sort(dynamicSort("name"));
  }
);

const slice = createSlice({
  name: "customers",
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
    viewCustomerDetail: (state, action) => {
      state.details = action.payload;

      state.currentlyModifying = null;
    },

    addToCustomerSelection: (state, action) => {
      state.currentlySelected = action.payload;
    },

    resetAllCachedCustomerData: (state) => {
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
      .addCase(fetchCustomers.pending, (state) => {
        state.status.fetch = Constants.LOADING;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status.fetch = Constants.SUCCESS;

        state.data = action.payload.map((customer) => ({
          ...customer,
          fullname: `${customer.firstname} ${customer.lastname}`,
        }));
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status.fetch = Constants.SUCCESS;

        state.error = action.error.message;
      });
  },
});

export const {
  viewCustomerDetail,
  addToCustomerSelection,
  resetAllCachedCustomerData,
} = slice.actions;

export default slice.reducer;
