import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9092', // Ajusta tu baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === 'Token inválido o expirado'
    ) {
      // Asegurar que el evento solo se dispare una vez
      if (!window.sessionExpiredEventEmitted) {
        window.sessionExpiredEventEmitted = true; // Flag global
        const event = new CustomEvent('sessionExpired');
        window.dispatchEvent(event);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
