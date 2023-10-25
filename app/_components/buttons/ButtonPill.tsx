import clsx from 'clsx'

export default function ButtonPillLg({text, className, onClick} : {text: string, className?: string; onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
   return (
      <button className={clsx("bg-primary hover:bg-primary-light transition-colors rounded-full py-3 px-5 font-bold text-[0.95rem]", className)} onClick={onClick}>
         {text}
      </button>
   )
}