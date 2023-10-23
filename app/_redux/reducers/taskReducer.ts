import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';

export type Todo = {
   id: string;
   text: string;
   y: number;
   pageYTop: number;
   pageYBottom: number;
   moved: string;
}
interface TodoState {
   todos: Todo[]
}

const initialState: TodoState = {
   todos: [
      {id: 'td1', text: 'Todo 1', y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
      {id: 'td2', text: 'Todo 2. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis totam neque.', y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
      {id: 'td3', text: 'Todo 3. Lorem ipsum, fuckboy sinaga, anjing', y: 0, pageYTop: 0, pageYBottom: 0, moved: ''}, 
      {id: 'td4', text: 'Todo 4', y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
      {id: 'td5', text: 'Todo 5', y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
   ]
}
export const todoSlice = createSlice({
   name: 'todo',
   initialState,
   reducers: {
      add: (state, action: PayloadAction<Todo>) => {
         state.todos.push(action.payload)
      },
      swap: (state, action: PayloadAction<(number | null)[]>) => { 
         const index1 = action.payload[0]
         const index2 = action.payload[1]
         console.log('swap', 'index1', index1, 'index2', index2)
         if (index1 == null || index2 == null) return 
         if (
               index1 < 0 || index1 >=  state.todos.length ||
               index2 < 0 || index2 >=  state.todos.length
            ) {
            return
         }
         let newState;
         if (index1 < index2) {
            newState = [...state.todos.slice(0, index1), ...state.todos.slice(index1+1, index2+1), state.todos[index1], ...state.todos.slice(index2+1)]
         } else {
            newState = [...state.todos.slice(0, index2), state.todos[index1], ...state.todos.slice(index2, index1), ...state.todos.slice(index1+1)]
         }
         state.todos = newState.map( todo => ({...todo, y: 0}))
      },
      move: (state, action: PayloadAction<{index: number; y: number}>) => {
         const {index, y} = action.payload;
         console.log('reducer move', y)
         state.todos[index].y += y
      },
      resetY: (state) => {
         state.todos = state.todos.map( todo => ({...todo, y: 0}))
      },
      setPageYTop: (state, action) => {
         state.todos[action.payload.index].pageYTop = action.payload.pageYTop;
      },
      setPageYBottom: (state, action) => {
         state.todos[action.payload.index].pageYBottom = action.payload.pageYBottom;
      },
   }
})

export const { add, swap, move, resetY, setPageYTop, setPageYBottom } = todoSlice.actions
// Other code such as selectors can use the imported `RootState` type
// export const todos = (state: RootState) => state.todo.todos

export default todoSlice.reducer