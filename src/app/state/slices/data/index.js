import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setStale } from "../auth";
import HttpService from "../../../../services/http";

const http = HttpService();

/* Sorting function */
function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

/* Async thunks */
export const fetchData = createAsyncThunk(
  "dataService/fetch",
  async (_, { dispatch }) => {
    const response = await http.onDataFetch();

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }

    return response.data.sort(dynamicSort("name"));
  }
);

export const pushData = createAsyncThunk(
  "dataService/push",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataPush(data);

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }

    return response.data;
  }
);

export const updateData = createAsyncThunk(
  "dataService/modify",
  async (modifiedData, { dispatch }) => {
    const response = await HttpService().onDataModify(modifiedData);

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }
    if (response.data.success) return modifiedData;
  }
);

export const removeData = createAsyncThunk(
  "dataService/delete",
  async (id, { dispatch }) => {
    const response = await HttpService().onDataRemove(id);

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }

    if (response.data.success) return id;
  }
);

const slice = createSlice({
  name: "dataService",
  initialState: {
    data: [],
    status: {
      fetch: "idle",
      push: "idle",
      modify: "idle",
      delete: "idle",
    },
    error: {
      fetch: null,
      push: null,
      modify: null,
      delete: null,
    },
    dataDetails: null,
    sn: null,
    currentlyModifying: null,
    currentlySelected: [],
  },
  reducers: {
    setIdle: (state, action) => {
      action.payload === "all"
        ? (state.status = {
            fetch: "idle",
            push: "idle",
            modify: "idle",
            delete: "idle",
          })
        : (state.status[action.payload] = "idle");
    },

    viewData: (state, action) => {
      state.dataDetails = action.payload;

      state.sn = null;
      state.currentlyModifying = null;
    },

    modifyData: (state, action) => {
      state.currentlyModifying = action.payload;

      state.sn = null;
    },

    modifyReset: (state) => {
      state.currentlyModifying = null;
    },

    addScannedCode: (state, action) => {
      state.sn = action.payload;
    },

    addToSelection: (state, action) => {
      state.currentlySelected = action.payload;
    },

    deleteAllData: (state) => {
      // Empty datastore
      state.data = [];

      // Reset everything to defaults
      state.status = {
        fetch: "idle",
        push: "idle",
        modify: "idle",
        delete: "idle",
      };
      state.error = {
        fetch: null,
        push: null,
        modify: null,
        delete: null,
      };
      state.dataDetails = null;
      state.sn = null;
      state.currentlyModifying = null;
      state.currentlySelected = null;
    },
  },

  extraReducers: (builder) => {
    /* Fetch data cases */
    builder
      .addCase(fetchData.pending, (state) => {
        state.status.fetch = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status.fetch = "success";

        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status.fetch = "failed";

        state.error = action.error.message;
      });

    /* Push data cases */
    builder
      .addCase(pushData.pending, (state) => {
        state.status.push = "loading";
      })
      .addCase(pushData.fulfilled, (state, action) => {
        state.status.push = "success";

        // Push to the datastore
        state.data.push(action.payload.product);
        state.data.sort(dynamicSort("name"));

        state.sn = null;
      })
      .addCase(pushData.rejected, (state, action) => {
        state.status.push = "failed";

        state.error = action.error.message;
      });

    /* Update data cases */
    builder
      .addCase(updateData.fulfilled, (state, action) => {
        state.status.modify = "success";

        // Remove the old data, push the approved change to the datastore,
        // then re-sort everything in the datastore
        state.data = state.data.filter(({ _id }) => _id !== action.payload._id);
        state.data.push(action.payload);
        state.data.sort(dynamicSort("name"));

        // Data details should be updated with the latest approved change
        state.dataDetails = action.payload;

        // Finally, clear some states
        state.currentlyModifying = null;
        state.sn = null;
      })
      .addCase(updateData.rejected, (state) => {
        state.status.modify = "failed";
      });

    /* Remove data cases */
    builder.addCase(removeData.fulfilled, (state, action) => {
      state.status.delete = "success";

      // After removing the aprroved deleted data, remove from datastore
      // and re-sort
      state.data = state.data.filter(({ _id }) => _id !== action.payload);
      state.data.sort(dynamicSort("name"));

      state.sn = null;
      state.currentlyModifying = null;
      state.dataDetails = null;
    });
  },
});

export const {
  setIdle,
  viewData,
  modifyData,
  modifyReset,
  addScannedCode,
  addToSelection,
  deleteAllData,
} = slice.actions;

// State data selectors
export const selectAllData = (state) => state.root.data.data;
export const selectDataDetails = (state) => state.root.data.dataDetails;
export const selectDataInEdit = (state) => state.root.data.currentlyModifying;
export const selectDataCode = (state) => state.root.data.sn;
export const selectDataInSelection = (state) =>
  state.root.data.currentlySelected;
export const selectDataFetchStatus = (state) => state.root.data.status.fetch;
export const selectDataError = (state) => state.root.data.error;

export default slice.reducer;
