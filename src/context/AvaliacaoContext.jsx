import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

import {
    createAvaliacao as apiCreateAvaliacao,
    getAllAvaliacoes as apiGetAllAvaliacoes,
    getAvaliacao as apiGetAvaliacao,
    updateAvaliacao as apiUpdateAvaliacao,
    deleteAvaliacao as apiDeleteAvaliacao,
    moveCard as apiMoveCard,
    exportarImagens as apiExportarImagens,
    exportarDocumentos as apiExportarDocumentos
} from "../services/avaliacaoService";

import { useAuth } from "./AuthContext";

export const AvaliacaoContext = createContext(null);

export const AvaliacaoProvider = ({ children }) => {
    const { user, loadingAuth, updateActivity } = useAuth();

    const [avaliacoes, setAvaliacoes] = useState();
    const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
    const [loadingAvaliacao, setLoadingAvaliacao] = useState(false);

    const [busca, setBusca] = useState("");
    const [periodo, setPeriodo] = useState("15");

    const getToken = async () => {
    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    return await user.getIdToken();
    };

    const fetchAvaliacoes = async () => {
        setLoadingAvaliacao(true);

        try {
            const token = await getToken();

            const response = await apiGetAllAvaliacoes(token);

            setAvaliacoes(response);
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            throw error;
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const fetchAvaliacao = async (id) => {
        setLoadingAvaliacao(true);

        try {
            const token = await getToken();

            const response = await apiGetAvaliacao(id, token);

            setAvaliacaoSelecionada(response);
        } catch (error) {
            console.error("Erro ao buscar avaliação:", error);
            throw error;
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const createAvaliacao = async (dados) => {
        setLoadingAvaliacao(true);
     
        try {
            const token = await getToken();
     
            updateActivity();
     
            const novaAvaliacao = await apiCreateAvaliacao(dados, token);
     
            setAvaliacoes((prev) => [novaAvaliacao, ...prev]);
     
            if (novaAvaliacao.pendenteRemovido) {
                toast.info(
                    "Já havia dados pra essa matrícula — a avaliação foi direto em Fazendo."
                );
            }
     
            return novaAvaliacao;
        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            throw error;
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const updateAvaliacao = async (id, dados) => {
        setLoadingAvaliacao(true);

        try {
            const token = await getToken();

            updateActivity();

            const avaliacaoAtualizada = await apiUpdateAvaliacao(
            id,
            dados,
            token
            );

            setAvaliacoes((prev) =>
            prev.map((item) =>
                item.id === id ? avaliacaoAtualizada : item
            )
            );

            if (
            avaliacaoSelecionada &&
            avaliacaoSelecionada.id === id
            ) {
            setAvaliacaoSelecionada(avaliacaoAtualizada);
            }

            return avaliacaoAtualizada;
        } catch (error) {
            console.error("Erro ao atualizar avaliação:", error);
            throw error;
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const deleteAvaliacao = async (id) => {
        setLoadingAvaliacao(true);

        try {
            const token = await getToken();

            updateActivity();

            await apiDeleteAvaliacao(id, token);

            setAvaliacoes((prev) =>
            prev.filter((item) => item.id !== id)
            );

            if (
            avaliacaoSelecionada &&
            avaliacaoSelecionada.id === id
            ) {
            setAvaliacaoSelecionada(null);
            }
        } catch (error) {
            console.error("Erro ao deletar avaliação:", error);
            throw error;
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const moveCard = async (id, dados) => {
        let estadoAnterior;
 
        setAvaliacoes((prev) => {
          estadoAnterior = prev;
 
          const item = prev.find((i) => i.id === id);
          if (!item) return prev;
 
          const semItem = prev.filter((i) => i.id !== id);
 
          // Reordena localmente igual o backend faria com updatedAt DESC:
          // o card recém-movido vai pro topo da lista.
          const itemAtualizado = {
            ...item,
            ...dados,
            updatedAt: new Date().toISOString(),
          };
 
          return [itemAtualizado, ...semItem];
        });
 
        try {
          const token = await getToken();
 
          updateActivity();
 
          await apiMoveCard(id, dados, token);
        } catch (error) {
          setAvaliacoes(estadoAnterior);
 
          console.error("Erro ao mover card:", error);
          throw error;
        }
    };

    const exportarImagens = async (dadosExportacao) => {
        setLoadingAvaliacao(true);
    
        try {
            const token = await getToken();
    
            updateActivity();
    
            const blob = await apiExportarImagens(
                dadosExportacao,
                token
            );
    
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement("a");
            link.href = url;
            link.download = `Imagens_${dadosExportacao.avaliacaoMat}_${dadosExportacao.avaliacaoNome}.docx`;
    
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("Erro ao exportar imagens:", error);
            throw error;
    
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const exportarDocumentos = async (doc) => {
        setLoadingAvaliacao(true);
    
        try {
            const token = await getToken();
    
            updateActivity();
    
            const blob = await apiExportarDocumentos(doc.id, token);
    
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement("a");
            link.href = url;
            link.download = `${doc.nome}.docx`;
    
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("Erro ao exportar documentos:", error);
            throw error;
    
        } finally {
            setLoadingAvaliacao(false);
        }
    };

    const adicionarAvaliacaoLocal = (avaliacao) => {
        setAvaliacoes((prev) => [avaliacao, ...(prev || [])]);
    };

    const avaliacoesFiltradas = useMemo(() => {
        let lista = avaliacoes || [];
       
        if (busca.trim()) {
          const termo = busca.trim().toLowerCase();
          lista = lista.filter(
            (item) =>
              item.proprietario?.toLowerCase().includes(termo) ||
              String(item.matricula).toLowerCase().includes(termo) ||
              item.cidade?.toLowerCase().includes(termo) || 
              item.estado?.toLowerCase().includes(termo) ||
              item.proprietario?.toLowerCase().includes(termo)
          );
        }
       
        if (periodo !== "todos") {
          const dias = Number(periodo);
          const limite = new Date();
          limite.setDate(limite.getDate() - dias);
       
          lista = lista.filter((item) => {
            if (!item.updatedAt) return true; // sem data, não filtra fora
            return new Date(item.updatedAt) >= limite;
          });
        }
       
        return lista;
      }, [avaliacoes, busca, periodo]);
 

    useEffect(() => {
    if (!loadingAuth && user) {
        fetchAvaliacoes();
    }
    }, [loadingAuth, user]);

    const value = {
    avaliacoes,
    avaliacaoSelecionada,

    loadingAvaliacao,

    fetchAvaliacoes,
    fetchAvaliacao,

    createAvaliacao,
    updateAvaliacao,
    deleteAvaliacao,

    moveCard,

    exportarImagens,
    exportarDocumentos,

    adicionarAvaliacaoLocal,
    avaliacoesFiltradas,

    setBusca,
    busca,
    setPeriodo,
    periodo
    };

    return (
    <AvaliacaoContext.Provider value={value}>
        {children}
    </AvaliacaoContext.Provider>
    );
};

export const useAvaliacao = () => {
    const context = useContext(AvaliacaoContext);

    if (!context) {
    throw new Error(
        "useAvaliacao deve ser usado dentro de um AvaliacaoProvider"
    );
    }

    return context;
};