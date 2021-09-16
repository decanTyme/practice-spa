import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../services/http";

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

export const fetchData = createAsyncThunk("dataService/fetch", async () => {
  const response = await HttpService().onDataFetch();

  return response.data.sort(dynamicSort("name"));
});

export const pushData = createAsyncThunk("dataService/push", async (data) => {
  const response = await HttpService().onDataPush(data);

  return response.data;
});

export const updateData = createAsyncThunk(
  "dataService/modify",
  async (modifiedData) => {
    const response = await HttpService().onDataModify(modifiedData);

    if (response.data.success) return modifiedData;
  }
);

export const removeData = createAsyncThunk("dataService/delete", async (id) => {
  const response = await HttpService().onDataRemove(id);

  if (response.data.success) return id;
});

const slice = createSlice({
  name: "dataService",
  initialState: {
    data: [],
    status: "idle",
    error: null,
    dataDetails: null,
    currentlyModifying: null,
    sn: null,
  },
  reducers: {
    viewData: (state, action) => {
      state.dataDetails = action.payload;

      state.sn = null;
      state.currentlyModifying = null;
    },

    modifyData: (state, action) => {
      state.sn = null;
      state.currentlyModifying = action.payload;
    },

    addCode: (state, action) => {
      state.sn = action.payload;
    },

    deleteAllData: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
      state.dataDetails = null;
      state.sn = null;
      state.currentlyModifying = null;
    },
  },

  extraReducers: (builder) => {
    /* Fetch data cases */
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    /* Push data cases */
    builder.addCase(pushData.fulfilled, (state, action) => {
      state.sn = null;
      state.data.push(action.payload.product);
      state.data.sort(dynamicSort("name"));
    });

    /* Update data cases */
    builder.addCase(updateData.fulfilled, (state, action) => {
      state.data = state.data.filter(({ _id }) => _id !== action.payload._id);
      state.data.push(action.payload);
      state.data.sort(dynamicSort("name"));

      state.currentlyModifying = null;
      state.dataDetails = action.payload;
      state.sn = null;
    });

    /* Remove data cases */
    builder.addCase(removeData.fulfilled, (state, action) => {
      state.data = state.data.filter(({ _id }) => _id !== action.payload);
      state.data.sort(dynamicSort("name"));

      state.sn = null;
      state.currentlyModifying = null;
      state.dataDetails = null;
    });
  },
});

export const { viewData, modifyData, addCode, deleteAllData } = slice.actions;

// State data selectors
export const selectData = (state) => state.root.data.data;
export const selectDataDetails = (state) => state.root.data.dataDetails;
export const selectDataInEdit = (state) => state.root.data.currentlyModifying;
export const selectDataCode = (state) => state.root.data.sn;
export const selectDataError = (state) => state.root.data.error;
export const selectDataStatus = (state) => state.root.data.status;

export default slice.reducer;
