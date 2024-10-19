import { useEffect } from 'react';
import * as yup from 'yup'
import Modal from '@/app/_components/Modal';
import { Formik, FieldArray } from 'formik';
import Input from '@/app/_components/Input';
import ButtonPill from '@/app/_components/buttons/ButtonPill';
import XIcon from '../../_assets/icons/x.svg';
import { RootState } from '@/app/_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { addNewColumns } from '@/app/_redux/reducers/boardReducer';
import { CustomModalProps } from '@/app/_components/Modal';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

export default function ModalAddNewColumn({isOpen, onRequestClose}: CustomModalProps) {
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const board = state.board.boards[state.board.activeBoard];
  const columns = board.columns;

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('columns[0].name')?.focus()
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
          columns: columns === null ? [] : columns,
        }}
        validationSchema={yup.object().shape({
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
                  if (i === index) break;
                  if (name.toLowerCase().trim() === value.toLocaleLowerCase().trim()) unique = false
                }
                return unique;
              }),
            })
          ),
        })}
        onSubmit={(values) => {
          dispatch(addNewColumns(values.columns));
          // onRequestClose();
        }}
      >
        {({ values, handleChange, handleSubmit, errors, submitForm, isValid }) => (
          <form onSubmit={handleSubmit} className="asdf">
            <div className="font-bold text-lg mb-4">Add New Column</div>
            <div className="mb-6">
              <label
                htmlFor="column-name"
                className="block font-semibold text-xs mb-2"
              >
                Name
              </label>
              <Input
                value={board !== null ? board.name : ""}
                disabled
                id="column-name"
              />
            </div>

            <FieldArray
              name="columns"
              render={({ push, remove }) => (
                <>
                  <div className="mb-4">
                    <div className="block font-semibold text-xs mb-2">
                      Columns
                    </div>
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
                e.preventDefault();
                submitForm(); 
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
