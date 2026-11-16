import React, { useEffect, useState } from "react";
import { useFerramentas } from "../context/FerramentaContext";
import { SWOT_QUADRANTES } from "../constants/swotItens";

const VAZIO = { forcas: [], fraquezas: [], oportunidades: [], ameacas: [] };

const SwotModal = ({ open, onClose }) => {
  const { gerarSwot, copiarSwot, loadingFerramenta } = useFerramentas();

  const [selecionados, setSelecionados] = useState(VAZIO);
  const [blob, setBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // libera a URL da imagem quando ela muda ou o modal fecha
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  const total = Object.values(selecionados).reduce((s, l) => s + l.length, 0);

  const limparResultado = () => {
    setBlob(null);
    setPreviewUrl(null);
  };

  const adicionar = (chave, valor) => {
    if (!valor) return;
    setSelecionados((prev) => ({ ...prev, [chave]: [...prev[chave], valor] }));
    limparResultado();
  };

  const remover = (chave, valor) => {
    setSelecionados((prev) => ({
      ...prev,
      [chave]: prev[chave].filter((v) => v !== valor),
    }));
    limparResultado();
  };

  const handleGerar = async () => {
    try {
      const png = await gerarSwot(selecionados);
      setBlob(png);
      setPreviewUrl(URL.createObjectURL(png));
      await copiarSwot(png);
    } catch {
    }
  };

  const handleFechar = () => {
    setSelecionados(VAZIO);
    limparResultado();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={handleFechar}
    >
      <div
        className="
          w-full max-w-4xl max-h-[92vh] overflow-y-auto
          bg-white rounded-xl border border-zinc-200 shadow-sm p-8
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-xl font-semibold text-zinc-800">Análise SWOT</h1>

          <button
            onClick={handleFechar}
            className="text-zinc-500 hover:text-zinc-800 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SWOT_QUADRANTES.map((q) => {
            const escolhidos = selecionados[q.chave];
            const disponiveis = q.itens.filter((i) => !escolhidos.includes(i));

            return (
              <div
                key={q.chave}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 overflow-hidden"
              >
                <div
                  className="px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: q.cor }}
                >
                  {q.titulo}
                </div>

                <div className="flex flex-col gap-3 px-4 pb-4">
                  <select
                    value=""
                    onChange={(e) => adicionar(q.chave, e.target.value)}
                    disabled={disponiveis.length === 0}
                    className="
                      w-full text-sm text-gray-700 outline-none
                      px-2 py-2 rounded-xl bg-zinc-100
                      focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700
                      disabled:opacity-50
                    "
                  >
                    <option value="" disabled>
                      {disponiveis.length === 0 ? "Todos adicionados" : "Adicionar item"}
                    </option>

                    {disponiveis.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  {escolhidos.length === 0 ? (
                    <p className="text-xs text-zinc-500">Nenhum item marcado</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {escolhidos.map((item) => (
                        <li
                          key={item}
                          className="
                            flex items-start justify-between gap-3
                            border border-zinc-200 rounded-lg px-3 py-2
                          "
                        >
                          <span className="text-sm text-zinc-800">{item}</span>

                          <button
                            onClick={() => remover(q.chave, item)}
                            className="shrink-0 text-zinc-400 hover:text-zinc-800 leading-none"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {previewUrl && (
          <div className="mt-6 flex flex-col gap-3">
            <img
              src={previewUrl}
              alt="SWOT gerado"
              className="w-full rounded-lg border border-zinc-200"
            />
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleGerar}
            disabled={loadingFerramenta || total === 0}
            className="
              px-6 py-3 text-sm text-white font-medium transition
              bg-zinc-700 rounded-lg hover:bg-zinc-800
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:bg-zinc-700
              flex items-center justify-center gap-2
            "
          >
            {loadingFerramenta && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loadingFerramenta ? "Gerando..." : previewUrl ? "Gerar novamente" : "Gerar imagem"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwotModal;