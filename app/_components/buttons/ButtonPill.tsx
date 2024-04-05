import clsx from 'clsx'

type ButtonPillProps = {
   text?: string;
   className?: string; 
   onClick?: React.MouseEventHandler<HTMLButtonElement>;
   size?: 'small' | 'medium';
   backgroundColor?: string;
   color?: string; // text color
}
export default function ButtonPill({text, className, onClick, size = 'medium', color = 'text-white', backgroundColor = 'bg-primary hover:bg-primary-light'} : ButtonPillProps) {
   // size class 
   let sizeClass; 
   if (size == 'medium') {
      sizeClass = 'py-3 px-5  text-[0.95rem]'
   } else if (size == 'small') {
      sizeClass = 'py-2.5 px-3 text-[0.8rem]'
   }

   return (
      <button className={clsx("transition-all rounded-full font-bold", color, backgroundColor, sizeClass, className)} onClick={onClick}>
         {text}
      </button>
   )
}