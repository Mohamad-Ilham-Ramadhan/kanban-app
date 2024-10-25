import { useState, useEffect } from "react";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import Modal, { CustomModalProps } from "@/app/_components/Modal";
import { Formik, FieldArray } from "formik";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import Select from "@/app/_components/Select";
import Option from "@/app/_components/Option";
import Textarea from "@/app/_components/Textarea";
import ButtonPill from "@/app/_components/buttons/ButtonPill";
import XIcon from "../../_assets/icons/x.svg";
import { RootState } from "@/app/_redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editActiveTask } from "@/app/_redux/reducers/boardReducer";

export default function ModalEditTask({ isOpen, onRequestClose }: CustomModalProps) {
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const board = state.board.boards[state.board.activeBoard];
  const currentColumn = board.columns[state.board.activeColumn]
  const currentTask = currentColumn.tasks[state.board.activeTask];

  const dispatch = useDispatch();

  const [selectStatusOpen, setSelectStatusOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('title')?.focus()
      })
    }
  }, [isOpen]);
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Formik
        initialValues={{
         id: currentTask?.id,
          title: currentTask?.title,
          description: currentTask?.description,
          subtasks: currentTask?.subtasks,
          status: { ...currentColumn, index: state.board.activeColumn },
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
          dispatch(editActiveTask(values));
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
                Edit Task
              </div>
              <div className="mb-4">
                <Label htmlFor="title">Title</Label>
                <div className="relative">
                  <Input
                    id="title"
                    value={values.title}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddBoardname(e.target.value)}
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
                          {values.subtasks.length === 1 ? null : (
                            <button
                              className="w-[50px] flex justify-center items-center"
                              type="button"
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
                    {values.subtasks.length === 7 ? null : (
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
                text="Save Changes"
                size="small"
                className="w-full"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  submitForm()
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
