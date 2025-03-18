import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Crear un tema personalizado de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul principal
    },
    secondary: {
      main: '#dc004e', // Rojo principal
    },
    background: {
      default: '#f5f5f5', // Fondo general
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Proveedor de tema para Material-UI */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline restablece los estilos básicos */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Para medir el rendimiento de la aplicación
reportWebVitals();
