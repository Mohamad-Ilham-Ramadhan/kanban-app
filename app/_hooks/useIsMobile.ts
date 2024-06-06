import { useState, useEffect } from "react";

export default function useIsMobile() {
   let [isMobile, setIsMobile] = useState(window.innerWidth < 767 ? true : false);

   function size() {
      if (window.innerWidth < 767) {
         setIsMobile(true);
      } else {
         setIsMobile(false);
      }
      console.log('isMobile size()')
   }

   useEffect(() => {
      window.removeEventListener('resize', size)
      window.addEventListener('resize', size)
      return () => {
         window.removeEventListener('resize', size)
      }
   }, [])

   return {isMobile}
}