'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import logo from './_assets/kanban-logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './_redux/store';
import { createNewBoard } from './_redux/reducers/boardReducer';
import ButtonPillLg from './_components/buttons/buttonPillLg';

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
      <div className="flex bg-[#2b2c37] border-b border-gray-700">
        <div className="w-[300px] p-8 border-r border-gray-700">
          <img src={logo.src} alt="Kanban App" />
        </div>
        <div className="p-8 flex">
          <div className="text-2xl font-bold">Get job</div>
          <ButtonPillLg text={'+ Add New Task'} onClick={() => {alert('fuck you')}} />
        </div>
      </div>
    </>
  )
}
