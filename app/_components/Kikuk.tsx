'use client'
import { useState, useEffect, useRef} from 'react';
import { useField } from 'formik';
import { createPortal } from 'react-dom';

export default function Kikuk({name, open, data, onClick} : {name: string, open: boolean, data: {index: number, name: string}[], onClick: React.MouseEventHandler<HTMLButtonElement>}) {
   const paperRef = useRef(null);
   const [field, meta, helpers] = useField(name);

   console.log('kikuk useFIeld', field, 'meta', meta, 'helpers', helpers);

   useEffect(() => {
      console.log(paperRef.current)
   }, [open])
   return (
      <>
         <button
            onClick={onClick}
            className="hover:cursor-pointer"
            type="button"
         >
            {field.value.name}
         </button>
         {open && 
         createPortal(
            <div className='overlay-wrapper absolute inset-0 z-[1000]'>
               <div className='overlay absolute inset-0'></div>
               <ul ref={paperRef} className='listbox absolute z-[1000] py-3 rounded overflow-hidden bg-white dark:bg-slate-700 drop-shadow'>
                  {data.map((value) => 
                     <li 
                        key={value.name} 
                        data-value={value.index}
                        onClick={() => helpers.setValue({index: value.index, name: value.name})}
                     >
                           {value.name}
                     </li>
                  )}
               </ul>
            </div>,
            document.body
         )}
      </>
   )
}

function Option({value, label} : {value: string, label: string}) {
   return (
      <li data-value={value}>{label}</li>
   );
}