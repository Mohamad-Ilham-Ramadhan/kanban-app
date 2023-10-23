import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';

export type Task = {
   id: string;
   title: string;
   description: string;
   subtasks: string[];
   // for drag n swap 
   y: number;
   pageYTop: number;
   pageYBottom: number;
   moved: string;
}
export type Column = {
   name: string; 
   tasks: Task[];
}
export type Board = {
   name: string; 
   columns: Column[];
}


interface TaskState {
   tasks: Task[]
}
const initialState: { boards: Board[] } = {
   boards: [
      
   ]
}
const initialTasks: TaskState = {
   tasks: [
      {id: 'td1', title: 'task 1', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
      {id: 'td2', title: 'task 2. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis totam neque.', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
      {id: 'td3', title: 'task 3. Lorem ipsum, fuckboy sinaga, anjing', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''}, 
      {id: 'td4', title: 'task 4', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
      {id: 'td5', title: 'task 5', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
   ]
}
export const taskSlice = createSlice({
   name: 'task',
   initialState,
   reducers: {
      add: (state, action: PayloadAction<Task>) => {
         state.tasks.push(action.payload)
      },
      swap: (state, action: PayloadAction<(number | null)[]>) => { 
         const index1 = action.payload[0]
         const index2 = action.payload[1]
         console.log('swap', 'index1', index1, 'index2', index2)
         if (index1 == null || index2 == null) return 
         if (
               index1 < 0 || index1 >=  state.tasks.length ||
               index2 < 0 || index2 >=  state.tasks.length
            ) {
            return
         }
         let newState;
         if (index1 < index2) {
            newState = [...state.tasks.slice(0, index1), ...state.tasks.slice(index1+1, index2+1), state.tasks[index1], ...state.tasks.slice(index2+1)]
         } else {
            newState = [...state.tasks.slice(0, index2), state.tasks[index1], ...state.tasks.slice(index2, index1), ...state.tasks.slice(index1+1)]
         }
         state.tasks = newState.map( task => ({...task, y: 0}))
      },
      move: (state, action: PayloadAction<{index: number; y: number}>) => {
         const {index, y} = action.payload;
         console.log('reducer move', y)
         state.tasks[index].y += y
      },
      resetY: (state) => {
         state.tasks = state.tasks.map( task => ({...task, y: 0}))
      },
      setPageYTop: (state, action) => {
         state.tasks[action.payload.index].pageYTop = action.payload.pageYTop;
      },
      setPageYBottom: (state, action) => {
         state.tasks[action.payload.index].pageYBottom = action.payload.pageYBottom;
      },
   }
})

export const { add, swap, move, resetY, setPageYTop, setPageYBottom } = taskSlice.actions
// Other code such as selectors can use the imported `RootState` type
// export const tasks = (state: RootState) => state.task.tasks

export default taskSlice.reducer