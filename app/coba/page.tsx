'use client'

import { useState, useEffect, useRef} from 'react'
import Kikuk from '../_components/Kikuk'

export default function Page() {
   const [open, setOpen] = useState(false);
   function onClick() {
      setOpen(prev => !prev)
   }
   return (
      <>
         <Kikuk 
            open={open}
            onClick={onClick}
         />
      </>
   )
}