import { useState } from "react";
import { Formik, FieldArray } from "formik";
import Modal from "../../_components/Modal";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addNewTask } from "../../_redux/reducers/boardReducer";
import Input from "../../_components/Input";
import Label from "../../_components/Label";
import Textarea from "../../_components/Textarea";
import XIcon from "../../_assets/icons/x.svg";
import ButtonPill from "../../_components/buttons/ButtonPill";
import Select from "../../_components/Select";
import Option from "../../_components/Option";
import { CustomModalProps } from '@/app/_components/Modal';
import { RootState } from "@/app/_redux/store";
import { useSelector } from "react-redux";

export default function ModalAddNewTask({isOpen, onRequestClose}: CustomModalProps) {
  const dispatch = useDispatch();
   //   @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);


//   const board =
//     state.board.boards.length > 0
//       ? state.board.boards[state.board.activeBoard]
//       : null;
const board = state.board.boards[state.board.activeBoard];


  const [selectStatusOpen, setSelectStatusOpen] = useState(false);


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
         //  setModalAddNewTaskOpen(false);
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
                <Label htmlFor="title">Title</Label>
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
                <Label htmlFor="title">Description</Label>
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
                      <Label>Subtasks</Label>
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
                            {errors.subtasks && errors.subtasks[index] ? (
                              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                                Required
                              </div>
                            ) : null}
                          </div>
                          <button
                            className="w-[50px] flex justify-center items-center"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <XIcon className="text-gray-400" />
                          </button>
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
                <Label htmlFor="status">Status</Label>
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
                        setFieldValue("status", { index, name: c.name });
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
                onClick={(e) => {
                  e.preventDefault();
                  submitForm(); 
                  onRequestClose(e);
                }}
                type="submit"
              />
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
}
