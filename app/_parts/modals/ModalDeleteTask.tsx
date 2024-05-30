import ButtonPill from "@/app/_components/buttons/ButtonPill";
import Modal from '@/app/_components/Modal';
import { useDispatch, useSelector } from "react-redux";
import { deleteActiveTask } from "@/app/_redux/reducers/boardReducer";

export default function ModalDeleteTask({isOpen, onRequestClose}: any) {
      // @ts-ignore
      const state: RootState = useSelector<RootState>((state) => state);
      const board = state.board.boards[state.board.activeBoard];
   
      const dispatch = useDispatch();
   
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <>
        <div className="font-bold text-red-500 text-lg mb-4">
          Delete this Task?
        </div>
        <div className="text-gray-400 text-xs font-semibold leading-6 mb-6">
          Are you sure you want to delete the &apos;
          {
            board?.columns[state.board.activeColumn].tasks[
              state.board.activeTask
            ]?.title
          }
          &apos; task? This action cannot be reversed.
        </div>
        <div className="flex flex-row justify-center items-center">
          <ButtonPill
            color="text-white"
            backgroundColor="bg-red-500 hover:bg-red-500"
            text="Delete"
            size="small"
            className="w-full transition-opacity hover:opacity-70 mr-4"
            onClick={() => {
              dispatch(deleteActiveTask());
              onRequestClose();
            }}
          />
          <ButtonPill
            color="text-gray-500"
            backgroundColor="bg-gray-100 hover:bg-gray-100 text-primary"
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