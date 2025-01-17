"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";

import Arrow from "../_assets/icons/arrow-down.svg";

export default function Select({
  open,
  close,
  className,
  onButtonClick,
  value,
  children,
}: {
  open: boolean;
  close: Function;
  className?: string;
  value: string | undefined;
  children: React.ReactElement[] | React.ReactElement | undefined;
  onButtonClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const listboxRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const transitionRef = useRef(null);

  useEffect(() => {
    const btn: HTMLButtonElement | null = buttonRef.current;
    const listbox: HTMLUListElement | null = listboxRef.current;
    let btnRect;
    let listboxRect;

    if (listbox !== null && btn !== null) {
      if (!open) {
        btn.focus();
      }
      if (open) {
        (listbox.firstElementChild as HTMLButtonElement)?.focus();
      }
      btnRect = btn.getBoundingClientRect();
      listboxRect = listbox.getBoundingClientRect();
      listbox.style.left = `${btnRect?.left}px`;
      listbox.style.top = `${btnRect?.bottom + 8}px`;
      listbox.style.width = `${btnRect?.width}px`;

      // if listbox overflowing window.innerHeight 
      const diff = window.innerHeight - listbox.getBoundingClientRect().bottom;
      if (diff < 0) {
        listbox.style.top = `${btnRect?.bottom + 8 + diff - 8}px`;
      }
    }
  }, [open]);
  return (
    <>
      <button
        onClick={onButtonClick}
        className={clsx(
          "block relative w-full bg-transparent border-2 border-slate-300 dark:border-gray-600 focus:border-primary outline-0 rounded py-2.5 px-4 text-left text-xs font-semibold focus:outline focus:outline-1 focus:outline-orange-300",
          className
        )}
        type="button"
        ref={buttonRef}
      >
        {value}
        <Arrow
          className={clsx(
            "text-primary w-[18px] h-[18px] absolute right-[12px] top-[10px] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {createPortal(
        <CSSTransition
          in={open}
          ref={transitionRef}
          timeout={200}
          classNames="select"
          unmountOnExit
        >
          <div className="overlay-wrapper  absolute inset-0 z-[1000]">
            <div
              className="overlay absolute inset-0"
              onClick={() => close()}
            ></div>
            <div>
              <ul
                ref={listboxRef}
                className="listbox absolute z-[1000] p-3 rounded overflow-hidden bg-white dark:bg-dark drop-shadow"
              >
                {/* {data.map((value) => (
                  <li
                    key={value.name}
                    data-value={value.index}
                    onClick={() => {
                      helpers.setValue({ index: value.index, name: value.name });
                      close();
                    }}
                    onClick={onOptionClick}
                    className="px-4 mb-2 last:mb-0 text-[13px] hover:font-semibold text-slate-400 hover:text-black dark:hover:text-white hover:cursor-pointer"
                  >
                    {value.name}
                  </li>
                ))} */}
                {children}
              </ul>
            </div>
          </div>
        </CSSTransition>,
        document.body
      )}
    </>
  );
}

