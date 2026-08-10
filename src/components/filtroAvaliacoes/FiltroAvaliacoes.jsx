import React from "react";
import { useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useAvaliacao } from "../../context/AvaliacaoContext";
import { usePendentes } from "../../context/PendenteContext";

const FiltroAvaliacoes = () => {
  const location = useLocation();

  // Chama os dois hooks sempre (regra dos hooks), e decide qual
  // estado usar de acordo com a rota atual.
  const avaliacaoCtx = useAvaliacao();
  const pendentesCtx = usePendentes();

  const emPendentes = location.pathname.startsWith("/pendentes");
  const emHome = location.pathname === "/";

  if (!emHome && !emPendentes) {
    return null;
  }

  const { busca, setBusca, periodo, setPeriodo } = emPendentes
    ? pendentesCtx
    : avaliacaoCtx;

  return (
    <div className="flex gap-3 items-center">
      <div className="relative">
        <IoSearchOutline
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque aqui"
          className="
            pl-9 pr-3 py-2
            text-sm
            border border-zinc-300
            rounded-lg
            bg-white
            w-64
            text-black
          "
        />
      </div>

      <select
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
        className="
          text-sm
          border border-zinc-300
          rounded-lg
          px-3 py-2
          bg-white
          text-zinc-700
        "
      >
        <option value="15">Últimos 15 dias</option>
        <option value="30">Últimos 30 dias</option>
        <option value="60">Últimos 60 dias</option>
        <option value="todos">Tudo</option>
      </select>
    </div>
  );
};

export default FiltroAvaliacoes;