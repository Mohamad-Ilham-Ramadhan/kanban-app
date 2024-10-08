"use client"
import { RootState } from "../_redux/store";
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from "../_redux/store"
import { useDispatch, useSelector } from "react-redux";
import { swapTask, Task } from "../_redux/reducers/cobaReducer";
import { useState } from "react";

export default function CobaComponent() {
   const state: any = useSelector<RootState>((state) => state.coba);
   const dispatch = useDispatch();
   const [fromIndex, setFromIndex] = useState(0);
   const [toIndex, setToIndex] = useState(0);
   function doSwapTask() {
      console.log('do swap task');
      console.log('fromIndex', fromIndex);
      console.log('toIndex', toIndex);
      dispatch(swapTask({fromIndex, toIndex}))
   }
   return (
      <div className="w-[300px] flex justify-center flex-col mx-auto pt-4">
         <div>
            {state.map( (t: Task, index: number) => (
               <div key={index} data-index={index} className="p-4 bg-slate-700 flex justify-center items-center mb-2">{t.name}</div>
            ))}
         </div>
         <label htmlFor="">
            <div>From Index</div>
            <input className="text-black" type="number" value={fromIndex} onChange={(e) => {setFromIndex(Number(e.target.value))}}/>
         </label>
         <label htmlFor="">
            <div>To Index</div>
            <input className="text-black" type="number" value={toIndex} onChange={(e) => {setToIndex(Number(e.target.value))}}/>
         </label>
         <button onClick={doSwapTask}>Swap Task</button>
      </div>
   );
}