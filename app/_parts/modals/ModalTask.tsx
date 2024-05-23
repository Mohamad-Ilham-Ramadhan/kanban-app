import { useState } from "react";
import { createPortal } from "react-dom";
import * as yup from "yup";
import Modal from "@/app/_components/Modal";
import { Formik, FieldArray } from "formik";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import Checkbox from "@/app/_components/Checkbox";
import Select from "@/app/_components/Select";
import Option from "@/app/_components/Option";
import ButtonIcon from "@/app/_components/buttons/ButtonIcon";
import XIcon from "../../_assets/icons/x.svg";
import { RootState } from "@/app/_redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  moveTaskColumn,
  toggleSubtask,
  SubTask,
} from "@/app/_redux/reducers/boardReducer";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { CssTransition } from "@mui/base";

import ModalDeleteTask from "./ModalDeleteTask";
import ModalEditTask from "./ModalEditTask";

export default function ModalTask({ isOpen, onRequestClose }: any) {
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const board = state.board.boards[state.board.activeBoard];
  let currentTask =
    board !== null && board.columns[state.board.activeColumn].tasks.length > 0
      ? board.columns[state.board.activeColumn].tasks[state.board.activeTask]
      : null;

  console.log('activeColumn', state.board.activeColumn, 'activeTask', state.board.activeTask);
  console.log('currentTask', currentTask);
  console.log('currentTask robust', )

  const dispatch = useDispatch();

  const [modalDeleteTaskOpen, setModalDeleteTaskOpen] = useState(false);
  const [modalEditTaskOpen, setModalEditTaskOpen] = useState(false);
  const [selectCurrentStatusOpen, setSelectCurrentStatusOpen] = useState(false);

  // popup
  const [anchorTask, setAnchorTask] = useState<null | HTMLElement>(null);
  const openPopperTask = Boolean(anchorTask);
  const idTask = openPopperTask ? "simple-popper" : undefined;

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
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
                    onRequestClose();
                  }}
                >
                  Edit Task
                </button>
                <button
                  className="w-full text-left text-red-500 hover:opacity-50 transition-opacity"
                  onClick={() => {
                    setAnchorTask(null);
                    setModalDeleteTaskOpen(true);
                    onRequestClose();
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
                  dispatch(moveTaskColumn(index));
                  setSelectCurrentStatusOpen((prev) => !prev);
                }}
              />
            ))}
          </Select>
        </div>
      </Modal>
      {/* Modal task [end] */}

      <ModalDeleteTask
        isOpen={modalDeleteTaskOpen}
        onRequestClose={() => setModalDeleteTaskOpen(false)}
      />

      <ModalEditTask 
        isOpen={modalEditTaskOpen}
        onRequestClose={() => setModalEditTaskOpen(false)}
      />
    </>
  );
}
