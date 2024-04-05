"use client";
import React, { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
  id: number;
  name: string;
}

export default function Sorta() {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "Ilham" },
    { id: 2, name: "lorem ipsum dolor amet sumpeh tekal sodo anjing" },
    { id: 3, name: "Frodo" },
  ]);

  return (
    <>
      <div>Sorta orta</div>
      <div className="w-[300px]">
         <ReactSortable 
            list={state} 
            setList={setState}
            animation={5000}
         >
            {state.map((item) => (
               <div key={item.id} className="p-2 bg-gray-300 text-gray-700 mb-4">{item.name}</div>
            ))}
         </ReactSortable>
      </div>
    </>
  );
}
