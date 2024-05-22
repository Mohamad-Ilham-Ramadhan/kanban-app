import { LabelHTMLAttributes, useState } from 'react';
import CheckIcon from '../_assets/icons/check.svg';
import checkFatIcon from '../_assets/icons/check-fat.svg';
import checkFat from '../_assets/icons/check-fat.png';
import checkImg from '../_assets/icons/check.png';
import clsx from 'clsx';
import { SubTask } from '../_redux/reducers/boardReducer';
import Image from 'next/image';

type CheckboxProps = {
 data: SubTask;
 className?: string;
 onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined;
}

export default function Checkbox({data, onClick, className} : CheckboxProps) {
   // const [check, setCheck] = useState(false);
   return (
      <label 
         className={clsx('flex bg-[#f7f8ff] hover:bg-[#635fc740] dark:bg-dark dark:hover:bg-[#9b88fb33] p-3 rounded-md cursor-pointer transition-all', className)}
         onClick={onClick}
      >
         <div 
            className={clsx('flex justify-center items-center h-[15px] w-[15px] rounded-sm mr-4 transition-all', data.isDone ? 'bg-primary' : 'bg-white dark:bg-dark-light border border-gray-300 dark:border-gray-600')}
         >
            {data.isDone && (
               <img src={checkImg.src} className='w-[80%]' />
            )}
         </div>
         <div className={clsx('text-xs font-semibold transition-all', data.isDone && 'line-through decoration-black text-zinc-400')}>{data.text}</div>
      </label>
   );
}