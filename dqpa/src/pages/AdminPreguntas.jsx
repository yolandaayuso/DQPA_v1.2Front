import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete, Edit, Visibility, Add, Close, Clear } from "@mui/icons-material";
import { Breadcrumbs, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9092";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  overflowY: "auto",
  maxHeight: "90vh",
};

const AdminPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "view" | "add" | "edit"
  const [selectedPregunta, setSelectedPregunta] = useState({});
  const [tipoPregunta, setTipoPregunta] = useState("proceso"); // "proceso" o "general"
  const [filtroProceso, setFiltroProceso] = useState(""); // Estado para el proceso seleccionado
  const navigate = useNavigate(); // Inicializa navigate

  const [formData, setFormData] = useState({
    descripcion: "",
    proceso: "",
    general: 0,
    ayuda: "",
    respuestas: [{ descripcion: "", ponderacion: 0, tareas: [""] }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resPreguntas = await fetch(`${API_BASE_URL}/api/admin/preguntas`);
      const resProcesos = await fetch(`${API_BASE_URL}/api/admin/procesos`);      
      const preguntasData = await resPreguntas.json();
      const procesosData = await resProcesos.json();

      setPreguntas(preguntasData);
      setProcesos(procesosData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, pregunta = {}) => {
    setModalMode(mode);
    if (mode === "add") {
      setTipoPregunta("proceso");
      setFormData({
        descripcion: "",
        proceso: "",
        general: 0,
        ayuda: "",
        respuestas: [{ descripcion: "", ponderacion: 0, tareas: [""] }],
      });
    } else {
      setSelectedPregunta(pregunta);
      setTipoPregunta(pregunta.proceso ? "proceso" : "general");
      setFormData({
        descripcion: pregunta.descripcion || "",
        proceso: pregunta.proceso?._id || "",
        general: pregunta.general || 0,
        ayuda: pregunta.ayuda || "",
        respuestas:
          pregunta.respuestas?.map((resp) => ({
            descripcion: resp.descripcion || "",
            ponderacion: resp.ponderacion || 0,
            tareas: resp.tareas || [""],
          })) || [{ descripcion: "", ponderacion: 0, tareas: [""] }],
      });
    }
    setOpenModal(true);
  };
  const handleAddRespuesta = () => {
    if (modalMode === "view") return; // Evitar cambios en modo 'view'
    setFormData({
      ...formData,
      respuestas: [
        ...formData.respuestas,
        { descripcion: "", ponderacion: "", tareas: [""] }, // Nueva respuesta vacía
      ],
    });
  };
  const handleDeleteRespuesta = (index) => {
    if (modalMode === "view") return; // Evitar cambios en modo 'view'
    const updatedRespuestas = formData.respuestas.filter((_, i) => i !== index);
    setFormData({ ...formData, respuestas: updatedRespuestas });
  };
  
  const handleCloseModal = () => setOpenModal(false);

  const handleAddTarea = (respIndex) => {
    const updated = [...formData.respuestas];
    updated[respIndex].tareas.push("");
    setFormData({ ...formData, respuestas: updated });
  };

  const handleDeleteTarea = (respIndex, tareaIndex) => {
    const updated = [...formData.respuestas];
    updated[respIndex].tareas.splice(tareaIndex, 1);
    setFormData({ ...formData, respuestas: updated });
  };
// Aplica el filtro directamente antes de reducir



  const handleSave = async () => {
    
    try {
      const method = modalMode === "add" ? "POST" : "PUT";
      const url =
        modalMode === "add"
          ? `${API_BASE_URL}/api/admin/preguntas/create`// Nueva ruta para añadir
          : `${API_BASE_URL}/api/admin/preguntas/update/${selectedPregunta._id}`; // Nueva ruta para actualizar
  
      const payload = {
        descripcion: formData.descripcion,
        ayuda: formData.ayuda,
        respuestas: formData.respuestas,
        ...(tipoPregunta === "proceso"
          ? { proceso: formData.proceso }
          : { general: formData.general }),
      };
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar la pregunta");
      }
  
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
    }
  };
  const handleDeletePregunta = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta pregunta?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/preguntas/delete/${id}`,
          { method: "DELETE" }
        );
  
        if (!response.ok) {
          throw new Error("Error al eliminar la pregunta");
        }
  
        fetchData(); // Recargar las preguntas después de eliminar
      } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
      }
    }
  };
  

// Filtrado de preguntas según el proceso seleccionado
const preguntasFiltradas = filtroProceso
  ? preguntas.filter((pregunta) => pregunta.proceso?.nombre === filtroProceso)
  : preguntas;

// Generar las preguntas categorizadas por proceso usando las preguntas filtradas
const preguntasPorProceso = preguntasFiltradas.reduce((acc, pregunta) => {
  const key = pregunta.proceso?.nombre || "General";
  acc[key] = acc[key] || [];
  acc[key].push(pregunta);
  return acc;
}, {});


  return (
    <div style={{ padding: "6rem 2rem 2rem", minHeight: "100vh" }}>
      {/* Breadcrumb */}
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    <Link
      underline="hover"
      color="inherit"
      onClick={() => navigate("/admin-dashboard")}
      style={{ cursor: "pointer" }}
    >
      Panel de Administración
    </Link>
    <Typography color="text.primary">Gestión de Preguntas</Typography>
  </Breadcrumbs>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Gestión de Preguntas</Typography>
        <FormControl fullWidth style={{ marginTop: "1rem", marginBottom: "1rem" }}>
  <InputLabel>Filtrar por Proceso</InputLabel>
  <Select
    value={filtroProceso}
    onChange={(e) => setFiltroProceso(e.target.value)}
  >
    <MenuItem value="">Todos</MenuItem>
    {procesos.map((proceso) => (
      <MenuItem key={proceso._id} value={proceso.nombre}>
        {proceso.nombre}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal("add")}>
          Añadir Nueva Pregunta
        </Button>
      </Grid>

      {Object.entries(preguntasPorProceso).map(([proceso, preguntas]) => (
        <Card key={proceso} style={{ marginTop: "2rem" }}>
          <CardContent>
          <Typography variant="h6" style={{ color: "#1e4b81", fontWeight: "bold" }}>
  {proceso}
</Typography>
          <Divider style={{ margin: "1rem 0" }} />
            {preguntas.map((pregunta) => (
              <Box
                key={pregunta._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                style={{ marginBottom: "1rem", padding: "1rem", background: "#f9f9f9" }}
              >
                <Typography>{pregunta.descripcion}</Typography>
                <Box display="flex" gap={1}>
                  <IconButton onClick={() => handleOpenModal("view", pregunta)}>
                    <Visibility sx={{ color: "blue" }} />
                  </IconButton>
                  <IconButton onClick={() => handleOpenModal("edit", pregunta)}>
                    <Edit sx={{ color: "orange" }} />
                  </IconButton>
                  <IconButton>
                  <IconButton onClick={() => handleDeletePregunta(pregunta._id)}>
  <Delete sx={{ color: "red" }} />
</IconButton>
                  </IconButton>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}

<Modal open={openModal} onClose={handleCloseModal}>
  <Box sx={modalStyle}>
    {/* Encabezado del Modal */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">
        {modalMode === "add"
          ? "Añadir Nueva Pregunta"
          : modalMode === "edit"
          ? "Editar Pregunta"
          : "Detalles de la Pregunta"}
      </Typography>
      <IconButton onClick={handleCloseModal}>
        <Close />
      </IconButton>
    </Box>

    {/* Tipo de Pregunta */}
    {modalMode === "add" && (
      <FormControl fullWidth margin="normal">
        <InputLabel>Tipo de Pregunta</InputLabel>
        <Select
          value={tipoPregunta}
          onChange={(e) => setTipoPregunta(e.target.value)}
        >
          <MenuItem value="proceso">Pregunta de Proceso</MenuItem>
          <MenuItem value="general">Pregunta General</MenuItem>
        </Select>
      </FormControl>
    )}

    {/* Descripción */}
    <TextField
      fullWidth
      margin="normal"
      label="Descripción"
      value={formData.descripcion}
      onChange={(e) =>
        setFormData({ ...formData, descripcion: e.target.value })
      }
      disabled={modalMode === "view"}
    />

    {/* Ayuda */}
    <TextField
      fullWidth
      margin="normal"
      label="Ayuda"
      value={formData.ayuda}
      onChange={(e) => setFormData({ ...formData, ayuda: e.target.value })}
      disabled={modalMode === "view"}
    />

    {/* Proceso o General */}
    {tipoPregunta === "proceso" ? (
      <FormControl fullWidth margin="normal" disabled={modalMode === "view"}>
        <InputLabel>Proceso</InputLabel>
        <Select
          value={formData.proceso}
          onChange={(e) =>
            setFormData({ ...formData, proceso: e.target.value })
          }
        >
          {procesos.map((proceso) => (
            <MenuItem key={proceso._id} value={proceso._id}>
              {proceso.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <TextField
        fullWidth
        margin="normal"
        label="General"
        type="number"
        value={formData.general}
        onChange={(e) =>
          setFormData({ ...formData, general: e.target.value })
        }
        disabled={modalMode === "view"}
      />
    )}

    {/* Respuestas */}
    {formData.respuestas.map((resp, respIndex) => (
      <Box
        key={respIndex}
        style={{
          marginTop: "1.5rem",
          borderBottom: "1px solid #ccc",
          paddingBottom: "1rem",
        }}
      >
        <Typography variant="subtitle1">Respuesta {respIndex + 1}</Typography>

        {/* Descripción Respuesta */}
        <TextField
          fullWidth
          margin="normal"
          label="Descripción de la Respuesta"
          value={resp.descripcion}
          onChange={(e) => {
            const updated = [...formData.respuestas];
            updated[respIndex].descripcion = e.target.value;
            setFormData({ ...formData, respuestas: updated });
          }}
          disabled={modalMode === "view"}
        />

        {/* Ponderación */}
        <TextField
          fullWidth
          margin="normal"
          label="Ponderación"
          type="number"
          value={resp.ponderacion}
          onChange={(e) => {
            const updated = [...formData.respuestas];
            updated[respIndex].ponderacion = e.target.value;
            setFormData({ ...formData, respuestas: updated });
          }}
          disabled={modalMode === "view"}
        />

        {/* Tareas (si ponderación < 100) */}
        {resp.ponderacion < 100 &&
          resp.tareas.map((tarea, tareaIndex) => (
            <Box key={tareaIndex} display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                margin="normal"
                label={`Tarea ${tareaIndex + 1}`}
                value={tarea}
                onChange={(e) => {
                  const updated = [...formData.respuestas];
                  updated[respIndex].tareas[tareaIndex] = e.target.value;
                  setFormData({ ...formData, respuestas: updated });
                }}
                disabled={modalMode === "view"}
              />
              {modalMode !== "view" && (
                <IconButton
                  color="error"
                  onClick={() => handleDeleteTarea(respIndex, tareaIndex)}
                >
                  <Clear />
                </IconButton>
              )}
            </Box>
          ))}

        {/* Botón para añadir tarea */}
        {modalMode !== "view" && resp.ponderacion < 100 && (
          <Button
            variant="outlined"
            onClick={() => handleAddTarea(respIndex)}
            style={{ marginTop: "1rem" }}
          >
            Añadir Tarea
          </Button>
        )}

        {/* Botón para eliminar respuesta */}
        {modalMode !== "view" && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteRespuesta(respIndex)}
            style={{ marginTop: "1rem" }}
          >
            Eliminar Respuesta
          </Button>
        )}
      </Box>
    ))}

    {/* Botón para añadir Respuesta */}
    {modalMode !== "view" && (
      <Button
        variant="outlined"
        onClick={handleAddRespuesta}
        style={{ marginTop: "1rem" }}
      >
        Añadir Respuesta
      </Button>
    )}

    {/* Botón Guardar */}
    {modalMode !== "view" && (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSave}
        style={{ marginTop: "2rem" }}
      >
        Guardar
      </Button>
    )}
  </Box>
</Modal>


    </div>
  );
};

export default AdminPreguntas;
