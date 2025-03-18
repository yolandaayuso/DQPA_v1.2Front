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
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Delete, Edit, Visibility, Add } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

// Generador de contraseñas robustas
const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  return Array.from({ length: 12 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

// Estilo del modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  overflowY: "auto",
  maxHeight: "80vh",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "view" | "edit" | "add"
  const [formData, setFormData] = useState({
    email: "",
    emailSoporte: "",
    empresa: "",
    ubicacion: "",
    sector: "",
    numEmpleados: "",
    password: generatePassword(),
  });

  const navigate = useNavigate();

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9092/api/admin/users");
      const data = await response.json();
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedData);
      setFilteredUsers(sortedData);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, user = {}) => {
    setModalMode(mode);
    setFormData(
      mode === "add"
        ? {
            email: "",
            emailSoporte: "",
            empresa: "",
            ubicacion: "",
            sector: "",
            numEmpleados: "",
            password: generatePassword(),
          }
        : { ...user }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({});
  };

  const handleSave = async () => {
    const payload = { ...formData };

    try {
      if (modalMode === "add") {
        await fetch("http://localhost:9092/api/admin/users/premiumpro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (modalMode === "edit") {
        await fetch(
          `http://localhost:9092/api/admin/users/update/${formData._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error al ${modalMode === "add" ? "crear" : "actualizar"} usuario:`,
        error
      );
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await fetch(`http://localhost:9092/api/admin/users/delete/${id}`, {
          method: "DELETE",
        });
        fetchUsers();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setRoleFilter(value);
    if (value) {
      setFilteredUsers(users.filter((user) => user.role === value));
    } else {
      setFilteredUsers(users);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
        <Typography color="text.primary">Gestión de Usuarios</Typography>
      </Breadcrumbs>

      {/* Encabezado */}
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h5">Total de Usuarios: {users.length}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filtrar por Rol</InputLabel>
            <Select value={roleFilter} label="Filtrar por Rol" onChange={handleFilterChange}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ROLE_FREEMIUM">Freemium</MenuItem>
              <MenuItem value="ROLE_PREMIUM">Premium</MenuItem>
              <MenuItem value="ROLE_PREMIUMPRO">Premium Pro</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal("add")}
          >
            Añadir Nuevo Usuario
          </Button>
        </Grid>
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal("view", user)}>
                    <Visibility sx={{ color: "blue" }} />
                  </Button>
                  <Button onClick={() => handleOpenModal("edit", user)}>
                    <Edit sx={{ color: "orange" }} />
                  </Button>
                  <Button onClick={() => handleDeleteUser(user._id)}>
                    <Delete sx={{ color: "red" }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {modalMode === "add"
                ? "Añadir Nuevo Usuario"
                : modalMode === "edit"
                ? "Editar Usuario"
                : "Detalles del Usuario"}
            </Typography>
            <Button onClick={handleCloseModal} sx={{ color: "black", fontWeight: "bold" }}>
              ✖
            </Button>
          </Box>
          {Object.entries(formData)
            .filter(([key]) => key !== "_id" && key !== "__v")
            .map(([key, value]) => (
              <TextField
                key={key}
                fullWidth
                margin="normal"
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value || ""}
                disabled={modalMode === "view"}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            ))}
          {modalMode !== "view" && (
            <Button variant="contained" color="primary" fullWidth onClick={handleSave} sx={{ mt: 2 }}>
              Guardar
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminUsers;
