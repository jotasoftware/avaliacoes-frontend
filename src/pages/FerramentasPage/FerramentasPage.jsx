import React, { useState } from "react";
import { IoDocumentTextOutline, IoMapOutline, IoPricetagsOutline, IoLogoOctocat, IoPaperPlaneOutline } from "react-icons/io5";
import FerramentaCard from "../../components/ferramentasCard/FerramentasCard";
import PoligonoModal from "../../modals/PoligonoModal";
import CategoriasModal from "../../modals/CategoriasModal";

const TELEGRAM_BOT_URL = "https://web.telegram.org/k/#@avaliobot";

const ferramentas = [
  {
    id: "poligono-car",
    titulo: "Polígono com CAR",
    descricao: "Gere o polígono a partir do número do CAR.",
    icone: IoMapOutline,
    tipo: "car",
  },
//   {
//     id: "poligono-documento",
//     titulo: "Polígono com Documento",
//     descricao: "Gere o polígono a partir de um documento enviado.",
//     icone: IoDocumentTextOutline,
//     tipo: "documento",
//   },
  {
    id: "categorias",
    titulo: "Categorias de imagem",
    descricao: "Edite as categorias usadas pela IA pra classificar as fotos.",
    icone: IoPricetagsOutline,
    tipo: "categorias",
  },
  {
    id: "telegram-bot",
    titulo: "Bot do Telegram",
    descricao: "Abre o chat com o bot pra enviar imagens e documentos.",
    icone: IoPaperPlaneOutline,
    tipo: "telegram",
  },
];

const FerramentasPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState(null);

  const abrirModal = (tipo) => {
    if (tipo === "telegram") {
      window.open(TELEGRAM_BOT_URL, "_blank", "noopener,noreferrer");
      return;
    }

    setTipoModal(tipo);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setTipoModal(null);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-100 p-4 flex flex-col gap-4">
      <div
        className="
          w-full
          bg-white
          rounded-xl
          border border-zinc-200
          shadow-sm
          p-8
        "
      >
        <h1
          className="
            text-xl
            font-semibold
            text-zinc-800
            mb-6
          "
        >
          Ferramentas
        </h1>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >
          {ferramentas.map((ferramenta) => (
            <FerramentaCard
              key={ferramenta.id}
              titulo={ferramenta.titulo}
              descricao={ferramenta.descricao}
              icone={ferramenta.icone}
              onClick={() => abrirModal(ferramenta.tipo)}
            />
          ))}
        </div>
      </div>

      {(tipoModal === "car" || tipoModal === "documento") && (
        <PoligonoModal
          open={modalOpen}
          onClose={fecharModal}
          tipo={tipoModal}
        />
      )}

      {tipoModal === "categorias" && (
        <CategoriasModal open={modalOpen} onClose={fecharModal} />
      )}
    </div>
  );
};

export default FerramentasPage;