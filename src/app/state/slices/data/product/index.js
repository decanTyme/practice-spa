import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { notify } from "../../notification";
import { dynamicSort } from "../sort";

/* Async thunks */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { dispatch }) => {
    const response = await HttpService().onDataFetch("products", {
      populated: true,
    });

    if (response.status !== 200) {
      dispatch(setStale(true));
      dispatch(
        notify(
          Constants.NotifyService.ERROR,
          "Products Fetch Error",
          response.data.message
        )
      );
      throw new Error();
    }

    return response.data;
  }
);

export const pushProduct = createAsyncThunk(
  "products/push",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataPush("products", data);

    switch (response.status) {
      case 200:
        dispatch(
          setProductStatus({
            type: Constants.DataService.PUSH,
            status: Constants.SUCCESS,
          })
        );
        return response.data;

      case 401:
        dispatch(setStale(true));
        throw new Error();

      case 403:
        dispatch(
          notify(
            Constants.NotifyService.ERROR,
            "Save Product Error",
            response.data.message
          )
        );
        throw new Error();

      default:
        return;
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/modify",
  async (modifiedData, { dispatch }) => {
    const response = await HttpService().onDataModify("products", modifiedData);

    switch (response.status) {
      case 200:
        dispatch(
          setProductStatus({
            type: Constants.DataService.MODIFY,
            status: Constants.SUCCESS,
          })
        );
        return modifiedData;

      case 401:
        dispatch(setStale(true));
        throw new Error();

      case 403:
        dispatch(
          notify(
            Constants.NotifyService.ERROR,
            "Update Product Error",
            response.data.message
          )
        );
        throw new Error();

      default:
        return;
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete",
  async (id, { dispatch }) => {
    const response = await HttpService().onDataRemove("products", id);

    switch (response.status) {
      case 200:
        dispatch(
          setProductStatus({
            type: Constants.DataService.REMOVE,
            status: Constants.SUCCESS,
          })
        );
        return id;

      case 401:
        dispatch(setStale(true));
        throw new Error();

      case 403:
        dispatch(
          notify(
            Constants.NotifyService.ERROR,
            "Remove Product Error",
            response.data.message
          )
        );
        throw new Error();

      default:
        return;
    }
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

        // Modify some structure before pushing to the datastore
        action.payload.forEach((item) => {
          const images = [];
          let total = 0;

          item.variants.forEach((variant) => {
            const inbound = variant.stocks
              .filter(({ _type }) => _type === "inbound")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            const warehouse = variant.stocks
              .filter(({ _type }) => _type === "warehouse")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            const shipped = variant.stocks
              .filter(({ _type }) => _type === "shipped")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            images.push(...variant.images);

            // Calculate the sum of all stock quantities on a given product
            total += inbound.length + warehouse.length + shipped.length;

            // Rewrite the stock field with the filtered stock types
            variant.stocks = { inbound, warehouse, shipped };

            // Delete some unnecessary fields
            delete variant.id;
            delete variant.product;
          });

          // Append the newly calculated values to the original data
          item.stock = { total };
          item.images = [...item.images, ...images];

          // Finally, push the data to the datastore
          state.data.push(item);
        });

        // Sort the fetched data
        state.data.all.sort(dynamicSort("name"));

        // Get all needed subdata, ensure there is no duplication,
        // then finally sort
        state.data.brands = [
          ...new Set(action.payload.map(({ brand }) => brand)),
        ].sort();

        state.data.classes = [
          ...new Set(action.payload.map(({ _class }) => _class)),
        ].sort();

        state.data.units = [
          ...new Set(action.payload.map(({ stock: { unit } }) => unit)),
        ].sort();

        state.data.categories = [
          ...new Set(action.payload.map(({ category }) => category)),
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
        state.status.push = Constants.IDLE;

        // If the user used CSV (bulk) import, the data will be an array
        // Add some new data before storing to the datastore
        if (!!action.payload.products) {
          action.payload.products.forEach((item) => {
            const { inbound, warehouse, shipped } = item.stock;

            // Calculate the sum of all stock on a given product,
            // then add it to the product object
            item.stock.total =
              inbound.length + warehouse.length + shipped.length;

            state.data.all.push(item);
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

        // Remove the old product first
        state.data.all = state.data.all.filter(
          ({ _id }) => _id !== action.payload._id
        );

        const { inbound, warehouse, shipped } = action.payload.stock;

        // Calculate the sum of all stock on a given product,
        // then add it to the product object
        action.payload.stock.total =
          inbound.length + warehouse.length + shipped.length;

        // Push the approved change with the new calculated data to the
        // datastore, then re-sort everything in the datastore
        state.data.all.push(action.payload);
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
