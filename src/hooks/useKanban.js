import { useState, useEffect } from "react";

export function useKanban(avaliacoes) {
  const [board, setBoard] = useState({
    entrada: [],
    todo: [],
    doing: [],
    done: [],
  });


  useEffect(() => {
    const lista = avaliacoes || [];

    setBoard({
      entrada: lista.filter((a) => a.status === "entrada"),
      todo: lista.filter((a) => a.status === "todo"),
      doing: lista.filter((a) => a.status === "doing"),
      done: lista.filter((a) => a.status === "done"),
    });
  }, [avaliacoes]);


  const findColumn = (id) => {
    return Object.keys(board).find((key) =>
      board[key].some((item) => item.id === id)
    );
  };


  const moveCard = (from, to, id) => {
    setBoard((prev) => {
      const item = prev[from].find(
        (i) => i.id === id
      );

      const novaOrigem = prev[from].filter(
        (i) => i.id !== id
      );

      const novoDestino = [
        ...prev[to],
        {
          ...item,
          status: to,
        },
      ];

      return {
        ...prev,
        [from]: novaOrigem,
        [to]: novoDestino,
      };
    });
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return null;

    const from = findColumn(active.id);
    const to = over.id;

    if (!from || !to || from === to) return null;

    moveCard(from, to, active.id);

    return {
      id: active.id,
      status: to,
    };
  };


  return {
    board,
    handleDragEnd,
  };
}