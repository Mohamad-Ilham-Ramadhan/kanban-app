// root reducer
import { combineReducers } from "@reduxjs/toolkit";
import listReducer from "./listReducer";
import counterReducer from "./counterReducer";
import boardReducer from "./boardReducer";

export const rootReducer = combineReducers({
   boards: boardReducer
});