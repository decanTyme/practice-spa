import { createAsyncThunk } from "@reduxjs/toolkit";
import HttpService from "../../../../../services/http";
import { setStale } from "../../auth";
import Constants from "../../constants";
import { notify } from "../../notification";

/* Products */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { dispatch }) => {
    const response = await HttpService().onDataFetch("products");

    const errMsg = "Product fetch unsuccessful!";

    switch (response.status) {
      case 401:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 403:
      case 404:
      case 418:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );
        throw new Error();

      default:
        return response.data;
    }
  }
);

export const pushProduct = createAsyncThunk(
  "products/push",
  async (data, { dispatch }) => {
    const response = await HttpService().onDataPush("products", data);

    const successMsg = "Product successfuly saved!";
    const errMsg = "Product save unsuccessful!";

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
        dispatch(
          notify(Constants.SUCCESS, successMsg, void 0, {
            noHeader: true,
          })
        );

        return response.data;
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/modify",
  async (modifiedData, { dispatch }) => {
    const response = await HttpService().onDataModify("products", modifiedData);

    const successMsg = "Product successfuly updated!";
    const errMsg = "Product update unsuccessful!";

    switch (response.status) {
      case 401:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 403:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        throw new Error();

      default:
        dispatch(
          notify(Constants.SUCCESS, successMsg, void 0, {
            noHeader: true,
          })
        );

        return modifiedData;
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete",
  async (id, { dispatch }) => {
    const response = await HttpService().onDataRemove("products", id);

    const successMsg = "Product successfuly deleted!";
    const errMsg = "Product delete unsuccessful!";

    switch (response.status) {
      case 401:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        dispatch(setStale(true));
        throw new Error();

      case 403:
        dispatch(
          notify(Constants.NotifyService.ERROR, errMsg, response.data.message)
        );

        throw new Error();

      default:
        dispatch(
          notify(Constants.SUCCESS, successMsg, void 0, {
            noHeader: true,
          })
        );

        return id;
    }
  }
);

/* Stocks */
export const pushStock = createAsyncThunk(
  "products/stock/push",
  async (newStock, { dispatch }) => {
    const response = HttpService().onDataPush("products", newStock);

    const successMsg = "Stock successfuly saved!";
    const errMsg = "Stock save unsuccessful!";

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
        dispatch(
          notify(Constants.SUCCESS, successMsg, void 0, {
            noHeader: true,
          })
        );

        return {
          stock: newStock,
          _id: response.data.product._id,
        };
    }
  }
);

export const stockMarkInventoryChecked = createAsyncThunk(
  "products/stocks/mark",
  async ({ _id, mark }, { dispatch }) => {
    const response = await HttpService().onDataModify("stocks", void 0, {
      params: { _id, check: true, mark },
    });

    const successMsg = `Stock successfuly ${mark ? "mark" : "unmark"}ed!`;
    const errMsg = `Stock ${mark ? "mark" : "unmark"} unsuccessful!`;

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

        dispatch(
          notify(Constants.SUCCESS, successMsg, void 0, {
            noHeader: true,
          })
        );

        return response.data;
    }
  }
);
