import React, { useMemo, useState } from 'react'
import QuadrosKanban from '../../components/quadrosKanban/QuadrosKanban';
import { useAvaliacao } from '../../context/AvaliacaoContext';

const HomePage = () => {

  const closeModal = ()=>{
    setOpenColecao(false)
    setOpenItem(false)
  }

  const openModalColecao = (colecao)=>{
    setOpenColecao(true)
    setColecaoEdit(colecao)
  }

  const openModalItem = (item)=>{
    setOpenItem(true)
    setItemEdit(item)
  }

  return (
    <div className="mx-1 flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-6">
        <QuadrosKanban></QuadrosKanban>
      </div>
    </div>
    
  );
}

export default HomePage