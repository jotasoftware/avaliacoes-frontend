import { API_CONFIG } from "../config/apiConfig";
import api from "../config/apiClient";

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const tratarErro = (error, mensagem) => {
  console.error(mensagem, error.response?.data || error.message);
  throw new Error(
    error.response?.data?.error ||
    error.response?.data?.message ||
    mensagem
  );
};

// Ajuste API_CONFIG.pendentes.getAll / completar pra apontar
// pros endpoints reais (ex: "/pendentes" e "/pendentes").

export const getAllPendentes = async (token) => {
  try {
    const { data } = await api.get(API_CONFIG.pendentes.getAll, {
      headers: getHeaders(token),
    });
    return data;
  } catch (error) {
    tratarErro(error, "Erro ao buscar pendentes");
  }
};

export const completarPendente = async (id, dados, token) => {
  try {
    const { data } = await api.post(
      `${API_CONFIG.pendentes.completar}/${id}/completar`,
      dados,
      { headers: getHeaders(token) }
    );
    return data;
  } catch (error) {
    tratarErro(error, "Erro ao completar avaliação pendente");
  }
};

export const descartarPendente = async (id, token) => {
  try {
    await api.delete(`${API_CONFIG.pendentes.descartar}/${id}`, {
      headers: getHeaders(token),
    });
  } catch (error) {
    tratarErro(error, "Erro ao descartar pendente");
  }
};