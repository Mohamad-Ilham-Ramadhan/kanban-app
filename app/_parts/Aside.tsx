import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../_redux/store";
import {
  toggleTheme,
  setActiveBoard,
  setSidebar,
  setModalCreateNewBoardOpen
} from "../_redux/reducers/boardReducer";
import ButtonPill from "../_components/buttons/ButtonPill";
import BoardIcon from "../_assets/icons/board.svg";
import XIcon from "../_assets/icons/x.svg";
import MoonIcon from "../_assets/icons/moon.svg";
import SunIcon from "../_assets/icons/sun.svg";
import EyeSlashIcon from "../_assets/icons/eye-slash.svg";
import clsx from "clsx";
import useIsMobile from "../_hooks/useIsMobile";
export default function Aside() {
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const dispatch = useDispatch();
  const boards = state.board.boards;

  const {isMobile} = useIsMobile();

  return (
    <aside
      className={clsx(
        "flex flex-col justify-between h-[calc(100vh-96px)] w-[300px] shrink-0 bg-white dark:bg-dark-light border-r border-slate-200 dark:border-gray-700 absolute transition-[left] mobile:hidden",
        state.board.sidebar ? "left-0" : "left-[-300px]"
      )}
    >
      {/* #828fa3 */}
      <div className="beauty-scroll overflow-auto pt-4 pr-6">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-[2px] pl-8 mb-5">
          all boards <span>({boards.length})</span>
        </div>
        <nav className="list-none">
          {boards.map((b, index) => (
            <li
              className={clsx(
                "text-slate-400 font-bold mb-1 py-2.5 pl-8 hover:cursor-pointer rounded-r-full flex items-center",
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
            onClick={() => {dispatch(setModalCreateNewBoardOpen(true))}}
          >
            <BoardIcon className="mr-4" />
            <span>+ Create New Board</span>
          </li>
        </nav>
      </div>

      <div className="bottom-nav flex flex-col">
        <div className="flex justify-center items-center h-[48px] w-[80%] mx-auto rounded-md bg-slate-100 dark:bg-dark mb-4">
          <MoonIcon className="text-slate-400" />
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center h-[20px] w-[40px] bg-primary rounded-full px-1 mx-6"
          >
            <div className="relative h-full w-full flex items-center">
              <div
                className={clsx(
                  "bg-white h-[15px] w-[15px] rounded-full absolute transition-all",
                  state.board.theme ? "left-[50%]" : "left-0"
                )}
              ></div>
            </div>
          </button>
          <SunIcon className="text-slate-400" />
        </div>
        <button
          className="hide-n-show flex items-center transition-colors text-slate-400 hover:text-gray-300 dark:hover:text-gray-600 text-[15px] font-bold pl-8 mb-8"
          onClick={() => dispatch(setSidebar(false))}
        >
          <EyeSlashIcon />
          Hide Sidebar
        </button>
      </div>
    </aside>
  );
}
