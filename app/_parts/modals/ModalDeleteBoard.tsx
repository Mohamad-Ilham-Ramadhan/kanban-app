import { useEffect } from "react";
import ButtonPill from "@/app/_components/buttons/ButtonPill";
import Modal, { CustomModalProps } from '@/app/_components/Modal';
import { useDispatch, useSelector} from "react-redux";
import { deleteActiveBoard } from "@/app/_redux/reducers/boardReducer";
import { RootState } from "@/app/_redux/store";

export default function ModalDeleteBoard({ isOpen, onRequestClose }: CustomModalProps) {
   // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const board = state.board.boards[state.board.activeBoard];
   const dispatch = useDispatch();

  return (
    <Modal /* Modal delete current active board */
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <>
        <div className="font-bold text-red-500 text-lg mb-4">
          Delete this board?
        </div>
        <div className="text-gray-400 text-xs font-semibold leading-6 mb-6">
          Are you sure you want to delete the &apos;{board.name}
          &apos; board? This action will remove all columns and tasks and cannot
          be reversed.
        </div>
        <div className="flex flex-row justify-center items-center">
          <ButtonPill
            color="text-white"
            backgroundColor="bg-red-500 hover:bg-red-500"
            text="Delete"
            size="small"
            className="w-full transition-opacity hover:opacity-70 mr-4"
            onClick={(e) => {
              dispatch(deleteActiveBoard());
              onRequestClose(e);
            }}
          />
          <ButtonPill
            color="text-primary"
            backgroundColor="bg-gray-100 hover:bg-gray-100"
            text="Cancel"
            size="small"
            className="w-full transition-opacity hover:opacity-70"
            onClick={onRequestClose}
          />
        </div>
      </>
    </Modal>
  );
}


/**
 <Modal 
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
 */