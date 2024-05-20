
type Props = {
   htmlFor?: string,
   children?: React.ReactElement | string,
}

export default function Label({htmlFor, children} : Props) {
   return (
      <label
         htmlFor={htmlFor}
         className="block font-semibold text-xs text-slate-400 dark:text-white mb-2"
      >
         {children}
      </label>
   );
}