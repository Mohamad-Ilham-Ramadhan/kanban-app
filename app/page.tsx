"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import KanbanLogo from "./_assets/kanban-logo.svg";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./_redux/store";
import {
  toggleTheme,
  createNewBoard,
  setActiveBoard,
  deleteActiveBoard,
  editActiveBoard,
  addNewColumns,
  addNewTask
} from "./_redux/reducers/boardReducer";
import ButtonPill from "./_components/buttons/ButtonPill";
import ButtonIcon from "./_components/buttons/ButtonIcon";
import BoardIcon from "./_assets/icons/board.svg";
import XIcon from "./_assets/icons/x.svg";
import MoonIcon from "./_assets/icons/moon.svg";
import SunIcon from "./_assets/icons/sun.svg";
import EyeSlashIcon from './_assets/icons/eye-slash.svg'
import EyeIcon from './_assets/icons/eye.svg'
import clsx from "clsx";
import Modal from "@/app/_components/Modal";
import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { Popper } from "@mui/base/Popper";
// import { Select } from '@mui/base/Select';
import { Option } from "@mui/base/Option";
import Slider from "@/app/_components/Slider";
import Select from '@/app/_components/Select';
import { CSSTransition } from "react-transition-group";

export default function Home() {
  const [open, setOpen] = useState(false);
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const dispatch = useDispatch();

  const boards = state.board.boards;
  const board =
    state.board.boards.length > 0
      ? state.board.boards[state.board.activeBoard]
      : null;
  const columns = board !== null ? board.columns : null;

  const [sidebar, setSidebar] = useState(true);

  const [modalCreateNewBoardOpen, setModalCreateNewBoardOpen] = useState(false);
  const [modalDeleteBoardOpen, setModalDeleteBoardOpen] = useState(false);
  const [modalEditActiveBoardOpen, setModalEditActiveBoardOpen] = useState(false);
  const [modalCreateNewColumnOpen, setModalCreateNewColumnOpen] =
    useState(false);
  const [modalAddNewTaskOpen, setModalAddNewTaskOpen] = useState(false);

  // Popper
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openPopper = Boolean(anchorEl);
  const id = openPopper ? "simple-popper" : undefined;

  function theme() {
    // document.documentElement.classList.toggle('dark');
    dispatch(toggleTheme());
  }

  useEffect(() => {
    console.log('state.board.theme', state.board.theme);
    if (state.board.theme) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [state.board.theme])

  const showSidebarTransitionRef = useRef(null);
  return (
    <>
      <header className="flex items-center fixed top-0 left-0 z-20 w-full h-[96px] bg-dark-light border-b border-gray-700">
        <div className="flex items-center w-[300px] h-full px-8 border-r border-gray-700">
          <KanbanLogo />
        </div>

        <div className="px-8 flex grow justify-between items-center">
          <div className="text-2xl font-bold dark:text-white">
            {board !== null ? board.name : "No Board Found"}
          </div>
          {board !== null ? (
            <div className="flex items-center">
              <ButtonPill
                text={"+ Add New Task"}
                onClick={() => {
                  setModalAddNewTaskOpen(true);
                }}
                className="mr-4"
              />
              {/* Modal Add New Task */}
              <Modal
                isOpen={modalAddNewTaskOpen}
                onRequestClose={(e: React.MouseEvent<Element>) => {
                  setModalAddNewTaskOpen(false);
                }}
              >
                <Formik
                  initialValues={{
                    title: "",
                    description: "",
                    subtasks: [{id: uuidv4(), text: '', isDone: false}],
                    status: {...board.columns[0], index: 0},
                  }}
                  validationSchema={yup.object().shape({
                    title: yup.string().required(),
                    description: yup.string().required(),
                    subtasks: yup.array().of(
                      yup.object().shape({
                        id: yup.string().required(),
                        text: yup.string().required(),
                        isDone: yup.boolean().required()
                      })
                    ),
                    // status: yup.array().of(yup.string().required()),
                  })}
                  onSubmit={(values) => {
                    dispatch(addNewTask(values));
                    setModalAddNewTaskOpen(false);
                  }}
                >
                  {({ values, errors, handleChange, handleSubmit, submitForm }) => {
                    return (
                      <form onSubmit={handleSubmit}>
                        <div className="text-lg dark:text-white font-bold mb-4">
                          Add New Task
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block font-semibold text-xs mb-2"
                          >
                            Title
                          </label>
                          <div className="relative">
                            <Input
                              id="title"
                              value={values.title}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBoardname(e.target.value)}
                              onChange={handleChange}
                              error={errors.title ? true : false}
                            />
                            {errors.title ? (
                              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                Required
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block font-semibold text-xs mb-2"
                          >
                            Description
                          </label>
                          <div className="relative">
                            <Textarea
                              id="description"
                              value={values.description}
                              onChange={handleChange}
                              error={errors.description ? true : false}
                              rows="4"
                            />
                            {errors.description ? (
                              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                Required
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <FieldArray
                          name="subtasks"
                          render={({ push, remove }) => (
                            <>
                              <div className="mb-4">
                                <div className="block font-semibold text-xs mb-2">
                                  Subtasks
                                </div>
                                {values.subtasks.map((val, index) => (
                                  <div className="flex mb-2" key={index}>
                                    <div className="relative w-full">
                                      <Input
                                        value={values.subtasks[index].text}
                                        id={`subtasks[${index}].text`}
                                        onChange={handleChange}
                                        error={
                                          errors.subtasks !== undefined &&
                                          errors.subtasks[index]
                                            ? true
                                            : false
                                        }
                                      />
                                      {errors.subtasks &&
                                      errors.subtasks[index] ? (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                          Required
                                        </div>
                                      ) : null}
                                    </div>
                                    {values.subtasks.length === 1 ? null : (
                                      <button
                                        className="w-[50px] flex justify-center items-center"
                                        onClick={() => {
                                          remove(index);
                                        }}
                                      >
                                        <XIcon />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {values.subtasks.length === 6 ? null : (
                                <ButtonPill
                                  text="+ Add New Subtask"
                                  size="small"
                                  className="w-full mb-4"
                                  color="text-primary"
                                  backgroundColor="bg-white hover:bg-gray-200"
                                  onClick={() => {
                                    push({id: uuidv4(), text: '', isDone: false});
                                    setTimeout(() => {
                                      const newInput = document.getElementById(`subtasks[${values.subtasks.length}].text`);
                                      newInput?.focus()
                                    })
                                  }}
                                  type="button"
                                />
                              )}
                            </>
                          )}
                        />

                        <div className="mb-4">
                          <label
                            htmlFor="status"
                            className="block font-semibold text-xs mb-2"
                          >
                            Status
                          </label>
                          {/* <Select /> */}

                          <Select 
                            name="status" 
                            open={open} 
                            close={() => {setOpen(prev => !prev)}} 
                            data={ board.columns.map((c, index) => ({index: index, name: c.name})) } 
                            onClick={() => setOpen(prev => !prev)} 
                          />
                        </div>

                        <ButtonPill
                          text="Create Task"
                          size="small"
                          className="w-full"
                          onClick={submitForm}
                          type="submit"
                        />
                      </form>
                    );
                  }}
                </Formik>
              </Modal>
              {/* Modal Add New Task [end] */}
              
              <div>
                <ButtonIcon
                  icon={
                    <svg
                      width="5"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ pointerEvents: "none" }}
                    >
                      <g fill="currentColor" fillRule="evenodd">
                        <circle cx="2.308" cy="2.308" r="2.308"></circle>
                        <circle cx="2.308" cy="10" r="2.308"></circle>
                        <circle cx="2.308" cy="17.692" r="2.308"></circle>
                      </g>
                    </svg>
                  }
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setAnchorEl(anchorEl ? null : e.currentTarget);
                  }}
                  className="text-gray-400 hover:bg-board transition-colors"
                />
                <Modal /* Modal delete current active board */
                  isOpen={modalDeleteBoardOpen}
                  onRequestClose={(e: React.MouseEvent<Element>) => {
                    setModalDeleteBoardOpen(false);
                  }}
                >
                  <>
                    <div className="font-bold text-red-500 text-lg mb-4">
                      Delete this board?
                    </div>
                    <div className="text-gray-400 text-xs font-semibold leading-6 mb-6">
                      Are you sure you want to delete the &apos;{board.name}
                      &apos; board? This action will remove all columns and
                      tasks and cannot be reversed.
                    </div>
                    <div className="flex flex-row justify-center items-center">
                      <ButtonPill
                        color="text-white"
                        backgroundColor="bg-red-500 hover:bg-red-500"
                        text="Delete"
                        size="small"
                        className="w-full hover:opacity-70 mr-4"
                        onClick={() => {
                          dispatch(deleteActiveBoard());
                          setModalDeleteBoardOpen(false);
                        }}
                      />
                      <ButtonPill
                        color="text-gray-500"
                        backgroundColor="bg-gray-100 hover:bg-gray-100"
                        text="Cancel"
                        size="small"
                        className="w-full hover:opacity-70"
                        onClick={() => setModalDeleteBoardOpen(false)}
                      />
                    </div>
                  </>
                </Modal>
                {/* modal edit board [start] */}
                <Modal
                  isOpen={modalEditActiveBoardOpen}
                  onRequestClose={(e: React.MouseEvent<Element>) => {
                    setModalEditActiveBoardOpen(false);
                  }}
                >
                  <Formik
                    initialValues={{
                      name: board.name,
                      columns: columns === null ? [] : columns,
                    }}
                    validationSchema={yup.object().shape({
                      name: yup.string(),
                      columns: yup.array().of(yup.object({
                        name: yup.string().required()
                      })),
                      // status: yup.array().of(yup.string().required()),
                    })}
                    onSubmit={(values) => {
                      dispatch(editActiveBoard(values));
                      setModalEditActiveBoardOpen(false);
                    }}
                  >
                    {({ values, handleChange, handleSubmit, errors, submitForm }) => (
                      <form onSubmit={handleSubmit} className="asdf">
                        <div className="font-bold text-lg mb-4">
                          Edit board
                        </div>
                        <div className="mb-6">
                          <label
                            htmlFor="column-name"
                            className="block font-semibold text-xs mb-2"
                          >
                            Name
                          </label>
                          <Input
                            value={values.name}
                            id="name"
                            onChange={handleChange}
                            
                          />
                        </div>

                        <FieldArray
                          name="columns"
                          render={({ push, remove }) => (
                            <>
                              <div className="mb-4">
                                <div className="block font-semibold text-xs mb-2">
                                  Columns
                                </div>
                                {values.columns.map((val, index) => (
                                  <div className="flex mb-2" key={index}>
                                    <div className="relative w-full">
                                      <Input
                                        value={values.columns[index].name}
                                        id={`columns[${index}].name`}
                                        onChange={handleChange}
                                        error={
                                          errors.columns !== undefined &&
                                          errors.columns[index]
                                            ? true
                                            : false
                                        }
                                      />
                                      {errors.columns &&
                                      errors.columns[index] ? (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                          Required
                                        </div>
                                      ) : null}
                                    </div>
                                    {values.columns.length === 1 ? null : (
                                      <button
                                        className="w-[50px] flex justify-center items-center"
                                        disabled={
                                          values.columns[index].tasks.length > 0
                                        }
                                        onClick={() => {
                                          remove(index);
                                        }}
                                        type="button"
                                      >
                                        <XIcon
                                          className={
                                            values.columns[index].tasks.length > 0
                                              ? "text-gray-700"
                                              : "text-gray-500"
                                          }
                                        />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {values.columns.length === 6 ? null : (
                                <ButtonPill
                                  text="+ Add New Column"
                                  size="small"
                                  className="w-full mb-4"
                                  color="text-primary"
                                  backgroundColor="bg-white hover:bg-gray-200"
                                  onClick={() => {
                                    push({ name: "", tasks: [] });
                                    setTimeout(() => {
                                      document
                                        .getElementById(
                                          `columns[${values.columns.length}].name`
                                        )
                                        ?.focus();
                                    }, 1);
                                  }}
                                  type="button"
                                />
                              )}
                            </>
                          )}
                        />
                        <ButtonPill
                          text="Save Changes"
                          size="small"
                          className="w-full"
                          onClick={submitForm}
                          type="submit"
                        />
                      </form>
                    )}
                  </Formik>
                </Modal>
                {/* modal edit board [end] */}
                <Popper
                  id={id}
                  open={openPopper}
                  anchorEl={anchorEl}
                  placement="bottom-end"
                  className="z-[10000] py-[14px]"
                >
                  <div className="z-[10000] w-[192px] bg-board rounded-lg px-6 py-4 flex flex-col items-start">
                    <button 
                      className="text-gray-400 hover:opacity-50 font-semibold mb-2"
                      onClick={() => setModalEditActiveBoardOpen(true)}
                    >
                      Edit Board
                    </button>
                    
                    

                    <button
                      className="text-red-600 hover:opacity-50 font-semibold"
                      onClick={() => {
                        setAnchorEl(null);
                        setModalDeleteBoardOpen(true);
                      }}
                    >
                      Delete Board
                    </button>
                  </div>
                </Popper>
                {createPortal(
                  <>
                    {openPopper && (
                      <div
                        className="fixed inset-0 z-[10000]"
                        onClick={() => setAnchorEl(null)}
                      ></div>
                    )}
                  </>,
                  document.body
                )}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <CSSTransition
        in={!sidebar}
        classNames={'show-sidebar'}
        ref={showSidebarTransitionRef}
        timeout={200}
        unmountOnExit
      >
        <button 
          className="flex justify-center items-center w-[56px] h-[48px] bg-primary rounded-r-full fixed left-0 bottom-[32px] z-50"
          onClick={() => setSidebar(true)}
        >
          <EyeIcon />
        </button>
      </CSSTransition>

      <main className="flex fixed top-0 left-0 z-10 pt-[96px] w-screen h-screen bg-dark">
        <aside 
          className={clsx("flex flex-col justify-between h-[calc(100vh-96px)] w-[300px] shrink-0 bg-[#2b2c37] border-r border-gray-700 transition-transform", !sidebar && 'translate-x-[-300px]')}
        >
          {/* #828fa3 */}
          <div className="pt-4 pr-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-[2px] pl-8 mb-5">
              all boards <span>({boards.length})</span>
            </div>
            <nav className="list-none">
              {boards.map((b, index) => (
                <li
                  className={clsx(
                    "text-slate-400 font-bold mb-2 py-3 pl-8 hover:cursor-pointer rounded-r-full flex items-center",
                    state.board.activeBoard === index
                      ? "bg-primary text-white"
                      : "hover:bg-primary-light hover:text-white"
                  )}
                  onClick={() => {
                    dispatch(setActiveBoard(index));
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
                  setModalCreateNewBoardOpen(true);
                }}
              >
                <BoardIcon className="mr-4" />
                <span>+ Create New Board</span>
              </li>
              
              {/* modal create new board [start] */}
              <Modal
                isOpen={modalCreateNewBoardOpen}
                onRequestClose={(e: React.MouseEvent<Element>) => {
                  e.stopPropagation();
                  setModalCreateNewBoardOpen(false);
                }}
              >
                <Formik
                  initialValues={{
                    name: "",
                    columns: [""],
                  }}
                  validationSchema={yup.object().shape({
                    name: yup.string().required(),
                    columns: yup.array().of(yup.string().required()),
                  })}
                  onSubmit={(values) => {
                    dispatch(
                      createNewBoard({
                        name: values.name,
                        columns: values.columns,
                      })
                    );
                    setModalCreateNewBoardOpen(false);
                    dispatch(setActiveBoard(boards.length));
                  }}
                >
                  {({ values, errors, handleChange, submitForm, handleSubmit }) => {
                    return (
                      <form onSubmit={handleSubmit}>
                        <div className="text-lg font-bold mb-4">
                          Add New Board
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block font-semibold text-xs mb-2"
                          >
                            Name
                          </label>
                          <div className="relative">
                            <Input
                              id="name"
                              value={values.name}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBoardname(e.target.value)}
                              onChange={handleChange}
                              error={errors.name ? true : false}
                            />
                            {errors.name ? (
                              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                Required
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <FieldArray
                          name="columns"
                          render={({ push, remove }) => (
                            <>
                              <div className="mb-4">
                                <div className="block font-semibold text-xs mb-2">
                                  Columns
                                </div>
                                {values.columns.map((val, index) => (
                                  <div className="flex mb-2" key={index}>
                                    <div className="relative w-full">
                                      <Input
                                        value={values.columns[index]}
                                        id={`columns[${index}]`}
                                        onChange={handleChange}
                                        error={
                                          errors.columns !== undefined &&
                                          errors.columns[index]
                                            ? true
                                            : false
                                        }
                                      />
                                      {errors.columns &&
                                      errors.columns[index] ? (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                          Required
                                        </div>
                                      ) : null}
                                    </div>
                                    {values.columns.length === 1 ? null : (
                                      <button
                                        className="w-[50px] flex justify-center items-center"
                                        onClick={() => {
                                          remove(index);
                                        }}
                                      >
                                        <XIcon />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {values.columns.length === 6 ? null : (
                                <ButtonPill
                                  text="+ Add New Column"
                                  size="small"
                                  className="w-full mb-4"
                                  color="text-primary"
                                  backgroundColor="bg-white hover:bg-gray-200"
                                  onClick={() => {
                                    push("");
                                  }}
                                  type="button"
                                />
                              )}
                            </>
                          )}
                        />

                        <ButtonPill
                          text="Create New Board"
                          size="small"
                          className="w-full"
                          onClick={submitForm}
                          type="submit"
                        />
                      </form>
                    );
                  }}
                </Formik>
              </Modal>
              {/* modal create new board [end] */}

            </nav>
          </div>

          <div className="bottom-nav flex flex-col">

            <div className="flex justify-center items-center h-[48px] w-[80%] mx-auto rounded-md bg-dark mb-4">
              <MoonIcon className="text-slate-400" />
              <button 
                onClick={theme}
                className="flex items-center h-[20px] w-[40px] bg-primary rounded-full px-1 mx-6"
              >
                <div className="relative h-full w-full flex items-center">
                  <div className={clsx("bg-white h-[15px] w-[15px] rounded-full absolute transition-all", state.board.theme ? 'left-[50%]' : 'left-0')}></div>
                </div>
              </button>
              <SunIcon className="text-slate-400" />
            </div>
            <button 
              className="hide-n-show flex items-center transition-colors text-slate-400 hover:text-gray-600 text-[15px] font-bold pl-8 mb-8"
              onClick={() => {setSidebar(false)}}
            >
              <EyeSlashIcon />
              Hide Sidebar
            </button>

          </div>
        </aside>

        <section className={clsx("main-section grow py-6 px-8 overflow-auto absolute transition-all", !sidebar ? 'left-0' : 'left-[300px]')}>
          {board !== null ? (
            <>
              <div className="flex flex-row h-full">
                {/* bg-column[] is defined in tailwind.config.ts */}
                {columns !== null &&
                  columns.map((c, index) => (
                    <div
                      key={c.id}
                      className="shrink-0 w-[280px] rounded-lg mr-8"
                    >
                      <div
                        className="flex flex-row items-center mb-6"
                        key={c.id}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-column${index} mr-3`}
                        ></div>
                        <div className="uppercase text-[.7rem] font-semibold tracking-[3px] text-slate-400">
                          <span>{c.name}</span>
                          <span>({c.tasks.length})</span>
                        </div>
                      </div>

                      {c.tasks.length > 0 ? (
                        c.tasks.map((task, index) => (
                          <div
                            key={task.id}
                            className="px-4 py-6 mb-6 rounded-md transition-opacity bg-[#2b2c37] hover:opacity-50 hover:cursor-pointer border border-gray-700"
                          >
                            <div className="font-semibold text-[.95rem] mb-3">
                              {task.title}
                            </div>
                            {/* <div className="font-semibold text-[.95rem] mb-3">QA and test all major user journeys</div> */}
                            <div className="text-xs text-slate-400 font-semibold">
                              0 of {task.subtasks.length} subtasks
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed border-gray-600 rounded-lg h-[calc(100%-40px)]"></div>
                      )}
                    </div>
                  ))}
                {columns && columns.length < 6 && (
                  <div className="rounded-lg h-full shrink-0 w-[280px]">
                    <div className="h-10"></div>
                    <div
                      className="rounded-lg bg-red-700 h-[calc(100%-40px)] flex justify-center items-center font-bold text-2xl bg-gradient-to-b from-[#2b2c37] to-board hover:cursor-pointer hover:text-primary"
                      onClick={() => setModalCreateNewColumnOpen(true)}
                    >
                      + New Column
                    </div>
                  </div>
                )}
                {/* Modal add new Column */}
                <Modal
                  isOpen={modalCreateNewColumnOpen}
                  onRequestClose={() => {
                    setModalCreateNewColumnOpen(false);
                  }}
                >
                  <Formik
                    initialValues={{
                      columns: columns === null ? [] : columns,
                    }}
                    validationSchema={yup.object().shape({
                      columns: yup.array().of(yup.object({
                        name: yup.string().required()
                      })),
                      // status: yup.array().of(yup.string().required()),
                    })}
                    onSubmit={(values) => {
                      console.log('form add new column')
                      dispatch(addNewColumns(values.columns));
                      setModalCreateNewColumnOpen(false);
                    }}
                  >
                    {({ values, handleChange, handleSubmit, errors, submitForm }) => (
                      <form onSubmit={handleSubmit} className="asdf">
                        <div className="font-bold text-lg mb-4">
                          Add New Column
                        </div>
                        <div className="mb-6">
                          <label
                            htmlFor="column-name"
                            className="block font-semibold text-xs mb-2"
                          >
                            Name
                          </label>
                          <Input
                            value={board !== null ? board.name : ""}
                            disabled
                            id="column-name"
                          />
                        </div>

                        <FieldArray
                          name="columns"
                          render={({ push, remove }) => (
                            <>
                              <div className="mb-4">
                                <div className="block font-semibold text-xs mb-2">
                                  Columns
                                </div>
                                {values.columns.map((val, index) => (
                                  <div className="flex mb-2" key={index}>
                                    <div className="relative w-full">
                                      <Input
                                        value={values.columns[index].name}
                                        id={`columns[${index}].name`}
                                        onChange={handleChange}
                                        error={
                                          errors.columns !== undefined &&
                                          errors.columns[index]
                                            ? true
                                            : false
                                        }
                                      />
                                      {errors.columns &&
                                      errors.columns[index] ? (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                          Required
                                        </div>
                                      ) : null}
                                    </div>
                                    {values.columns.length === 1 ? null : (
                                      <button
                                        className="w-[50px] flex justify-center items-center"
                                        disabled={
                                          values.columns[index].tasks.length > 0
                                        }
                                        onClick={() => {
                                          remove(index);
                                        }}
                                        type="button"
                                      >
                                        <XIcon
                                          className={
                                            values.columns[index].tasks.length > 0
                                              ? "text-gray-700"
                                              : "text-gray-500"
                                          }
                                        />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {values.columns.length === 6 ? null : (
                                <ButtonPill
                                  text="+ Add New Column"
                                  size="small"
                                  className="w-full mb-4"
                                  color="text-primary"
                                  backgroundColor="bg-white hover:bg-gray-200"
                                  onClick={() => {
                                    push({ name: "", tasks: [] });
                                    setTimeout(() => {
                                      document
                                        .getElementById(
                                          `columns[${values.columns.length}].name`
                                        )
                                        ?.focus();
                                    }, 1);
                                  }}
                                  type="button"
                                />
                              )}
                            </>
                          )}
                        />
                        <ButtonPill
                          text="Save Changes"
                          size="small"
                          className="w-full"
                          onClick={submitForm}
                          type="submit"
                        />
                      </form>
                    )}
                  </Formik>
                </Modal>
                {/* Modal add new Column [end] */}
              </div>
            </>
          ) : (
            <>
              {/* When there is no single board in the store. */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  There is no single board. Create a new one to get started.
                </div>
                <ButtonPill
                  text="+ Create New Board"
                  className="w-fit"
                  onClick={() => {
                    setModalCreateNewBoardOpen(true);
                  }}
                />
              </div>
            </>
          )}
          {/* 
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
          </div> */}
        </section>
      </main>
    </>
  );
}
