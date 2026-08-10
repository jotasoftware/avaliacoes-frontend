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

// Ajuste API_CONFIG.categorias.getAll / create / delete
// pra apontar pros endpoints reais (ex: "/categorias").

export const getAllCategorias = async (token) => {
  try {
    const { data } = await api.get(API_CONFIG.categorias.getAll, {
      headers: getHeaders(token),
    });
    return data;
  } catch (error) {
    tratarErro(error, "Erro ao buscar categorias");
  }
};

export const createCategoria = async (nome, token) => {
  try {
    const { data } = await api.post(
      API_CONFIG.categorias.create,
      { nome },
      { headers: getHeaders(token) }
    );
    return data;
  } catch (error) {
    tratarErro(error, "Erro ao criar categoria");
  }
};

export const deleteCategoria = async (id, token) => {
  try {
    await api.delete(`${API_CONFIG.categorias.delete}/${id}`, {
      headers: getHeaders(token),
    });
  } catch (error) {
    tratarErro(error, "Erro ao excluir categoria");
  }
};