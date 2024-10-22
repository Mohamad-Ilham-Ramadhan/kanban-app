export default function Option({label, onClick}: {
   label: string;
   onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      className="block w-full text-left px-4 mb-2 last:mb-0 text-[13px] hover:font-semibold text-slate-400 hover:text-black dark:hover:text-white hover:cursor-pointer focus:outline focus:outline-1 focus:outline-orange-300"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
