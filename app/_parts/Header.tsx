import {useState} from 'react';
import { createPortal } from 'react-dom';
import { RootState } from "../_redux/store";
import { useSelector, useDispatch } from "react-redux";
import KanbanLogoDark from "../_assets/logo-dark.svg";
import KanbanLogo from "../_assets/kanban-logo.svg";
import IconPlus from '../_assets/icons/plus.svg';
import XIcon from "../_assets/icons/x.svg";
import ButtonPill from "../_components/buttons/ButtonPill";
import Modal from '../_components/Modal';
import Input from '../_components/Input';
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
import ModalAddNewTask from './modals/ModalAddNewTask';
import ModalDeleteBoard from './modals/ModalDeleteBoard';
import ModalEditBoard from './modals/ModalEditBoard';

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
   const [modalMenuOpen, setModalMenuOpen] = useState(false);
   // Popup board
   const [anchorBoard, setAnchorBoard] = useState<null | HTMLElement>(null);
   const openPopperBoard = Boolean(anchorBoard);
   const idBoard = openPopperBoard ? "simple-popper" : undefined;
 

   
   return (
      <header className="flex items-center fixed top-0 left-0 z-20 w-full h-[96px] bg-white dark:bg-dark-light border-b border-slate-200 dark:border-gray-700">
        
        <div className="mobile:hidden flex items-center shrink-0 w-[300px] h-full px-8 border-r border-slate-200 dark:border-gray-700">
          {state.board.theme ? <KanbanLogoDark /> : <KanbanLogo />}
        </div>



        <div className="px-8 mobile:px-4 flex grow justify-between items-center">
          <div 
            className="mobile:hidden text-2xl font-bold dark:text-white w-full overflow-hidden text-ellipsis whitespace-nowrap md:max-w-[200px] lg:max-w-[400px] xl:max-w-[600px]"
            title={board !== null ? board.name : "No Board Found"}
          >
            {board !== null ? board.name : "No Board Found"}
          </div>

          {isMobile && (
            <>
              <button 
                className="flex items-center"
                onClick={() => { setModalMenuOpen(true)}}
              >
                <LogoMobile className="mr-2 shrink-0" />
                <div className="font-bold text-lg mr-1 max-w-[150px] overflow-hidden whitespace-nowrap">{board !== null ? board.name : "No Board Found"}</div>
                <IconArrowDown className="text-primary shrink-0 w-[18px] pt-1"/>
              </button>
              <ModalMenu 
                isOpen={modalMenuOpen} 
                onRequestClose={(e) => {
                  e.stopPropagation();
                  setModalMenuOpen(false);
                }}
               />
            </>

          )}

          {board !== null ? (
            <div className="flex items-center shrink-0">
              <ButtonPill
                text={isMobile ? <IconPlus /> : '+ Add New Task'}
                onClick={() => {
                  setModalAddNewTaskOpen(true);
                }}
                className='mr-4 mobile:mr-2 mobile:px-4'
                size={isMobile ? 'small' : 'medium'}
              />


              {/* Modal Add New Task */}
              <ModalAddNewTask 
                isOpen={modalAddNewTaskOpen}
                onRequestClose={() => setModalAddNewTaskOpen(false)}
              />
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

                <ModalDeleteBoard
                  isOpen={modalDeleteBoardOpen}
                  onRequestClose={() => setModalDeleteBoardOpen(false)}
                />

                {/* modal edit board [start] */}
                <ModalEditBoard 
                  isOpen={modalEditActiveBoardOpen} 
                  onRequestClose={() => setModalEditActiveBoardOpen(false)}
                />
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