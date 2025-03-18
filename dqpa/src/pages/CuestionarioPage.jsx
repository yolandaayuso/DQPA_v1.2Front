import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";

const CuestionarioPage = () => {
  const { cuestionarioId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCompleted = new URLSearchParams(location.search).get('completed') === 'true';
  const autoevaluacionId  =  cuestionarioId
  const [cuestionario, setCuestionario] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [procesosFiltrados, setProcesosFiltrados] = useState([]);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('Todos los niveles');
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [ayudaSeleccionada, setAyudaSeleccionada] = useState('');
  const [dialogoInstruccionesAbierto, setDialogoInstruccionesAbierto] = useState(true);
  const [isLoadingFinalizar, setIsLoadingFinalizar] = useState(false);

  useEffect(() => {
    const fetchCuestionario = async () => {
      try {
        const token = Cookies.get('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log("este es el cuestionario Id")
        console.log(cuestionarioId)
        const response = await axios.get(
          `http://localhost:9092/api/autoevaluaciones/obtenerOptimizado/${autoevaluacionId}`,
          config
        );
        console.log(response.data);
        const cuestionarioData = response.data.cuestionario;
  
        // Actualizar cuestionario y progreso
        setCuestionario(cuestionarioData);
        setProgreso(cuestionarioData.progreso);
  
        // Inicializar respuestas seleccionadas
        const initialRespuestas = {};
        [...(cuestionarioData.preguntasGenerales || []), ...(cuestionarioData.preguntasPorProceso || [])].forEach((pregunta) => {
          if (pregunta.respuestaSeleccionada) {
            initialRespuestas[pregunta.pregunta] = pregunta.respuestaSeleccionada;
          }
        });
        setRespuestasSeleccionadas(initialRespuestas);
  
        // Mapear preguntas generales por nivel
        const preguntasGeneralesPorNivel = (cuestionarioData.preguntasGenerales || []).reduce((acc, pregunta) => {
          const nivel = pregunta.general || 'Sin Nivel';
          if (!acc[nivel]) {
            acc[nivel] = { proceso: { _id: `general-${nivel}`, nombre: `Preguntas Generales Nivel ${nivel}`, nivel: nivel }, preguntas: [] };
          }
          acc[nivel].preguntas.push(pregunta);
          return acc;
        }, {});
  
        // Mapear preguntas por proceso
        const procesosMap = (cuestionarioData.preguntasPorProceso || []).reduce((acc, pregunta) => {
          const procesoId = pregunta.proceso?._id;
          if (!procesoId) return acc; // Ignorar preguntas sin proceso
          if (!acc[procesoId]) {
            acc[procesoId] = { proceso: pregunta.proceso, preguntas: [] };
          }
          acc[procesoId].preguntas.push(pregunta);
          return acc;
        }, {});
  
        // Combinar procesos y preguntas generales
        const procesosList = [...Object.values(procesosMap), ...Object.values(preguntasGeneralesPorNivel)];
        setProcesos(procesosList);
        setProcesosFiltrados(procesosList);
  
        // Seleccionar el primer proceso si hay disponibles
        if (procesosList.length > 0) {
          seleccionarProceso(procesosList[0]?.proceso._id, procesosList);
        }
      } catch (error) {
        console.error('Error al cargar el cuestionario:', error);
      }
    };
  
    fetchCuestionario();
  }, [autoevaluacionId]);
  

  const cerrarDialogoInstrucciones = () => {
    setDialogoInstruccionesAbierto(false);
  };
  const filtrarPorNivel = (nivel) => {
    setNivelSeleccionado(nivel);
  
    if (nivel === 'Todos los niveles') {
      // Si selecciona "Todos los niveles", no aplicar filtro
      setProcesosFiltrados(procesos);
    } else {
      const nivelInt = parseInt(nivel, 10);
      const filtrados = procesos.filter((p) => {
        const procesoNivel = p.proceso.nivel;
        return procesoNivel === nivelInt || p.proceso.nombre.includes(`Nivel ${nivel}`);
      });
  
      setProcesosFiltrados(filtrados);
  
      if (filtrados.length > 0) {
        seleccionarProceso(filtrados[0]?.proceso._id, filtrados);
      } else {
        setProcesoSeleccionado(null);
        setPreguntas([]);
      }
    }
  };
  

  const seleccionarProceso = (procesoId, listaProcesos) => {
    setProcesoSeleccionado(procesoId);
    const proceso = listaProcesos.find((p) => p.proceso._id === procesoId);
    setPreguntas(proceso?.preguntas || []);
  };
  
  

  const manejarSeleccionRespuesta = async (preguntaId, respuestaId) => {
    if (isCompleted) return;
  
    // Actualiza el estado local primero para una mejor experiencia de usuario
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: respuestaId,
    }));
  
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      // Llamar al backend para actualizar el cuestionario
      const payload = { preguntaId, respuesta: respuestaId }; // Cambiado a 'respuesta'
      const response = await axios.put(
        `http://localhost:9092/api/autoevaluaciones/actualizar/${cuestionario._id}`,
        payload,
        config
      );
  
      // Actualizar el progreso y las respuestas del cuestionario localmente
      setProgreso(response.data.cuestionario.progreso);
      setCuestionario(response.data.cuestionario);
    } catch (error) {
      
    }
  };
  
  const abrirDialogoAyuda = (ayuda) => {
    setAyudaSeleccionada(ayuda);
    setDialogoAbierto(true);
  };

  const cerrarDialogoAyuda = () => {
    setDialogoAbierto(false);
    setAyudaSeleccionada('');
  };

  const finalizarCuestionario = async () => {
    if (isCompleted) {
      navigate('/autoevaluaciones');
      return;
    }
  
    const totalPreguntas = cuestionario.preguntasRespuestas ? cuestionario.preguntasRespuestas.length : 0;
    const respondidas = Object.keys(respuestasSeleccionadas).length;
  
    if (respondidas < totalPreguntas || totalPreguntas === 0) {
      Swal.fire({
        title: '¿Deseas salir del cuestionario?',
        text: 'Aún no has completado todas las preguntas. Puedes continuar más tarde.',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#A5D6A7',
        cancelButtonColor: '#EF9A9A',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setIsLoadingFinalizar(true); // 🔥 Activa el spinner
            const token = Cookies.get('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
  
            const payload = {
              respuestas: cuestionario.preguntasRespuestas?.map((pr) => ({
                pregunta: pr.pregunta,
                respuestaSeleccionada: respuestasSeleccionadas[pr.pregunta] || null,
              })) || [],
            };
  
            await axios.post(
              `http://localhost:9092/api/autoevaluaciones/guardarProgreso/${cuestionario._id}`,
              payload,
              config
            );
  
            navigate('/autoevaluaciones');
          } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el progreso.', 'error');
          } finally {
            setIsLoadingFinalizar(false); // 🔥 Desactiva el spinner
          }
        }
      });
      return;
    }
  
    Swal.fire({
      title: '¿Finalizar el cuestionario?',
      text: 'Has respondido todas las preguntas.',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A5D6A7',
      cancelButtonColor: '#EF9A9A',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoadingFinalizar(true); // 🔥 Activa el spinner
          const token = Cookies.get('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
  
          const payload = {
            respuestas: cuestionario.preguntasRespuestas?.map((pr) => ({
              pregunta: pr.pregunta,
              respuestaSeleccionada: respuestasSeleccionadas[pr.pregunta] || null,
            })) || [],
          };
  
          await axios.post(
            `http://localhost:9092/api/autoevaluaciones/finalizarCuestionario/${cuestionario._id}`,
            payload,
            config
          );
  
          navigate('/autoevaluaciones');
        } catch (error) {
          Swal.fire('Error', 'No se pudo finalizar el cuestionario.', 'error');
        } finally {
          setIsLoadingFinalizar(false); // 🔥 Desactiva el spinner
        }
      }
    });
  };
  

  if (!cuestionario) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

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
    <Typography sx={{ color: "#d37d36", fontWeight: "bold" }}>
      Cuestionario   </Typography>
  </Breadcrumbs>
