import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { v4 as uuidv4 } from 'uuid';


export const activeBoardSlice = createSlice({
   name: 'activeBoard',
   initialState: '',
   reducers: {
      setActiveBoard: (state, action) => {
         return action.payload
      }
   }
})

export const { setActiveBoard } = activeBoardSlice.actions 
export default activeBoardSlice.reducer