import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Income } from './pages/Income';
import { Expenses } from './pages/Expenses';
import { Goals } from './pages/Goals';
import { Planning } from './pages/Planning';
import { Settings } from './pages/Settings';
import { Login } from './pages/login';
import { Register } from './pages/Register';
import { AuthProvider, useAuth } from './hooks/useAuth';

export default function App() {
  return (
    <BrowserRouter basename="/nexabudget">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Carregando...</div>;

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={session ? <Navigate to="/" replace /> : <Register />} />
      <Route element={session ? <AppShell /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="income" element={<Income />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="goals" element={<Goals />} />
        <Route path="planning" element={<Planning />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}