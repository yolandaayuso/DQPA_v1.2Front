import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const ConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // Estados: 'loading', 'success', 'alreadyConfirmed', 'error'

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const response = await axios.get(`http://localhost:9092/api/auth/confirm?email=${email}`);
        
        // Verifica el código de estado en la respuesta
        if (response.status === 200) {
          setStatus('success'); // Confirmación exitosa
          setTimeout(() => navigate('/login'), 2000); // Redirige al login tras 3 segundos
        } else if (response.status === 400) {
          setStatus('alreadyConfirmed'); // Cuenta ya confirmada
        } else {
          setStatus('error'); // Cualquier otro caso inesperado
        }
      } catch (error) {
        if (error.response) {
          // Maneja respuestas con error del backend
          if (error.response.status === 400) {
            setStatus('alreadyConfirmed'); // Cuenta ya confirmada
          } else {
            setStatus('error'); // Otros errores del backend
          }
        } else {
          // Error de red u otro problema
          setStatus('error');
        }
      }
    };

    if (email) {
      confirmAccount();
    } else {
      setStatus('error');
    }
  }, [email, navigate]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)', // Ajuste para navbar y footer
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      {status === 'loading' && (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Confirmando tu cuenta, por favor espera...
          </Typography>
        </>
      )}
      {status === 'success' && (
        <Alert severity="success">
          ¡Tu cuenta ha sido confirmada con éxito! Serás redirigido al inicio de sesión.
        </Alert>
      )}
      {status === 'alreadyConfirmed' && (
        <Alert severity="info">
          Esta cuenta ya estaba confirmada. Por favor, inicia sesión.
        </Alert>
      )}
      {status === 'error' && (
        <Alert severity="error">
          Hubo un problema al confirmar tu cuenta. Por favor, intenta nuevamente o contacta con soporte.
        </Alert>
      )}
    </Box>
  );
};

export default ConfirmPage;
