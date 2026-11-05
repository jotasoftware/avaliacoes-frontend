import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAvaliacao } from "../context/AvaliacaoContext";

const MAX_ARQUIVOS = 5;
const MAX_MB = 200;

const formatarTamanho = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const UploadDocumentoModal = ({ open, onClose, avaliacao, onSuccess }) => {
  const { enviarDocumentos } = useAvaliacao();

  const [arquivos, setArquivos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setArquivos([]);
      setProgresso(0);
      setEnviando(false);
      setArrastando(false);
    }
  }, [open]);

  if (!open) return null;

  const fechar = () => {
    if (!enviando) onClose();
  };

  const adicionarArquivos = (lista) => {
    const novos = [...lista];
    const aceitos = [];

    for (const f of novos) {
      const ehPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);

      if (!ehPdf) {
        toast.warn(`"${f.name}" não é um PDF`);
        continue;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.warn(`"${f.name}" passa de ${MAX_MB} MB`);
        continue;
      }
      aceitos.push(f);
    }

    setArquivos((prev) => {
      const todos = [...prev];
      for (const f of aceitos) {
        const repetido = todos.some((p) => p.name === f.name && p.size === f.size);
        if (!repetido) todos.push(f);
      }
      if (todos.length > MAX_ARQUIVOS) {
        toast.warn(`Máximo de ${MAX_ARQUIVOS} arquivos por envio`);
      }
      return todos.slice(0, MAX_ARQUIVOS);
    });
  };

  const removerArquivo = (index) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEnviar = async () => {
    if (!arquivos.length) {
      toast.warn("Selecione pelo menos um PDF");
      return;
    }

    setEnviando(true);
    setProgresso(0);

    try {
      await enviarDocumentos(
        {
          files: arquivos,
          matNumber: avaliacao.matricula,
          cidade: avaliacao.cidade,
          estado: avaliacao.estado,
        },
        setProgresso
      );

      toast.info("Documentos enviados com sucesso");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Erro ao enviar documentos");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={fechar} />

      <div className="relative bg-white w-full max-w-xl max-h-[94vh] overflow-y-auto rounded-xl shadow-lg p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-medium text-zinc-700">
            Adicionar documentos
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Matrícula {avaliacao?.matricula} — {avaliacao?.cidade}/{avaliacao?.estado}
          </p>
        </div>

        <div
          onClick={() => !enviando && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!enviando) setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastando(false);
            if (!enviando) adicionarArquivos(e.dataTransfer.files);
          }}
          className={`
            flex flex-col items-center justify-center gap-1
            rounded-lg border border-dashed px-4 py-8
            text-sm text-zinc-600 transition
            ${enviando ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-zinc-50"}
            ${arrastando ? "border-zinc-500 bg-zinc-50" : "border-zinc-300"}
          `}
        >
          <span className="font-medium">Clique ou arraste os PDFs aqui</span>
          <span className="text-xs text-zinc-500">
            Até {MAX_ARQUIVOS} arquivos de {MAX_MB} MB cada
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              adicionarArquivos(e.target.files);
              e.target.value = ""; // permite escolher o mesmo arquivo de novo
            }}
          />
        </div>

        {arquivos.length > 0 && (
          <ul className="flex flex-col gap-2 mt-4">
            {arquivos.map((f, i) => (
              <li
                key={`${f.name}-${f.size}`}
                className="flex items-center justify-between gap-3 border border-zinc-200 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 truncate">{f.name}</p>
                  <p className="text-xs text-zinc-500">{formatarTamanho(f.size)}</p>
                </div>

                <button
                  onClick={() => removerArquivo(i)}
                  disabled={enviando}
                  className="text-xs text-zinc-500 hover:text-zinc-800 disabled:opacity-50"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        {enviando && (
          <div className="mt-4">
            <div className="h-2 w-full rounded bg-zinc-200 overflow-hidden">
              <div
                className="h-full bg-zinc-700 transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {progresso < 100
                ? `Enviando arquivos... ${progresso}%`
                : "Processando os documentos, isso pode demorar alguns minutos. Não feche esta janela."}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={fechar}
            disabled={enviando}
            className="px-4 py-2 rounded border border-gray-300 text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleEnviar}
            disabled={enviando || !arquivos.length}
            className="px-4 py-2 rounded text-white bg-zinc-700 hover:bg-zinc-900 disabled:opacity-50 flex items-center gap-2"
          >
            {enviando && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentoModal;