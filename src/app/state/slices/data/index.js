import { combineReducers } from "redux";
import productReducer from "./product";
import customerReducer from "./customer";
import courierReducer from "./courier";

export default combineReducers({
  products: productReducer,
  customers: customerReducer,
  couriers: courierReducer,
});
