import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const counterSlice = createSlice({
   name: 'counter',
   initialState: 0,
   reducers: {
      increment(state) {
         console.log('COUNTER REDUCER: increment')
         return state + 1
      },
      decrement(state) {
         console.log('COUNTER REDUCER: decrement')
         return state - 1
      }
   }
})

export default counterSlice.reducer
export const { increment, decrement } = counterSlice.actions;