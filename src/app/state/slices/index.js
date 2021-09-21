import { combineReducers } from "redux";
import authReducer from "./auth";
import dataReducer from "./data";

const rootReducer = combineReducers({ auth: authReducer, data: dataReducer });

export default rootReducer;
