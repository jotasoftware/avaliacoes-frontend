import React from "react";
import { useAvaliacao } from "../context/AvaliacaoContext";
import { toast } from "react-toastify";


const ConfirmDeleteAvaliacaoModal = ({
  open,
  onClose,
  avaliacao,
  // Props opcionais pra reaproveitar esse modal em outras ações:
  titulo,
  mensagem,
  avisoExtra = "A pasta no Drive também será removida. Essa ação não poderá ser desfeita.",
  labelConfirmar = "Excluir",
  mensagemSucesso = "Avaliação removida",
  onConfirm: onConfirmProp,
}) => {
  if (!open) return null;

  const { deleteAvaliacao } = useAvaliacao();

  const mensagemPadrao = avaliacao ? (
    <>
      Tem certeza que deseja excluir a avaliação de
      <span className="font-semibold text-gray-800">
        {" "}{avaliacao.proprietario}
      </span>
      ?
    </>
  ) : null;

  const onConfirm = async () => {
    try {
      if (onConfirmProp) {
        await onConfirmProp();
      } else {
        await deleteAvaliacao(avaliacao.id);
      }

      toast.info(mensagemSucesso);

      onClose();
    } catch (error) {
      toast.error(
        error.message || "Erro ao excluir"
      );
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6">

        {titulo && (
          <h3 className="font-semibold text-gray-800 mb-2">{titulo}</h3>
        )}

        <p className="text-sm text-gray-600">
          {mensagem || mensagemPadrao}
        </p>

        <p className="text-sm text-red-600 mt-2">
          {avisoExtra}
        </p>


        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded border border-gray-300 
              text-gray-600 hover:bg-gray-100
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded bg-red-600 
              text-white hover:bg-red-700
            "
          >
            {labelConfirmar}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmDeleteAvaliacaoModal;