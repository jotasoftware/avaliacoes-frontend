import React from "react";
import { PiImage, PiFilePdf } from "react-icons/pi";

import { IoLink } from "react-icons/io5";
import { FiDownload, FiEdit, FiLink, FiTrash } from "react-icons/fi";


const ItemLine = ({
  item,
  ultimas = false,
  onEdit,
  onDelete,
  busca = false,
}) => {
  const iconMap = {
    1: IoLink,
    2: PiFilePdf,
    3: PiImage,
  };
  const Icon = iconMap[item?.tipo] || IoLink;

  const dataFormatada = new Date(item?.createdAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="
        w-full
      "
    >
      {ultimas ? 
        <div className="flex items-start gap-2 rounded-md cursor-pointer hover:opacity-80 hover:translate-x-1 transition">
          <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
            <Icon size={18} />
          </div>
            <div className="flex align-bottom flex-col">
            <p className="text-gray-700 text-sm p-0 m-0">
              {item?.titulo}
            </p>
            <p className="text-gray-400 text-xs p-0 m-0">
              {dataFormatada} / {item?.Colecao.titulo}
            </p>
          </div>
        </div>
      :
        <div className="flex justify-between w-full gap-5">
          <div className="flex items-start gap-2 rounded-md py-2 hover:opacity-80 transition">
            <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm align-top flex-1">
              <Icon size={20} />
            </div>
            <div className="flex align-bottom flex-col">
              <p className="text-gray-700 text-sm p-0 m-0">
                {item?.titulo}
              </p>
              <p className="text-gray-400 text-xs p-0 m-0">
                {dataFormatada}
              </p>
              <p className="text-gray-400 text-xs p-0 m-0 break-words">
                {item?.conteudo}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {item.tipo==1 ?
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={item.url?.startsWith("http") ? item.url : `https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-800 p-2 transition-colors"
            >
              <FiLink size={18} />
            </a>
            :
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`http://localhost:3000${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-800 p-2 transition-colors"
            >
              <FiDownload size={18} />
            </a>
            }
            {!busca &&
            <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-gray-400 hover:text-gray-800 p-2 transition-colors"
            >
              <FiEdit size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-400 hover:text-red-600 p-2 transition-colors"
            >
              <FiTrash size={18} />
            </button>
            </>
            }
          </div>
        </div>

      }
    </div>
  );
};

export default ItemLine;
