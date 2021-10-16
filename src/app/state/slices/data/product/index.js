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
  updateStock,
  removeStock,
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
    currentlyViewedItem: null,
    sn: null,
    currentlyModifying: null,
    currentlyModifyingStock: null,
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
      state.currentlyViewedItem = action.payload;

      state.sn = null;
      state.currentlyModifying = null;
      state.currentlyModifyingStock = null;
    },

    modifyProduct: (state, action) => {
      state.currentlyModifying = action.payload;

      state.sn = null;
    },

    modifyStock: (state, action) => {
      state.currentlyModifyingStock = action.payload;

      state.sn = null;
    },

    resetAllProductModification: (state) => {
      state.currentlyModifying = null;
    },

    resetAllStockModification: (state) => {
      state.currentlyModifyingStock = null;
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
      state.currentlyViewedItem = null;
      state.sn = null;
      state.currentlyModifying = null;
      state.currentlyModifyingStock = null;
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

            const sold = variant.stocks
              .filter(({ _type }) => _type === "sold")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            images.push(...variant.images);

            // Calculate the sum of all stock quantities on a given product
            total += inbound.length + warehouse.length + sold.length;

            // Rewrite the stock field with the filtered stock types
            variant.stocks = { inbound, warehouse, sold };

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

        // Modify some structure before pushing to the datastore
        // If the user used CSV (bulk) import, the data will be an array
        if (action.payload.products) {
          const products = action.payload.products;

          products.forEach((item) => {
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

              const sold = variant.stocks
                .filter(({ _type }) => _type === "sold")
                .sort((a, b) => b.expiry.localeCompare(a.expiry))
                .sort((a, _) => (a.checked ? 1 : -1));

              images.push(...variant.images);

              // Calculate the sum of all stock quantities on a given product
              total += inbound.length + warehouse.length + sold.length;

              // Rewrite the stock field with the filtered stock types
              variant.stocks = { inbound, warehouse, sold };

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
        } else {
          const images = [];
          let total = 0;

          const product = action.payload.product;

          product.variants.forEach((variant) => {
            const inbound = variant.stocks
              .filter(({ _type }) => _type === "inbound")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            const warehouse = variant.stocks
              .filter(({ _type }) => _type === "warehouse")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            const sold = variant.stocks
              .filter(({ _type }) => _type === "sold")
              .sort((a, b) => b.expiry.localeCompare(a.expiry))
              .sort((a, _) => (a.checked ? 1 : -1));

            images.push(...variant.images);

            // Calculate the sum of all stock quantities on a given product
            total += inbound.length + warehouse.length + sold.length;

            // Rewrite the stock field with the filtered stock types
            variant.stocks = { inbound, warehouse, sold };

            // Delete some unnecessary fields
            delete variant.id;
            delete variant.product;
          });

          // Append the newly calculated values to the original data
          product.stock = { total };
          product.images = [...product.images, ...images];

          // Push to the datastore
          state.data.push(product);

          // Show the new product to the user
          state.currentlyViewedItem = product;
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
      .addCase(updateProduct.pending, (state) => {
        state.status.modify = Constants.LOADING;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

        const product = action.payload;

        // Remove the old product first
        state.data = state.data.filter(({ _id }) => _id !== product._id);

        const images = [];
        let total = 0;

        product.variants.forEach((variant) => {
          const inbound = variant.stocks
            .filter(({ _type }) => _type === "inbound")
            .sort((a, b) => b.expiry.localeCompare(a.expiry))
            .sort((a, _) => (a.checked ? 1 : -1));

          const warehouse = variant.stocks
            .filter(({ _type }) => _type === "warehouse")
            .sort((a, b) => b.expiry.localeCompare(a.expiry))
            .sort((a, _) => (a.checked ? 1 : -1));

          const sold = variant.stocks
            .filter(({ _type }) => _type === "sold")
            .sort((a, b) => b.expiry.localeCompare(a.expiry))
            .sort((a, _) => (a.checked ? 1 : -1));

          images.push(...variant.images);

          // Calculate the sum of all stock quantities on a given product
          total += inbound.length + warehouse.length + sold.length;

          // Rewrite the stock field with the filtered stock types
          variant.stocks = { inbound, warehouse, sold };

          // Delete some unnecessary fields
          delete variant.id;
          delete variant.product;
        });

        // Append the newly calculated values to the original data
        product.stock = { total };
        product.images = [...product.images, ...images];

        // Push the approved change with the new calculated data to the
        // datastore, then re-sort everything in the datastore
        state.data.push(product);
        state.data.sort(dynamicSort("name"));

        // Currently viewed item should be updated
        // with the latest approved change
        state.currentlyViewedItem = product;

        // Finally, clear some states
        state.currentlyModifying = null;
        state.currentlyModifyingStock = null;
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
      state.currentlyModifyingStock = null;
      state.currentlyViewedItem = null;
    });

    /* Push stock cases */
    builder
      .addCase(pushStock.pending, (state) => {
        state.status.push = Constants.LOADING;
      })
      .addCase(pushStock.fulfilled, (state, action) => {
        state.status.push = Constants.SUCCESS;

        for (const product of state.data) {
          let total = product.stock.total;

          for (const variant of product.variants) {
            if (action.payload.variantId === variant._id) {
              variant.stocks[action.payload._type].push(action.payload.stock);

              variant.stocks[action.payload._type]
                .sort((a, b) => b.expiry.localeCompare(a.expiry))
                .sort((a, _) => (a.checked ? 1 : -1));

              // Since we're only adding one stock
              // at a time, just increment
              total++;

              product.stock = { total };

              // Update the viewed product
              state.currentlyViewedItem = product;
            }
          }
        }
      })
      .addCase(pushStock.rejected, (state, action) => {
        state.status.push = Constants.FAILED;

        state.error.push = action.error.message;
      });

    /* Update stock cases */
    builder
      .addCase(updateStock.pending, (state) => {
        state.status.modify = Constants.LOADING;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

        for (const product of state.data) {
          for (const variant of product.variants) {
            if (action.payload.variantId === variant._id) {
              variant.stocks[action.payload._type] = variant.stocks[
                action.payload._type
              ].filter(({ _id }) => _id !== action.payload.stock._id);

              variant.stocks[action.payload._type].push(action.payload.stock);

              variant.stocks[action.payload._type]
                .sort((a, b) => b.expiry.localeCompare(a.expiry))
                .sort((a, _) => (a.checked ? 1 : -1));

              // Update the viewed product
              state.currentlyViewedItem = product;
            }
          }
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.status.modify = Constants.FAILED;

        state.error.modify = action.error.message;
      });

    /* Delete stock cases */
    builder
      .addCase(removeStock.pending, (state) => {
        state.status.delete = Constants.LOADING;
      })
      .addCase(removeStock.fulfilled, (state, action) => {
        state.status.delete = Constants.SUCCESS;

        for (const product of state.data) {
          let total = product.stock.total;

          for (const variant of product.variants) {
            if (action.payload.variantId === variant._id) {
              variant.stocks[action.payload._type] = variant.stocks[
                action.payload._type
              ].filter(({ _id }) => _id !== action.payload._id);

              variant.stocks[action.payload._type]
                .sort((a, b) => b.expiry.localeCompare(a.expiry))
                .sort((a, _) => (a.checked ? 1 : -1));

              // Since we're only removing one stock
              // at a time, just decrement
              total--;

              product.stock = { total };

              // Update the viewed product
              state.currentlyViewedItem = product;
            }
          }
        }
      })
      .addCase(removeStock.rejected, (state, action) => {
        state.status.delete = Constants.FAILED;

        state.error.delete = action.error.message;
      });

    /* Stock move location cases */
    builder
      .addCase(moveStock.pending, (state) => {
        state.status.modify = Constants.LOADING;
      })
      .addCase(moveStock.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

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

                state.currentlyViewedItem = product;
                break;
              }
            }
          }
        }
      })
      .addCase(moveStock.rejected, (state, action) => {
        state.status.modify = Constants.FAILED;

        state.error.modify = action.error.message;
      });

    /* Stock mark inventory check cases */
    builder
      .addCase(stockMarkInventoryChecked.pending, (state) => {
        state.status.modify = Constants.LOADING;
      })
      .addCase(stockMarkInventoryChecked.fulfilled, (state, action) => {
        state.status.modify = Constants.SUCCESS;

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

                state.currentlyViewedItem = product;
                break;
              }
            }
          }
        }
      })
      .addCase(stockMarkInventoryChecked.rejected, (state, action) => {
        state.status.modify = Constants.FAILED;

        state.error.modify = action.error.message;
      });
  },
});

export const {
  setIdle,
  setProductStatus,
  viewProductDetail,
  modifyProduct,
  modifyStock,
  resetAllProductModification,
  resetAllStockModification,
  addScannedCode,
  importCSV,
  abortCSVImport,
  addToProductSelection,
  resetAllCachedProductData,
} = slice.actions;

export default slice.reducer;
