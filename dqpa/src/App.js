import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import AutoevaluacionesPage from './pages/AutoevaluacionesPage';
import NuevaAutoevaluacion from './pages/NuevaAutoevaluacionPage';
import CuestionarioPage from './pages/CuestionarioPage';
import DashboardResultados from './pages/DashboardResultadosPage';
import AdminDashboard from './pages/AdminDashboardPage';
import AdminPreguntas from './pages/AdminPreguntas';
import AdminProcesos from './pages/AdminProcesos';
import AdminUsers from './pages/AdminUsers';
import Politica from './pages/Politica';
import ConfirmPage from './pages/ConfirmPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PropuestasMejora from './pages/PropuestasMejoraPage';
import ScrollToTop from './components/ScrollToTop';
import AuthProvider from './authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstruccionesPage from './pages/InstruccionesPage';
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const location = useLocation(); // Obtener la ruta actual

  // Mostrar Navbar solo en Home ("/") y Política ("/politica")
  const showNavbar = location.pathname === '/' || location.pathname === '/politica';
  
  // Mostrar Sidebar en todas menos Home, Login y Registro
  const showSidebar = !showNavbar && location.pathname !== '/login' && location.pathname !== '/register';

  // Mostrar Footer solo en Home, Login, Registro y Política
  const showFooter = location.pathname === '/' || location.pathname === '/login' || 
                     location.pathname === '/register' || location.pathname === '/politica';

  return (
    <>
      <ToastContainer />
      {showNavbar && <Navbar />}
      <ScrollToTop />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar solo cuando corresponde */}
        {showSidebar && <Sidebar />}

        {/* Contenido Principal */}
        <div style={{ flexGrow: 1, paddingLeft: showSidebar ? '0' : '0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/politica" element={<Politica />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistroPage />} />
            <Route path="/autoevaluaciones" element={<AutoevaluacionesPage />} />
            <Route path="/mis-autoevaluaciones" element={<AutoevaluacionesPage />} />
            <Route path="/nueva-autoevaluacion" element={<NuevaAutoevaluacion />} />
            <Route path="/cuestionario/:cuestionarioId" element={<CuestionarioPage />} />
            <Route path="/resultados/:cuestionarioId" element={<DashboardResultados />} />
            <Route path="/propuestas-mejora/:cuestionarioId" element={<PropuestasMejora />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/preguntas" element={<AdminPreguntas />} />
            <Route path="/admin-dashboard/procesos" element={<AdminProcesos />} />
            <Route path="/admin-dashboard/usuarios" element={<AdminUsers />} />
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/instrucciones/:cuestionarioId" element={<InstruccionesPage />} />
          </Routes>
        </div>
      </div>

      {/* Mostrar el Footer solo en Home, Login, Register y Política */}
      {showFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
