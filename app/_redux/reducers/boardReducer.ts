import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
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
   // for drag n swap 
   y: number;
   pageYTop: number;
   pageYBottom: number;
   moved: string;
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
               {id: uuidv4(), title: 'Build UI for onboarding flow.', description: '', subtasks: [
                  {id: uuidv4(), text: 'Sign up page', isDone: true},
                  {id: uuidv4(), text: 'Sign in page', isDone: false},
                  {id: uuidv4(), text: 'Welcome page', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Build UI for search.', description: '', subtasks: [
                  {id: uuidv4(), text: 'Search page', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Build settings UI.', description: '', subtasks: [
                  {id: uuidv4(), text: 'Account page', isDone: false},
                  {id: uuidv4(), text: 'Billing page', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'QA and test all major user journeys.', description: 'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.', subtasks: [
                  {id: uuidv4(), text: 'Internal testing', isDone: false},
                  {id: uuidv4(), text: 'External testing', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
            ]
         },
         {
            id: uuidv4(), 
            name: 'Doing', 
            tasks: [
               {id: uuidv4(), title: 'Design settings and search pages', description: '', subtasks: [
                  {id: uuidv4(), text: 'Settings - Accoung page', isDone: true},
                  {id: uuidv4(), text: 'Settings - Billing page', isDone: true},
                  {id: uuidv4(), text: 'Search page', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Add account management endpoints', description: '', subtasks: [
                  {id: uuidv4(), text: 'Upgrade plan', isDone: true},
                  {id: uuidv4(), text: 'Cancel plan', isDone: true},
                  {id: uuidv4(), text: 'Update payment method', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Design onboarding flow', description: '', subtasks: [
                  {id: uuidv4(), text: 'Sign up page', isDone: true},
                  {id: uuidv4(), text: 'Sign in page', isDone: false},
                  {id: uuidv4(), text: 'Welcome page', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Add search endpoints', description: '', subtasks: [
                  {id: uuidv4(), text: 'Add search endpoint', isDone: true},
                  {id: uuidv4(), text: 'Define search filters', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Add authentication endpoints', description: '', subtasks: [
                  {id: uuidv4(), text: 'Define user model', isDone: true},
                  {id: uuidv4(), text: 'Add auth endpoints', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Research pricing points of various competitors and trial different business models', description: "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.", subtasks: [
                  {id: uuidv4(), text: 'Research competitor pricing and business models', isDone: true},
                  {id: uuidv4(), text: 'Outline a business model that works for our solution', isDone: false},
                  {id: uuidv4(), text: 'Talk to potential customers about our proposed solution and a sk for fair price expectancy', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
            ]
         },
         {
            id: uuidv4(), 
            name: 'Done', 
            tasks: [
               {id: uuidv4(), title: 'Conduct 5 wireframes tests', description: 'Ensure the layout continues to make sense and we have strong buy-in from potential users.', subtasks: [
                  {id: uuidv4(), text: 'Complete 5 wireframe prototype tests', isDone: true},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Create wireframe prototype', description: 'Create a greyscale clickable wireframe prototype to test our asssumptions so far.', subtasks: [
                  {id: uuidv4(), text: 'Create clickable wireframe prototype in Balsamiq', isDone: true},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Review result of usability tests and iterate', description: "Keep iterating through the subtasks until we're clear on the core concepts for the app.", subtasks: [
                  {id: uuidv4(), text: 'Meet to review notes from previous tests and plan changes', isDone: true},
                  {id: uuidv4(), text: 'Make changes to paper prototypes', isDone: true},
                  {id: uuidv4(), text: 'Conduct 5 usability tests', isDone: true},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Create paper prototypes and conduct 10 usability tests with potential customers', description: '', subtasks: [
                  {id: uuidv4(), text: 'Create paper prototypes for version one', isDone: true},
                  {id: uuidv4(), text: 'Complete 10 usability tests', isDone: true},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
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
               {id: uuidv4(), title: 'Plan Product Hunt launch', description: '', subtasks: [
                  {id: uuidv4(), text: 'Find hunter', isDone: false},
                  {id: uuidv4(), text: 'Gather assets', isDone: false},
                  {id: uuidv4(), text: 'Draft product page', isDone: false},
                  {id: uuidv4(), text: 'Notify customers', isDone: false},
                  {id: uuidv4(), text: 'Notify network', isDone: false},
                  {id: uuidv4(), text: 'Launch!', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Share on Show HN', description: '', subtasks: [
                  {id: uuidv4(), text: 'Draft out HN post', isDone: false},
                  {id: uuidv4(), text: 'Get feedback and refine', isDone: false},
                  {id: uuidv4(), text: 'Publish post', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
               {id: uuidv4(), title: 'Write launch article to publish on multiple channels', description: '', subtasks: [
                  {id: uuidv4(), text: 'Write article', isDone: false},
                  {id: uuidv4(), text: 'Publish on LinkedIn', isDone: false},
                  {id: uuidv4(), text: 'Publish on Indie Hackers', isDone: false},
                  {id: uuidv4(), text: 'Publish on Medium', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
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
               {id: uuidv4(), title: 'Launch version one', description: '', subtasks: [
                  {id: uuidv4(), text: 'Launch privately to our waitlist', isDone: false},
                  {id: uuidv4(), text: 'Launch publicly on PH, HN, etc.', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
            ]
         },
         {
            id: uuidv4(), 
            name: 'Next', 
            tasks: [
               {id: uuidv4(), title: 'Review early feedback and plan next steps for roadmap', description: "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.", subtasks: [
                  {id: uuidv4(), text: 'Interview 10 customers', isDone: false},
                  {id: uuidv4(), text: 'Review common customer pain points and suggestions', isDone: false},
                  {id: uuidv4(), text: 'Outline next steps for our roadmap', isDone: false},
               ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
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



export const boardSlice = createSlice({
   name: 'board',
   initialState: {
      boards,
      activeBoard: 0
   },
   reducers: {
      createNewBoard: (state, action) => {
         state.boards.push({
            id: uuidv4(),
            name:  action.payload.name,
            columns: action.payload.columns.map( (c: string )=> ({
               id: uuidv4(),
               name: c,
               tasks: []
            }))
         })
      },
      setActiveBoard: (state, action) => {
         state.activeBoard = action.payload
      }
   }
})


// const initialTasks: TaskState = {
//    tasks: [
//       {id: 'td1', title: 'task 1', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
//       {id: 'td2', title: 'task 2. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis totam neque.', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
//       {id: 'td3', title: 'task 3. Lorem ipsum, fuckboy sinaga, anjing', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''}, 
//       {id: 'td4', title: 'task 4', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
//       {id: 'td5', title: 'task 5', description: 'description', subtasks: ['sub 1'], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''},
//    ]
// }

// export const taskSlice = createSlice({
//    name: 'task',
//    initialState,
//    reducers: {
//       add: (state, action: PayloadAction<Task>) => {
//          state.tasks.push(action.payload)
//       },
//       swap: (state, action: PayloadAction<(number | null)[]>) => { 
//          const index1 = action.payload[0]
//          const index2 = action.payload[1]
//          console.log('swap', 'index1', index1, 'index2', index2)
//          if (index1 == null || index2 == null) return 
//          if (
//                index1 < 0 || index1 >=  state.tasks.length ||
//                index2 < 0 || index2 >=  state.tasks.length
//             ) {
//             return
//          }
//          let newState;
//          if (index1 < index2) {
//             newState = [...state.tasks.slice(0, index1), ...state.tasks.slice(index1+1, index2+1), state.tasks[index1], ...state.tasks.slice(index2+1)]
//          } else {
//             newState = [...state.tasks.slice(0, index2), state.tasks[index1], ...state.tasks.slice(index2, index1), ...state.tasks.slice(index1+1)]
//          }
//          state.tasks = newState.map( task => ({...task, y: 0}))
//       },
//       move: (state, action: PayloadAction<{index: number; y: number}>) => {
//          const {index, y} = action.payload;
//          console.log('reducer move', y)
//          state.tasks[index].y += y
//       },
//       resetY: (state) => {
//          state.tasks = state.tasks.map( task => ({...task, y: 0}))
//       },
//       setPageYTop: (state, action) => {
//          state.tasks[action.payload.index].pageYTop = action.payload.pageYTop;
//       },
//       setPageYBottom: (state, action) => {
//          state.tasks[action.payload.index].pageYBottom = action.payload.pageYBottom;
//       },
//    }
// })

// export const { add, swap, move, resetY, setPageYTop, setPageYBottom } = taskSlice.actions
// Other code such as selectors can use the imported `RootState` type
// export const tasks = (state: RootState) => state.task.tasks

export const {  createNewBoard, setActiveBoard } =  boardSlice.actions
export default boardSlice.reducer