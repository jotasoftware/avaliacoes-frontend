import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { getAllPendentes, completarPendente, descartarPendente } from "../services/pendenteService";
import { useAuth } from "./AuthContext";
import { useAvaliacao } from "./AvaliacaoContext";

const PendentesContext = createContext();

export const PendentesProvider = ({ children }) => {
  const { user } = useAuth();
  const { fetchAvaliacoes } = useAvaliacao();
 
  const [pendentes, setPendentes] = useState([]);
  const [loadingPendentes, setLoadingPendentes] = useState(false);
 
  const getToken = async () => {
    if (!user) throw new Error("Usuário não autenticado");
    return await user.getIdToken();
  };
 
  const fetchPendentes = useCallback(async () => {
    setLoadingPendentes(true);
    try {
      const token = await getToken();
      const dados = await getAllPendentes(token);
      setPendentes(dados || []);
    } catch (error) {
      toast.error(error.message || "Erro ao buscar pendentes");
    } finally {
      setLoadingPendentes(false);
    }
  }, [user]);
 
  const completar = async (id, dados) => {
    try {
      const token = await getToken();
      const cardCriado = await completarPendente(id, dados, token);
 
      toast.success("Avaliação criada com sucesso");
      setPendentes((prev) => prev.filter((p) => p.id !== id));
 
      // Busca a lista atualizada do backend em vez de tentar adivinhar
      // a posição certa no array local -> garante a ordem correta sempre.
      await fetchAvaliacoes();
 
      return cardCriado;
    } catch (error) {
      toast.error(error.message || "Erro ao completar avaliação");
      throw error;
    }
  };
 
  const descartar = async (id) => {
    try {
      const token = await getToken();
      await descartarPendente(id, token);
      setPendentes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error(error.message || "Erro ao descartar pendente");
      throw error;
    }
  };
 
  return (
    <PendentesContext.Provider
      value={{
        pendentes,
        loadingPendentes,
        fetchPendentes,
        completar,
        descartar,
      }}
    >
      {children}
    </PendentesContext.Provider>
  );
};
 
export const usePendentes = () => useContext(PendentesContext);
 