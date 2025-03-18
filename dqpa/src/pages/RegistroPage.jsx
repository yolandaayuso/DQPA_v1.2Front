import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  MenuItem,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';

const RegistroPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const planType = queryParams.get('plan') || 'freemium';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: planType === 'freemium' ? 'ROLE_FREEMIUM' : 'ROLE_PREMIUM',
    empresa: '',
    pais: '',
    sector: '',
    acceptPolicy: false,
  });

  const [paises, setPaises] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const listaPaises = response.data.map((pais) => pais.translations.spa.common).sort();
        setPaises(listaPaises);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
        setPaises(['España', 'México', 'Argentina', 'Colombia', 'Otro']);
      } finally {
        setLoadingPaises(false);
      }
    };
    fetchPaises();
  }, []);

  useEffect(() => {
    const sectoresAPI = [
      'Tecnología', 'Finanzas', 'Salud', 'Educación', 'Manufactura',
      'Energía', 'Retail', 'Turismo', 'Construcción', 'Automotriz', 'Consultoría'
    ];
    setSectores(sectoresAPI);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.acceptPolicy) {
      setError('Todos los campos son obligatorios y debe aceptar la política de privacidad.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial.');
      return;
    }

    if (planType !== 'freemium' && (!formData.empresa || !formData.pais || !formData.sector)) {
      setError('Por favor, complete todos los campos requeridos para el plan Premium.');
      return;
    }

    try {
      await axios.post('http://localhost:9092/api/auth/register', formData);
      setError('');
      setSuccess('Registro exitoso. Hemos enviado un correo de confirmación. Si no lo encuentra en su bandeja de entrada, revise la carpeta de Spam.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error durante el registro.');
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Formulario - Columna izquierda */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        lg={5} 
        sx={{
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 3, md: 6 }, 
        }}
      >
        <Grid item sx={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <img src="/images/logo4.png" alt="DQPa Logo" style={{ width: '60px', marginBottom: '10px' }} />

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#1e4b81' }}>
            Registro {planType === 'premium' && 'Premium'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField label="Correo electrónico" variant="outlined" fullWidth sx={{ mb: 2 }} name="email" value={formData.email} onChange={handleChange}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} />

          <TextField label="Contraseña" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} name="password" value={formData.password} onChange={handleChange}
  helperText="Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&)."
  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }} />

          {planType === 'premium' && (
            <>
              <TextField label="Empresa" variant="outlined" fullWidth sx={{ mb: 2 }} name="empresa" value={formData.empresa} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon /></InputAdornment> }} />

              <TextField select label="País" variant="outlined" fullWidth sx={{ mb: 2 }} name="pais" value={formData.pais} onChange={handleChange}>
                {paises.map((pais) => <MenuItem key={pais} value={pais}>{pais}</MenuItem>)}
              </TextField>

              <TextField select label="Sector" variant="outlined" fullWidth sx={{ mb: 2 }} name="sector" value={formData.sector} onChange={handleChange}>
                {sectores.map((sector) => <MenuItem key={sector} value={sector}>{sector}</MenuItem>)}
              </TextField>
            </>
          )}

          <FormControlLabel control={<Checkbox name="acceptPolicy" checked={formData.acceptPolicy} onChange={handleChange} />} 
            label={<Link href="/politica">Acepto la política de privacidad</Link>} />

          <Button variant="contained" fullWidth sx={{ bgcolor: '#d37d36', '&:hover': { bgcolor: '#c16f31' }, color: 'white', fontWeight: 'bold', py: 1.2 }} 
            onClick={handleRegister}>
            Registrarse
          </Button>

          <Typography sx={{ mt: 2 }}>
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
          </Typography>
        </Grid>
      </Grid>

      {/* Imagen - Columna derecha */}
      <Grid item xs={12} md={6} lg={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: { xs: 2, md: 4 } }}>
        <img src="/images/registro.svg" alt="Ilustración de Registro" style={{ width: '90%', maxWidth: '650px', height: 'auto' }} />
      </Grid>
    </Grid>
  );
};

export default RegistroPage;
