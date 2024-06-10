import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/_redux/store";
import clsx from "clsx";
import Modal from "react-modal";

import {
  setActiveBoard,
  toggleTheme,
  setModalCreateNewBoardOpen,
} from "@/app/_redux/reducers/boardReducer";
import IconBoard from "../../_assets/icons/board.svg";
import IconMoonStar from "../../_assets/icons/moon.svg";
import IconSun from "../../_assets/icons/sun.svg";


function M({
  isOpen,
  onRequestClose,
  children,
}: {
  isOpen: boolean;
  onRequestClose: React.MouseEventHandler<Element>;
  children: React.ReactElement;
}) {

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      style={{
        overlay: {
          zIndex: "1000",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          overflow: 'auto'
        },
      }}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={onRequestClose}
      className={"ReactModal__Content"}
      bodyOpenClassName={"ReactModal__Body--open"}
      htmlOpenClassName="ReactModal__Html--open"
      contentElement={(props, children) => (
        <div onClick={props.onClick} className={props.className}>{children}</div>
      )}
    >{children}</Modal>
  );
}

export default function ModalMenu({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: React.MouseEventHandler<Element>;
}) {
    // udah ikutin documentasi dengan stack overflow tapi tetep unknown
    const state = useSelector<RootState>(
      (state) => state.board
    ) as RootState["board"];
    const dispatch = useDispatch();
  
  return (
    <M
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <div
        className="w-[300px] py-6 absolute z-[1100] top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-dark-light rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="uppercase text-[.725rem] text-slate-500 dark:text-slate-400 font-bold tracking-[.175rem] pl-8 mb-4">
          all boards ({state.boards.length})
        </div>
        <nav className="flex flex-col justify-between pr-8 mb-2">
          {state.boards.map((b, index) => (
            <li
              key={b.id}
              className={clsx(
                "list-none font-bold flex items-center hover:bg-primary-light hover:text-white dark:hover:text-white hover:cursor-pointer pl-8 py-2.5 rounded-r-[30px] mb-1",
                state.activeBoard === index
                  ? "bg-primary text-white"
                  : "dark:text-slate-400 text-slate-500"
              )}
              onClick={(e) => {
                dispatch(setActiveBoard(index));
                onRequestClose(e);
              }}
            >
              <IconBoard className="mr-4 shrink-0" />
              <div>{b.name}</div>
            </li>
          ))}

          <li className="list-none">
            <button
              className="flex items-center font-bold pl-8 py-2.5 list-none text-primary hover:opacity-60 hover:cursor-pointer transition-opacity"
              onClick={(e) => {
                dispatch(setModalCreateNewBoardOpen(true))
                onRequestClose(e);
              }}
            >
              <span className="mr-4">
                <IconBoard />
              </span>
              <span>+ Create New Board</span>
            </button>
          </li>
        </nav>

        <div className="px-8 mb-4">
          <div className="flex items-center justify-center rounded-lg py-3.5 bg-indigo-50 dark:bg-dark text-slate-500 dark:text-slate-400">
            <IconMoonStar />
            <div
              className="p-[3px] rounded-full bg-primary w-[40px] h-[20px] flex hover:cursor-pointer mx-6"
              onClick={() => dispatch(toggleTheme())}
            >
              <div className="rounded-full w-full h-full relative">
                <div
                  className={clsx(
                    "w-[14px] h-[14px] rounded-full bg-white transition-all relative",
                    state.theme === 0 ? "left-0" : "left-[calc(100%-14px)]"
                  )}
                ></div>
              </div>
            </div>
            <IconSun />
          </div>
        </div>
      </div>
    </M>
  );
}
