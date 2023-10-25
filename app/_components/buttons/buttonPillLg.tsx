

export default function ButtonPillLg({text, onClick} : {text: string, onClick: React.MouseEventHandler<HTMLButtonElement>}) {
   return (
      <button className="bg-primary hover:bg-primary-light transition-colors rounded-full py-3 px-5 font-bold text-[0.95rem]" onClick={onClick}>
         {text}
      </button>
   )
}