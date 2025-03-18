import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Button, LinearProgress, Container, Paper,
  ToggleButton, ToggleButtonGroup, Stack, IconButton, Menu, MenuItem, Chip
} from '@mui/material';
import { FormControl, Select } from "@mui/material";
import { Skeleton } from "@mui/material";
import {
  InsertChartOutlined, CheckCircleOutlined, HourglassEmptyOutlined,
  CalendarToday, AccessTime, FilterList
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import styled, { keyframes } from 'styled-components';
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, Avatar } from "@mui/material";

const Dashboard = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('recientes');
  const [statusFilter, setStatusFilter] = useState('todas');

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const [userRole, setUserRole] = useState('');
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  
  const stats = [
    {
      label: "Total",
      value: evaluations.length,
      icon: InsertChartOutlined,
      color: "#1E4B81", // Azul oscuro moderno
      background: "linear-gradient(135deg, #1E4B81 0%, #5A8DEE 100%)",
    },
    {
      label: "Completadas",
      value: evaluations.filter(e => e.estado).length,
      icon: CheckCircleOutlined,
      color: "#2E7D32", // Verde éxito
      background: "linear-gradient(135deg, #2E7D32 0%, #81C784 100%)",
    },
    {
      label: "Incompletas",
      value: evaluations.filter(e => !e.estado).length,
      icon: HourglassEmptyOutlined,
      color: "#D32F2F", // Rojo alerta
      background: "linear-gradient(135deg, #D32F2F 0%, #E57373 100%)",
    },
  ];

  const DashboardSkeleton = () => {
    return (
      <Box sx={{ p: 3 }}>
        {/* 🔹 Título principal */}
        <Skeleton variant="text" width={250} height={50} sx={{ mb: 3 }} />
  
        <Grid container spacing={3}>
          {/* 🔹 Tarjeta de Bienvenida */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
              <Skeleton variant="circular" width={100} height={100} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={30} sx={{ mx: "auto", mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mx: "auto", mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <Skeleton variant="rounded" width={60} height={25} />
                <Skeleton variant="rounded" width={60} height={25} />
                <Skeleton variant="rounded" width={60} height={25} />
              </Box>
            </Paper>
          </Grid>
  
          {/* 🔹 Tarjetas de Estadísticas */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Skeleton variant="text" width="50%" height={25} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                    <Skeleton variant="circular" width={35} height={35} sx={{ position: "absolute", top: 10, right: 10 }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
  
        {/* 🔹 Filtros */}
        <Box sx={{ display: "flex", gap: 2, mt: 3, alignItems: "center" }}>
          {[...Array(3)].map((_, index) => (
            <Skeleton variant="rounded" width={100} height={35} key={index} />
          ))}
          <Skeleton variant="rounded" width={120} height={35} sx={{ ml: "auto" }} />
        </Box>
  
        {/* 🔹 Lista de autoevaluaciones */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 3, borderRadius: 3, minHeight: 140 }}>
                <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={15} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" width="80%" height={10} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="15%" height={20} />
  
                {/* 🔹 Botones */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Skeleton variant="rounded" width={100} height={35} />
                  <Skeleton variant="rounded" width={100} height={35} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('Token no encontrado');
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);

        const userId = decodedToken.id;

        const response = await axios.get(
          `http://localhost:9092/api/autoevaluaciones/resumen/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const evaluationsWithState = response.data.autoevaluaciones.map((evaluation) => ({
          ...evaluation,
          estado: evaluation.progreso === 100,
        }));

        setEvaluations(evaluationsWithState);
        setFilteredEvaluations(evaluationsWithState);
        // 🚨 Mostrar alerta si el usuario ha alcanzado el límite
if (
  (decodedToken.role === 'ROLE_FREEMIUM' && evaluationsWithState.length >= 1) ||
  
  (decodedToken.role === 'ROLE_PREMIUM' && evaluationsWithState.length >= 2)
) {
  setShowUpgradeAlert(true);
}
console.log(decodedToken.role)
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las autoevaluaciones.');
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let filtered = [...evaluations];

    if (statusFilter === 'completadas') {
      filtered = filtered.filter(e => e.estado);
    } else if (statusFilter === 'incompletas') {
      filtered = filtered.filter(e => !e.estado);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return sortOrder === 'recientes' ? dateB - dateA : dateA - dateB;
    });

    setFilteredEvaluations(filtered);
  }, [sortOrder, statusFilter, evaluations]);

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = (order) => {
    if (order) setSortOrder(order);
    setAnchorEl(null);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }
  
  if (error) return <Typography variant="h5" textAlign="center" mt={4} color="red">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ffffff', pt: { xs: 8, md: 0 } }}>

      <Box sx={{ flexGrow: 1, p: { xs: 3, md: 5 }, width: '100%' }}>
        <Container maxWidth="xl">
        <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}



    >
     <Typography
  variant="h3"
  fontWeight={600}
  sx={{
    mb: 4,
    textAlign: "left",
    color: "#333333  ", // 🔹 Azul oscuro moderno
    fontFamily: '"Inter", "Plus Jakarta Sans", "Manrope", sans-serif', // ✨ Fuente profesional
    letterSpacing: "-0.5px", // 🔹 Ligera compresión del texto para modernidad
    opacity: 0.9, // 🔹 Transparencia para suavidad
    textShadow: "0px 3px 8px rgba(30, 75, 129, 0.3)", // 🔹 Glow sutil y elegante
    fontSize: { xs: "1.7rem", sm: "2.0rem", md: "2.5rem" }, // 📏 Escalado responsivo
  }}
>
  Bienvenido 👋
</Typography>

    </motion.div>
    <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
  {/* 📌 Tarjeta de Bienvenida */}
  <Grid item xs={12} md={4}>
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background: "#fff",
        minHeight: 200, // 🔥 TODAS LAS TARJETAS AHORA TIENEN EL MISMO ALTO
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 🔹 Imagen de usuario con borde punteado */}
      <Box
        sx={{
          width: 65,
          height: 65,
          borderRadius: "50%",
          border: "4px dotted #D37D36",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0.8,
          mb: 1.5,
        }}
      >
        <Avatar src="/images/user.jpg" sx={{ width: "100%", height: "100%" }} />
      </Box>

      {/* 📝 Título y descripción */}
      <Typography variant="h6" fontWeight="bold">
        ¡Nos alegra verte de nuevo!
      </Typography>
      <Typography variant="body2" color="textSecondary">
      Autoevalúa tu organización en Gobierno, Gestión y Calidad de Datos  
      </Typography>

      {/* 🏷️ Chips de categorías */}
      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
  {[
    { label: "UNE 0077", borderColor: "#1E4B81" }, // Azul
    { label: "UNE 0078", borderColor: "#D37D36" }, // Verde
    { label: "UNE 0079", borderColor: "#B0B0B0" }, // Naranja
    { label: "UNE 0080", borderColor: "#81C784" }, // VERDE
  ].map((tag, index) => (
    <Chip
      key={index}
      label={tag.label}
      sx={{
        bgcolor: "#f0f0f0",
        fontSize: "12px",
        border: `2px solid ${tag.borderColor}`, // Borde de color
        color: tag.borderColor, // Color del texto acorde al borde
        fontWeight: "bold",
      }}
    />
  ))}
</Box>

    </Paper>
  </Grid>

  {/* 📊 Tarjetas de Estadísticas */}
  <Grid item xs={12} md={8}>
  <Typography variant="h6" sx={{ mb: 1 }}>
    Datos de tus autoevaluaciones
  </Typography>
  <Grid container spacing={2}>
    {[
      { label: "Total", value: evaluations.length, color: "#1E4B81", bgColor: "#E3F2FD", icon: InsertChartOutlined },
      { label: "Completas", value: evaluations.filter(e => e.estado).length, color: "#2E7D32", bgColor: "#E8F5E9", icon: CheckCircleOutlined },
      { label: "Incompletas", value: evaluations.filter(e => !e.estado).length, color: "#D32F2F", bgColor: "#FFEBEE", icon: HourglassEmptyOutlined },
    ].map((stat, index) => (
      <Grid item xs={12} sm={4} key={index}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: stat.bgColor, // 🎨 Fondo pastel
            position: "relative",
            textAlign: "left",
            minHeight: 180, // 🔥 Asegurar misma altura
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* 🔹 Mancha de color estilo curvo */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: `linear-gradient(135deg, ${stat.color} 20%, transparent 80%)`,
              borderTopRightRadius: "12px",
              borderBottomLeftRadius: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.15, // 🎨 Efecto más sutil
            }}
          />

          {/* 🔹 Ícono en la mancha */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 40,
              height: 40,
              background: stat.color,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <stat.icon sx={{ fontSize: 24, color: "#fff" }} />
          </Box>

          {/* 📂 Datos de cada tarjeta */}
          <Typography variant="h6" fontWeight="bold" sx={{ color: stat.color }}>
            {stat.label}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
            {stat.value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            autoevaluaciones
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Grid>

</Grid>



{/* 🎛️ Filtros */}
<Box
  sx={{
    display: "flex",
    gap: 2,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    p: 2,
    bgcolor: "#F7F9FC", // 🔹 Fondo suave
    borderRadius: 3,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  }}
>
  {/* 🔹 Botones Modernos de Filtros */}
  <Box sx={{ display: "flex", gap: 1 }}>
    {[
      { value: "todas", label: "Todas", color: "#1E4B81" },
      { value: "completadas", label: "Completadas", color: "#81C784" },
      { value: "incompletas", label: "Incompletas", color: "#E57373" },
    ].map((filter) => (
      <Button
        key={filter.value}
        variant={statusFilter === filter.value ? "contained" : "outlined"}
        onClick={() => setStatusFilter(filter.value)}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: "bold",
          px: 3,
          bgcolor: statusFilter === filter.value ? filter.color : "transparent",
          color: statusFilter === filter.value ? "white" : filter.color,
          border: `2px solid ${filter.color}`,
          "&:hover": { opacity: 0.8 },
        }}
      >
        {filter.label}
      </Button>
    ))}
  </Box>

  {/* 🔹 Ordenamiento con Select en lugar de menú emergente */}
  <FormControl sx={{ minWidth: 180 }}>
    <Select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      displayEmpty
      sx={{
        borderRadius: 3,
        bgcolor: "#fff",
        fontWeight: "bold",
        border: "1px solid #ddd",
        "&:hover": { borderColor: "#1E4B81" },
      }}
    >
      <MenuItem value="recientes">
        <CalendarToday fontSize="small" sx={{ mr: 1 }} />
        Más recientes
      </MenuItem>
      <MenuItem value="antiguas">
        <AccessTime fontSize="small" sx={{ mr: 1 }} />
        Más antiguas
      </MenuItem>
    </Select>
  </FormControl>
</Box>
{/* 📌 Mostrar mensaje si no hay autoevaluaciones */}
{evaluations.length === 0 && (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      minHeight: "55vh",
      backgroundColor: "#F8FAFC", // Fondo claro moderno
      p: 4,
      animation: "fadeIn 1s ease-in-out", // 🔥 Animación de aparición
    }}
  >
    {/* 📊 Ilustración moderna */}
   
    {/* 📝 Mensaje destacado */}
    <Typography
      variant="h4"
      fontWeight="bold"
      sx={{
        color: "#1E4B81",
        mb: 1,
        fontSize: { xs: "1.5rem", sm: "2rem" },
        letterSpacing: "-0.5px",
        textShadow: "0px 3px 8px rgba(30, 75, 129, 0.3)", // ✨ Glow sutil
      }}
    >
      ¡Comienza tu Autoevaluación!
    </Typography>

    <Typography
      variant="body1"
      sx={{
        color: "#555",
        maxWidth: "600px",
        fontSize: "1rem",
        opacity: 0.9,
        mb: 3,
      }}
    >
      Evalúa la <strong>gestión, gobierno y calidad de datos</strong> en tu organización.  
      Selecciona los procesos adecuados y obtén un diagnóstico inmediato.
    </Typography>

    {/* 🚀 Botón flotante con animación */}
    <Button
      variant="contained"
      sx={{
        background: "linear-gradient(135deg, #d37d36 0%, #b65a1e 100%)",
        color: "#fff",
        fontWeight: "bold",
        textTransform: "none",
        px: 5,
        py: 1.8,
        fontSize: "1rem",
        borderRadius: "50px",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          background: "linear-gradient(135deg, #1e4b81 0%, #14365a 100%)",
          transform: "translateY(-2px)", // 🚀 Efecto flotante
          boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.25)",
        },
        "&:active": {
          transform: "scale(0.98)", // 🔥 Pequeña presión al hacer clic
        },
      }}
      onClick={() => navigate("/nueva-autoevaluacion")}
    >
      🚀 Iniciar Ahora
    </Button>
  </Box>
)}


<Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
  {filteredEvaluations.map(evaluation => (
    <Grid item xs={12} sm={12} md={6} key={evaluation._id}>
      <Paper 
        elevation={3} 
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #E0E0E0",  // 🖌️ Filo gris claro
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
          position: "relative",
          overflow: "hidden",
          minHeight: 140,  
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderLeft: `5px solid ${evaluation.estado ? "#1E4B81" : "#D37D36"}`, // 🟦🟧 Borde dinámico
        }}
      >
        {/* 🔹 Estado en la esquina */}
        <Chip
  label={evaluation.estado ? "Completada" : "Pendiente"}
  sx={{
    position: "absolute",
    top: 12,
    right: 12,
    fontWeight: "bold",
    fontSize: "12px",
    padding: "3px 8px",
    bgcolor: evaluation.estado ? "#C8E6C9" : "#FFCDD2",  // 💚 Verde pastel | ❤️ Rojo pastel
    color: evaluation.estado ? "#2E7D32" : "#D32F2F",  // Texto más fuerte
  }}
/>


        {/* 🔹 Contenido */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#4A4A4A", fontSize: "16px" }}>
            Autoevaluación
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#6c757d", mt: 0.5 }}>
            <CalendarToday fontSize="small" />
            <Typography variant="body2">
              {new Date(evaluation.fecha).toLocaleString()}
            </Typography>
          </Box>

          {/* 🔹 Barra de progreso más corta */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#6c757d", fontSize: "12px" }}>
              Progreso:
            </Typography>
            <Box sx={{ width: "80px" }}>  
              <LinearProgress
                variant="determinate"
                value={evaluation.progreso}
                sx={{
                  height: 6,  
                  borderRadius: 3,
                  bgcolor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: evaluation.estado ? "#1E4B81" : "#D37D36",
                  },
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#4A4A4A", fontSize: "12px" }}>
              {evaluation.progreso}%
            </Typography>
          </Box>
        </Box>

        {/* 🔹 Botones más discretos */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
          {evaluation.estado ? (
            <>
              <Button 
                variant="outlined" 
                sx={{ 
                  minWidth: "100px",  
                  height: "32px",
                  borderColor: "#1E4B81", 
                  color: "#1E4B81", 
                  fontSize: "12px", 
                  fontWeight: "bold",
                  borderRadius: "6px",
                  "&:hover": { background: "#1E4B81", color: "#fff" } 
                }}
                onClick={() => navigate(`/cuestionario/${evaluation.cuestionario?._id}?completed=true`)}
              >
                Cuestionario
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  minWidth: "100px",
                  height: "32px",
                  background: "#1E4B81", 
                  color: "white", 
                  fontSize: "12px", 
                  fontWeight: "bold",
                  borderRadius: "6px",
                  "&:hover": { background: "#163A63" } 
                }}
                onClick={() => navigate(`/resultados/${evaluation.cuestionario?._id}`)}
              >
                Resultados
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              sx={{ 
                minWidth: "110px",
                height: "34px",
                background: "#D37D36", 
                color: "white", 
                fontSize: "12px", 
                fontWeight: "bold",
                borderRadius: "6px",
                "&:hover": { background: "#B6632C" } 
              }}
              onClick={() => navigate(`/cuestionario/${evaluation.cuestionario?._id}`)}
            >
              Completar
            </Button>
          )}
        </Box>
      </Paper>
    </Grid>
  ))}
</Grid>



        </Container>
    
      </Box>
      {/* 🚨 Notificación de actualización de plan */}
{/* 🚨 Notificación de actualización de plan */}
{showUpgradeAlert && (
  <UpgradeAlert>
    <AlertIcon>⚠️</AlertIcon>
    <AlertText>
      <Typography variant="body2" fontWeight="bold">
        ¡Límite alcanzado!
      </Typography>
      <Typography variant="body2">
        Has alcanzado el límite de autoevaluaciones. 🚀 ¡Actualiza tu plan para seguir evaluando!
      </Typography>
    </AlertText>
    <UpgradeButton >
      Contáctenos
    </UpgradeButton>
  </UpgradeAlert>
)}


    </Box>
  );
};
// 🎨 Estilos generales
const cardStyle = {
  p: 4,
  borderRadius: 4,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  minHeight: '120px',
  bgcolor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1, // Espaciado entre icono y texto
};

const iconStyleTotal = {
  fontSize: 48,
  color: '#1e4b81', // Azul
};

const iconStyleCompleted = {
  fontSize: 48,
  color: '#2e7d32', // Verde
};

const iconStyleIncomplete = {
  fontSize: 48,
  color: '#d32f2f', // Rojo
};



const filterGroupStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
};

const filterButtonStyle = {
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  borderRadius: '8px',
  px: 3,
};

// 🎨 Estilo para las tarjetas de autoevaluaciones
const evaluationCardStyle = (estado) => ({
  p: 3,
  borderRadius: 4,
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  borderLeft: `3px solid ${estado ? '#1e4b81' : '#d37d36'}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '180px', // Todas del mismo tamaño
});

// 🎨 Estilos de la barra de progreso
const progressStyle = (estado) => ({
  height: 10,
  borderRadius: 5,
  bgcolor: '#e0e0e0',
  mt: 1,
  position: 'relative',
  '& .MuiLinearProgress-bar': {
    bgcolor: estado ? '#81c784' : '#d32f2f',
  },
});

// 🎨 Botones Modernos
const modernButtonStyle = {
  minWidth: "140px",
  height: "40px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "none",
  transition: "0.3s ease",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// 🎨 Colores de los botones
const buttonColors = {
  primary: { backgroundColor: "#1e4b81", color: "white", "&:hover": { backgroundColor: "#163a63" } },
  secondary: { borderColor: "#1e4b81", color: "#1e4b81", "&:hover": { backgroundColor: "#1e4b81", color: "white" } },
  warning: { backgroundColor: "#d37d36", color: "white", "&:hover": { backgroundColor: "#b6632c" } },
};
// 🔥 Animación de rebote (bounce)
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
`;

// 📌 Contenedor de la alerta
const UpgradeAlert = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  max-width: 340px;
  background-color: white;
  color: #333;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 2px solid #d37d36; /* 💙 Borde azul */
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1300;
  animation: ${bounce} 2s infinite; /* 🔥 Aplica el efecto de rebote */
`;

// ⚠️ Icono de alerta
const AlertIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #fdd835;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

// 📜 Texto de la alerta
const AlertText = styled.div`
  flex: 1;
`;

// 🔘 Botón de actualización
const UpgradeButton = styled(Button)`
  background-color: #1E4B81 !important;
  color: white !important;
  font-size: 12px !important;
  text-transform: none !important;
  border-radius: 20px !important;
  &:hover {
    background-color: #163a63 !important;
  }
`;


export default Dashboard;
