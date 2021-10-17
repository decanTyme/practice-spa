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

    const errMsg = "Brand fetch unsuccessful!";

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

export const pushBrand = createAsyncThunk(
  "brands/push",
  async (data, { dispatch }) => {
    const response = await http.onDataPush("brands", data);

    const successMsg = "Brand save success!";
    const errMsg = "Brand save unsuccessful!";

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
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error();

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg));

        return response.data;
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/modify",
  async (modifiedBrand, { dispatch }) => {
    const response = await http.onDataModify("brands", modifiedBrand);

    const successMsg = "Brand update success!";
    const errMsg = "Brand update unsuccessful!";

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
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error();

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg));

        return response.data;
    }
  }
);

export const removeBrand = createAsyncThunk(
  "brands/delete",
  async ({ _id }, { dispatch }) => {
    const response = await http.onDataRemove("brands", void 0, {
      params: { _id },
    });

    const successMsg = "Brand delete success!";
    const errMsg = "Brand delete unsuccessful!";

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
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error();

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg));

        return _id;
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
    setIdle: (state, action) => {
      action.payload === Constants.DataService.ALL
        ? (state.status = {
            fetch: Constants.IDLE,
            push: Constants.IDLE,
            modify: Constants.IDLE,
            delete: Constants.IDLE,
          })
        : (state.status[action.payload] = Constants.IDLE);
    },

    viewBrandDetail: (state, action) => {
      state.details = action.payload;

      state.currentlyModifying = null;
    },

    modifyBrand: (state, action) => {
      state.currentlyModifying = action.payload;
    },

    addToBrandSelection: (state, action) => {
      state.currentlySelected = action.payload;
    },

    resetAllBrandModification: (state) => {
      state.currentlyModifying = null;
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
        state.data.sort(dynamicSort("name"));
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status.fetch = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Push brand cases */
    builder
      .addCase(pushBrand.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(pushBrand.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        state.data.push(action.payload.brand);
        state.data.sort(dynamicSort("name"));
      })
      .addCase(pushBrand.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Update brand cases */
    builder
      .addCase(updateBrand.pending, (state) => {
        state.status.modify = Constants.LOADING;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

        const brand = action.payload.brand;

        // Remove the old brand first
        state.data = state.data.filter(({ _id }) => _id !== brand._id);

        // Then push new brand to datastore and sort
        state.data.push(brand);
        state.data.sort(dynamicSort("name"));
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.status.modify = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Delete brand cases */
    builder
      .addCase(removeBrand.pending, (state) => {
        state.status.delete = Constants.LOADING;
      })
      .addCase(removeBrand.fulfilled, (state, action) => {
        state.status.delete = Constants.SUCCESS;

        state.data = state.data.filter(({ _id }) => _id !== action.payload);
        state.data.sort(dynamicSort("name"));
      })
      .addCase(removeBrand.rejected, (state, action) => {
        state.status.delete = Constants.FAILED;

        state.error = action.error.message;
      });
  },
});

export const {
  setIdle,
  viewBrandDetail,
  modifyBrand,
  addToBrandSelection,
  resetAllBrandModification,
  resetAllCachedBrandData,
} = slice.actions;

export const selectAllBrands = (state) => state.root.DataService.brands.data;

export const selectBrandInEdit = (state) =>
  state.root.DataService.brands.currentlyModifying;

/* Fetch */
export const selectBrandFetchStatus = (state) =>
  state.root.DataService.brands.status.fetch;

export const selectBrandFetchError = (state) =>
  state.root.DataService.brands.error.fetch;

/* Push */
export const selectBrandPushStatus = (state) =>
  state.root.DataService.brands.status.push;

export const selectBrandPushError = (state) =>
  state.root.DataService.brands.error.push;

/* Modify */
export const selectBrandModifyStatus = (state) =>
  state.root.DataService.brands.status.modify;

export const selectBrandModifyError = (state) =>
  state.root.DataService.brands.error.modify;

/* Delete */
export const selectBrandRemoveStatus = (state) =>
  state.root.DataService.brands.status.delete;

export const selectBrandRemoveError = (state) =>
  state.root.DataService.brands.error.delete;

export default slice.reducer;
