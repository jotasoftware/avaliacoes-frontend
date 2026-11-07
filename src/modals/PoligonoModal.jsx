import React, { useState, useEffect } from "react";
import CampoForm from "../components/campoForm/CampoForm";
import { toast } from "react-toastify";
import { useFerramentas } from "../context/FerramentaContext";
import { verificarCodigo } from "../utils/validators";

const PoligonoModal = ({ open, onClose, tipo }) => {
  const { gerarPoligonoCar, gerarPoligonoIncra, loadingFerramenta } =
    useFerramentas();

  const [car, setCar] = useState("");
  const [incra, setIncra] = useState("");

  useEffect(() => {
    if (open) {
      setCar("");
      setIncra("");
    }
  }, [open, tipo]);

  if (!open) return null;

  const handleEnviar = async () => {
    try {
      if (tipo === "car") {
        const codigo = verificarCodigo("CAR", car);
        if (!codigo) return;
        await gerarPoligonoCar(car.trim());
      } else if (tipo === "incra") {
        const codigo = verificarCodigo("INCRA", incra);
        if (!codigo) return;
        await gerarPoligonoIncra(incra.trim());
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
            {tipo === "car" ? "Polígono com CAR" : "Polígono com INCRA/SIGEF"}
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
          ) : <CampoForm
            label="INCRA"
            value={incra}
            onChange={setIncra}
            placeholder="Digite o código do INCRA/SIGEF"
          />}
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