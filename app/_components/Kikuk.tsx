"use client";
import { useState, useEffect, useRef } from "react";
import { useField } from "formik";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";

import Arrow from "../_assets/icons/arrow-down.svg";

export default function Kikuk({
  name,
  open,
  close,
  data,
  className,
  onClick,
}: {
  name: string;
  open: boolean;
  close: Function;
  data: { index: number; name: string }[];
  className: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const listboxRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [field, meta, helpers] = useField(name);
  const transitionRef = useRef(null);

  useEffect(() => {
    const btn: HTMLButtonElement | null = buttonRef.current;
    const listbox: HTMLUListElement | null = listboxRef.current;
    let btnRect;
    let listboxRect;

    if (listbox !== null && btn !== null) {
      btnRect = btn.getBoundingClientRect();
      listboxRect = listbox.getBoundingClientRect();
      listbox.style.left = `${btnRect?.left}px`;
      listbox.style.top = `${btnRect?.bottom + 8}px`;
      listbox.style.width = `${btnRect?.width}px`;
    }
  }, [open]);
  return (
    <>
      <button
        onClick={onClick}
        className={clsx(
          "block relative w-full bg-transparent border-2 border-gray-600 focus:border-primary outline-0 rounded py-2.5 px-4 text-left text-xs font-semibold",
          className
        )}
        type="button"
        ref={buttonRef}
      >
        {field.value.name}
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
          <div className="overlay-wrapper absolute inset-0 z-[1000]">
            <div
              className="overlay absolute inset-0"
              onClick={() => close()}
            ></div>
            <ul
              ref={listboxRef}
              className="listbox absolute z-[1000] py-3 rounded overflow-hidden bg-white dark:bg-dark drop-shadow"
            >
              {data.map((value) => (
                <li
                  key={value.name}
                  data-value={value.index}
                  onClick={() => {
                    helpers.setValue({ index: value.index, name: value.name });
                    close();
                  }}
                  className="px-4 mb-2 last:mb-0 text-[13px] hover:font-semibold text-slate-400 hover:text-black dark:hover:text-white hover:cursor-pointer"
                >
                  {value.name}
                </li>
              ))}
            </ul>
          </div>
        </CSSTransition>,
        document.body
      )}
    </>
  );
}

function Option({ value, label }: { value: string; label: string }) {
  return <li data-value={value}>{label}</li>;
}
