import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Modal,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { jwtDecode } from 'jwt-decode';
import LockIcon from "@mui/icons-material/Lock";
import "react-circular-progressbar/dist/styles.css"
import ListAltIcon from "@mui/icons-material/ListAlt";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import MediumPriorityIcon from "@mui/icons-material/WarningAmber";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { Table, TableHead, TableBody, TableRow, TableCell, Avatar,Tooltip,TablePagination,LinearProgress  } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt"; // Nuevo icono moderno para tarea
import VisibilityIcon from "@mui/icons-material/Visibility"; // Icono moderno para ver detalle
import Cookies from 'js-cookie';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Estilos para los indicadores 

const PropuestasMejora = () => {
  const { cuestionarioId } = useParams();
  const [propuestas, setPropuestas] = useState([]);
  const [filteredPropuestas, setFilteredPropuestas] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [userRole, setUserRole] = useState('ROLE_FREEMIUM'); // Rol predeterminado
  const [userId, setUserId] = useState(null); // Estado para almacenar userId
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9092";

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
            const token = Cookies.get('token');
                if (!token) {
                  return;
                }
        
                const decodedToken = jwtDecode(token)
                const id = decodedToken.id || decodedToken.userId || decodedToken._id;
                if (!id) {
                  return;
                }
        
                setUserId(id);
                const role = decodedToken.role ;
                setUserRole(role);
                const response = await axios.get(
                  `${API_BASE_URL}/api/autoevaluaciones/${cuestionarioId}/propuestas`
                );
                
        setPropuestas(response.data);
        setFilteredPropuestas(response.data);
      } catch (error) {
        console.error("Error al cargar las propuestas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropuestas();
  }, [cuestionarioId]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedProcess(value);
    if (value === "") {
      setFilteredPropuestas(propuestas);
    } else {
      setFilteredPropuestas(propuestas.filter((p) => p.proceso === value));
    }
  };

  const handleOpenModal = async (tarea) => {
    setLoadingDescription(true);
    setModalOpen(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/autoevaluaciones/${cuestionarioId}/tareas/${tarea.id}/descripcion`
      );
      
      const updatedTask = { ...tarea, descripcion: response.data.descripcion };
      setSelectedTask(updatedTask);
    } catch (error) {
      console.error("Error al cargar la descripción de la tarea:", error);
    } finally {
      setLoadingDescription(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setModalOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "#ffc1c1";
      case "Media":
        return "#ffe680";
      case "Baja":
        return "#c1f4c1";
      default:
        return "#e0e0e0";
    }
  };
  const filasPorPaginaOpciones = [5, 10, 15]; // Opciones de filas por página
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página
  
  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const getPriorityOrder = (priority) => {
    switch (priority) {
      case "Alta":
        return 1;
      case "Media":
        return 2;
      case "Baja":
        return 3;
      default:
        return 4;
    }
  };
  const DashboardStats = ({ propuestas }) => {

    const totalTareas = propuestas.length;
    const totalProcesos = [...new Set(propuestas.map((p) => p.proceso))].length;
  
    // Calcular cantidad por prioridad
    const alta = propuestas.filter((p) => p.prioridad === "Alta").length;
    const media = propuestas.filter((p) => p.prioridad === "Media").length;
    const baja = propuestas.filter((p) => p.prioridad === "Baja").length;
    const tareasPorProceso = propuestas.reduce((acc, propuesta) => {
      acc[propuesta.proceso] = (acc[propuesta.proceso] || 0) + 1;
      return acc;
    }, {});
    return (
      
      
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid container spacing={2} alignItems="flex-start">
          
          {/* 📌 Sección Principal (Texto + Indicadores) */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #1e4b81, #4b7fbb)", // 🎨 Gradiente azul
                color: "#fff",
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 2, // 🔥 Reduce la separación
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Propuestas de Mejora 
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                  Aquí encontrarás tareas recomendadas según tus resultados, diseñadas para optimizar tus procesos de datos. Estas propuestas están basadas en las especificaciones UNE 0077, 0078 y 0079.
                </Typography>
              </Box>
              {/* 🔹 Imagen a la derecha */}
              <Box sx={{ width: 120, height: "auto", display: { xs: "none", md: "block" } }}>
                <img src="/images/mejorar.svg" alt="Mejoras" style={{ width: "100%", height: "auto" }} />
              </Box>
            </Paper>
      
            {/* 🔹 Indicadores (Total Tareas y Procesos Afectados) */}
            <Grid container spacing={2}>
              
              {/* 📌 Tarjeta "Total de Tareas" - Más compacta */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 3, bgcolor: "#FAE0D3", minHeight: 160 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#d37d36" }}>
                    {totalTareas}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4A4A4A" }}>
                    Total de Tareas
                  </Typography>
                </Paper>
              </Grid>
      
              {/* 📌 Tarjeta "Procesos Afectados" - Más compacta */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 3, bgcolor: "#F2F2F2", minHeight: 160 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#7A7A7A" }}>
                    {totalProcesos}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4A4A4A" }}>
                    Procesos requieren mejoras
                  </Typography>
                </Paper>
              </Grid>
      
            </Grid>
          </Grid>
      
          {/* 📌 Distribución por Proceso - Más Ancho */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%", overflow: "hidden", minHeight: 390 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#37474f" }}>
                Distribución por Proceso
              </Typography>
              <Box sx={{ mt: 2, maxHeight: { xs: 220, md: 300 }, overflowY: "auto", pr: 1 }}>
                {Object.keys(tareasPorProceso).map((proceso) => {
                  const porcentaje = ((tareasPorProceso[proceso] / totalTareas) * 100).toFixed(1);
                  return (
                    <Box key={proceso} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, minHeight: 60 }}>
                      {/* 📌 Indicador Circular */}
                      <Box sx={{ width: 45, height: 45, flexShrink: 0 }}>
                        <CircularProgressbar
                          value={porcentaje}
                          text={`${porcentaje}%`}
                          styles={buildStyles({
                            textSize: "26px",
                            pathColor: "#d37d36",  // 🔥 Progreso en naranja
                            textColor: "#37474f",
                            trailColor: "#d9d9d9",  // 🔥 Fondo en gris claro
                          })}
                        />
                      </Box>
                      {/* 📌 Información del Proceso */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#37474f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
                          title={proceso}
                        >
                          {proceso}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" } }}>
                          {tareasPorProceso[proceso]} tareas
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
      
        </Grid>
      </Container>
      
    
    );

    
  };
  
  return (
    <Box sx={{  minHeight: "100vh", pb: 6 }}>
      <Box sx={{ bgcolor: "#f9f9f9", px: 3, py: 2, borderRadius: 2, mb: 3 }}>
  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
    <MuiLink 
      component={RouterLink} 
      to="/mis-autoevaluaciones" 
      sx={{ display: "flex", alignItems: "center", color: "#1e4b81", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}
    >
      <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
      Inicio
    </MuiLink>
    <MuiLink 
      component={RouterLink} 
      to={`/resultados/${cuestionarioId}`} 
      sx={{ color: "#1e4b81", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}
    >
      Autoevaluación
    </MuiLink>
    <Typography sx={{ color: "#d37d36", fontWeight: "bold" }}>
      Propuestas de Mejora
    </Typography>
  </Breadcrumbs>
</Box>

  {/* 📌 Cabecera Moderna */}


{/* 📌 Agregar el Dashboard de estadísticas */}
<DashboardStats propuestas={propuestas} />
  
      {/* 📌 Filtro y vista */}
      <Container maxWidth="xl" sx={{ mt: 5, px: { xs: 2, sm: 3 } }}>
        {/* 📌 Filtros Modernos */}
{/* 📌 Filtros Modernos y Compactos */}
<Paper 
  elevation={3} 
  sx={{ 
    p: 2, // 🔥 Reduce el padding
    mb: 3, // 🔥 Reduce el margen inferior
    display: "flex", 
    flexDirection: { xs: "column", sm: "row" }, 
    alignItems: "center", 
    justifyContent: "space-between", 
    gap: 1, // 🔥 Reduce la separación entre elementos
    bgcolor: "#ffffff", 
    borderRadius: 3,
    minHeight: 60, // 🔥 Reduce la altura mínima
  }}
>
  {/* 🔍 Filtro de Procesos (Compacto) */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#6c757d" }}>
      Proceso:
    </Typography>
    <FormControl sx={{ minWidth: 150 }}>
      <Select
        value={selectedProcess}
        onChange={handleFilterChange}
        displayEmpty
        sx={{ 
          borderRadius: 2, 
          bgcolor: "#f9f9f9",
          height: 36, // 🔥 Reduce la altura del Select
          fontSize: "0.85rem", // 🔥 Letra más pequeña
        }}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {[...new Set(propuestas.map((p) => p.proceso))].map((proceso) => (
          <MenuItem key={proceso} value={proceso}>{proceso}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>


</Paper>



  
        {/* 📌 Lista o cuadrícula */}
      {/* 📌 Tabla de propuestas de mejora */}
      <Paper elevation={3} sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Tarea</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {filteredPropuestas
    .sort((a, b) => getPriorityOrder(a.prioridad) - getPriorityOrder(b.prioridad)) // 🔥 Ordena por prioridad
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 🔥 Paginación
    .map((propuesta) => (
      <TableRow key={propuesta.id}>

                {/* 📌 Columna de Icono + Nombre de la Tarea + Proceso */}
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* Nuevo icono de tarea moderno y en color pastel */}
                  <Avatar sx={{ bgcolor: "#90caf9", color: "#0d47a1" }}>
                    <TaskAltIcon />
                  </Avatar>

                  {/* Texto con nombre de la tarea y proceso debajo */}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1e4b81" }}>
                      {propuesta.tarea}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "0.85rem" }}>
                      {propuesta.proceso}
                    </Typography>
                  </Box>
                </TableCell>

               

                {/* 📌 Columna de Acción (Icono moderno para ver detalles) */}
                <TableCell sx={{ textAlign: "center" }}>
                  <Tooltip
                    title={
                      userRole === "ROLE_FREEMIUM"
                        ? "Función exclusiva para usuarios con otros planes"
                        : "Ver Detalle"
                    }
                  >
                    <span>
                      <IconButton
                        onClick={() => userRole !== "ROLE_FREEMIUM" && handleOpenModal(propuesta)}
                        sx={{
                          color: userRole === "ROLE_FREEMIUM" ? "#bdbdbd" : "#ffa469",
                          cursor: userRole === "ROLE_FREEMIUM" ? "not-allowed" : "pointer",
                          position: "relative",
                        }}
                        disabled={userRole === "ROLE_FREEMIUM"}
                      >
                        {/* Ojo principal */}
                        <VisibilityIcon sx={{ fontSize: 28 }} />

                        {/* 🔒 Candado en color amarillo dorado si el botón está deshabilitado */}
                        {userRole === "ROLE_FREEMIUM" && (
                          <LockIcon
                            sx={{
                              fontSize: 16, // 🔒 Tamaño más pequeño
                              position: "absolute",
                              bottom: -2, // 🔽 Lo coloca un poco abajo
                              right: -4, // 🔽 Lo mueve un poco a la derecha
                              color: "#FFC107", // 🎨 Mantiene su color original (amarillo dorado)
                            }}
                          />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* 📌 Paginación */}
      <TablePagination
  rowsPerPageOptions={[5, 10, 15]} // Opciones de filas por página
  component="div"
  count={filteredPropuestas.length} // 🔥 Total de filas
  rowsPerPage={rowsPerPage} // 🔥 Filas por página seleccionadas
  page={page} // 🔥 Página actual
  onPageChange={handleChangePage} // 🔄 Cambiar página
  onRowsPerPageChange={handleChangeRowsPerPage} // 🔄 Cambiar filas por página
  labelRowsPerPage={`Nº de Filas:`} // 🔥 Cambia el texto a "Filas: X"
/>

    </Paper>
  

      </Container>

    {/* Modal de detalle */}
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "90%", maxWidth: "800px", maxHeight: "90vh", bgcolor: "white", boxShadow: 24, p: 4, borderRadius: 2, overflowY: "auto"
      }}>
        <IconButton onClick={handleCloseModal} sx={{ position: "absolute", top: 16, right: 16 }}>
          <CloseIcon />
        </IconButton>
        {loadingDescription ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
            <CircularProgress sx={{ color: "#1e4b81" }} />
            <Typography variant="body2" sx={{ mt: 2, color: "#6c757d" }}>
              Cargando los detalles para implementar esta tarea...
            </Typography>
          </Box>
        ) : selectedTask ? (
          <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1e4b81" }}>
              {selectedTask.tarea}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "justify", color: "#4a4a4a", whiteSpace: "pre-line" }}>
              {selectedTask.descripcion}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "#6c757d", textAlign: "center" }}>
            No se encontró la tarea seleccionada.
          </Typography>
        )}
      </Box>
    </Modal>
    </Box>
  );
  
};

export default PropuestasMejora;
