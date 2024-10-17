import clsx from 'clsx'

type ButtonPillProps = {
   text?: string | React.ReactNode;
   className?: string; 
   onClick?: React.MouseEventHandler<HTMLButtonElement>;
   size?: 'small' | 'medium';
   backgroundColor?: string;
   color?: string; // text color
   type?: 'submit' | 'reset' | 'button' | undefined;
   id?: string;
}
export default function ButtonPill({text, className, onClick, size = 'medium', color = 'text-white', backgroundColor = 'bg-primary hover:bg-primary-light', type, id} : ButtonPillProps) {
   // size class 
   let sizeClass; 
   if (size == 'medium') {
      sizeClass = 'py-3 px-5  text-[0.95rem]'
   } else if (size == 'small') {
      sizeClass = 'py-2 px-3 text-[0.815rem]'
   }

   return (
      <button id={id} className={clsx("transition-colors rounded-full font-bold focus:outline-2 focus:outline-amber-400 focus:outline", color, backgroundColor, sizeClass, className)} onClick={onClick} type={type}>
         {text}
      </button>
   )
}