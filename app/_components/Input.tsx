import clsx from 'clsx'

export default function Input({className, ...props} : {className?: string}) {
   return <input type="text" id="board-name" className={clsx("block w-full bg-transparent border-2 border-gray-500 focus:border-primary outline-0 rounded py-2 px-4 text-xs font-semibold", className)} {...props}/>
}