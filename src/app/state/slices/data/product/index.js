import { createSlice } from "@reduxjs/toolkit";
import Constants from "../../constants";
import { dynamicSort } from "../sort";
import {
  fetchProducts,
  pushProduct,
  pushStock,
  removeProduct,
  updateProduct,
  stockMarkInventoryChecked,
  moveStock,
} from "./async-thunks";

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
      action.payload === Constants.DataService.ALL
        ? (state.status = {
            fetch: Constants.IDLE,
            push: Constants.IDLE,
            modify: Constants.IDLE,
            delete: Constants.IDLE,
          })
        : (state.status[action.payload] = Constants.IDLE);
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

        // Finally, sort the fetched data
        state.data.sort(dynamicSort("name"));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status.fetch = Constants.FAILED;

        state.error.fetch = action.error.message;
      });

    /* Push product cases */
    builder
      .addCase(pushProduct.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(pushProduct.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        // If the user used CSV (bulk) import, the data will be an array
        // Add some new data before storing to the datastore
        if (!!action.payload.products) {
          action.payload.products.forEach((item) => {
            const { inbound, warehouse, shipped } = item.stock;

            // Calculate the sum of all stock on a given product,
            // then add it to the product object
            item.stock.total =
              inbound.length + warehouse.length + shipped.length;

            state.data.push(item);
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

        state.error.push = action.error.message;
      });

    /* Update product cases */
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

        // Remove the old product first
        state.data = state.data.filter(({ _id }) => _id !== action.payload._id);

        const { inbound, warehouse, shipped } = action.payload.stock;

        // Calculate the sum of all stock on a given product,
        // then add it to the product object
        action.payload.stock.total =
          inbound.length + warehouse.length + shipped.length;

        // Push the approved change with the new calculated data to the
        // datastore, then re-sort everything in the datastore
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

    /* Push stock cases */
    builder
      .addCase(pushStock.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(pushStock.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        state.data.forEach((product) => {
          let total = product.stock.total;

          product.variants.forEach((variant) => {
            if (action.payload.variantId === variant._id) {
              variant.stocks[action.payload._type].push(action.payload.stock);

              variant.stocks[action.payload._type]
                .sort((a, b) => b.expiry.localeCompare(a.expiry))
                .sort((a, _) => (a.checked ? 1 : -1));

              // Since we're only adding one stock
              // at a time, just increment the sum
              total++;

              product.stock = { total };

              state.details = product;
            }
          });
        });
      })
      .addCase(pushStock.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error.push = action.error.message;
      });

    /* Stock move location cases */
    builder
      .addCase(moveStock.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(moveStock.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        for (const product of state.data) {
          for (const variant of product.variants) {
            for (const stock of variant.stocks[action.payload.prevType]) {
              if (action.payload.data.moved._id === stock._id) {
                variant.stocks[action.payload.prevType] = variant.stocks[
                  action.payload.prevType
                ].filter(({ _id }) => _id !== action.payload.data.moved._id);

                variant.stocks[action.payload.data.moved._type].push(
                  action.payload.data.moved
                );

                variant.stocks[action.payload.data.moved._type]
                  .sort((a, b) => b.expiry.localeCompare(a.expiry))
                  .sort((a, _) => (a.checked ? 1 : -1));

                state.details = product;
                break;
              }
            }
          }
        }
      })
      .addCase(moveStock.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error.modify = action.error.message;
      });

    /* Stock mark inventory check cases */
    builder
      .addCase(stockMarkInventoryChecked.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(stockMarkInventoryChecked.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        for (const product of state.data) {
          for (const variant of product.variants) {
            for (const stock of variant.stocks[action.payload.stock._type]) {
              if (action.payload.stock._id === stock._id) {
                variant.stocks[action.payload.stock._type] = variant.stocks[
                  action.payload.stock._type
                ].filter(({ _id }) => _id !== action.payload.stock._id);

                variant.stocks[action.payload.stock._type].push(
                  action.payload.stock
                );

                variant.stocks[action.payload.stock._type]
                  .sort((a, b) => b.expiry.localeCompare(a.expiry))
                  .sort((a, _) => (a.checked ? 1 : -1));

                state.details = product;
                break;
              }
            }
          }
        }
      })
      .addCase(stockMarkInventoryChecked.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error.modify = action.error.message;
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
