import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'
// import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
import { v4 as uuidv4 } from 'uuid';

export type SubTask = {
   id: string;
   text: string;
   isDone: boolean
}
export type Task = {
   id: string;
   title: string;
   description: string;
   subtasks: SubTask[];
}
export type Column = {
   id: string;
   name: string;
   tasks: Task[];
}
export type Board = {
   id: string;
   name: string;
   columns: Column[];
}


interface TaskState {
   tasks: Task[]
}

const boards: Board[] = [
   {
      id: uuidv4(),
      name: 'Platform Launch',
      columns: [
         {
            id: uuidv4(),
            name: 'Todo',
            tasks: [
               {
                  id: uuidv4(), title: 'Build UI for onboarding flow.', description: '', subtasks: [
                     { id: uuidv4(), text: 'Sign up page', isDone: true },
                     { id: uuidv4(), text: 'Sign in page', isDone: false },
                     { id: uuidv4(), text: 'Welcome page', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Build UI for search.', description: '', subtasks: [
                     { id: uuidv4(), text: 'Search page', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Build settings UI.', description: '', subtasks: [
                     { id: uuidv4(), text: 'Account page', isDone: false },
                     { id: uuidv4(), text: 'Billing page', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'QA and test all major user journeys.', description: 'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.', subtasks: [
                     { id: uuidv4(), text: 'Internal testing', isDone: false },
                     { id: uuidv4(), text: 'External testing', isDone: false },
                  ],
               },
            ]
         },
         {
            id: uuidv4(),
            name: 'Doing',
            tasks: [
               {
                  id: uuidv4(), title: 'Design settings and search pages', description: '', subtasks: [
                     { id: uuidv4(), text: 'Settings - Accoung page', isDone: true },
                     { id: uuidv4(), text: 'Settings - Billing page', isDone: true },
                     { id: uuidv4(), text: 'Search page', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Add account management endpoints', description: '', subtasks: [
                     { id: uuidv4(), text: 'Upgrade plan', isDone: true },
                     { id: uuidv4(), text: 'Cancel plan', isDone: true },
                     { id: uuidv4(), text: 'Update payment method', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Design onboarding flow', description: '', subtasks: [
                     { id: uuidv4(), text: 'Sign up page', isDone: true },
                     { id: uuidv4(), text: 'Sign in page', isDone: false },
                     { id: uuidv4(), text: 'Welcome page', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Add search endpoints', description: '', subtasks: [
                     { id: uuidv4(), text: 'Add search endpoint', isDone: true },
                     { id: uuidv4(), text: 'Define search filters', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Add authentication endpoints', description: '', subtasks: [
                     { id: uuidv4(), text: 'Define user model', isDone: true },
                     { id: uuidv4(), text: 'Add auth endpoints', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Research pricing points of various competitors and trial different business models', description: "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.", subtasks: [
                     { id: uuidv4(), text: 'Research competitor pricing and business models', isDone: true },
                     { id: uuidv4(), text: 'Outline a business model that works for our solution', isDone: false },
                     { id: uuidv4(), text: 'Talk to potential customers about our proposed solution and a sk for fair price expectancy', isDone: false },
                  ],
               },
            ]
         },
         {
            id: uuidv4(),
            name: 'Done',
            tasks: [
               {
                  id: uuidv4(), title: 'Conduct 5 wireframes tests', description: 'Ensure the layout continues to make sense and we have strong buy-in from potential users.', subtasks: [
                     { id: uuidv4(), text: 'Complete 5 wireframe prototype tests', isDone: true },
                  ],
               },
               {
                  id: uuidv4(), title: 'Create wireframe prototype', description: 'Create a greyscale clickable wireframe prototype to test our asssumptions so far.', subtasks: [
                     { id: uuidv4(), text: 'Create clickable wireframe prototype in Balsamiq', isDone: true },
                  ],
               },
               {
                  id: uuidv4(), title: 'Review result of usability tests and iterate', description: "Keep iterating through the subtasks until we're clear on the core concepts for the app.", subtasks: [
                     { id: uuidv4(), text: 'Meet to review notes from previous tests and plan changes', isDone: true },
                     { id: uuidv4(), text: 'Make changes to paper prototypes', isDone: true },
                     { id: uuidv4(), text: 'Conduct 5 usability tests', isDone: true },
                  ],
               },
               {
                  id: uuidv4(), title: 'Create paper prototypes and conduct 10 usability tests with potential customers', description: '', subtasks: [
                     { id: uuidv4(), text: 'Create paper prototypes for version one', isDone: true },
                     { id: uuidv4(), text: 'Complete 10 usability tests', isDone: true },
                  ],
               },
            ]
         }


      ]
   },
   {
      id: uuidv4(),
      name: 'Marketing Plan',
      columns: [
         {
            id: uuidv4(),
            name: 'Todo',
            tasks: [
               {
                  id: uuidv4(), title: 'Plan Product Hunt launch', description: '', subtasks: [
                     { id: uuidv4(), text: 'Find hunter', isDone: false },
                     { id: uuidv4(), text: 'Gather assets', isDone: false },
                     { id: uuidv4(), text: 'Draft product page', isDone: false },
                     { id: uuidv4(), text: 'Notify customers', isDone: false },
                     { id: uuidv4(), text: 'Notify network', isDone: false },
                     { id: uuidv4(), text: 'Launch!', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Share on Show HN', description: '', subtasks: [
                     { id: uuidv4(), text: 'Draft out HN post', isDone: false },
                     { id: uuidv4(), text: 'Get feedback and refine', isDone: false },
                     { id: uuidv4(), text: 'Publish post', isDone: false },
                  ],
               },
               {
                  id: uuidv4(), title: 'Write launch article to publish on multiple channels', description: '', subtasks: [
                     { id: uuidv4(), text: 'Write article', isDone: false },
                     { id: uuidv4(), text: 'Publish on LinkedIn', isDone: false },
                     { id: uuidv4(), text: 'Publish on Indie Hackers', isDone: false },
                     { id: uuidv4(), text: 'Publish on Medium', isDone: false },
                  ],
               },
            ]
         },
         {
            id: uuidv4(),
            name: 'Doing',
            tasks: []
         },
      ]
   },
   {
      id: uuidv4(),
      name: 'Roadmap',
      columns: [
         {
            id: uuidv4(),
            name: 'Now',
            tasks: [
               {
                  id: uuidv4(), title: 'Launch version one', description: '', subtasks: [
                     { id: uuidv4(), text: 'Launch privately to our waitlist', isDone: false },
                     { id: uuidv4(), text: 'Launch publicly on PH, HN, etc.', isDone: false },
                  ],
               },
            ]
         },
         {
            id: uuidv4(),
            name: 'Next',
            tasks: [
               {
                  id: uuidv4(), title: 'Review early feedback and plan next steps for roadmap', description: "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.", subtasks: [
                     { id: uuidv4(), text: 'Interview 10 customers', isDone: false },
                     { id: uuidv4(), text: 'Review common customer pain points and suggestions', isDone: false },
                     { id: uuidv4(), text: 'Outline next steps for our roadmap', isDone: false },
                  ],
               },
            ]
         },
         {
            id: uuidv4(),
            name: 'Later',
            tasks: []
         }
      ]
   },
]

type SwapTask = {
   fromColumnIndex: number;
   toColumnIndex: number;
   fromIndex: number;
   toIndex: number;
}
export const swapTask = createAsyncThunk<SwapTask, SwapTask>(
   'board/swapTask',
   async (argu, thunkAPI) => {
     return argu;
   },
 )

export const boardSlice = createSlice({
   name: 'board',
   initialState: {
      boards,
      activeBoard: 0,
      activeColumn: 0, // column index
      activeTask: 0, // task index
      theme: 0, // 0 = dark, 1 = light
      sidebar: true, // show/hide sidebar
      modalCreateNewBoardOpen: false,
   },
   reducers: {
      setModalCreateNewBoardOpen(state, {payload}) {
         state.modalCreateNewBoardOpen = payload
      },
      toggleTheme: (state) => {
         if (state.theme) {
            state.theme = 0;
         } else {
            state.theme = 1;
         }
      },
      setSidebar(state, {payload})  {
         state.sidebar = payload;
      },
      createNewBoard(state, action)  {
         state.boards.push({
            id: uuidv4(),
            name: action.payload.name,
            columns: action.payload.columns.map((c: string) => ({
               id: uuidv4(),
               name: c.trim(),
               tasks: []
            }))
         })
      },
      editActiveBoard(state, {payload: {name, columns}}) {
         // column management
         state.boards[state.activeBoard].columns = columns.map((c: Column) => {
            if (c.id) return {id: c.id, name: c.name, tasks: c.tasks}
            else return {id: uuidv4(), name: c.name, tasks: []}
         });
         // edit active board's name
         state.boards[state.activeBoard].name = name
      },
      addNewTask(state, action) {
         const task = action.payload;
         task.subtasks = task.subtasks.map( (st: SubTask) => ({...st, text: st.text.trim()}))
         state.boards[state.activeBoard].columns[action.payload.status.index].tasks.push({
            id: uuidv4(),
            title: task.title,
            description: task.description,
            subtasks: task.subtasks,
         })
      },
      setActiveBoard: (state, action) => {
         state.activeBoard = action.payload;
         state.activeColumn = 0;
         state.activeTask = 0;
      },
      setActiveTask(state, {payload}) {
         state.activeTask = payload;
      },
      setActiveColumn(state, {payload}) {
         state.activeColumn = payload;
      },
      deleteActiveBoard: (state) => {
         state.boards.splice(state.activeBoard, 1)
         state.activeBoard = 0
      },
      addNewColumns: (state, {payload}: {payload: Column[]}) => {
         state.boards[state.activeBoard].columns = payload.map((c: Column) => {
            if (c.id) return {id: c.id, name: c.name.trim(), tasks: c.tasks}
            else return {id: uuidv4(), name: c.name.trim(), tasks: []}
         });
      },
      toggleSubtask(state, {payload: p}) {
         state.boards[state.activeBoard].columns[state.activeColumn].tasks[state.activeTask].subtasks[p.subtaskIndex].isDone = !p.isDone;
      },
      moveTaskColumn(state, {payload: toColumnIndex}) {
         const task = state.boards[state.activeBoard].columns[state.activeColumn].tasks.find((t, index) => index === state.activeTask)
         state.boards[state.activeBoard].columns[state.activeColumn].tasks = state.boards[state.activeBoard].columns[state.activeColumn].tasks.filter((t, index) => index !== state.activeTask)

         // new column
         if (task !== undefined) {
            state.boards[state.activeBoard].columns[toColumnIndex].tasks.push(task);
            
            state.activeTask = state.boards[state.activeBoard].columns[toColumnIndex].tasks.length - 1;
            state.activeColumn = toColumnIndex;
         }
      },
      deleteActiveTask(state) {
         state.boards[state.activeBoard].columns[state.activeColumn].tasks = state.boards[state.activeBoard].columns[state.activeColumn].tasks.filter((t, index) => index !== state.activeTask)
      },
      editActiveTask(state, {payload}) {
         // no change column
         state.boards[state.activeBoard].columns[state.activeColumn].tasks[state.activeTask] = {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            subtasks: payload.subtasks
         }
         if (payload.status.index !== state.activeColumn) {
            const task = state.boards[state.activeBoard].columns[state.activeColumn].tasks.splice(state.activeTask, 1)[0];
            state.boards[state.activeBoard].columns[payload.status.index].tasks.push(task);
            state.activeTask = state.boards[state.activeBoard].columns[payload.status.index].tasks.length -1;
            state.activeColumn = payload.status.index;
         } 
      },
   },
   extraReducers(builder) {
      builder.addCase(swapTask.fulfilled, (state, {payload}) => {
         const board = state.boards[state.activeBoard];
         const {fromColumnIndex, toColumnIndex, fromIndex, toIndex} = payload;
         // this.board.columns[colIndex].tasks
         if (toColumnIndex === null && fromIndex === toIndex) {
            return;
         } else if (fromColumnIndex === toColumnIndex || toColumnIndex === null) {
            // same column
            if (toIndex > fromIndex) { // drag ke bawah
               const newTasks = board.columns[fromColumnIndex].tasks.map((t, index) => {
                  if (index > toIndex || index < fromIndex) return t; // stay in the place
                  if (index == toIndex) return board.columns[fromColumnIndex].tasks[fromIndex]; // dragged card
                  if (index >= fromIndex){ 
                     // console.log('index >= fromIndex');
                     return board.columns[fromColumnIndex].tasks[index + 1]};
                  return t;
               })
               if (newTasks !== undefined) {
                  state.boards[state.activeBoard].columns[fromColumnIndex].tasks = newTasks;
               }
            } else if (toIndex < fromIndex) { // drag ke atas
               const newTasks = board.columns[fromColumnIndex].tasks.map((t, index) => {
                  if (index < toIndex || index > fromIndex) return t
                  if (index == toIndex) return board.columns[fromColumnIndex].tasks[fromIndex] 
                  if (index <= fromIndex) return board.columns[fromColumnIndex].tasks[index - 1]
                  return t;
               })
               state.boards[state.activeBoard].columns[fromColumnIndex].tasks = newTasks
            }
         } else {
            // oldColumn
            const theTask = board.columns[fromColumnIndex].tasks.splice(fromIndex, 1)[0];
            board.columns[toColumnIndex].tasks.splice(toIndex, 0, theTask)
         }
      })
   },

})

export const { setModalCreateNewBoardOpen, setSidebar, editActiveTask, deleteActiveTask, moveTaskColumn, toggleSubtask, createNewBoard, addNewTask, setActiveBoard, setActiveTask, setActiveColumn, deleteActiveBoard, editActiveBoard, addNewColumns, toggleTheme } = boardSlice.actions;

export default boardSlice.reducer