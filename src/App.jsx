import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AvaliacaoProvider } from './context/AvaliacaoContext';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { FerramentasProvider } from './context/FerramentaContext';
import { PendentesProvider } from './context/PendenteContext';

function App() {
  return (
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AuthProvider>
                <AvaliacaoProvider>
                  <PendentesProvider>
                    <FerramentasProvider>
                      <AppRoutes />
                    </FerramentasProvider>
                  </PendentesProvider>
                </AvaliacaoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
