import { combineReducers } from "redux";
import productReducer from "./product";
import customerReducer from "./customer";
import courierReducer from "./courier";
import brandReducer from "./brand";

export default combineReducers({
  products: productReducer,
  customers: customerReducer,
  couriers: courierReducer,
  brands: brandReducer,
});
