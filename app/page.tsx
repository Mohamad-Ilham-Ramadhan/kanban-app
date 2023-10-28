'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import KanbanLogo from './_assets/kanban-logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './_redux/store';
import { createNewBoard } from './_redux/reducers/boardReducer';
import ButtonPill from './_components/buttons/ButtonPill';
import ButtonIcon from './_components/buttons/ButtonIcon';
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css'
// import boardIcon from './_assets/icons/board.svg'
import BoardIcon from './_assets/icons/board.svg'


export default function Home() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>('light')
  const { theme, setTheme } = useTheme();
  // @ts-ignore
  const state: RootState = useSelector<RootState>(state => state);
  const dispatch = useDispatch();
  console.log('STATE', state)

  console.log('uuidv4', uuidv4())

  const [listText, setListText] = useState('')
  return (
    <>
      <header className="flex items-center fixed z-20 w-full h-[96px] bg-[#2b2c37] border-b border-gray-700">
        <div className="flex items-center w-[300px] h-full px-8 border-r border-gray-700">
          <KanbanLogo />
        </div>

        <div className="px-8 flex grow justify-between items-center">
          <div className="text-2xl font-bold">Get job</div>
          <div className="flex items-center">
            <ButtonPill text={'+ Add New Task'} onClick={() => { alert('fuck you') }} className='mr-2' />
            <ButtonIcon
              icon={
                <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}><g fill="currentColor" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"></circle><circle cx="2.308" cy="10" r="2.308"></circle><circle cx="2.308" cy="17.692" r="2.308"></circle></g></svg>
              }
            />
          </div>
        </div>
      </header>
      <main className="flex fixed z-10 pt-[96px]">
        <aside className="flex flex-col h-[100vw] w-[300px] shrink-0 bg-[#2b2c37] border-r border-gray-700">
          {/* #828fa3 */}
          <div className="pt-4 pr-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-[2px] pl-8 mb-5">all boards <span>({state.boards.length})</span></div>
            <nav className="list-none">
              {state.boards.map( b => (
                <li className="text-slate-400 font-bold mb-2 py-2 pl-8 hover:bg-primary-light hover:text-white hover:cursor-pointer rounded-r-full flex items-center">
                  <BoardIcon className="mr-4" />
                  <span>{b.name}</span>
                </li>
              ))}
            </nav>
          </div>
        </aside>
        <section className="grow overflow-x-scroll">
              
        </section>
      </main>
    </>
  )
}
