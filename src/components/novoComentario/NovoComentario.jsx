import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { LuSendHorizontal } from "react-icons/lu";
import { useComentario } from "../../context/ComentarioContext";

const NovoComentario = ({idColecao}) => {
  const [comentario, setComentario] = useState("");
  const {createComentario} = useComentario();


  const handleChange = (e) => {
    setComentario(e.target.value);
  };

  const clear = () => {
    setComentario("");
  };

  const onSend = async() => {
    if (!comentario.trim()) return;
    await createComentario(comentario, idColecao)
    setComentario("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="mt-4 flex items-center gap-2 bg-white rounded-xl p-2 w-full border-gray-200/60 shadow-sm">
      <input
        type="text"
        value={comentario}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite seu comentário aqui"
        className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none transition-all hover:opacity-80"
      />

      {comentario && (
        <>
          <button
            onClick={clear}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FiX size={14} />
          </button>

          <button
            onClick={onSend}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
          >
            <LuSendHorizontal size={14} />
          </button>
        </>
      )}
    </div>
  );
};

export default NovoComentario;