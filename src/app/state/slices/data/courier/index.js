import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { notify } from "../../notification";
import { dynamicSort } from "../sort";

const http = HttpService();

export const fetchCouriers = createAsyncThunk(
  "couriers/fetch",
  async (_, { dispatch }) => {
    const response = await http.onDataFetch("couriers");

    const errMsg = "Courier fetch unsuccessful!";

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

export const pushCouriers = createAsyncThunk(
  "couriers/push",
  async (data, { dispatch }) => {
    const response = await http.onDataPush("couriers", data);

    const successMsg = "Courier save success!";
    const errMsg = "Courier save unsuccessful!";

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

export const updateCourier = createAsyncThunk(
  "couriers/modify",
  async (modifiedCourier, { dispatch }) => {
    const response = await http.onDataModify("couriers", modifiedCourier);

    const successMsg = "Courier update success!";
    const errMsg = "Courier update unsuccessful!";

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

export const removeCourier = createAsyncThunk(
  "couriers/delete",
  async ({ _id }, { dispatch }) => {
    const response = await http.onDataRemove("couriers", void 0, {
      params: { _id },
    });

    const successMsg = "Courier delete success!";
    const errMsg = "Courier delete unsuccessful!";

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

    viewCourierDetail: (state, action) => {
      state.details = action.payload;

      state.currentlyModifying = null;
    },

    modifyCourier: (state, action) => {
      state.currentlyModifying = action.payload;
    },

    resetAllCourierModification: (state) => {
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

    /* Push courier cases */
    builder
      .addCase(pushCouriers.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(pushCouriers.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        state.data.push(action.payload.courier);
        state.data.sort(dynamicSort("name"));
      })
      .addCase(pushCouriers.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Update courier cases */
    builder
      .addCase(updateCourier.pending, (state) => {
        state.status.modify = Constants.LOADING;
      })
      .addCase(updateCourier.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

        const courier = action.payload.courier;

        // Remove the old courier first
        state.data = state.data.filter(({ _id }) => _id !== courier._id);

        // Then push new courier to datastore and sort
        state.data.push(courier);
        state.data.sort(dynamicSort("name"));
      })
      .addCase(updateCourier.rejected, (state, action) => {
        state.status.modify = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Delete courier cases */
    builder
      .addCase(removeCourier.pending, (state) => {
        state.status.delete = Constants.LOADING;
      })
      .addCase(removeCourier.fulfilled, (state, action) => {
        state.status.delete = Constants.SUCCESS;

        state.data = state.data.filter(({ _id }) => _id !== action.payload);
        state.data.sort(dynamicSort("name"));
      })
      .addCase(removeCourier.rejected, (state, action) => {
        state.status.delete = Constants.FAILED;

        state.error = action.error.message;
      });
  },
});

export const {
  setIdle,
  viewCourierDetail,
  modifyCourier,
  resetAllCourierModification,
  addToCourierSelection,
  resetAllCachedCourierData,
} = slice.actions;

export const selectAllCouriers = (state) =>
  state.root.DataService.couriers.data;

export const selectCourierInEdit = (state) =>
  state.root.DataService.couriers.currentlyModifying;

/* Fetch */
export const selectCourierFetchStatus = (state) =>
  state.root.DataService.couriers.status.fetch;

export const selectCourierFetchError = (state) =>
  state.root.DataService.couriers.error.fetch;

/* Push */
export const selectCourierPushStatus = (state) =>
  state.root.DataService.couriers.status.push;

export const selectCourierPushError = (state) =>
  state.root.DataService.couriers.error.push;

/* Modify */
export const selectCourierModifyStatus = (state) =>
  state.root.DataService.couriers.status.modify;

export const selectCourierModifyError = (state) =>
  state.root.DataService.couriers.error.modify;

/* Delete */
export const selectCourierRemoveStatus = (state) =>
  state.root.DataService.couriers.status.delete;

export const selectCourierRemoveError = (state) =>
  state.root.DataService.couriers.error.delete;

export default slice.reducer;
