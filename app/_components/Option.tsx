export default function Option({label, onClick}: {
   label: string;
   onClick: React.MouseEventHandler<HTMLLIElement>
}) {
  return (
    <li
      className="px-4 mb-2 last:mb-0 text-[13px] hover:font-semibold text-slate-400 hover:text-black dark:hover:text-white hover:cursor-pointer"
      onClick={onClick}
    >
      {label}
    </li>
  );
}
