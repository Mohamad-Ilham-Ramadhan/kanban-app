// root reducer
import { combineReducers } from "@reduxjs/toolkit";
import boardReducer from "./boardReducer";
import cobaReducer from './cobaReducer';

export const rootReducer = combineReducers({
   board: boardReducer,
   coba: cobaReducer,
});