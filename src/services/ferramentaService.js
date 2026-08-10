import { API_CONFIG } from "../config/apiConfig";
import api from "../config/apiClient";

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Quando a request usa responseType: "blob", um erro do backend
// (ex: {error: "mensagem"}) chega como um Blob, não como JSON já parseado.
// Essa função converte esse blob de volta em objeto, se possível.
const extrairErroDoBlob = async (error) => {
  const data = error?.response?.data;

  if (data instanceof Blob) {
    try {
      const texto = await data.text();
      return JSON.parse(texto);
    } catch {
      return null;
    }
  }

  return data;
};

const tratarErro = async (error, mensagem) => {
  const dadosErro = await extrairErroDoBlob(error);

  console.error(mensagem, dadosErro || error.message);

  throw new Error(
    dadosErro?.error ||
    dadosErro?.message ||
    mensagem
  );
};

export const enviarPoligonoCar = async (car, token) => {
  try {
    const response = await api.post(
      API_CONFIG.ferramentas.poligonoCar,
      { car },
      {
        headers: getHeaders(token),
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    await tratarErro(error, "Erro ao gerar polígono pelo CAR");
  }
};

export const enviarPoligonoDocumento = async (arquivo, token) => {
  try {
    const formData = new FormData();
    formData.append("documento", arquivo);

    const response = await api.post(
      API_CONFIG.ferramentas.poligonoDocumento,
      formData,
      {
        headers: {
          ...getHeaders(token),
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    await tratarErro(error, "Erro ao gerar polígono pelo documento");
  }
};