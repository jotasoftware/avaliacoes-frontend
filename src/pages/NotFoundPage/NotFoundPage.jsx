import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 w-screen">
        <div className="text-center mb-6">
        <h1 className="text-6xl font-extrabold text-blue-600 animate-bounce">
            404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Página não encontrada
        </h2>
        <p className="text-gray-500 mb-4">
            Parece que você se perdeu 😅
        </p>
        <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-l "
        >
            Voltar para casa
        </button>
        </div>

        <p className="mt-6 text-gray-400 italic text-sm">
            Enquanto isso, aproveite para explorar outras partes do Avaliações.cloud!
        </p>
    </div>
  )
}

export default NotFoundPage
