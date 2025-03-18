import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Grid, Chip } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
const NuevaAutoevaluacion = () => {
  const [procesos, setProcesos] = useState([]);
  const [selectedProcesos, setSelectedProcesos] = useState([]);
  const [todosSeleccionados, setTodosSeleccionados] = useState(false);
  const [userRole, setUserRole] = useState("ROLE_FREEMIUM");
  const [userId, setUserId] = useState(null);
  const [numAutoevaluaciones, setNumAutoevaluaciones] = useState(0);
  const maxAutoevaluaciones = userRole === "ROLE_FREEMIUM" ? 1 : userRole === "ROLE_PREMIUM" ? 2 : Infinity;
  const disableButtons = numAutoevaluaciones >= maxAutoevaluaciones;
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9092";

  useEffect(() => {
    const fetchProcesos = async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/procesos/${id}`);
        setProcesos(response.data);
      } catch (error) {
        console.error("Error al obtener los procesos:", error.response?.data || error.message);
      }
    };
    const fetchAutoevaluaciones = async (id, token) => {
      let userId = id;
      console.log(userId)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/autoevaluaciones/resumen/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setNumAutoevaluaciones(response.data.autoevaluaciones.length);
      } catch (error) {
        console.error("Error al obtener autoevaluaciones:", error);
      }
    };
    
    const initializeUser = () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;
    
        const decodedToken = jwtDecode(token);
        const id = decodedToken.id || decodedToken.userId || decodedToken._id;
        if (!id) return;
    
        setUserId(id);
        setUserRole(decodedToken.role || "ROLE_FREEMIUM");
    
        fetchAutoevaluaciones(id, token); // ✅ PASA el token correctamente
        fetchProcesos(id);
      } catch (error) {
        console.error("Error al decodificar el token:", error.message);
      }
    };
    

    initializeUser();
  }, []);

  const toggleProceso = (procesoId) => {
    setSelectedProcesos((prev = []) =>
      prev.includes(procesoId) ? prev.filter((id) => id !== procesoId) : [...prev, procesoId]
    );
  };

  const toggleSeleccionarTodos = () => {
    setSelectedProcesos(todosSeleccionados ? [] : procesos.map((p) => p._id));
    setTodosSeleccionados(!todosSeleccionados);
  };

  const groupedProcesos = procesos.length > 0
    ? procesos.reduce((acc, proceso) => {
        const nivel = proceso.nivel || "Sin Nivel";
        if (!acc[nivel]) acc[nivel] = [];
        acc[nivel].push(proceso);
        return acc;
      }, {})
    : {};

  const nivelDescriptions = {
    1: "Realizado",
    2: "Gestionado",
    3: "Establecido",
  };

  const iniciarAutoevaluacion = async () => {
    if (selectedProcesos.length === 0) {
      Swal.fire({
        title: "Sin procesos seleccionados",
        text: "Debe seleccionar al menos un proceso.",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#A5D6A7",
      });
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/autoevaluaciones/crear`,
        { userId, procesos: selectedProcesos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      const cuestionarioId = response.data.cuestionario._id;
      window.location.href = `/instrucciones/${cuestionarioId}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al iniciar la autoevaluación.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmColor: "#EF9A9A",
      });
    }
  };

  return (
    <>
      {/* 🔹 Breadcrumbs sin margen lateral */}
      <Box sx={{ width: "100%", bgcolor: "#f9f9f9", px: 3, py: 2, borderRadius: 2, mb: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <MuiLink component={RouterLink} to="/mis-autoevaluaciones" sx={{ display: "flex", alignItems: "center", color: "#1e4b81", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}>
            <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Inicio
          </MuiLink>
          <Typography sx={{ color: "#d37d36", fontWeight: "bold" }}>Nueva autoevaluación</Typography>
        </Breadcrumbs>
      </Box>
  
      {/* 🔹 Contenido con margen lateral */}
      <Box sx={{ minHeight: "100vh", pb: 6, px: { xs: 3, sm: 6, md: 12 } }}>

      {/* 🔹 Título */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "700", color: "#1e4b81", mb: 1 }}>
          Seleccione procesos para autoevaluar
        </Typography>
      </Box>

{/* 🔹 Mostrar procesos sin niveles si es ROLE_FREEMIUM */}
{userRole === "ROLE_FREEMIUM" ? (
  <Grid container spacing={3} justifyContent="center">
    {procesos.map((proceso) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={proceso._id} sx={{ display: "flex" }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: "12px",
            cursor: "pointer",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "140px",
            maxHeight: "160px",
            textAlign: "center",
            position: "relative",
            transition: "0.3s ease-in-out",
            border: selectedProcesos.includes(proceso._id) ? "2px solid #d37d36" : "2px solid transparent",
            boxShadow: selectedProcesos.includes(proceso._id) ? "0px 4px 12px rgba(211, 125, 54, 0.4)" : "0px 2px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
            },
          }}
          onClick={() => toggleProceso(proceso._id)}
        >
          {/* 🏷️ Chip del Tipo (ESQUINA SUPERIOR IZQUIERDA) */}
          <Chip
                label={proceso.tipo}
                sx={{
                  position: "absolute",
                  top: "-12px",
                  left: "-8px",
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                  px: 1.5,
                  fontWeight: "bold",
                  bgcolor: proceso.tipo === "Gobierno" ? "#1e4b81" : proceso.tipo === "Calidad" ? "#d9d9d9" : "#d37d36",
                  color: "white",
                }}
          />

          {/* 📌 Contenido */}
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", mt: 2, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {proceso.abreviatura}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", fontSize: "0.8rem", lineHeight: "1.2", mt: 1 }}>
            {proceso.nombre}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
) : (
  // 🔹 Si no es ROLE_FREEMIUM, se muestran los niveles
  Object.keys(groupedProcesos).map((nivel) => (
    <Box key={nivel} sx={{ mb: 5 }}>
      {/* 📌 Encabezado del Nivel */}
      <Box sx={{ width: "100%", bgcolor: "#1e4b81", color: "white", py: 2, borderRadius: "8px", textAlign: "center", fontWeight: "bold", mb: 3 }}>
        Nivel {nivel} - {nivelDescriptions[nivel] || "Desconocido"}
      </Box>

      {/* 📌 Tarjetas de Procesos */}
      <Grid container spacing={3} justifyContent="center">
        {groupedProcesos[nivel].map((proceso) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={proceso._id} sx={{ display: "flex" }}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: "12px",
                cursor: "pointer",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "140px",
                maxHeight: "160px",
                textAlign: "center",
                position: "relative",
                transition: "0.3s ease-in-out",
                border: selectedProcesos.includes(proceso._id) ? "2px solid #d37d36" : "2px solid transparent",
                boxShadow: selectedProcesos.includes(proceso._id) ? "0px 4px 12px rgba(211, 125, 54, 0.4)" : "0px 2px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
              onClick={() => toggleProceso(proceso._id)}
            >
              {/* 🏷️ Chip del Tipo (ESQUINA SUPERIOR IZQUIERDA) */}
              <Chip
                label={proceso.tipo}
                sx={{
                  position: "absolute",
                  top: "-12px",
                  left: "-8px",
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                  px: 1.5,
                  fontWeight: "bold",
                  bgcolor: proceso.tipo === "Gobierno" ? "#1e4b81" : proceso.tipo === "Calidad" ? "#d9d9d9" : "#d37d36",
                  color: "white",
                }}
              />

              {/* 📌 Contenido */}
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", mt: 2, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {proceso.abreviatura}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", fontSize: "0.8rem", lineHeight: "1.2", mt: 1 }}>
                {proceso.nombre}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  ))
)}


      {/* 🔘 Botones */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
      <Tooltip title={disableButtons ? "Has alcanzado el límite de autoevaluaciones" : ""} arrow>
  <span>
    <Button
      variant="outlined"
      onClick={toggleSeleccionarTodos}
      disabled={disableButtons}
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: "8px",
        px: 4,
        py: 1.5,
        fontSize: "1rem",
        border: "2px solid #1e4b81",
        color: "#1e4b81",
        boxShadow: "0px 4px 10px rgba(30, 75, 129, 0.2)",
        "&:hover": { background: "#1e4b81", color: "white", borderColor: "#1e4b81" },
      }}
    >
      {todosSeleccionados ? "Deseleccionar Todos" : "Seleccionar Todos"}
    </Button>
  </span>
</Tooltip>

<Tooltip title={disableButtons ? "Has alcanzado el límite de autoevaluaciones" : ""} arrow>
  <span>
    <Button
      variant="contained"
      onClick={iniciarAutoevaluacion}
      disabled={disableButtons}
      sx={{
        ml: 2,
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: "8px",
        px: 4,
        py: 1.5,
        fontSize: "1rem",
        background: "linear-gradient(135deg, #d37d36, #b65a1e)",
        color: "white",
        boxShadow: "0px 4px 10px rgba(211, 125, 54, 0.4)",
        "&:hover": { background: "linear-gradient(135deg, #b65a1e, #8a4514)" },
      }}
    >
      🚀 Autoevaluarse
    </Button>
  </span>
</Tooltip>
</Box>

    </Box>
    </>
  );
};

export default NuevaAutoevaluacion;
