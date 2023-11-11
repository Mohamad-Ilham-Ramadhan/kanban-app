import clsx from 'clsx'

type InputProps = {
   className?: string;
   value?: string;
   onChange?: React.ChangeEventHandler<HTMLInputElement>;
   id?: string;
   error?: boolean;
   disabled?: boolean;
}
export default function Input({className, error, disabled, ...props} : InputProps) {
   return <input 
      type="text" 
      className={
         clsx(
            "block w-full bg-transparent border-2 border-gray-600 focus:border-primary outline-0 rounded py-2.5 px-4 text-xs font-semibold", 
            error ? 'border-red-500 focus:border-red-500' : '',
            disabled ? 'opacity-30' : '',
            className
         )
      } 
      {...props}
      disabled={disabled}
   />
}