import React from "react";

/**
 * Card clicável de uma ferramenta. Quem decide o que acontece ao clicar
 * é o componente pai, via prop `onClick` (abrir modal, navegar, etc).
 *
 * Props:
 * - titulo: string
 * - descricao: string
 * - icone: componente de ícone (ex: de react-icons), recebido como referência, não JSX
 * - onClick: () => void
 */
const FerramentaCard = ({ titulo, descricao, icone: Icone, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        flex
        items-start
        gap-4
        text-left
        border
        border-zinc-200
        rounded-xl
        p-5
        transition
        hover:border-zinc-400
        hover:bg-zinc-50
      "
    >
      <div
        className="
          flex
          items-center
          justify-center
          h-10
          w-10
          rounded-lg
          bg-zinc-100
          text-zinc-700
          shrink-0
        "
      >
        {Icone && <Icone size={20} />}
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-800">
          {titulo}
        </p>

        <p className="text-xs text-zinc-500 mt-1">
          {descricao}
        </p>
      </div>
    </button>
  );
};

export default FerramentaCard;