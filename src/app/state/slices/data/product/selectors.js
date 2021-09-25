export const selectAllProducts = (state) =>
  state.root.DataService.products.data.all;

export const selectAllBrands = (state) =>
  state.root.DataService.products.data.brands;

export const selectAllClasses = (state) =>
  state.root.DataService.products.data.classes;

export const selectAllCategories = (state) =>
  state.root.DataService.products.data.categories;

export const selectAllUnits = (state) =>
  state.root.DataService.products.data.units;

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
