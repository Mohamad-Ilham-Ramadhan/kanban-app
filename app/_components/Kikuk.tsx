'use client'

import { useState, useEffect, useRef} from 'react'

export default function Kikuk({open, onClick} : {open: boolean, onClick: React.MouseEventHandler<HTMLButtonElement>}) {
   const paperRef = useRef(null);
   useEffect(() => {
      console.log(paperRef.current)
   }, [open])
   return (
      <>
         <button
            onClick={onClick}
            className="hover:cursor-pointer"
         type="button">Button</button>
         {open && (
         <div ref={paperRef}>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
         </div>
         )}
      </>
   )
}