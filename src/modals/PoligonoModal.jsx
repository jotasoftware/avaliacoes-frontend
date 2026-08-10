import React, { useState, useEffect } from "react";
import CampoForm from "../components/campoForm/CampoForm";
import { toast } from "react-toastify";
import { useFerramentas } from "../context/FerramentaContext";

/**
 * Modal genérico das ferramentas de polígono.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - tipo: "car" | "documento" — define qual campo mostrar e qual função chamar
 */
const PoligonoModal = ({ open, onClose, tipo }) => {
  const { gerarPoligonoCar, gerarPoligonoDocumento, loadingFerramenta } =
    useFerramentas();

  const [car, setCar] = useState("");
  const [arquivo, setArquivo] = useState(null);

  useEffect(() => {
    if (open) {
      setCar("");
      setArquivo(null);
    }
  }, [open, tipo]);

  if (!open) return null;

  const handleArquivoChange = (e) => {
    const file = e.target.files?.[0];
    setArquivo(file || null);
  };

  const handleEnviar = async () => {
    try {
      if (tipo === "car") {
        if (!car.trim()) {
          toast.warn("Informe o número do CAR");
          return;
        }

        await gerarPoligonoCar(car.trim());
      } else {
        if (!arquivo) {
          toast.warn("Selecione um documento");
          return;
        }

        await gerarPoligonoDocumento(arquivo);
      }

      onClose();
    } catch {
      // erro já tratado (toast) dentro do context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-medium text-zinc-700">
            {tipo === "car" ? "Polígono com CAR" : "Polígono com Documento"}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {tipo === "car" ? (
            <CampoForm
              label="CAR"
              value={car}
              onChange={setCar}
              placeholder="Digite o código do CAR"
            />
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Documento</label>

              <label
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  border-2
                  border-dashed
                  border-zinc-300
                  rounded-lg
                  py-8
                  cursor-pointer
                  hover:bg-zinc-50
                  transition
                "
              >
                <span className="text-sm text-zinc-500">
                  {arquivo
                    ? arquivo.name
                    : "Clique para selecionar um arquivo"}
                </span>

                <input
                  type="file"
                  className="hidden"
                  onChange={handleArquivoChange}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loadingFerramenta}
            className="
              px-4 py-2 rounded border border-gray-300 text-zinc-700
              hover:bg-zinc-100
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Cancelar
          </button>

          <button
            onClick={handleEnviar}
            disabled={loadingFerramenta}
            className="
              px-4 py-2 rounded text-white bg-zinc-700
              hover:bg-zinc-900
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex items-center gap-2
            "
          >
            {loadingFerramenta && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loadingFerramenta ? "Baixando..." : "Baixar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoligonoModal;