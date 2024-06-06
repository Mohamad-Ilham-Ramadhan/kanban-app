import {useState} from 'react';
import { createPortal } from 'react-dom';
import { RootState } from "../_redux/store";
import { useSelector, useDispatch } from "react-redux";
import KanbanLogoDark from "../_assets/logo-dark.svg";
import KanbanLogo from "../_assets/kanban-logo.svg";
import XIcon from "../_assets/icons/x.svg";
import ButtonPill from "../_components/buttons/ButtonPill";
import Modal from '../_components/Modal';
import Input from '../_components/Input';
import Select from '../_components/Select';
import Option from '../_components/Option';
import Textarea from '../_components/Textarea';
import ButtonIcon from '../_components/buttons/ButtonIcon';
import Label from '../_components/Label';
import { Formik, FieldArray } from 'formik';
import {v4 as uuidv4} from 'uuid';
import * as yup from "yup";
import { CssTransition } from "@mui/base";
import {Unstable_Popup as BasePopup} from "@mui/base/Unstable_Popup";

import {
   deleteActiveBoard,
   editActiveBoard,
   addNewTask,
 } from "../_redux/reducers/boardReducer";
import useIsMobile from '../_hooks/useIsMobile';
import LogoMobile from '../_assets/logo-mobile.svg';
import IconArrowDown from '../_assets/icons/arrow-down.svg';
import ModalMenu from './modals/ModalMenu';

