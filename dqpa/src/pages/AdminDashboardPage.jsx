import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import SettingsIcon from "@mui/icons-material/Settings";

// Función genérica para llamadas al backend
const fetchData = async (url) => {
  const token = "TU_TOKEN_AQUI"; // Reemplaza con tu token real
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al cargar datos.");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Estados
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersData, questionsData, processesData] = await Promise.all([
          fetchData("http://localhost:9092/api/admin/users"),
          fetchData("http://localhost:9092/api/admin/preguntas"),
          fetchData("http://localhost:9092/api/admin/procesos"),
        ]);
        setUsers(usersData);
        setQuestions(questionsData);
        setProcesses(processesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Contar roles de usuario
  const roleCounts = users.reduce(
    (acc, user) => {
      if (user.role === "ROLE_PREMIUM") acc.premium += 1;
      else if (user.role === "ROLE_PREMIUMPRO") acc.premiumPro += 1;
      else if (user.role === "ROLE_FREEMIUM") acc.freemium += 1;
      return acc;
    },
    { premium: 0, premiumPro: 0, freemium: 0 }
  );

  // Contar procesos por niveles
  const processLevelCounts = processes.reduce((acc, process) => {
    const level = process.nivel || "Sin Nivel";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  // Datos de gráficos
  const userRoleChartData = {
    labels: ["Freemium", "Premium", "Premium Pro"],
    datasets: [
      {
        label: "Usuarios por Rol",
        data: [roleCounts.freemium, roleCounts.premium, roleCounts.premiumPro],
        backgroundColor: ["#D9D9D9", "#D37D36", "#1E4B81"],
        hoverOffset: 10,
      },
    ],
  };

  const processLevelChartData = {
    labels: Object.keys(processLevelCounts),
    datasets: [
      {
        label: "Niveles",
        data: Object.values(processLevelCounts),
        backgroundColor: ["#1E4B81", "#D37D36", "#D9D9D9", "#4BC0C0"],
        barThickness: 30,
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Función para renderizar botones con estilo dinámico
  const renderButton = (color, text, route) => (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#FFFFFF",
        color: color,
        fontWeight: "bold",
        boxShadow: 3,
        "&:hover": {
          backgroundColor: "#f5f5f5",
          boxShadow: 6,
        },
        marginTop: "1rem",
      }}
      onClick={() => navigate(route)}
    >
      {text}
    </Button>
  );

  return (
    <div style={{ padding: "5rem 2rem", height: "calc(100vh - 64px)" }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3}>
        {/* Usuarios */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#D9D9D9", boxShadow: 3 }}>
            <CardContent>
              <PeopleIcon fontSize="large" />
              <Typography variant="h6">Usuarios Totales</Typography>
              <Typography variant="h4">{users.length}</Typography>
              {renderButton("#D9D9D9", "Gestionar", "/admin-dashboard/usuarios")}
            </CardContent>
          </Card>
        </Grid>

        {/* Preguntas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#D37D36", color: "#fff", boxShadow: 3 }}>
            <CardContent>
              <QuizIcon fontSize="large" />
              <Typography variant="h6">Preguntas Totales</Typography>
              <Typography variant="h4">{questions.length}</Typography>
              {renderButton("#D37D36", "Gestionar", "preguntas")}
            </CardContent>
          </Card>
        </Grid>

        {/* Procesos */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#1E4B81", color: "#fff", boxShadow: 3 }}>
            <CardContent>
              <SettingsIcon fontSize="large" />
              <Typography variant="h6">Procesos Activos</Typography>
              <Typography variant="h4">{processes.length}</Typography>
              {renderButton("#1E4B81", "Gestionar", "procesos")}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} style={{ marginTop: "2rem" }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Distribución de Usuarios por Rol</Typography>
              <Box sx={{ height: "300px", display: "flex", justifyContent: "center" }}>
                <Doughnut data={userRoleChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Procesos por Nivel</Typography>
              <Box sx={{ height: "300px" }}>
                <Bar
                  data={processLevelChartData}
                  options={{
                    responsive: true,
                    scales: {
                      x: { title: { display: true, text: "Nivel" } },
                      y: { title: { display: true, text: "Número de Procesos" }, beginAtZero: true },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
