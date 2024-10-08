import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

export type Task = {
   id: string,
   name: string,
}
const initialState: Task[] = [
   { id: uuid(), name: "1" },
   { id: uuid(), name: "2" },
   { id: uuid(), name: "3" },
   { id: uuid(), name: "4" },
   { id: uuid(), name: "5" },
 ];

export const cobaSlice = createSlice({
  name: "coba",
  initialState,
  reducers: {
    swapTask(state, { payload }) {
      const { fromIndex, toIndex } = payload;
      console.log('swap task on reducer');

      // state = [
      //    { id: uuid(), name: "xxx" },
      //    { id: uuid(), name: "2" },
      //    { id: uuid(), name: "3" },
      //    { id: uuid(), name: "4" },
      //    { id: uuid(), name: "yyy" },
      //  ];
      // return state;
      if (fromIndex === toIndex) return state;

      if (fromIndex < toIndex) {
        // swap bawah
        state = state.map((t, index: number) => {
          if (index >= fromIndex && index < toIndex) return state[index + 1];
          else if (index === toIndex) return state[fromIndex];
          return t;
        });
      } else {
        // swap atas
        state = state.map((t, index: number) => {
          if (index < toIndex) return t;
          else if (index === toIndex) return state[fromIndex];
          return state[index - 1];
        });
      }
      console.log("state", state);
      return state;
    },
  },
});


export const { swapTask } = cobaSlice.actions;

export default cobaSlice.reducer