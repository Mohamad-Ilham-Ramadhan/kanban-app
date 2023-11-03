// root reducer
import { combineReducers } from "@reduxjs/toolkit";
import listReducer from "./listReducer";
import counterReducer from "./counterReducer";
import boardReducer from "./boardReducer";
import activeBoardReducer from "./activeBoardReducer";

export const rootReducer = combineReducers({
   board: boardReducer,
   // activeboard: activeBoardReducer,
});