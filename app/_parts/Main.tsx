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
import ModalTask from "./modals/ModalTask";

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
        <ModalTask 
            isOpen={modalTaskOpen}
            onRequestClose={() => {setModalTaskOpen(false)}}
        />
      </section>
    </main>
  );
}
