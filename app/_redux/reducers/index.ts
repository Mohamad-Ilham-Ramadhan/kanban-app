// root reducer
import { combineReducers } from "@reduxjs/toolkit";
import listReducer from "./listReducer";
import counterReducer from "./counterReducer";

export const rootReducer = combineReducers({
   list: listReducer,
   counter: counterReducer,
});