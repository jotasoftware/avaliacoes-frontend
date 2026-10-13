import React, { useState, useEffect } from "react";
import CampoForm from "../components/campoForm/CampoForm";
import SelectForm from "../components/selectForm/SelectForm";
import { toast } from "react-toastify";
import { useAvaliacao } from "../context/AvaliacaoContext";
import { usePendentes } from "../context/PendenteContext";

const CriarAvaliacaoModal = ({
  open,
  onClose,
  avaliacaoEdit,
  pendente,
}) => {
  if (!open) return null;

  const {
    createAvaliacao,
    updateAvaliacao
  } = useAvaliacao();

  const { completar } = usePendentes();

  const initialState = {
    matricula: "",
    cidade: "",
    estado: "",
    proprietario: "",
    tipo: "",
    status: "entrada",
    ordem: 0,
  };


  const [avaliacao, setAvaliacao] = useState(initialState);
  const [salvando, setSalvando] = useState(false);

  // matrícula/cidade/estado vêm preenchidos do Pendente, mas o usuário
  // pode editar antes de confirmar (ex: corrigir erro de digitação do bot).


  useEffect(() => {
    if (pendente) {
      setAvaliacao({
        matricula: pendente.matricula || "",
        cidade: pendente.cidade || "",
        estado: pendente.estado || "",
        proprietario: "",
        tipo: "",
        status: "doing",
        ordem: 0,
      });
    } else if (avaliacaoEdit) {
      setAvaliacao({
        matricula: avaliacaoEdit.matricula || "",
        cidade: avaliacaoEdit.cidade || "",
        estado: avaliacaoEdit.estado || "",
        proprietario: avaliacaoEdit.proprietario || "",
        tipo: avaliacaoEdit.tipo || "",
        status: avaliacaoEdit.status || "todo",
        ordem: avaliacaoEdit.ordem || 0,
      });
    } else {
      setAvaliacao(initialState);
    }
  }, [avaliacaoEdit, pendente, open]);


  const onChangeAvaliacao = (campo, valor) => {
    setAvaliacao((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };


  const limparAvaliacao = () => {
    setAvaliacao(initialState);
  };


  const validarTudo = (obj) => {
    console.log(obj)
    return Object.entries(obj)
      .filter(([chave]) => 
        chave !== "status" && chave !== "ordem"
      )
      .every(
        ([, valor]) => valor !== "" && valor !== null
      );
  };


  const salvarAvaliacao = async () => {

    if (!validarTudo(avaliacao)) {
      toast.warn("Existem campos não preenchidos");
      return;
    }

    setSalvando(true);

    try {

      if (pendente) {
        // Completa o Pendente — manda também matricula/cidade/estado,
        // já que agora podem ter sido editados nesse modal.
        await completar(pendente.id, {
          matricula: avaliacao.matricula,
          cidade: avaliacao.cidade,
          estado: avaliacao.estado,
          proprietario: avaliacao.proprietario,
          tipo: avaliacao.tipo,
        });

        toast.info("Avaliação criada com sucesso");

      } else {

        const dados = {
          ...avaliacao,
        };

        if (avaliacaoEdit) {
          await updateAvaliacao(avaliacaoEdit.id, dados);
          toast.info("Avaliação atualizada com sucesso");
        } else {
          await createAvaliacao(dados);
          toast.info("Avaliação criada com sucesso");
        }
      }

      limparAvaliacao();
      onClose();

    } catch (error) {
      toast.error(
        error.message || "Erro ao salvar avaliação"
      );
    } finally {
      setSalvando(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-xl shadow-lg p-6">


        <div className="mb-5">
          <h2 className="font-semibold text-medium text-zinc-700">
            {pendente
              ? "Completar avaliação"
              : avaliacaoEdit
                ? "Editar avaliação"
                : "Nova avaliação"
            }
          </h2>
        </div>


        <div className="flex flex-col gap-4">

          <CampoForm
            label="Matrícula"
            value={avaliacao.matricula}
            onChange={(v) =>
              onChangeAvaliacao("matricula", v)
            }
            placeholder="Digite a matrícula"
          />


          <div className="flex gap-4">

            <div className="flex-[3]">
              <CampoForm
                label="Cidade"
                value={avaliacao.cidade}
                onChange={(v) =>
                  onChangeAvaliacao("cidade", v)
                }
                placeholder="Digite a cidade"
              />
            </div>


            <div className="flex-1">
              <SelectForm
                label="Estado"
                value={avaliacao.estado}
                onChange={(v) =>
                  onChangeAvaliacao("estado", v)
                }
                options={[
                  { id: "BA", nome: "Bahia" },
                  { id: "GO", nome: "Goiás" },
                  { id: "MT", nome: "Mato Grosso" },
                  { id: "MS", nome: "Mato Grosso do Sul" },
                  { id: "MG", nome: "Minas Gerais" },
                  { id: "SP", nome: "São Paulo" },
                  { id: "TO", nome: "Tocantins" },
                ]}
                placeholder="Selecione o estado"
              />
            </div>

          </div>


          <CampoForm
            label="Nome do Proprietário"
            value={avaliacao.proprietario}
            onChange={(v) =>
              onChangeAvaliacao("proprietario", v)
            }
            placeholder="Digite o nome do proprietário"
          />


          <SelectForm
            label="Tipo"
            value={avaliacao.tipo}
            onChange={(v) =>
              onChangeAvaliacao("tipo", v)
            }
            options={[
              { id: "rural", nome: "Rural" },
              { id: "urbano", nome: "Urbano" },
            ]}
            placeholder="Selecione o tipo"
          />

        </div>


        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            disabled={salvando}
            className="px-4 py-2 rounded border border-gray-300 text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Cancelar
          </button>


          <button
            onClick={salvarAvaliacao}
            disabled={salvando}
            className="px-4 py-2 rounded text-white bg-zinc-700 hover:bg-zinc-900 disabled:opacity-50 flex items-center gap-2"
          >
            {salvando && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {salvando
              ? "Salvando..."
              : pendente
                ? "Criar avaliação"
                : avaliacaoEdit
                  ? "Editar"
                  : "Salvar"
            }
          </button>

        </div>

      </div>

    </div>
  );
};

export default CriarAvaliacaoModal;