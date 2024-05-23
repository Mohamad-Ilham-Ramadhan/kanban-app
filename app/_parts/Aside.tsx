import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../_redux/store";
import {
  toggleTheme,
  createNewBoard,
  setActiveBoard,
  setSidebar
} from "../_redux/reducers/boardReducer";
import ButtonPill from "../_components/buttons/ButtonPill";
import BoardIcon from "../_assets/icons/board.svg";
import XIcon from "../_assets/icons/x.svg";
import MoonIcon from "../_assets/icons/moon.svg";
import SunIcon from "../_assets/icons/sun.svg";
import EyeSlashIcon from "../_assets/icons/eye-slash.svg";
import clsx from "clsx";
import Modal from "@/app/_components/Modal";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
export default function Aside() {
      // @ts-ignore
      const state: RootState = useSelector<RootState>((state) => state);
   const dispatch = useDispatch();
  const boards = state.board.boards;

  const [modalCreateNewBoardOpen, setModalCreateNewBoardOpen] = useState(false);


  return (
    <aside
      className={clsx(
        "flex flex-col justify-between h-[calc(100vh-96px)] w-[300px] shrink-0 bg-white dark:bg-dark-light border-r border-slate-200 dark:border-gray-700 absolute transition-all",
        state.board.sidebar ? "left-0" : "left-[-300px]"
      )}
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
                    <div className="text-lg font-bold mb-4">Add New Board</div>
                    <div className="mb-4">
                      <Label htmlFor="name">Name</Label>
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
                            <Label>Columns</Label>
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
                                  {errors.columns && errors.columns[index] ? (
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
                              backgroundColor="bg-violet-50 hover:bg-violet-100 dark:bg-white dark:hover:bg-gray-200"
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
                      className="w-full mb-4"
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
          className="hide-n-show flex items-center transition-colors text-slate-400 hover:text-gray-600 text-[15px] font-bold pl-8 mb-8"
          onClick={() => dispatch(setSidebar(false))}
        >
          <EyeSlashIcon />
          Hide Sidebar
        </button>
      </div>
    </aside>
  );
}
