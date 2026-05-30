import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tarefas from './pages/Tarefas'
import DatasEspeciais from './pages/DatasEspeciais'
import Configuracoes from './pages/Configuracoes'

// Componente que protege rotas — redireciona para login se não autenticado
function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    // Div raiz com tema escuro forçado
    <div className="dark min-h-screen bg-slate-900 text-slate-100">
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/tarefas"
          element={
            <RotaProtegida>
              <Tarefas />
            </RotaProtegida>
          }
        />
        <Route
          path="/datas"
          element={
            <RotaProtegida>
              <DatasEspeciais />
            </RotaProtegida>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <RotaProtegida>
              <Configuracoes />
            </RotaProtegida>
          }
        />

        {/* Redireciona qualquer rota desconhecida para o dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
