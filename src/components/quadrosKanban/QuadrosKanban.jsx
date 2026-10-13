import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import QuadroKanban from "../quadroKanban/QuadroKanban";
import { useKanban } from "../../hooks/useKanban";
import { useAvaliacao } from "../../context/AvaliacaoContext";
import { toast } from "react-toastify";

import CriarAvaliacaoModal from "../../modals/CriarAvaliacaoModal";
import ConfirmDeleteModal from "../../modals/ConfirmDeleteModal";

const QuadrosKanban = () => {
  const { avaliacoesFiltradas, moveCard, deleteAvaliacao } = useAvaliacao();
  const { board, handleDragEnd } = useKanban(avaliacoesFiltradas);

  const [openAvaliacao, setOpenAvaliacao] = useState(false);
  const [avaliacaoEdit, setAvaliacaoEdit] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [avaliacaoDelete, setAvaliacaoDelete] = useState(null);

  const openModalAvaliacao = () => {
    setOpenAvaliacao(true);
  };
  
  const closeModalAvaliacao = () => {
    setOpenAvaliacao(false);
  };
  
  const onDragEnd = async (event) => {
    const result = handleDragEnd(event);

    if (!result) return;

    try {
      await moveCard(result.id, {
        status: result.status,
      });

    } catch (error) {
      toast.error(
        error.message || "Erro ao mover card"
      );
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleEdit = (id) => {
    const avaliacao = avaliacoesFiltradas.find(
      (item) => item.id === id
    );
  
    setAvaliacaoEdit(avaliacao);
    setOpenAvaliacao(true);
  };

  const handleDelete = (id) => {
    const avaliacao = avaliacoesFiltradas.find(
      (item) => item.id === id
    );
  
    setAvaliacaoDelete(avaliacao);
    setOpenDelete(true);
  };


  return (<>
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-4 w-full bg-zinc-100 p-4">
        <QuadroKanban titulo="Entrada" id="entrada" data={board.entrada} openModal={openModalAvaliacao} onEdit={handleEdit} onDelete={handleDelete}/>
        <QuadroKanban titulo="A fazer" id="todo" data={board.todo} onEdit={handleEdit} onDelete={handleDelete}/>
        <QuadroKanban titulo="Fazendo" id="doing" data={board.doing} onEdit={handleEdit} onDelete={handleDelete}/>
        <QuadroKanban titulo="Feito" id="done" data={board.done} onEdit={handleEdit} onDelete={handleDelete}/>

      </div>
    </DndContext>
    <CriarAvaliacaoModal
      open={openAvaliacao}
      onClose={() => {
        setOpenAvaliacao(false);
        setAvaliacaoEdit(null);
      }}
      avaliacaoEdit={avaliacaoEdit}
    />

    <ConfirmDeleteModal
      open={openDelete}
      onClose={() => setOpenDelete(false)}
      avaliacao={avaliacaoDelete}
    />
  </>
    
  );
};

export default QuadrosKanban;