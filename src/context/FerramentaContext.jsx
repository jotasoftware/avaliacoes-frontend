import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  enviarPoligonoCar,
  enviarPoligonoDocumento,
} from "../services/ferramentaService";
import { useAuth } from "./AuthContext";

const FerramentasContext = createContext();

const dispararDownload = (blob, nomeArquivo) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const FerramentasProvider = ({ children }) => {

  const { user } = useAuth();

  const [loadingFerramenta, setLoadingFerramenta] = useState(false);
  const [resultadoPoligono, setResultadoPoligono] = useState(null);

  const getToken = async () => {
    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    return await user.getIdToken();
    };

  const gerarPoligonoCar = async (car) => {
    setLoadingFerramenta(true);

    try {
      const token = await getToken();
      const blob = await enviarPoligonoCar(car, token);

      dispararDownload(blob, `poligono_${car}.kml`);
      setResultadoPoligono(blob);
      toast.info("Polígono gerado com sucesso");

      return blob;
    } catch (error) {
      toast.error(error.message || "Erro ao gerar polígono pelo CAR");
      throw error;
    } finally {
      setLoadingFerramenta(false);
    }
  };

  const gerarPoligonoDocumento = async (arquivo) => {
    setLoadingFerramenta(true);

    try {
      const token = await getToken();
      const blob = await enviarPoligonoDocumento(arquivo, token);

      dispararDownload(blob, "poligono.kml");
      setResultadoPoligono(blob);
      toast.info("Polígono gerado com sucesso");

      return blob;
    } catch (error) {
      toast.error(error.message || "Erro ao gerar polígono pelo documento");
      throw error;
    } finally {
      setLoadingFerramenta(false);
    }
  };

  return (
    <FerramentasContext.Provider
      value={{
        loadingFerramenta,
        resultadoPoligono,
        gerarPoligonoCar,
        gerarPoligonoDocumento,
      }}
    >
      {children}
    </FerramentasContext.Provider>
  );
};

export const useFerramentas = () => useContext(FerramentasContext);