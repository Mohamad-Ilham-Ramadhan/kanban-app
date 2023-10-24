import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

export interface List {
   id: string;
   text: string;
}
const initialState: List[] = [
   {id: uuidv4(), text: 'Ilham ganteng'},
   {id: uuidv4(), text: 'Push harder'},
   {id: uuidv4(), text: 'What comes next when you put the best work.'},
]
const listSlice = createSlice({
   name: 'list',
   initialState,
   reducers: {
      addList(state, action)  {
         state.push(action.payload)
      },
      deleteList(state, action) {
         state.splice(action.payload, 1)
      }
   }
})

export default listSlice.reducer
export const { addList, deleteList } = listSlice.actions;