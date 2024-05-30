"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./_redux/store";
import {
  setSidebar
} from "./_redux/reducers/boardReducer";
import EyeIcon from "./_assets/icons/eye.svg";
import { CSSTransition } from "react-transition-group";

import Header from "./_parts/Header";
import Main from "./_parts/Main";

export default function Home() {
  const [selectCurrentStatusOpen, setSelectCurrentStatusOpen] = useState(false); // modal task
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const dispatch = useDispatch();
  const boards = state.board.boards;
  const board =
    state.board.boards.length > 0
      ? state.board.boards[state.board.activeBoard]
      : null;
  const columns = board !== null ? board.columns : null;

  useEffect(() => {
    if (state.board.theme) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [state.board.theme]);

  const showSidebarTransitionRef = useRef(null);
  return (
    <>
      <Header />

      <CSSTransition
        in={!state.board.sidebar}
        classNames={"show-sidebar"}
        ref={showSidebarTransitionRef}
        timeout={200}
        unmountOnExit
      >
        <button
          className="flex justify-center items-center w-[56px] h-[48px] bg-primary hover:bg-primary-light transition-colors rounded-r-full fixed left-0 bottom-[32px] z-50"
          onClick={() => dispatch(setSidebar(true))}
        >
          <EyeIcon />
        </button>
      </CSSTransition>

      <Main />
    </>
  );
}
