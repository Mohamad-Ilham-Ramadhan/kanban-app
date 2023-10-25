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
import ButtonPill from './_components/buttons/ButtonPill';
import ButtonIcon from './_components/buttons/ButtonIcon';

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
      <div className="flex items-center h-[100px] bg-[#2b2c37] border-b border-gray-700">
        <div className="flex items-center w-[300px] h-full px-8 border-r border-gray-700">
          <img src={logo.src} alt="Kanban App" />
        </div>

        <div className="px-8 w-full flex justify-between items-center">
          <div className="text-2xl font-bold">Get job</div>
          <div className="flex items-center">
            <ButtonPill text={'+ Add New Task'} onClick={() => {alert('fuck you')}} className='mr-2' />
            <ButtonIcon 
              icon={
                <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: 'none'}}><g fill="currentColor" fill-rule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"></circle><circle cx="2.308" cy="10" r="2.308"></circle><circle cx="2.308" cy="17.692" r="2.308"></circle></g></svg>
              }
            />
          </div>
        </div>
      </div>
    </>
  )
}
