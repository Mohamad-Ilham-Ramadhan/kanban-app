'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import logo from './_assets/kanban-logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './_redux/store';
import { addList, deleteList } from './_redux/reducers/listReducer';
import { increment, decrement } from './_redux/reducers/counterReducer';

export default function Home() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>('light')
  const {theme, setTheme} = useTheme();
  // @ts-ignore
  const state: RootState = useSelector<RootState>( state => state);
  const dispatch = useDispatch();
  console.log('STATE', state)

  console.log('uuidv4', uuidv4())

  const [listText, setListText] = useState('')
  return (
    <>
    <div className="grid grid-rows-1 grid-cols-[300px,1fr] py-4 bg-slate-400">
      <div>
        <img src={logo.src} alt="Kanban App" />
      </div>
    </div>
    <div>
      <div>Add list:</div>
      <div>
        <label htmlFor="">Text: </label>
        <input type="text" value={listText} onChange={(e) => setListText(e.target.value)} />
        <button className="px-2 bg-slate-500 active:bg-slate-700"
          onClick={() => {
            dispatch(addList({id: uuidv4(), text: listText}))
            setListText('')
          }}
        >Add</button>
      </div>
    </div>
    <div>List:</div>
    <div>
      {state.list.map( (l, idx) => (
          <li data-index={idx}>
            {l.text}
            <span>
              <button 
                className="px-1 bg-slate-500 active:bg-slate-700"
                onClick={() => {
                  dispatch(deleteList(Number(idx)))
                }}
              >x</button></span></li>
        ))}
    </div>

    <div>
      <div>Counter:</div>
      <div>
        <button className="px-2 bg-slate-500 active:bg-slate-700"
          onClick={() => {dispatch(decrement())} }
        >-</button>
        {state.counter}
        <button className="px-2 bg-slate-500 active:bg-slate-700"
          onClick={() => {dispatch(increment())} }
        >+</button></div>
    </div>
    </>
  )
}
