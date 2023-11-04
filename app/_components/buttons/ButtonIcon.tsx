import clsx from 'clsx'

export default function ButtonIcon({icon, className, onClick, ...props} : {icon: React.ReactNode, className?: string; onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
   return (
      <button 
         className={clsx("text-[0.95rem] p-2 rounded-full hover:bg-dark", className)} 
         onClick={onClick}
         {...props}
      >
         {icon}
      </button>
   )
}