export const selectAllCustomers = (state) =>
  state.root.DataService.customers.data;

export const selectCustomerDetails = (state) =>
  state.root.DataService.customers.details;

export const selectCustomerInEdit = (state) =>
  state.root.DataService.customers.currentlyModifying;

export const selectCurrentlySelectedCustomers = (state) =>
  state.root.DataService.customers.currentlySelected;

/* Fetch */
export const selectCustomerFetchStatus = (state) =>
  state.root.DataService.customers.status.fetch;

export const selectCustomerFetchError = (state) =>
  state.root.DataService.customers.error.fetch;

/* Push */
export const selectCustomerPushStatus = (state) =>
  state.root.DataService.customers.status.push;

export const selectCustomerPushError = (state) =>
  state.root.DataService.customers.error.push;

/* Modify */
export const selectCustomerModifyStatus = (state) =>
  state.root.DataService.customers.status.modify;

export const selectCustomerModifyError = (state) =>
  state.root.DataService.customers.error.modify;

/* Remove */
export const selectCustomerRemoveStatus = (state) =>
  state.root.DataService.customers.status.remove;

export const selectCustomerRemoveError = (state) =>
  state.root.DataService.customers.error.remove;
