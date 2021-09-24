import { combineReducers } from "redux";
import authReducer from "./auth";
import dataReducer from "./data";

const rootReducer = combineReducers({
  AuthManager: authReducer,
  DataService: dataReducer,
});

export default rootReducer;
