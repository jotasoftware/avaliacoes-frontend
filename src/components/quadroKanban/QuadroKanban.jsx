import React from "react";
import { useDroppable } from "@dnd-kit/core";
import CardKanban from "../cardKanban/CardKanban";

const QuadroKanban = ({ titulo, id, data, openModal, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });



  return (
    <div className="bg-white border border-zinc-200 rounded-xl flex-1 min-w-[300px] shadow-sm flex flex-col h-[80vh]">

      <div className="px-4 py-3 border-b border-zinc-200 flex justify-between">
        <h2 className="text-sm font-semibold text-zinc-700">
          {titulo}
        </h2>
        {(titulo == "Entrada") && 
                <button
                onClick={openModal}
                className="text-sm font-bold text-zinc-500 hover:text-zinc-800"
            >
                +
            </button>
            }
      </div>

      <div
        ref={setNodeRef}
        className={`p-3 flex flex-col gap-3 flex-1 overflow-y-auto transition
          ${isOver ? "bg-zinc-100" : ""}`}
      >
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-zinc-400 text-center px-4">
              Nenhum item aqui ainda
            </p>
          </div>
        ) : (
          data.map((item) => (
            <CardKanban key={item.id} {...item} onEdit={onEdit} onDelete={onDelete} avaliacao={item}/>
          ))
        )}
      </div>

    </div>
  );
};

export default QuadroKanban;