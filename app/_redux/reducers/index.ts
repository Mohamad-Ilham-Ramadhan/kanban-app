// root reducer
import { combineReducers } from "@reduxjs/toolkit";
import boardReducer from "./boardReducer";

export const rootReducer = combineReducers({
   board: boardReducer,
});