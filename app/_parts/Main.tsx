import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../_redux/store";
import {
  addNewColumns,
  toggleSubtask,
  setActiveTask,
  setActiveColumn,
  moveTaskColumn,
  deleteActiveTask,
  SubTask
} from "../_redux/reducers/boardReducer";
import ButtonPill from "../_components/buttons/ButtonPill";
import ButtonIcon from "../_components/buttons/ButtonIcon";
import XIcon from "../_assets/icons/x.svg";
import clsx from "clsx";
import Modal from "@/app/_components/Modal";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import Select from "@/app/_components/Select";
import Option from "@/app/_components/Option";
import Checkbox from '@/app/_components/Checkbox';
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { CssTransition } from "@mui/base";
import {Unstable_Popup as BasePopup} from "@mui/base/Unstable_Popup";

import Aside from './Aside';
import ModalAddNewColumn from "./modals/ModalAddNewColumn";

export default function Main() {
   // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const dispatch = useDispatch();

  const board =
    state.board.boards.length > 0
      ? state.board.boards[state.board.activeBoard]
      : null;
  const columns = board !== null ? board.columns : null;

  console.log('Main board', board)
  
  let currentTask = (board !== null && board.columns[0].tasks.length > 0) ? board.columns[state.board.activeColumn].tasks[state.board.activeTask] : null;

  const [modalCreateNewColumnOpen, setModalCreateNewColumnOpen] =
    useState(false);
  const [modalTaskOpen, setModalTaskOpen] = useState(false);
  const [modalEditTaskOpen, setModalEditTaskOpen] = useState(false); // lagi dibuat
  const [modalDeleteTaskOpen, setModalDeleteTaskOpen] = useState(false);
  const [modalCreateNewBoardOpen, setModalCreateNewBoardOpen] = useState(false); // dipake
  const [selectCurrentStatusOpen, setSelectCurrentStatusOpen] = useState(false);

  // Popper
  const [anchorTask, setAnchorTask] = useState<null | HTMLElement>(null);
  const openPopperTask = Boolean(anchorTask);
  const idTask = openPopperTask ? "simple-popper" : undefined;

  useEffect(() => {
    console.log("state.board.theme", state.board.theme);
    if (state.board.theme) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [state.board.theme]);

  return (
    <main className="flex fixed top-0 left-0 z-10 pt-[96px] w-screen h-screen bg-slate-100 dark:bg-dark">
      <Aside />
      <section
        className={clsx(
          "flex w-[100vw] transition-all",
          state.board.sidebar ? "pl-[300px]" : "pl-0"
        )}
      >
        <div className="beauty-scroll  py-6 px-8 overflow-auto relative transition-all">
          {board !== null ? (
            <>
              <div className="flex flex-row h-full">
                {/* bg-column[] is defined in tailwind.config.ts */}
                {columns !== null &&
                  columns.map((c, columnIndex) => (
                    <div
                      key={c.id}
                      className="shrink-0 w-[280px] rounded-lg mr-8"
                    >
                      <div
                        className="flex flex-row items-center mb-6"
                        key={c.id}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-column${columnIndex} mr-3`}
                        ></div>
                        <div className="uppercase text-[.7rem] font-semibold tracking-[3px] text-slate-400">
                          <span>{c.name}</span>
                          <span>({c.tasks.length})</span>
                        </div>
                      </div>

                      {c.tasks.length > 0 ? (
                        c.tasks.map((task, taskIndex: number) => (
                          <div
                            key={task.id}
                            className="card-task px-4 py-6 mb-6 rounded-md transition-opacity bg-white dark:bg-dark-light hover:opacity-50 hover:cursor-pointer shadow-md dark:shadow-[0_4px_6px_rgb(54_78_126_/_10%)] shadow-slate-200 dark:border dark:border-[rgba(134,134,134,.1)]"
                            onClick={() => {
                              setModalTaskOpen(true);
                              dispatch(setActiveTask(taskIndex));
                              dispatch(setActiveColumn(columnIndex));
                            }}
                          >
                            <div className="font-semibold text-[.95rem] mb-2">
                              {task.title}
                            </div>
                            {/* <div className="font-semibold text-[.95rem] mb-3">QA and test all major user journeys</div> */}
                            <div className="text-xs text-slate-400 font-semibold">
                              {task.subtasks.reduce(
                                (t, st) => (st.isDone ? t + 1 : t),
                                0
                              )}{" "}
                              of {task.subtasks.length} subtasks
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-[calc(100%-40px)]"></div>
                      )}
                    </div>
                  ))}
                {columns && columns.length < 6 && (
                  <div className="rounded-lg h-full shrink-0 w-[280px]">
                    <div className="h-10"></div>
                    <div
                      className="rounded-lg bg-red-700 h-[calc(100%-40px)] flex justify-center items-center font-bold text-2xl bg-gradient-to-b from-slate-200 to-slate-100 dark:from-dark-light dark:to-board hover:cursor-pointer text-slate-400 hover:text-primary"
                      onClick={() => setModalCreateNewColumnOpen(true)}
                    >
                      + New Column
                    </div>
                  </div>
                )}
                <ModalAddNewColumn
                  isOpen={modalCreateNewColumnOpen}
                  onRequestClose={() => setModalCreateNewColumnOpen(false)}
                />
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
        </div>
        {/* Modal task [start] */}
        <Modal
          isOpen={modalTaskOpen}
          onRequestClose={() => setModalTaskOpen(false)}
        >
          <div className="relative">
            <div className="text-lg font-bold mb-4">{currentTask?.title}</div>
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
                setAnchorTask(anchorTask ? null : e.currentTarget);
              }}
              className="text-gray-400 hover:bg-board transition-colors absolute top-0 right-0"
            />
            <BasePopup
              id={idTask}
              open={openPopperTask}
              anchor={anchorTask}
              placement="bottom"
              className="z-[10000] py-[14px]"
            >
              <CssTransition
                enterClassName="popup-open"
                exitClassName="popup-close"
                lastTransitionedPropertyOnExit="transform"
              >
                <div className="z-[10000] w-[192px] bg-white dark:bg-board shadow-[0_0_8px_rgb(54_78_126_/_10%)] rounded-lg px-6 py-4 flex flex-col items-start">
                  <button
                    className="w-full text-left text-gray-500 hover:opacity-50 transition-opacity mb-2.5"
                    onClick={() => {
                      setModalEditTaskOpen(true);
                      setAnchorTask(null);
                      setModalTaskOpen(false);
                    }}
                  >
                    Edit Task
                  </button>
                  <button
                    className="w-full text-left text-red-500 hover:opacity-50 transition-opacity"
                    onClick={() => {
                      setAnchorTask(null);
                      setModalDeleteTaskOpen(true);
                      setModalTaskOpen(false);
                    }}
                  >
                    Delete Task
                  </button>
                </div>
              </CssTransition>
            </BasePopup>

            {createPortal(
              openPopperTask && (
                <div
                  className="fixed inset-0 z-[10000]"
                  onClick={() => setAnchorTask(null)}
                ></div>
              ),
              document.body
            )}

            <div className="text-[.8rem] text-gray-500 mb-4">
              {currentTask?.description}
            </div>
            <Label>{`Subtasks (${String(
              currentTask?.subtasks.reduce(
                (t: number, st: SubTask) => (st.isDone ? t + 1 : t),
                0
              )
            )} of ${String(currentTask?.subtasks.length)})`}</Label>
            {board?.columns[state.board.activeColumn].tasks[
              state.board.activeTask
            ]?.subtasks.map((s: SubTask, subtaskIndex: number) => (
              <Checkbox
                key={s.id}
                data={s}
                className="mb-2"
                onClick={(e) => {
                  // alert('vow to me');
                  e.preventDefault();
                  dispatch(toggleSubtask({ subtaskIndex, isDone: s.isDone }));
                }}
              />
            ))}
            <div className="mb-4"></div>

            <Label>Current Status</Label>
            <Select
              // name="current status"
              open={selectCurrentStatusOpen}
              value={board?.columns[state.board.activeColumn].name}
              close={() => {
                setSelectCurrentStatusOpen((prev) => !prev);
              }}
              onButtonClick={() => setSelectCurrentStatusOpen((prev) => !prev)}
            >
              {board?.columns.map((c, index) => (
                <Option
                  key={c.id}
                  label={c.name}
                  onClick={() => {
                    // setFieldValue('status', { index, name: c.name })
                    dispatch(moveTaskColumn(index));
                    setSelectCurrentStatusOpen((prev) => !prev);
                  }}
                />
              ))}
            </Select>
          </div>
        </Modal>
        {/* Modal task [end] */}

        <Modal
          isOpen={modalDeleteTaskOpen}
          onRequestClose={(e: React.MouseEvent<Element>) => {
            setModalDeleteTaskOpen(false);
          }}
        >
          <>
            <div className="font-bold text-red-500 text-lg mb-4">
              Delete this Task?
            </div>
            <div className="text-gray-400 text-xs font-semibold leading-6 mb-6">
              Are you sure you want to delete the &apos;
              {
                board?.columns[state.board.activeColumn].tasks[
                  state.board.activeTask
                ]?.title
              }
              &apos; task? This action cannot be reversed.
            </div>
            <div className="flex flex-row justify-center items-center">
              <ButtonPill
                color="text-white"
                backgroundColor="bg-red-500 hover:bg-red-500"
                text="Delete"
                size="small"
                className="w-full transition-opacity hover:opacity-70 mr-4"
                onClick={() => {
                  dispatch(deleteActiveTask());
                  setModalDeleteTaskOpen(false);
                }}
              />
              <ButtonPill
                color="text-gray-500"
                backgroundColor="bg-gray-100 hover:bg-gray-100 text-primary"
                text="Cancel"
                size="small"
                className="w-full transition-opacity hover:opacity-70"
                onClick={() => setModalDeleteTaskOpen(false)}
              />
            </div>
          </>
        </Modal>
      </section>
    </main>
  );
}
