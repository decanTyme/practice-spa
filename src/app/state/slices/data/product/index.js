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

    return response.data;
  }
);

export const pushProduct = createAsyncThunk(
  "products/push",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataPush("stocks", data);

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
    const response = await HttpService().onDataModify("stocks", modifiedData);

    if (response.status >= 400 && response.status < 500) {
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

    if (response.status >= 400 && response.status < 500) {
      dispatch(setStale(true));
      throw new Error();
    }

    if (response.data.success) return id;
  }
);

const slice = createSlice({
  name: "products",
  initialState: {
    data: {
      all: [],
      brands: [],
      classes: [],
      categories: [],
      units: [],
    },
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
      action.payload === Constants.DataService.ALL
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

    importCSV: (state, action) => {
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
      state.data = {
        all: [],
        brands: [],
        classes: [],
        categories: [],
        units: [],
      };

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

        const payload = action.payload;

        // Transform the received data first so that it can be consumed properly
        // by the
        const transformedPayload = payload.map((item) => {
          const { inbound, warehouse, shipped } = item.quantity;
          const totalQuantity = inbound + warehouse + shipped;

          const transformedItem = {
            ...item.product,
            stock: { ...item, totalQuantity },
          };

          delete transformedItem.stock.product;

          return transformedItem;
        });

        // Sort first, then store transformed data
        state.data.all = transformedPayload.sort(dynamicSort("name"));

        // Get all needed subdata, ensure there is no duplication,
        // then finally sort
        state.data.brands = [
          ...new Set(transformedPayload.map(({ brand }) => brand)),
        ].sort();

        state.data.classes = [
          ...new Set(transformedPayload.map((item) => item.class)),
        ].sort();

        state.data.units = [
          ...new Set(transformedPayload.map(({ stock: { unit } }) => unit)),
        ].sort();

        state.data.categories = [
          ...new Set(transformedPayload.map(({ category }) => category)),
        ].sort();
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
        const payload = action.payload;

        state.status.push = Constants.IDLE;

        // If the user used CSV (bulk) import, the data will be an array
        // Transform each item first before storing to the datastore
        if (!!action.payload.products) {
          payload.products.forEach((item) => {
            const { inbound, warehouse, shipped } = item.stock.quantity;
            const totalQuantity = inbound + warehouse + shipped;

            // Final transformed item
            const transformedItem = {
              ...item.product,
              stock: { ...item.stock, totalQuantity },
            };

            state.data.all.push(transformedItem);
          });
        } else {
          state.data.all.push(action.payload);
        }

        // Sort datastore
        state.data.all.sort(dynamicSort("name"));

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

        const payload = action.payload;

        state.error.modify = action.payload;

        // Remove the old product, push the approved change to the datastore,
        // then re-sort everything in the datastore
        state.data.all = state.data.all.filter(
          ({ _id }) => _id !== action.payload._id
        );

        const { inbound, warehouse, shipped } = payload.stock.quantity;
        const totalQuantity = inbound + warehouse + shipped;

        // Final transformed item
        const transformedPayload = {
          ...payload,
          stock: { ...payload.stock, totalQuantity },
        };

        state.data.all.push(transformedPayload);
        state.data.all.sort(dynamicSort("name"));

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
      state.data = state.data.all.filter(({ _id }) => _id !== action.payload);
      state.data.all.sort(dynamicSort("name"));

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
  importCSV,
  abortCSVImport,
  addToProductSelection,
  resetAllCachedProductData,
} = slice.actions;

export default slice.reducer;
