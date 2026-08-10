import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAvaliacao } from "../../context/AvaliacaoContext";
import Loading from "../../components/loading/Loading";
import { toast } from "react-toastify";

const AvaliacaoDetalhePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {fetchAvaliacao, avaliacaoSelecionada, loadingAvaliacao, exportarImagens, exportarDocumentos} = useAvaliacao();
  
  const [imagensPorFolha, setImagensPorFolha] = useState({});
  const avaliacao = location.state?.avaliacao;
  const [tipoExportacao, setTipoExportacao] = useState("imagens");

  useEffect(() => {
    if (avaliacao?.id) {
      fetchAvaliacao(avaliacao.id);
    }
  }, [avaliacao]);
  
  
  useEffect(() => {
    if (!loadingAvaliacao && avaliacaoSelecionada) {
      console.log(avaliacaoSelecionada);
    }
  }, [loadingAvaliacao, avaliacaoSelecionada]);

  const handleExportar = () => {
    if(tipoExportacao=="imagens"){
      if (Object.keys(imagensPorFolha).length === 0) {
        toast.warn("Não há o que exportar");
        return;
      }
      const dadosExportacao = {
        avaliacaoId: avaliacao.id,
        imagens: imagensPorFolha
      };
      exportarImagens(dadosExportacao);
    }else{
      exportarDocumentos(avaliacaoSelecionada?.subpastas?.documentos?.id)
    }
  };


  if (!avaliacao) {
    return (
      <div className="w-full min-h-screen p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900"
        >
          <IoArrowBack size={22} />
          Voltar
        </button>

        <p className="mt-6 text-zinc-600">
          Avaliação não encontrada.
        </p>
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-zinc-100 p-4 flex flex-col gap-4">

      <div className="
        w-full
        bg-white
        rounded-xl
        border border-zinc-200
        shadow-sm
        p-8
      ">

        <div className="flex justify-between items-start mb-8">

          <div>
            <h1 className="
              text-xl
              font-semibold
              text-zinc-800
            ">
              Avaliação de {avaliacao.proprietario}
            </h1>

            <p className="text-sm text-zinc-500 mt-2">
              Matrícula: {avaliacao.matricula}
            </p>
          </div>


          <span
            className="
              px-4 py-2
              rounded-full
              bg-zinc-100
              text-sm
              font-medium
              text-zinc-700
              capitalize
            "
          >
            {
              avaliacao.status === "todo"
                ? "A fazer"
                : avaliacao.status === "doing"
                  ? "Fazendo"
                  : "Finalizado"
            }
          </span>

        </div>


        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        ">

          <div>
            <p className="text-sm text-zinc-500">
              Proprietário
            </p>

            <p className="font-medium text-zinc-800">
              {avaliacao.proprietario}
            </p>
          </div>


          <div>
            <p className="text-sm text-zinc-500">
              Matrícula
            </p>

            <p className="font-medium text-zinc-800">
              {avaliacao.matricula}
            </p>
          </div>


          <div>
            <p className="text-sm text-zinc-500">
              Tipo
            </p>

            <p className="font-medium text-zinc-800 capitalize">
              {avaliacao.tipo}
            </p>
          </div>


          <div>
            <p className="text-sm text-zinc-500">
              Cidade
            </p>

            <p className="font-medium text-zinc-800">
              {avaliacao.cidade}
            </p>
          </div>


          <div>
            <p className="text-sm text-zinc-500">
              Estado
            </p>

            <p className="font-medium text-zinc-800">
              {avaliacao.estado}
            </p>
          </div>


          <div>
            <p className="text-sm text-zinc-500">
              Tamanho
            </p>

            <p className="font-medium text-zinc-800">
              {avaliacao.tamanho}
            </p>
          </div>

        </div>


        {avaliacao.id_drive && (
          <div className="mt-8">

            <p className="text-sm text-zinc-500 mb-2">
              Documentos
            </p>

            <a
              href={`https://drive.google.com/drive/folders/${avaliacao.id_drive}`}
              target="_blank"
              rel="noreferrer"
              className="
                text-blue-600
                hover:underline
              "
            >
              Abrir Google Drive
            </a>

          </div>
        )}

      </div>
      
      <div className="
        w-full
        bg-white
        rounded-xl
        border border-zinc-200
        shadow-sm
        p-8
      ">

        <h1 className="
          text-xl
          font-semibold
          text-zinc-800
          mb-6
        ">
          Exportar
        </h1>


        <div className="
          flex
          w-full
          border
          border-zinc-200
          rounded-xl
          overflow-hidden
        ">

          <button
            onClick={() => setTipoExportacao("imagens")}
            className={`
              flex-1
              py-3
              text-sm
              font-medium
              transition
              border-r
              border-zinc-200
              ${
                tipoExportacao === "imagens"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }
            `}
          >
            Imagens
          </button>


          <button
            onClick={() => setTipoExportacao("documentos")}
            className={`
              flex-1
              py-3
              text-sm
              font-medium
              transition
              ${
                tipoExportacao === "documentos"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }
            `}
          >
            Documentos
          </button>

        </div>
        {tipoExportacao == "imagens" ? (
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
            {loadingAvaliacao ? (
              <div className="w-full flex justify-center py-10">
                <Loading />
              </div>
            ) : (
              <div className="flex flex-col">
                {avaliacaoSelecionada?.subpastas?.imagens?.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-6">
                    Nenhuma imagem encontrada
                  </p>
                ) : (
                  avaliacaoSelecionada?.subpastas?.imagens?.map((pasta) => (
                  <div
                    key={pasta.id}
                    className="
                      flex
                      items-center
                      justify-between
                      border
                      border-zinc-200
                      rounded-lg
                      p-3
                      mb-3
                    "
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-800">
                        {pasta.nome}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {pasta.quantidade} imagens
                      </p>
                    </div>
                    <select
                      className="
                        border
                        border-zinc-300
                        bg-zinc-100
                        text-black
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                      "
                      value={imagensPorFolha[pasta.id] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        setImagensPorFolha((prev) => {
                          const next = { ...prev };

                          if (value === "") {
                            // "Não exportar" selecionado -> remove essa pasta do state
                            delete next[pasta.id];
                          } else {
                            next[pasta.id] = Number(value);
                          }

                          return next;
                        });
                      }}
                    >
                      <option value="">Não exportar</option>
                      <option value={2}>2 imagens por folha</option>
                      <option value={3}>3 imagens por folha</option>
                      <option value={6}>6 imagens por folha</option>
                    </select>
                  </div>
                  ))
                )}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleExportar}
                    disabled={
                      loadingAvaliacao ||
                      Object.keys(imagensPorFolha).length === 0
                    }
                    className="
                      flex-1
                      py-3
                      text-sm
                      text-white
                      font-medium
                      transition
                      bg-zinc-700
                      rounded-lg
                      hover:bg-zinc-800
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      disabled:hover:bg-zinc-700
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {loadingAvaliacao && (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loadingAvaliacao ? "Exportando..." : "Exportar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
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
            {loadingAvaliacao ? (
              <div className="w-full flex justify-center py-10">
                <Loading />
              </div>
            ) : (
              <>
                {!avaliacaoSelecionada?.subpastas?.documentos?.quantidadePastas ? (
                  <p className="text-sm text-zinc-500 text-center py-6">
                    Nenhum documento encontrado
                  </p>
                ) : (
                  <p className="text-sm font-medium text-zinc-800 text-center py-6">
                    {avaliacaoSelecionada.subpastas.documentos.quantidadePastas}{" "}
                    {avaliacaoSelecionada.subpastas.documentos.quantidadePastas === 1
                      ? "documento encontrado"
                      : "documentos encontrados"}
                  </p>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleExportar}
                    disabled={
                      loadingAvaliacao ||
                      !avaliacaoSelecionada?.subpastas?.documentos?.quantidadePastas
                    }
                    className="
                      flex-1
                      py-3
                      text-sm
                      text-white
                      font-medium
                      transition
                      bg-zinc-700
                      rounded-lg
                      hover:bg-zinc-800
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      disabled:hover:bg-zinc-700
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {loadingAvaliacao && (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loadingAvaliacao ? "Exportando..." : "Exportar"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>

    
  );
};

export default AvaliacaoDetalhePage;