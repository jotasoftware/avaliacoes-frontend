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

export const createAvaliacao = async (payload, token) => {
  try {
    const { data } = await api.post(
      API_CONFIG.avaliacao.create,
      payload,
      {
        headers: getHeaders(token),
      }
    );

    return data;
  } catch (error) {
    tratarErro(error, "Erro ao criar avaliação");
  }
};

export const getAllAvaliacoes = async (token) => {
  try {
    const { data } = await api.get(
      API_CONFIG.avaliacao.getAll,
      {
        headers: getHeaders(token),
      }
    );

    return data;
  } catch (error) {
    tratarErro(error, "Erro ao buscar avaliações");
  }
};

export const getAvaliacao = async (id, token) => {
  try {
    const { data } = await api.get(
      `${API_CONFIG.avaliacao.getById}/${id}`,
      {
        headers: getHeaders(token),
      }
    );

    return data;
  } catch (error) {
    tratarErro(error, "Erro ao buscar avaliação");
  }
};

export const updateAvaliacao = async (id, payload, token) => {
  try {
    const { data } = await api.put(
      `${API_CONFIG.avaliacao.update}/${id}`,
      payload,
      {
        headers: getHeaders(token),
      }
    );

    return data;
  } catch (error) {
    tratarErro(error, "Erro ao atualizar avaliação");
  }
};

export const deleteAvaliacao = async (id, token) => {
  try {
    await api.delete(
      `${API_CONFIG.avaliacao.delete}/${id}`,
      {
        headers: getHeaders(token),
      }
    );
  } catch (error) {
    tratarErro(error, "Erro ao deletar avaliação");
  }
};

export const moveCard = async (id, dados, token) => {
  try {
    const { data } = await api.patch(
      `${API_CONFIG.avaliacao.moveCard}/${id}/status`,
      dados,
      {
        headers: getHeaders(token),
      }
    );

    return data;
  } catch (error) {
    tratarErro(error, "Erro ao mover card");
  }
};

export const exportarImagens = async (dadosExportacao, token) => {
  try {
    const response = await api.post(
      API_CONFIG.avaliacao.exportarImagens,
      dadosExportacao,
      {
        headers: getHeaders(token),
        responseType: "blob",
      }
    );

    return response.data;

  } catch (error) {
    tratarErro(error, "Erro ao exportar imagens");
  }
};

export const exportarDocumentos = async (id, token) => {
  try {
    const response = await api.post(
      `${API_CONFIG.avaliacao.exportarDocumento}/${id}`,
      {},
      {
        headers: getHeaders(token),
        responseType: "blob",
      }
    );

    return response.data;

  } catch (error) {
    tratarErro(error, "Erro ao exportar documentos");
  }
};

export const uploadDocumentos = async ({ files, matNumber, cidade, estado }, token, onProgress) => {
  try {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("matNumber", matNumber);
    form.append("cidade", cidade);
    form.append("estado", estado);

    const { data } = await api.post(
      API_CONFIG.avaliacao.uploadDocumentos,
      form,
      {
        headers: getHeaders(token),
        timeout: 0, 
        onUploadProgress: (e) => {
          if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total));
        },
      }
    );
    return data;
  } catch (error) {
    tratarErro(error, "Erro ao enviar documentos");
  }
};