</Box>


  {/* 🔹 Aquí empieza la estructura principal con las columnas */}
  <Box sx={{ display: 'flex', flex: 1, height: '100vh' }}>
    
    {/* 🏷️ Sidebar de procesos */}
    <Box sx={{ width: '20%', bgcolor: '#f3f4f6', p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
  <InputLabel id="nivel-select-label">Filtrar por Nivel</InputLabel>
  <Select
    labelId="nivel-select-label"
    value={nivelSeleccionado}
    onChange={(e) => filtrarPorNivel(e.target.value)}
    sx={{
      borderRadius: "8px",
      bgcolor: "#fff",
      fontWeight: "bold",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1E4B81" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E4B81" },
    }}
  >
    <MenuItem value="Todos los niveles">🔹 Todos los niveles</MenuItem>
    <MenuItem value="1">🔹 Nivel 1</MenuItem>
    <MenuItem value="2">🔹 Nivel 2</MenuItem>
    <MenuItem value="3">🔹 Nivel 3</MenuItem>
  </Select>
</FormControl>


      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Procesos
      </Typography>

      {/* Lista de procesos */}
      {procesosFiltrados.map((p) => {
        const preguntasTotales = p.preguntas.length;
        const preguntasRespondidas = p.preguntas.filter(
          (pregunta) => respuestasSeleccionadas[pregunta.pregunta]
        ).length;
        const completado = preguntasTotales === preguntasRespondidas;

        return (
          <Paper
            key={p.proceso._id}
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: procesoSeleccionado === p.proceso._id ? '2px solid #1e4b81' : '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': { boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' },
            }}
            onClick={() => seleccionarProceso(p.proceso._id, procesosFiltrados)}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: procesoSeleccionado === p.proceso._id ? 'bold' : 'normal', color: completado ? '#4caf50' : '#000' }}
            >
              {p.proceso.nombre}
            </Typography>
          </Paper>
        );
      })}
    </Box>

      <Box sx={{ width: '55%' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          {procesoSeleccionado
            ? `Preguntas de ${procesosFiltrados.find((p) => p.proceso._id === procesoSeleccionado)?.proceso.nombre}`
            : 'Seleccione un proceso'}
        </Typography>
       

        {preguntas.map((p) => (
          <Paper
  key={p.pregunta}
  sx={{
    p: 3, // Más padding para mejor lectura
    mb: 2,
    borderRadius: '10px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)', // Sombra suave
    transition: '0.2s',
    "&:hover": { 
      boxShadow: '0 5px 12px rgba(0, 0, 0, 0.15)', // Efecto al pasar el mouse
      transform: "translateY(-2px)" // Pequeño efecto de elevación
    },
  }}
>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography sx={{ mb: 2, fontWeight: 'bold', flex: 1 }}>{p.descripcion}</Typography>
      {p.ayuda && (
        <Tooltip title="Ver ayuda" placement="top" arrow>
          <IconButton
            sx={{
              color: '#d37d36',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              borderRadius: '50%',
              ml: 2,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
            onClick={() => abrirDialogoAyuda(p.ayuda)}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {p.respuestas.map((r) => (
        <FormControlLabel
          key={r._id}
          control={
            <Checkbox
              checked={respuestasSeleccionadas[p.pregunta] === r._id}
              disabled={isCompleted}
              onChange={() => manejarSeleccionRespuesta(p.pregunta, r._id)}
            />
          }
          label={r.descripcion}
        />
      ))}
    </Box>
  </Paper>
))}

      </Box>

      <Box
  sx={{
    width: '25%',
    p: 3,
    borderRadius: '8px',
  }}
>
  {/* Título de progreso */}
  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e4b81' }}>
    Tu Progreso
  </Typography>

  {/* Barra de progreso general */}
  <Box sx={{ mb: 3 }}>
    <Typography sx={{ mb: 1 }}>Progreso Total: {progreso}%</Typography>
    <LinearProgress
      variant="determinate"
      value={progreso}
      sx={{
        height: '10px',
        borderRadius: '5px',
        '& .MuiLinearProgress-bar': {
          backgroundColor: '#1e4b81',
        },
      }}
    />
  </Box>

  {/* Detalles de los procesos */}
  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: '#1e4b81' }}>
    Procesos completados: {procesos.filter((p) => p.preguntas.length === p.preguntas.filter((pregunta) => respuestasSeleccionadas[pregunta.pregunta]).length).length}/{procesos.length}
  </Typography>

  {/* Lista de procesos con estado */}
  <Box>
    {procesos.map((p) => {
      const preguntasTotales = p.preguntas.length;
      const preguntasRespondidas = p.preguntas.filter((pregunta) => respuestasSeleccionadas[pregunta.pregunta]).length;
      const completado = preguntasTotales === preguntasRespondidas;

      return (
        <Box
          key={p.proceso._id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
            p: 1,
            borderRadius: '4px',
            backgroundColor: completado ? '#e8f5e9' : '#fff',
            boxShadow: completado ? '0 1px 3px rgba(0, 128, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: completado ? '#4caf50' : '#000',
              fontWeight: completado ? 'bold' : 'normal',
            }}
          >
            {p.proceso.nombre}
          </Typography>
          {completado ? (
            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
          ) : (
            <Typography variant="body2" sx={{ color: '#ff5722', fontSize: 12 }}>
              {preguntasRespondidas}/{preguntasTotales}
            </Typography>
          )}
        </Box>
      );
    })}
  </Box>
{/* 🔹 Botón para ver instrucciones */}
<Button
  variant="contained"
  fullWidth
  startIcon={<TipsAndUpdatesOutlinedIcon />} // Bombilla moderna
  sx={{
    mb: 2, // Margen inferior para separar del botón de finalizar
    bgcolor: "#FFE082", // Amarillo dorado
    color: "#000", // Texto en negro
    fontWeight: "bold",
    textTransform: "none", // Mantiene el texto sin mayúsculas forzadas
    "&:hover": {
      bgcolor: "#FFC107", // Un amarillo más oscuro en hover
    },
  }}
  onClick={() => navigate(`/instrucciones/${cuestionarioId}`)}
>
  Ver Instrucciones
</Button>

<Button
  variant="contained"
  fullWidth
  sx={{
    mt: 3,
    py: 1.5, // Hace el botón más alto
    fontSize: "1.1rem", // Texto más grande
    fontWeight: "bold",
    bgcolor: isLoadingFinalizar ? "#FFC107" : "#1e4b81", // Amarillo si está cargando
    color: "#fff",
    boxShadow: "0px 4px 10px rgba(30, 75, 129, 0.3)",
    borderRadius: "8px",
    transition: "0.3s",
    "&:hover": { 
      bgcolor: isLoadingFinalizar ? "#FFA000" : "#163a63",
      transform: isLoadingFinalizar ? "none" : "scale(1.05)",
    },
  }}
  disabled={isLoadingFinalizar} // 🔥 Deshabilita el botón mientras carga
  onClick={finalizarCuestionario}
>
  {isLoadingFinalizar ? (
    <>
      <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} /> Finalizando...
    </>
  ) : (
    isCompleted ? "Finalizar Revisión" : "Finalizar Cuestionario"
  )}
</Button>


</Box>


      <Dialog open={dialogoAbierto} onClose={cerrarDialogoAyuda}>
        <DialogTitle>Ayuda</DialogTitle>
        <DialogContent>
          <Typography>{ayudaSeleccionada}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
    </Box>

  );
};

export default CuestionarioPage;
