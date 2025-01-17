
import Modal from 'react-modal'
import clsx from 'clsx'
import { useSelector } from 'react-redux';
import { RootState } from '../_redux/store';
import XIcon from '../_assets/icons/x.svg';
// (event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>): void
export type ModalProps = {
   isOpen: boolean,
   onRequestClose: React.MouseEventHandler<Element>,
   children: React.ReactElement,
}

export type CustomModalProps = {
   isOpen: boolean,
   onRequestClose: React.MouseEventHandler<Element>
}; // for Modal Components from this component (CustomModal)

export default function CustomModal({isOpen, onRequestClose, children} : ModalProps) {
  const theme = useSelector<RootState>((state) => state.board.theme);
   return (
      <Modal
         ariaHideApp={false}
         isOpen={isOpen}
         style={{
            overlay: {
               zIndex: '1000',
               backgroundColor:'rgba(0, 0, 0, 0.5)',
               display: 'flex',
            },
         }}
         shouldCloseOnOverlayClick={true}
         shouldCloseOnEsc={true}
         onRequestClose={onRequestClose}
         contentElement={(props, children) => <div onClick={props.onClick} className={clsx(props.className, 'absolute z-[1100] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-[480px] w-full mobile:h-full bg-white dark:bg-dark-light p-8 rounded-lg max-h-screen overflow-auto')}>
            <>
               <button
                  className='absolute top-0 right-0 p-2 bg-dark md:hidden'
                  onClick={(e: React.MouseEvent<Element>) => onRequestClose(e)}
               >
                  <XIcon className="text-slate-400"/>
               </button>
               {children}
            </>
         </div>}
      >
         {children}
      </Modal>
   )
}