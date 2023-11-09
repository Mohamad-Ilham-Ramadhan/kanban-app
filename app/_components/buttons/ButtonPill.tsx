import clsx from 'clsx'

type ButtonPillProps = {
   text?: string;
   className?: string; 
   onClick?: React.MouseEventHandler<HTMLButtonElement>;
   size?: 'small' | 'medium'
}
export default function ButtonPill({text, className, onClick, size = 'medium'} : ButtonPillProps) {
   // size class 
   let sizeClass; 
   if (size == 'medium') {
      sizeClass = 'py-3 px-5  text-[0.95rem]'
   } else if (size == 'small') {
      sizeClass = 'py-2.5 px-3 text-[0.8rem]'
   }
   return (
      <button className={clsx("bg-primary hover:bg-primary-light transition-colors rounded-full font-bold ", sizeClass, className)} onClick={onClick}>
         {text}
      </button>
   )
}