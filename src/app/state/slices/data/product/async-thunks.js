import { createAsyncThunk } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { notify } from "../../notification";

const successMsg = `Operation success!`;
const errMsg = `Operation failed!`;

/* Products */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { dispatch }) => {
    const response = await HttpService().onDataFetch("products");

    const errMsg = "Product fetch unsuccessful!";

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 403:
      case 404:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        return response.data;
    }
  }
);

export const pushProduct = createAsyncThunk(
  "products/push",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataPush("products", data);

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 403:
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return response.data;
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/modify",
  async (modifiedData, { dispatch }) => {
    const response = await HttpService().onDataModify("products", modifiedData);

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 400:
      case 403:
      case 404:
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return response.data.product;
    }
  }
);

export const removeProducts = createAsyncThunk(
  "products/delete",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataRemove("products", void 0, {
      params: { _id: data },
    });

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 400:
      case 403:
      case 404:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        throw new Error();

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return response.data.deleted;
    }
  }
);

/* Stocks */
export const pushStock = createAsyncThunk(
  "products/stock/push",
  async (newStock, { dispatch }) => {
    const response = await HttpService().onDataPush("stocks", newStock, {
      params: {
        _id: newStock.variantId,
        _type: newStock._type,
      },
    });

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 403:
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return {
          stock: response.data.stock,
          variantId: response.data.stock.variant,
          _type: response.data.stock._type,
        };
    }
  }
);

export const updateStock = createAsyncThunk(
  "products/stock/modify",
  async (modifiedStock, { dispatch }) => {
    const response = await HttpService().onDataModify("stocks", modifiedStock);

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 403:
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return {
          stock: response.data.stock,
          variantId: response.data.stock.variant,
          _type: response.data.stock._type,
        };
    }
  }
);

export const removeStock = createAsyncThunk(
  "products/stock/delete",
  async ({ _id, _type, variant: variantId }, { dispatch }) => {
    const response = await HttpService().onDataRemove("stocks", void 0, {
      params: { _id },
    });

    switch (response.status) {
      case 401:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 403:
      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return { _id, variantId, _type };
    }
  }
);

export const moveStock = createAsyncThunk(
  "products/stocks/move",
  async ({ _id, _type, prevType }, { dispatch }) => {
    const response = await HttpService().onDataModify("stocks", void 0, {
      params: { _id, _type },
      endpoint: "move",
    });

    switch (response.status) {
      case 401:
      case 403:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg, response.data.message));

        return { data: response.data, prevType };
    }
  }
);

export const stockMarkInventoryChecked = createAsyncThunk(
  "products/stocks/mark",
  async ({ _id, mark }, { dispatch }) => {
    const response = await HttpService().onDataModify("stocks", void 0, {
      params: { _id, mark },
      endpoint: "mark",
    });

    switch (response.status) {
      case 401:
      case 403:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        dispatch(setStale(true));
        throw new Error(response.data.message);

      case 500:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error(response.data.message);

      default:
        if (!response.data.success) {
          dispatch(
            notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
          );
          throw new Error(response.data.message);
        }

        dispatch(notify(Constants.SUCCESS, successMsg));

        return response.data;
    }
  }
);
