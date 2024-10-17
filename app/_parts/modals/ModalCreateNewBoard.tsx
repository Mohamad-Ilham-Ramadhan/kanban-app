import { useEffect} from "react";
import { Formik, FieldArray } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import XIcon from "../../_assets/icons/x.svg";
import ButtonPill from "@/app/_components/buttons/ButtonPill";
import Modal from "@/app/_components/Modal";
import { Board } from "@/app/_redux/reducers/boardReducer";
import { RootState } from "@/app/_redux/store";
import {
  createNewBoard,
  setActiveBoard,
  setModalCreateNewBoardOpen
} from "@/app/_redux/reducers/boardReducer";
import { CustomModalProps } from "@/app/_components/Modal";

export default function ModalCreateNewBoardOpen() {
  const state = useSelector<RootState>(
    (state) => state
  ) as RootState;

  const boards = state.board.boards;
  const modalCreateNewBoardOpen = state.board.modalCreateNewBoardOpen;
  const namesSet = new Set(); // board names set
  boards.forEach( b => namesSet.add(b.name.toLowerCase()));
  const dispatch = useDispatch();

  function uniqueBoardName(value: string) {
    let error;
    if (namesSet.has(value)) error = 'forbiddenName';
    return error;
  }

  useEffect(() => {
    if (modalCreateNewBoardOpen) {
      setTimeout(() => {
        document.getElementById('name')?.focus();
      })
    }
  }, [modalCreateNewBoardOpen])
  
  return (
    <Modal isOpen={modalCreateNewBoardOpen} onRequestClose={() => dispatch(setModalCreateNewBoardOpen(false))}>
      <Formik
        initialValues={{
          name: "",
          coba: '',
          columns: [""],
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required('Required').test('unique-name', 'Used', (value) => {
            return namesSet.has(value?.toLowerCase().trim()) ? false : true;
          }),
          columns: yup.array().of(yup.string().required()),
        })}
        onSubmit={(values) => {
          dispatch(
            createNewBoard({
              name: values.name,
              columns: values.columns,
            })
          );
          dispatch(setActiveBoard(boards.length));
          dispatch(setModalCreateNewBoardOpen(false));
        }}
      >
        {({ values, errors, handleChange, submitForm, handleSubmit, validateField }) => {
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
                    onChange={(e) => {
                      handleChange(e);
                      uniqueBoardName(e.target.value);
                      validateField('name')
                    }}
                    error={errors.name ? true : false}
                  />
                  {errors.name && (
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                      {errors.name}
                    </div>
                  )}
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
                              className="input-column"
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
                              <XIcon className="text-slate-400" />
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
                          setTimeout(() => {
                            document
                              .getElementById(
                                `columns[${values.columns.length}]`
                              )
                              ?.focus();
                          });
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
  );
}
