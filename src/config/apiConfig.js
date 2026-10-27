const URL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
    avaliacao: {
        create: `${URL}/avaliacao`,
        getAll: `${URL}/avaliacao`,
        update: `${URL}/avaliacao`,
        getById: `${URL}/avaliacao`,
        delete: `${URL}/avaliacao`,
        moveCard: `${URL}/avaliacao`,
        exportarImagens: `${URL}/download/imagens`,
        exportarDocumento: `${URL}/download/documento`,
    },
    ferramentas: {
        poligonoCar: `${URL}/download/front/car`,
        poligonoDocumento: `${URL}/download/documento`,
    },
    pendentes: {
        getAll: `${URL}/pendente`,
        completar: `${URL}/pendente`,
        descartar: `${URL}/pendente`,
    },
    categorias: {
        create: `${URL}/categoria`,
        getAll: `${URL}/categoria`,
        delete: `${URL}/categoria`,
    },
}