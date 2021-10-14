import { createSelector } from "reselect";

export const selectAllProducts = (state) =>
  state.root.DataService.products.data;

export const selectAllClasses = createSelector(
  [selectAllProducts],
  (products) => {
    return [...new Set(products.map(({ _class }) => _class))].sort();
  }
);

export const selectAllCategories = createSelector(
  [selectAllProducts],
  (products) => {
    return [...new Set(products.map(({ category }) => category))].sort();
  }
);

export const selectAllUnits = createSelector(
  [selectAllProducts],
  (products) => {
    return [...new Set(products.map(({ unit }) => unit))].sort();
  }
);

export const selectAllStockInbound = createSelector(
  [selectAllProducts],
  (products) => {
    return products.map((product) => product.stock.inbound);
  }
);

export const selectProductDetails = (state) =>
  state.root.DataService.products.currentlyViewedItem;

export const selectProductDetailsInbound = (state) =>
  state.root.DataService.products.currentlyViewedItem?.stock.inbound;

export const selectProductDetailsWarehouse = (state) =>
  state.root.DataService.products.currentlyViewedItem?.stock.warehouse;

export const selectProductDetailsSold = (state) =>
  state.root.DataService.products.currentlyViewedItem?.stock.sold;

export const selectProductInEdit = (state) =>
  state.root.DataService.products.currentlyModifying;

export const selectProductScannedCode = (state) =>
  state.root.DataService.products.sn;

export const selectProductImportedCSV = (state) =>
  state.root.DataService.products.importedCSV;

export const selectCurrentlySelectedProducts = (state) =>
  state.root.DataService.products.currentlySelected;

/* Fetch */
export const selectProductFetchStatus = (state) =>
  state.root.DataService.products.status.fetch;

export const selectProductFetchError = (state) =>
  state.root.DataService.products.error.fetch;

/* Push */
export const selectProductPushStatus = (state) =>
  state.root.DataService.products.status.push;

export const selectProductPushError = (state) =>
  state.root.DataService.products.error.push;

/* Modify */
export const selectProductModifyStatus = (state) =>
  state.root.DataService.products.status.modify;

export const selectProductModifyError = (state) =>
  state.root.DataService.products.error.modify;

export const selectAllProductError = (state) =>
  state.root.DataService.products.error;
