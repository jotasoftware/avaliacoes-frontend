import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import HomePage from '../pages/HomePage/HomePage'
import LoginPage from '../pages/LoginPage/LoginPage'
import Private from '../components/private/Private'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import AvaliacaoDetalhePage from '../pages/AvaliacaoDetalhePage/AvaliacaoDetalhePage'
import FerramentasPage from '../pages/FerramentasPage/FerramentasPage'
import PendentesPage from '../pages/PendentesPage/PendentesPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Private><MainLayout /></Private>}>
        <Route path="/" element={<HomePage />} />
        <Route path="avaliacao" element={<AvaliacaoDetalhePage />} />
        <Route path="ferramentas" element={<FerramentasPage />} />
        <Route path="pendentes" element={<PendentesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
