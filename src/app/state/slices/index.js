import { combineReducers } from "redux";
import authReducer from "./auth";
import dataReducer from "./data";
import notifyReducer from "./notification";

const rootReducer = combineReducers({
  AuthManager: authReducer,
  DataService: dataReducer,
  NotifyService: notifyReducer,
});

export default rootReducer;
