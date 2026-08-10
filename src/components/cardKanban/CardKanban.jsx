import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { PiHouseLine, PiTree } from "react-icons/pi";
import { IoImageOutline, IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


// Configuração visual por tipo — cor e ícone.
// Se aparecer um "tipo" novo que não está aqui, cai no default (cinza).
const TIPO_CONFIG = {
  rural: {
    label: "Rural",
    icon: PiTree,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  urbano: {
    label: "Urbano",
    icon: PiHouseLine,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const TipoBadge = ({ tipo }) => {
  const config = TIPO_CONFIG[tipo?.toLowerCase()] || {
    label: tipo || "—",
    icon: null,
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  const Icone = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1
        text-[11px] font-medium
        px-2 py-0.5
        rounded-full
        border
        capitalize
        ${config.className}
      `}
    >
      {Icone && <Icone size={12} />}
      {config.label}
    </span>
  );
};


// Calcula "há X dias/horas" a partir de um timestamp, e devolve também
// uma cor de alerta: recente = neutro, parado há muito tempo = chama atenção.
function formatarTempoRelativo(dataString) {
  if (!dataString) return null;

  const data = new Date(dataString);
  const agora = new Date();
  const diffMs = agora - data;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let texto;
  if (diffMin < 1) texto = "agora mesmo";
  else if (diffMin < 60) texto = `há ${diffMin} min`;
  else if (diffHoras < 24) texto = `há ${diffHoras}h`;
  else if (diffDias === 1) texto = "há 1 dia";
  else texto = `há ${diffDias} dias`;

  // Cor de alerta: mais de 7 dias parado chama atenção (amarelo),
  // mais de 15 dias fica mais forte (vermelho).
  let cor = "text-zinc-400";
  if (diffDias >= 15) cor = "text-red-500";
  else if (diffDias >= 7) cor = "text-yellow-600";

  return { texto, cor };
}


const CardKanban = ({
  id,
  cidade,
  estado,
  matricula,
  proprietario,
  tipo,
  onEdit,
  onDelete,
  status,
  avaliacao,
  updatedAt,
  // NOVO: opcionais — só aparecem se o backend/listagem já mandar esses dados.
  // quantidadeImagens: number, quantidadeDocumentos: number
  quantidadeImagens,
  quantidadeDocumentos,
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
        id,
        data: {
            id,
        },
        });

    const style = {
        transform: transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    const navigate = useNavigate();

    const tempoRelativo = formatarTempoRelativo(updatedAt);

    // Só mostra a linha de imagens/documentos se pelo menos um dos dois
    // vier definido (evita mostrar "0 / 0" pra todo mundo por padrão
    // enquanto o backend não fornecer essa contagem).
    const mostrarIndicadores =
      quantidadeImagens !== undefined || quantidadeDocumentos !== undefined;

    return (
        <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="
            group
            bg-white
            border border-zinc-200
            rounded-xl
            p-4
            shadow-sm
            cursor-grab
            active:cursor-grabbing
            transition-all
            duration-150
            hover:shadow-md
            hover:border-zinc-300
            hover:-translate-y-[2px]
        "
        onClick={() => {
            if (status === "doing") {
            navigate("/avaliacao", {
                state: {
                avaliacao,
                },
            });
            return;
            }
        }}
        >

        <div className="flex justify-between items-start mb-3">

            <div>
            <h3 className="text-sm font-semibold text-zinc-800">
                {proprietario}
            </h3>

            <div className="mt-1.5">
                <TipoBadge tipo={tipo} />
            </div>
            </div>

            <div
            className="
                flex gap-2
                opacity-0
                group-hover:opacity-100
                transition-opacity
            "
            >
            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                }}
                className="
                w-7 h-7
                rounded-full
                bg-zinc-100
                hover:bg-yellow-100
                text-zinc-600
                hover:text-yellow-700
                flex items-center justify-center
                transition
                "
            >
                <MdOutlineEdit size={15} />
            </button>

            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                }}
                className="
                w-7 h-7
                rounded-full
                bg-zinc-100
                hover:bg-red-100
                text-zinc-600
                hover:text-red-600
                flex items-center justify-center
                transition
                "
            >
                <MdDelete size={15} />
            </button>
            </div>

        </div>

        <div className="space-y-2">

            <div className="flex justify-between text-sm">
            <span className="text-zinc-500">
                Matrícula
            </span>

            <span className="font-medium text-zinc-800">
                {matricula}
            </span>
            </div>

            <div className="flex justify-between text-sm">
            <span className="text-zinc-500">
                Local
            </span>

            <span className="font-medium text-zinc-800">
                {cidade} - {estado}
            </span>
            </div>

        </div>

        {mostrarIndicadores && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-zinc-100">
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <IoImageOutline size={14} />
              {quantidadeImagens ?? 0}
            </div>

            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <IoDocumentTextOutline size={14} />
              {quantidadeDocumentos ?? 0}
            </div>
          </div>
        )}

        {tempoRelativo && (
          <p className={`text-[11px] mt-2 ${tempoRelativo.cor}`}>
            Editado {tempoRelativo.texto}
          </p>
        )}

        </div>
    );
};

export default CardKanban;