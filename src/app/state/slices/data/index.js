import { combineReducers } from "redux";
import productReducer from "./product";
import customerReducer from "./customer";

export default combineReducers({
  products: productReducer,
  customers: customerReducer,
});
