'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'next-themes';
import KanbanLogo from './_assets/kanban-logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './_redux/store';
import { createNewBoard, setActiveBoard } from './_redux/reducers/boardReducer';
import ButtonPill from './_components/buttons/ButtonPill';
import ButtonIcon from './_components/buttons/ButtonIcon';
import BoardIcon from './_assets/icons/board.svg'
import XIcon from './_assets/icons/x.svg'
import clsx from 'clsx';
import Modal from 'react-modal'
import Input from '@/app/_components/Input'
import { Formik, FieldArray } from 'formik'
import * as yup from 'yup'
import { Popper } from '@mui/base/Popper';
// import { Select } from '@mui/base/Select';
import { Option } from '@mui/base/Option';
import Slider from '@/app/_components/Slider'
import Select from '@/app/_components/Select'

export default function Home() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>('light')
  const { theme, setTheme } = useTheme();
  // @ts-ignore
  const state: RootState = useSelector<RootState>(state => state);
  const dispatch = useDispatch();

  const boards = state.board.boards
  const board = state.board.boards[state.board.activeBoard]
  const columns = board.columns
  console.log('board', board)
  console.log('columns', columns)
  const [modalOpen, setModalOpen] = useState(false)

  // Popper
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openPopper = Boolean(anchorEl)
  const id = openPopper ? 'simple-popper' : undefined;
  return (
    <>
      <header className="flex items-center fixed top-0 left-0 z-20 w-full h-[96px] bg-[#2b2c37] border-b border-gray-700">
        <div className="flex items-center w-[300px] h-full px-8 border-r border-gray-700">
          <KanbanLogo />
        </div>

        <div className="px-8 flex grow justify-between items-center">
          <div className="text-2xl font-bold">{board.name}</div>
          <div className="flex items-center">
            <ButtonPill text={'+ Add New Task'} onClick={() => { alert('fuck you') }} className='mr-4' />

            <ButtonIcon
              icon={
                <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}><g fill="currentColor" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"></circle><circle cx="2.308" cy="10" r="2.308"></circle><circle cx="2.308" cy="17.692" r="2.308"></circle></g></svg>
              }
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(anchorEl ? null : e.currentTarget)
              }}
              className="text-gray-400 hover:bg-board transition-colors"
            />
            <Popper id={id} open={openPopper} anchorEl={anchorEl} placement='bottom-end' className='z-[10000] py-[14px]'>
              <div className="z-[10000] w-[192px] bg-board rounded-lg px-6 py-4 flex flex-col items-start">
                <button className="text-gray-400 hover:opacity-50 font-semibold mb-2">Edit Board</button>
                <button className="text-red-600 hover:opacity-50 font-semibold">Delete Board</button>
              </div>
            </Popper>
            {createPortal(
              <>
                {openPopper &&
                  <div className="fixed inset-0 z-[10000]"
                    onClick={() => setAnchorEl(null)}
                  ></div>
                }
              </>
              ,
              document.body)
            }
          </div>
        </div>
      </header>

      <main className="flex fixed top-0 left-0 z-10 pt-[96px] w-screen h-screen">
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
                    dispatch(createNewBoard({ name: values.name, columns: values.columns }))
                    setModalOpen(false)
                    dispatch(setActiveBoard(boards.length))
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


        <section className="main-section grow py-6 px-8 overflow-auto">

          <div className='flex flex-row'>
            {/* bg-column[] is defined in tailwind.config.ts */}
            {columns.map((c, index) => (
              <div className="shrink-0 w-[280px] mr-8">
                <div className="flex flex-row items-center mb-6" key={c.id}>
                  <div className={`w-4 h-4 rounded-full bg-column${index} mr-3`}></div>
                  <div className="uppercase text-[.7rem] font-semibold tracking-[3px] text-slate-400"><span>{c.name}</span><span>({c.tasks.length})</span></div>
                </div>

                {c.tasks.length > 0 && c.tasks.map((task, index) => (
                  <div key={task.id} className="px-4 py-6 mb-6 rounded-md transition-opacity bg-[#2b2c37] hover:opacity-50 hover:cursor-pointer border border-gray-700">
                    <div className="font-semibold text-[.95rem] mb-3">{task.title}</div>
                    {/* <div className="font-semibold text-[.95rem] mb-3">QA and test all major user journeys</div> */}
                    <div className="text-xs text-slate-400 font-semibold">0 of {task.subtasks.length} subtasks</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="relative">
            <Select defaultValue={10}>
              <Option value={10} className="text-red-300 bg-gray-700">Ten</Option>
              <Option value={20} className="text-red-300 bg-gray-700">Twenty</Option>
              <Option value={30} className="text-red-300 bg-gray-700">Thirty</Option>
            </Select>
            <Slider />
          </div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis repellat nulla nam quibusdam id corporis nostrum suscipit provident molestias, sint dolorem modi? Quod pariatur eligendi totam dolor ullam aliquam perspiciatis.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio natus porro excepturi voluptatem debitis et amet dignissimos nesciunt, culpa laudantium, consequuntur provident odit suscipit? Eveniet est quasi excepturi voluptate quidem.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, sit. Eum minus eveniet nostrum. Tempore sapiente totam exercitationem inventore earum dolore architecto nisi quis, hic dolor incidunt. Accusantium, omnis earum.
          </div>
        </section>
      </main>
    </>
  )
}
