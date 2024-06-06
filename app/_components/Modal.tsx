
import Modal from 'react-modal'
import clsx from 'clsx'
import { useSelector } from 'react-redux';
import { RootState } from '../_redux/store';
// (event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>): void
export type CustomModalProps = {
   isOpen: boolean,
   onRequestClose: React.MouseEventHandler<Element> | React.KeyboardEventHandler<Element>,
   children: React.ReactElement,
}
export default function CustomModal({isOpen, onRequestClose, children} : CustomModalProps) {
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
         contentElement={(props, children) => <div onClick={props.onClick} className={clsx(props.className, 'absolute z-[1100] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[480px] bg-white dark:bg-dark-light p-8 rounded-lg')}>{children}</div>}
      >
         {children}
      </Modal>
   )
}