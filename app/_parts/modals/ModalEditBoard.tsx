import { useEffect } from "react";
import ButtonPill from "@/app/_components/buttons/ButtonPill";
import Modal, { CustomModalProps } from '@/app/_components/Modal';
import { useDispatch, useSelector} from "react-redux";
import { RootState } from "@/app/_redux/store";
import { Formik, FieldArray} from "formik";
import * as yup from 'yup';
import Label from "@/app/_components/Label";
import Input from "@/app/_components/Input";
import XIcon from "../../_assets/icons/x.svg";
import { editActiveBoard} from "../../_redux/reducers/boardReducer";

export default function ModalEditBoard({ isOpen, onRequestClose }: CustomModalProps) {
     // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const board = state.board.boards[state.board.activeBoard];
  const columns = board !== null ? board.columns : null;
  const boards = state.board.boards;
  const namesSet = new Set(); // board names set
  boards.forEach( b => namesSet.add(b.name.toLowerCase().trim()));

   const dispatch = useDispatch();

   useEffect(() => {
      if (isOpen) {
         setTimeout(() => {
            document.getElementById('name')?.focus();
         })
      }
   }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Formik
        initialValues={{
          name: board.name,
          columns: columns === null ? [] : columns,
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required('Required').test('unique-name', 'Used', (value) => {
            value = value?.toLocaleLowerCase().trim();
            return !namesSet.has(value?.toLowerCase().trim()) || value === board.name.toLocaleLowerCase().trim() ? true : false;
          }),
          columns: yup.array().of(
            yup.object({
              name: yup.string().required('Required').test('unique-name', 'Used', (value, context) => {
                // @ts-ignore
                const columns = context.from[1].value.columns;
                const match = context?.path?.match(/\d+/)
                let index;
                if (match !== null) {
                  index = Number(match[0])
                }
                let unique = true;
                for (let i = 0; i < columns.length; i++) {
                  const {name} = columns[i];
                  if (!name) break;
                  if (i === index) break;
                  if (name.toLowerCase().trim() === value.toLocaleLowerCase().trim()) unique = false
                }
                return unique;
              }),
            })
          ),
        })}
        onSubmit={(values) => {
          dispatch(editActiveBoard(values));
        }}
      >
        {({ values, handleChange, handleSubmit, errors, submitForm, isValid }) => (
          <form onSubmit={handleSubmit} className="asdf">
            <div className="font-bold text-lg mb-4">Edit board</div>
            <div className="mb-6">
              <Label htmlFor="column-name">Name</Label>
              <div className="relative">
               <Input value={values.name} id="name" onChange={handleChange} error={errors.name ? true : false} />
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
                          {errors.columns && errors.columns[index] ? (
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-red-500">
                              {/* @ts-ignore */}
                              {errors.columns[index].name}
                            </div>
                          ) : null}
                        </div>
                        {values.columns.length === 1 ? null : (
                          <button
                            className="w-[50px] flex justify-center items-center"
                            disabled={values.columns[index].tasks.length > 0}
                            onClick={() => {
                              remove(index);
                            }}
                            type="button"
                          >
                            <XIcon
                              className={
                                values.columns[index].tasks.length > 0
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
              onClick={(e) => {
                submitForm()
                if (isValid) onRequestClose(e);
              }}
              type="submit"
            />
          </form>
        )}
      </Formik>
    </Modal>
  );
}