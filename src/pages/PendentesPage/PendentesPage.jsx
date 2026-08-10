import React, { useEffect, useState } from "react";
import { usePendentes } from "../../context/PendenteContext";
import CriarAvaliacaoModal from "../../modals/CriarAvaliacaoModal";
import ConfirmDeleteAvaliacaoModal from "../../modals/ConfirmDeleteModal";
import Loading from "../../components/loading/Loading";
import { IoAlertCircleOutline, IoArrowForward, IoTrashOutline } from "react-icons/io5";

// Mesma lógica usada no CardKanban, pra manter consistência de texto.
function formatarTempoRelativo(dataString) {
  if (!dataString) return null;

  const data = new Date(dataString);
  const agora = new Date();
  const diffMs = agora - data;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffHoras < 24) return `há ${diffHoras}h`;
  if (diffDias === 1) return "há 1 dia";
  return `há ${diffDias} dias`;
}

const PendentesPage = () => {
  const { pendentes, loadingPendentes, fetchPendentes, descartar } = usePendentes();

  const [modalOpen, setModalOpen] = useState(false);
  const [pendenteSelecionado, setPendenteSelecionado] = useState(null);

  const [openDescartar, setOpenDescartar] = useState(false);
  const [pendenteDescartar, setPendenteDescartar] = useState(null);

  useEffect(() => {
    fetchPendentes();
  }, []);

  const abrirModal = (pendente) => {
    setPendenteSelecionado(pendente);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setPendenteSelecionado(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
        <h1 className="text-xl font-semibold text-zinc-800 mb-6">
          Pendentes
        </h1>

        {loadingPendentes ? (
          <div className="w-full flex justify-center py-10">
            <Loading />
          </div>
        ) : pendentes.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">
            Nenhuma avaliação pendente
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendentes.map((pendente) => (
              <div
                key={pendente.id}
                onClick={() => abrirModal(pendente)}
                className="
                  group
                  text-left
                  bg-white
                  border border-zinc-200
                  rounded-xl
                  p-5
                  shadow-sm
                  transition-all
                  duration-150
                  hover:shadow-md
                  hover:border-zinc-300
                  hover:-translate-y-[2px]
                  cursor-pointer
                "
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-semibold text-zinc-800">
                    Matrícula {pendente.matricula}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span
                      className="
                        inline-flex items-center gap-1
                        text-[11px] font-medium
                        px-2 py-0.5
                        rounded-full
                        border
                        bg-amber-50 text-amber-700 border-amber-200
                      "
                    >
                      <IoAlertCircleOutline size={12} />
                      Pendente
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendenteDescartar(pendente);
                        setOpenDescartar(true);
                      }}
                      className="
                        w-6 h-6
                        rounded-full
                        bg-zinc-100
                        hover:bg-red-100
                        text-zinc-400
                        hover:text-red-600
                        flex items-center justify-center
                        transition
                        opacity-0
                        group-hover:opacity-100
                      "
                    >
                      <IoTrashOutline size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Local</span>
                  <span className="font-medium text-zinc-800">
                    {pendente.cidade} - {pendente.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                  <span className="text-xs text-zinc-500">
                    Criado {formatarTempoRelativo(pendente.createdAt)}
                  </span>

                  <span
                    className="
                      flex items-center gap-1
                      text-xs font-medium
                      text-zinc-700
                      group-hover:text-zinc-900
                      group-hover:gap-1.5
                      transition-all
                    "
                  >
                    Completar
                    <IoArrowForward size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CriarAvaliacaoModal
        open={modalOpen}
        onClose={fecharModal}
        pendente={pendenteSelecionado}
      />

      <ConfirmDeleteAvaliacaoModal
        open={openDescartar}
        onClose={() => setOpenDescartar(false)}
        titulo="Descartar pendente"
        mensagem={
          pendenteDescartar && (
            <>
              Tem certeza que deseja descartar o pendente da matrícula
              <span className="font-semibold text-gray-800">
                {" "}{pendenteDescartar.matricula}
              </span>
              ?
            </>
          )
        }
        avisoExtra="A pasta no Drive também será removida. Essa ação não poderá ser desfeita."
        labelConfirmar="Descartar"
        mensagemSucesso="Pendente descartado"
        onConfirm={() => descartar(pendenteDescartar.id)}
      />
    </div>
  );
};

export default PendentesPage;