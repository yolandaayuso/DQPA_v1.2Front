import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza al inicio
  }, [location.pathname]); // Actúa cuando cambia la ruta

  return null;
};

export default ScrollToTop;
