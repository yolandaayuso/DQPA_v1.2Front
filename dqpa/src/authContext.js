import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [sessionHandled, setSessionHandled] = useState(false); // Flag para evitar eventos duplicados
  const navigate = useNavigate();

  // Función para eliminar el token de las cookies
  const clearTokenCookie = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      if (sessionHandled) return; // Evitar manejar múltiples veces
      setSessionHandled(true); // Marcar el evento como manejado

      // Eliminar el token de las cookies
      clearTokenCookie();

      // Cambiar el estado de autenticación
      setIsAuthenticated(false);

      // Mostrar notificación profesional
      toast.error('Tu sesión ha expirado. Redirigiendo al inicio de sesión...', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
        setSessionHandled(false); // Resetear el flag después de redirigir
      }, 3000);
    };

    // Escuchar el evento `sessionExpired`
    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      // Limpiar el evento al desmontar el componente
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [navigate, sessionHandled]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
