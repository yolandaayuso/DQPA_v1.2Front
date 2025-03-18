import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Edit, Delete, Add, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

const AdminProcesos = () => {
  const [procesos, setProcesos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add" | "edit"
  const [selectedProceso, setSelectedProceso] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    abreviatura: "",
    nivel: "",
    tipo: "",
  });
  const navigate = useNavigate();

  // Fetch Procesos
  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = async () => {
    try {
      const response = await fetch("http://localhost:9092/api/admin/procesos");
      const data = await response.json();
      setProcesos(data);
    } catch (error) {
      console.error("Error fetching procesos:", error);
    }
  };

  // Abrir Modal
  const handleOpenModal = (mode, proceso = {}) => {
    setModalMode(mode);
    setSelectedProceso(proceso);
    setFormData({
      nombre: proceso.nombre || "",
      abreviatura: proceso.abreviatura || "",
      nivel: proceso.nivel || "",
      tipo: proceso.tipo || "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Guardar Proceso
  const handleSave = async () => {
    try {
      const method = modalMode === "add" ? "POST" : "PUT";
      const url =
        modalMode === "add"
          ? "http://localhost:9092/api/admin/procesos/create"
          : `http://localhost:9092/api/admin/procesos/update/${selectedProceso._id}`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      fetchProcesos();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving proceso:", error);
    }
  };

  // Eliminar Proceso
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este proceso?")) {
      try {
        await fetch(`http://localhost:9092/api/admin/procesos/delete/${id}`, {
          method: "DELETE",
        });
        fetchProcesos();
      } catch (error) {
        console.error("Error deleting proceso:", error);
      }
    }
  };

  // Agrupar procesos por nivel
  const procesosPorNivel = procesos.reduce((acc, proceso) => {
    const key = proceso.nivel || "Sin Nivel";
    acc[key] = acc[key] || [];
    acc[key].push(proceso);
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
        <Typography color="text.primary">Gestión de Procesos</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Gestión de Procesos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal("add")}
        >
          Añadir Nuevo Proceso
        </Button>
      </Grid>

      {/* Procesos por Nivel */}
      {Object.entries(procesosPorNivel).map(([nivel, procesos]) => (
        <Card key={nivel} style={{ marginTop: "2rem" }}>
          <CardContent>
            <Typography
              variant="h6"
              style={{ color: "#1e4b81", fontWeight: "bold" }}
            >
              Nivel {nivel}
            </Typography>
            <Divider style={{ margin: "1rem 0" }} />
            {procesos.map((proceso) => (
              <Box
                key={proceso._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  background: "#f9f9f9",
                }}
              >
                <Box>
                  <Typography>
                    <strong>Nombre:</strong> {proceso.nombre}
                  </Typography>
                  <Typography>
                    <strong>Abreviatura:</strong> {proceso.abreviatura}
                  </Typography>
                  <Typography>
                    <strong>Tipo:</strong> {proceso.tipo}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton
                    onClick={() => handleOpenModal("edit", proceso)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(proceso._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            {modalMode === "add" ? "Añadir Proceso" : "Editar Proceso"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Abreviatura"
            value={formData.abreviatura}
            onChange={(e) =>
              setFormData({ ...formData, abreviatura: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nivel"
            type="number"
            value={formData.nivel}
            onChange={(e) =>
              setFormData({ ...formData, nivel: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Tipo"
            value={formData.tipo}
            onChange={(e) =>
              setFormData({ ...formData, tipo: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            style={{ marginTop: "1.5rem" }}
          >
            Guardar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminProcesos;
