import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoTrashOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import {
  getAllCategorias,
  createCategoria,
  deleteCategoria,
} from "../services/categoriaService";

const CategoriasModal = ({ open, onClose }) => {
  if (!open) return null;

  const { user } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const getToken = async () => {
    if (!user) throw new Error("Usuário não autenticado");
    return await user.getIdToken();
  };

  const carregar = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const dados = await getAllCategorias(token);
      setCategorias(dados || []);
    } catch (error) {
      toast.error(error.message || "Erro ao buscar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) carregar();
  }, [open]);

  const adicionar = async () => {
    if (!novaCategoria.trim()) {
      toast.warn("Digite o nome da categoria");
      return;
    }

    setSalvando(true);
    try {
      const token = await getToken();
      const categoria = await createCategoria(novaCategoria.trim(), token);
      setCategorias((prev) => [...prev, categoria]);
      setNovaCategoria("");
    } catch (error) {
      toast.error(error.message || "Erro ao criar categoria");
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (id) => {
    try {
      const token = await getToken();
      await deleteCategoria(id, token);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error(error.message || "Erro ao excluir categoria");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl shadow-lg p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-medium text-zinc-700">
            Categorias de imagem
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Usadas pela IA pra classificar as fotos enviadas pelo bot.
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionar()}
            placeholder="Nova categoria (ex: fachada)"
            className="
              flex-1
              border border-zinc-300
              rounded-lg
              px-3 py-2
              text-sm
              bg-zinc-100
              text-black
            "
          />

          <button
            onClick={adicionar}
            disabled={salvando}
            className="
              px-4 py-2
              rounded-lg
              text-sm
              text-white
              bg-zinc-700
              hover:bg-zinc-900
              disabled:opacity-50
            "
          >
            {salvando ? "..." : "Adicionar"}
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500 text-center py-6">
            Carregando...
          </p>
        ) : categorias.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">
            Nenhuma categoria cadastrada
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="
                  flex
                  items-center
                  justify-between
                  border border-zinc-200
                  rounded-lg
                  px-3 py-2
                "
              >
                <span className="text-sm text-zinc-800 capitalize">
                  {categoria.nome}
                </span>

                <button
                  onClick={() => remover(categoria.id)}
                  className="text-zinc-400 hover:text-red-600 transition"
                >
                  <IoTrashOutline size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-zinc-700 hover:bg-zinc-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasModal;