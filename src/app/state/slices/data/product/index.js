import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { dynamicSort } from "../sort";

/* Async thunks */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (type, { dispatch }) => {
    const response = await HttpService().onDataFetch(type, { populated: true });

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }

    const data = response.data.map((datum) => ({
      ...datum.product,
      stock: { quantity: datum.quantity, unit: datum.unit },
    }));

    return data.sort(dynamicSort("name"));
  }
);

export const pushProduct = createAsyncThunk(
  "products/push",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataPush(data, "stocks");

    if (response.status >= 400 && response.status < 500) {
      dispatch(setStale(true));
      throw new Error();
    }
    dispatch(setProductStatus({ type: "push", status: Constants.SUCCESS }));

    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/modify",
  async (modifiedData, { dispatch }) => {
    const response = await HttpService().onDataModify(modifiedData);

    if (response.status !== 200) {
      dispatch(setStale(true));
      throw new Error();
    }
    if (response.data.success) return modifiedData;
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete",
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
  name: "products",
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
    sn: null,
    currentlyModifying: null,
    currentlySelected: [],
    importedCSV: null,
  },
  reducers: {
    setIdle: (state, action) => {
      action.payload === "ALL"
        ? (state.status = {
            fetch: Constants.IDLE,
            push: Constants.IDLE,
            modify: Constants.IDLE,
            delete: Constants.IDLE,
          })
        : (state.status[action.payload] = Constants.IDLE);
    },

    setProductStatus: (state, action) => {
      state.status[action.payload.type] = action.payload.status;
    },

    viewProductDetail: (state, action) => {
      state.details = action.payload;

      state.sn = null;
      state.currentlyModifying = null;
    },

    modifyProduct: (state, action) => {
      state.currentlyModifying = action.payload;

      state.sn = null;
    },

    resetAllProductModification: (state) => {
      state.currentlyModifying = null;
    },

    addScannedCode: (state, action) => {
      state.sn = action.payload;
    },

    addImportedCSV: (state, action) => {
      state.importedCSV = action.payload;
    },

    abortCSVImport: (state, action) => {
      state.importedCSV = null;
    },

    addToProductSelection: (state, action) => {
      state.currentlySelected = action.payload;
    },

    resetAllCachedProductData: (state) => {
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
      state.sn = null;
      state.currentlyModifying = null;
      state.currentlySelected = [];
    },
  },

  extraReducers: (builder) => {
    /* Fetch product cases */
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status.fetch = Constants.LOADING;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status.fetch = Constants.SUCCESS;

        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status.fetch = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Push product cases */
    builder
      .addCase(pushProduct.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(pushProduct.fulfilled, (state, action) => {
        state.status.push = Constants.IDLE;

        if (!!action.payload.products) {
          action.payload.products.forEach((item) => {
            const transformedItem = {
              ...item.product,
              stock: {
                quantity: item.stock.quantity,
                unit: item.stock.unit,
              },
            };
            state.data.push(transformedItem);
          });
        } else {
          state.data.push(action.payload);
        }

        // Sort datastore
        state.data.sort(dynamicSort("name"));

        state.sn = null;
      })
      .addCase(pushProduct.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error = action.error.message;
      });

    /* Update product cases */
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

        // Remove the old product, push the approved change to the datastore,
        // then re-sort everything in the datastore
        state.data = state.data.filter(({ _id }) => _id !== action.payload._id);
        state.data.push(action.payload);
        state.data.sort(dynamicSort("name"));

        // Data details should be updated with the latest approved change
        state.details = action.payload;

        // Finally, clear some states
        state.currentlyModifying = null;
        state.sn = null;
      })
      .addCase(updateProduct.rejected, (state) => {
        state.status.modify = Constants.FAILED;
      });

    /* Remove product cases */
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.status.delete = Constants.SUCCESS;

      // After removing the aprroved deleted data, remove from datastore
      // and re-sort
      state.data = state.data.filter(({ _id }) => _id !== action.payload);
      state.data.sort(dynamicSort("name"));

      state.sn = null;
      state.currentlyModifying = null;
      state.details = null;
    });
  },
});

export const {
  setIdle,
  setProductStatus,
  viewProductDetail,
  modifyProduct,
  resetAllProductModification,
  addScannedCode,
  addImportedCSV,
  abortCSVImport,
  addToProductSelection,
  resetAllCachedProductData,
} = slice.actions;

export default slice.reducer;
