'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import KanbanLogo from './_assets/kanban-logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './_redux/store';
import { createNewBoard, setActiveBoard } from './_redux/reducers/boardReducer';
import ButtonPill from './_components/buttons/ButtonPill';
import ButtonIcon from './_components/buttons/ButtonIcon';
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css'
// import boardIcon from './_assets/icons/board.svg'
import BoardIcon from './_assets/icons/board.svg'
import XIcon from './_assets/icons/x.svg'
import clsx from 'clsx';
import Modal from 'react-modal'
import Input from '@/app/_components/Input'
import { Formik, FieldArray } from 'formik'
import * as yup from 'yup'

export default function Home() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>('light')
  const { theme, setTheme } = useTheme();
  // @ts-ignore
  const state: RootState = useSelector<RootState>(state => state);
  const dispatch = useDispatch();

  const boards = state.board.boards
  const board = state.board.boards[state.board.activeBoard]
  const columns = board.columns
  console.log('columns', columns)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <header className="flex items-center fixed z-20 w-full h-[96px] bg-[#2b2c37] border-b border-gray-700">
        <div className="flex items-center w-[300px] h-full px-8 border-r border-gray-700">
          <KanbanLogo />
        </div>

        <div className="px-8 flex grow justify-between items-center">
          <div className="text-2xl font-bold">{board.name}</div>
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
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-[2px] pl-8 mb-5">all boards <span>({boards.length})</span></div>
            <nav className="list-none">
              {boards.map((b, index) => (
                <li
                  className={clsx("text-slate-400 font-bold mb-2 py-3 pl-8 hover:cursor-pointer rounded-r-full flex items-center", state.board.activeBoard === index ? 'bg-primary text-white' : 'hover:bg-primary-light hover:text-white')}
                  onClick={() => {
                    dispatch(setActiveBoard(index))
                  }}
                  key={b.id}
                >
                  <BoardIcon className="mr-4" />
                  <span>{b.name}</span>
                </li>
              ))}
              <li
                className="flex items-center text-primary font-bold py-3 pl-8 hover:cursor-pointer hover:opacity-50"
                onClick={() => {
                  setModalOpen(true)
                }}
              >

                <BoardIcon className="mr-4" />
                <span>+ Create New Board</span>
              </li>

              <Modal
                ariaHideApp={false}
                isOpen={modalOpen}
                style={{
                  overlay: {
                    zIndex: '1000',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                  },
                }}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={(e) => {
                  console.log('e', e)
                  e.stopPropagation()
                  setModalOpen(false)
                }}
                contentElement={(props, children) => <div onClick={props.onClick} className={clsx(props.className, 'absolute z-[1100] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[480px] bg-[#2b2c37] p-6 rounded')}>{children}</div>}
              >
                <Formik
                  initialValues={{
                    name: '',
                    columns: [''],
                  }}
                  validationSchema={yup.object().shape({
                    name: yup.string().required(),
                    columns: yup.array().of(yup.string().required())
                  })}
                  onSubmit={(values) => {
                    dispatch(createNewBoard({name: values.name, columns: values.columns}))
                  }}
                >
                  {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => {
                    // console.log('errors', errors)
                    // console.log('touched', touched)
                    return (
                      <>
                        <div className="text-lg font-bold mb-4">Add New Board</div>
                        <div className='mb-4'>
                          <label htmlFor="name" className="block font-semibold text-xs mb-2">Name</label>
                          <div className="relative">
                            <Input id="name"
                              value={values.name}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBoardname(e.target.value)}
                              onChange={handleChange}
                              error={errors.name ? true : false}
                            />
                            {errors.name ?
                              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">Required</div>
                              : null}
                          </div>
                        </div>
                        <FieldArray
                          name="columns"
                          render={({ push, remove }) => (
                            <>
                              <div className="mb-4">
                                <div className="block font-semibold text-xs mb-2">Columns</div>
                                {values.columns.map((val, index) => (
                                  <div className="flex mb-2" key={index}>
                                    <div className="relative w-full">
                                      <Input
                                        value={values.columns[index]}
                                        id={`columns[${index}]`}
                                        onChange={handleChange}
                                        error={(errors.columns !== undefined && errors.columns[index]) ? true : false}
                                      />
                                      {(errors.columns && errors.columns[index]) ? (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">Required</div>
                                      ) : null}
                                    </div>
                                    {values.columns.length === 1
                                      ? null
                                      : <button className="w-[50px] flex justify-center items-center"
                                        onClick={() => { remove(index) }}
                                      >
                                        <XIcon />
                                      </button>
                                    }

                                  </div>
                                ))}
                              </div>
                              {values.columns.length === 6 ? null : (
                                <ButtonPill text="+ Add New Column" size="small" className="w-full bg-white hover:bg-gray-200 text-primary mb-4"
                                  onClick={() => { push('') }}
                                />
                              )}
                            </>
                          )}
                        />


                        <ButtonPill text="Create New Board" size="small" className="w-full"
                          onClick={submitForm}
                        />
                      </>
                    )
                  }}

                </Formik>

              </Modal>
            </nav>
          </div>
        </aside>


        <section className="grow overflow-x-scroll">

          <div className='flex flex-row'>
            {/* bg-column[] is defined in tailwind.config.ts */}
            {columns.map((c, index) => (
              <div className="flex flex-row" key={c.id}>
                <div className={`w-4 h-4 rounded-full bg-column${index}`}></div>
                <div>{c.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
