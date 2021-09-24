export const selectAllProducts = (state) =>
  state.root.DataService.products.data;

export const selectProductDetails = (state) =>
  state.root.DataService.products.details;

export const selectProductInEdit = (state) =>
  state.root.DataService.products.currentlyModifying;

export const selectProductScannedCode = (state) =>
  state.root.DataService.products.sn;

export const selectProductImportedCSV = (state) =>
  state.root.DataService.products.importedCSV;

export const selectCurrentlySelectedProducts = (state) =>
  state.root.DataService.products.currentlySelected;

export const selectProductFetchStatus = (state) =>
  state.root.DataService.products.status.fetch;

export const selectProductFetchError = (state) =>
  state.root.DataService.products.error.fetch;

export const selectProductPushStatus = (state) =>
  state.root.DataService.products.status.push;

export const selectProductError = (state) =>
  state.root.DataService.products.error;