export default function Header() {
    const {isMobile} = useIsMobile();
   // @ts-ignore
   const state: RootState = useSelector<RootState>((state) => state);
   const dispatch = useDispatch();

   const board =
   state.board.boards.length > 0
     ? state.board.boards[state.board.activeBoard]
     : null;
   const columns = board !== null ? board.columns : null;
   
   const [selectStatusOpen, setSelectStatusOpen] = useState(false); // modal add new task
   const [modalAddNewTaskOpen, setModalAddNewTaskOpen] = useState(false);
   const [modalEditActiveBoardOpen, setModalEditActiveBoardOpen] = useState(false);
   const [modalDeleteBoardOpen, setModalDeleteBoardOpen] = useState(false);
   const [modalMenuOpen, setModalMenuOpen] = useState(true);
   // Popup board
   const [anchorBoard, setAnchorBoard] = useState<null | HTMLElement>(null);
   const openPopperBoard = Boolean(anchorBoard);
   const idBoard = openPopperBoard ? "simple-popper" : undefined;
 

   
   return (
      <header className="flex items-center fixed top-0 left-0 z-20 w-full h-[96px] bg-white dark:bg-dark-light border-b border-slate-200 dark:border-gray-700">
        
        <div className="mobile:hidden flex items-center w-[300px] h-full px-8 border-r border-slate-200 dark:border-gray-700">
          {state.board.theme ? <KanbanLogoDark /> : <KanbanLogo />}
        </div>



        <div className="px-8 flex grow justify-between items-center">
          <div className="mobile:hidden text-2xl font-bold dark:text-white">
            {board !== null ? board.name : "No Board Found"}
          </div>

          {isMobile && (
            <>
              <button 
                className="flex items-center"
                onClick={() => {console.log('open menu boy'); setModalMenuOpen(true)}}
              >
                <LogoMobile className="mr-2 shrink-0" />
                <div className="font-bold text-lg mr-1">{board !== null ? board.name : "No Board Found"}</div>
                <IconArrowDown className="text-primary shrink-0 w-[18px] pt-1"/>
              </button>
              <ModalMenu 
                isOpen={modalMenuOpen} 
                onRequestClose={(e) => {
                  console.log('ModalMenu onRequestClose callback')
                  e.stopPropagation();
                  setModalMenuOpen(false);
                }}
               />
            </>

          )}

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
                    subtasks: [{ id: uuidv4(), text: "", isDone: false }],
                    status: { ...board.columns[0], index: 0 },
                  }}
                  validationSchema={yup.object().shape({
                    title: yup.string().required(),
                    description: yup.string().required(),
                    subtasks: yup.array().of(
                      yup.object().shape({
                        id: yup.string().required(),
                        text: yup.string().required(),
                        isDone: yup.boolean().required(),
                      })
                    ),
                    // status: yup.array().of(yup.string().required()),
                  })}
                  onSubmit={(values) => {
                    dispatch(addNewTask(values));
                    setModalAddNewTaskOpen(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    handleChange,
                    handleSubmit,
                    submitForm,
                    setFieldValue,
                  }) => {
                    return (
                      <form onSubmit={handleSubmit}>
                        <div className="text-lg dark:text-white font-bold mb-4">
                          Add New Task
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="title"
                          >
                            Title
                          </Label>
                          <div className="relative">
                            <Input
                              id="title"
                              value={values.title}
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
                          <Label
                            htmlFor="title"
                          >
                            Description
                          </Label>
                          <div className="relative">
                            <Textarea
                              id="description"
                              value={values.description}
                              onChange={handleChange}
                              error={errors.description ? true : false}
                              rows={4}
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
                                <Label>
                                  Subtasks
                                </Label>
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
                                        <XIcon className="text-gray-400" />
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
                                  backgroundColor="bg-violet-50 hover:bg-violet-100 dark:bg-white dark:hover:bg-gray-200"
                                  onClick={() => {
                                    push({
                                      id: uuidv4(),
                                      text: "",
                                      isDone: false,
                                    });
                                    setTimeout(() => {
                                      const newInput = document.getElementById(
                                        `subtasks[${values.subtasks.length}].text`
                                      );
                                      newInput?.focus();
                                    });
                                  }}
                                  type="button"
                                />
                              )}
                            </>
                          )}
                        />

                        <div className="mb-4">
                          <Label
                            htmlFor="status"
                          >
                            Status
                          </Label>
                          {/* <Select /> */}

                          <Select
                            open={selectStatusOpen}
                            value={values.status.name}
                            close={() => {
                              setSelectStatusOpen((prev) => !prev);
                            }}
                            onButtonClick={() => setSelectStatusOpen((prev) => !prev)}
                          >
                            {board.columns.map((c, index) => (
                              <Option 
                                key={c.id}
                                label={c.name}
                                onClick={() => {
                                  setFieldValue('status', { index, name: c.name })
                                  setSelectStatusOpen((prev) => !prev);
                                }}
                              />
                            ))}
                          </Select>
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
                    setAnchorBoard(anchorBoard ? null : e.currentTarget);
                  }}
                  className="text-gray-400 hover:bg-board transition-colors"
                />
                <BasePopup
                  id={idBoard}
                  open={openPopperBoard}
                  anchor={anchorBoard}
                  placement="bottom-end"
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
                          setModalEditActiveBoardOpen(true);
                          setAnchorBoard(null);
                        }}
                      >
                        Edit Board
                      </button>
                      <button
                        className="w-full text-left text-red-500 hover:opacity-50 transition-opacity"
                        onClick={() => {
                          setAnchorBoard(null);
                          setModalDeleteBoardOpen(true);
                        }}
                      >
                        Delete Board
                      </button>
                    </div>
                  </CssTransition>
                </BasePopup>

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
                        className="w-full transition-opacity hover:opacity-70 mr-4"
                        onClick={() => {
                          dispatch(deleteActiveBoard());
                          setModalDeleteBoardOpen(false);
                        }}
                      />
                      <ButtonPill
                        color="text-primary"
                        backgroundColor="bg-gray-100 hover:bg-gray-100"
                        text="Cancel"
                        size="small"
                        className="w-full transition-opacity hover:opacity-70"
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
                      columns: yup.array().of(
                        yup.object({
                          name: yup.string().required(),
                        })
                      ),
                    })}
                    onSubmit={(values) => {
                      dispatch(editActiveBoard(values));
                      setModalEditActiveBoardOpen(false);
                    }}
                  >
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      errors,
                      submitForm,
                    }) => (
                      <form onSubmit={handleSubmit} className="asdf">
                        <div className="font-bold text-lg mb-4">Edit board</div>
                        <div className="mb-6">
                          <Label htmlFor="column-name">Name</Label>
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
                                <Label>Columns</Label>
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
                                            values.columns[index].tasks.length >
                                            0
                                              ? "text-gray-200 dark:text-gray-700"
                                              : "text-gray-400"
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
                                  backgroundColor="bg-violet-50 hover:bg-violet-100 dark:bg-white dark:hover:bg-gray-200"
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

                {createPortal(
                  <>
                    {openPopperBoard && (
                      <div
                        className="fixed inset-0 z-[10000]"
                        onClick={() => setAnchorBoard(null)}
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
   );
}