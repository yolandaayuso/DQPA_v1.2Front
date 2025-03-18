import React, { useEffect, useState } from 'react';

import { Box, Typography, CircularProgress, Button, Grid, Modal } from '@mui/material';
import { Doughnut, PolarArea, Line, Bar as ChartBar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import ReactECharts from 'echarts-for-react';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {jwtDecode} from 'jwt-decode'; // Importa jwt-decode
import html2canvas from 'html2canvas'; // Para capturar gráficos
import DownloadIcon from '@mui/icons-material/Download';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import ReactApexChart from "react-apexcharts";
import MuiTooltip from "@mui/material/Tooltip"; // ✅ Renombrado
import axiosInstance from '../axiosInstance';
import { Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {  Link } from "@mui/material";
import { ToggleButtonGroup, ToggleButton, Avatar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";  // Icono de proceso
import InfoIcon from "@mui/icons-material/Info";          // Icono de información
import {useRef} from 'react'; // Para capturar gráficos
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js';
import { color } from 'echarts';

// Registrar los elementos necesarios para los gráficos
ChartJS.register(
  ArcElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const DashboardResultados = () => {
  const { cuestionarioId } = useParams();
  const [resultados, setResultados] = useState(null);
  const [detalleProceso, setDetalleProceso] = useState(null);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [propuestas, setPropuestas] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [graficoData, setGraficoData] = useState(null);
  const colors = ['#1e4b81', '#d37d36', '#d9d9d9']; // Colores para los sectores
  const { showTooltip, hideTooltip, tooltipData, tooltipTop, tooltipLeft } = useTooltip();
  const [nivelSeleccionado, setNivelSeleccionado] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9092";

const [graficoRadarData, setGraficoRadarData] = useState({
  labels: [], 
  series: [{ data: [] }]
});
const chartRef = useRef(null); 




  const navigate = useNavigate(); // Hook para redirección
  

  // Colores para los gráficos
  const tipoColores = {
    gestion: '#d37d36',
    gobierno: '#1e4b81',
    calidad: '#d9d9d9',
  };

  const polarAreaColors = ['#1e4b81', '#d37d36', '#d9d9d9'];

  useEffect(() => {
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role; 
    setUserRole(role);
  
    const fetchData = async () => {
      try {
        const resultadosRes = await axiosInstance.get(
          `${API_BASE_URL}/api/autoevaluaciones/resultados/${cuestionarioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const data = resultadosRes.data;
        setResultados(data);
        console.log(data)
        // Si el endpoint incluye autoevaluacion.tareas (por ejemplo, data.tareas), se asignan
        if (data.tareas && data.tareas.length > 0) {
          setPropuestas(data.tareas);
        }
      } catch (err) {
        console.error("Error al cargar resultados", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [cuestionarioId]);
  
  

  const handleOpenModal = async (proceso) => {
    try {
      const token = Cookies.get('token');
      // Se añade el cuestionarioId a la URL
      const response = await axios.get(
        `${API_BASE_URL}/api/autoevaluaciones/procesos/${proceso.procesoId}/detalle/${cuestionarioId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Extraer datos para el gráfico radar: se espera recibir un objeto con { preguntas: [...] }
      const preguntas = response.data.preguntas || [];
      const labels = preguntas.map(p => p.descripcion);
      const valores = preguntas.map(p => p.ponderacion);
  
      setGraficoRadarData({
        labels,
        series: [{
          name: "Ponderación",
          data: valores
        }]
      });
  
      setSelectedProceso(proceso);
      setModalOpen(true);
    } catch (err) {
      console.error('Error al cargar detalle del proceso:', err);
    }
  };
  
  
  

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProceso(null);
    setDetalleProceso(null);
  };

 
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  
    const marginX = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
  
    // 🔹 Obtener datos de la API
    const token = Cookies.get("token");
    const autoevaluacionId = cuestionarioId;
  
    const [cuestionarioResponse, resultadosResponse, propuestasResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/autoevaluaciones/obtenerOptimizado/${autoevaluacionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE_URL}/api/autoevaluaciones/resultados/${autoevaluacionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE_URL}/api/autoevaluaciones/${autoevaluacionId}/propuestas-con-descripcion`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
  
    const autoevaluacion = cuestionarioResponse.data;
    const resultados = resultadosResponse.data;
    const propuestas = propuestasResponse.data;
    const totalProcesosEvaluados = resultados.resultadosPorProceso.length;
  
    // 🔹 1️⃣ Portada sin imagen, solo título
    doc.setFontSize(24);
    doc.setTextColor("#1e4b81");
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DE RESULTADOS", centerX, 30, null, null, "center");
  
    // 📅 Fecha
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.setTextColor("#000");
    doc.text(`Fecha de Evaluación: ${new Date(autoevaluacion.fecha).toLocaleDateString()}`, centerX, 40, null, null, "center");
  
    doc.addPage();
  
    // 🔹 2️⃣ Introducción
    doc.setFontSize(18);
    doc.setTextColor("#1e4b81");
    doc.setFont("helvetica", "bold");
    doc.text("1. Introducción", marginX, 20);
  
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.setFont("helvetica", "normal");
    doc.text(
      "Este informe presenta los resultados de una autoevaluación de procesos de datos, realizada bajo las especificaciones de las normas UNE 0077, 0078, 0079 y 0080.",
      marginX,
      30,
      { maxWidth: 180 }
    );
    doc.text(
      "La evaluación permite determinar el nivel de madurez en la gestión de datos de la organización, identificando fortalezas y áreas de mejora en aspectos clave como gobierno, calidad y gestión de datos.",
      marginX,
      40,
      { maxWidth: 180 }
    );
    doc.text(`📅 Fecha de Autoevaluación: ${new Date(autoevaluacion.fecha).toLocaleDateString()}`, marginX, 55);
    doc.text(`📊 Total de Procesos Evaluados: ${totalProcesosEvaluados}`, marginX, 65);
  
    doc.addPage();
  
    // 🔹 3️⃣ Nivel de Madurez con gráfico
    doc.setFontSize(18);
    doc.setTextColor("#1e4b81");
    doc.setFont("helvetica", "bold");
    doc.text("2. Nivel de Madurez", marginX, 20);
  
    const nivelCapacidadChart = chartRef.current;
  
    if (nivelCapacidadChart) {
      const chartCanvas = await html2canvas(nivelCapacidadChart, { scale: 2, useCORS: true });
      const imgData = chartCanvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", marginX, 30, 160, 80);
    } else {
      doc.setFontSize(14);
      doc.setTextColor("#d37d36");
      doc.text("⚠️ No se pudo capturar el gráfico de nivel de capacidad.", marginX, 40);
    }

    
  
    doc.addPage();
  
    // 🔹 4️⃣ Resultados por proceso
    doc.setFontSize(18);
    doc.setTextColor("#1e4b81");
    doc.setFont("helvetica", "bold");
    doc.text("3. Resultados de Procesos Evaluados", marginX, 20);
  
    autoTable(doc, {
      startY: 30,
      headStyles: { fillColor: "#1e4b81", textColor: "#ffffff" },
      styles: { fontSize: 10, textColor: "#000" },
      head: [["Proceso", "Tipo", "Nivel de Capacidad"]],
      body: resultados.resultadosPorProceso.map((proceso) => [
        proceso.nombre,
        proceso.tipo,
        proceso.nivelCapacidad,
      ]),
    });
  
    doc.addPage();
  
    // 🔹 5️⃣ Propuestas de Mejora con Tarea, Descripción, Prioridad y Proceso
    doc.setFontSize(18);
    doc.setTextColor("#d37d36");
    doc.setFont("helvetica", "bold");
    doc.text("4. Propuestas de Mejora", marginX, 20);
  
    autoTable(doc, {
      startY: 30,
      headStyles: { fillColor: "#d37d36", textColor: "#ffffff" },
      styles: { fontSize: 10, textColor: "#000" },
      head: [["#", "Proceso", "Tarea", "Descripción", "Prioridad"]],
      body: propuestas.map((prop, index) => [
        index + 1,
        prop.procesoNombre, // 🔥 Nuevo: Nombre del proceso al que pertenece la propuesta
        prop.tarea,
        prop.descripcion,
        prop.prioridad,
      ]),
    });
  
    // 🔥 Pie de página en todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor("#555");
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, 285);
    }
  
    // 📥 Descargar el PDF
    doc.save(`Informe_Autoevaluacion_${new Date().toLocaleDateString()}.pdf`);
  };
  
  
  
  
 
  
  
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (!resultados) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          No se pudieron cargar los resultados. Intenta de nuevo más tarde.
        </Typography>
      </Box>
    );
  }

  // Totales por tipo
  const totalesPorTipo = {
    gestion: resultados.resultadosPorProceso.filter((r) => r.tipo === 'Gestion').length,
    gobierno: resultados.resultadosPorProceso.filter((r) => r.tipo === 'Gobierno').length,
    calidad: resultados.resultadosPorProceso.filter((r) => r.tipo === 'Calidad').length,
  };

  const totalProcesos = resultados.resultadosPorProceso.length;


  const NivelMadurezGauge = ({ nivelMadurez }) => {
    const colors = ["#D6E6F2", "#A3C9E2", "#5B92E5", "#1E4B81"]; 
    // Azul muy claro → Azul medio pastel → Azul más fuerte → Azul oscuro
      
    const options = {
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 3,
          splitNumber: 3,
          
          pointer: {
            show: true,
            length: "75%",
            width: 6,
            itemStyle: {
              color:" #d37d36"
            }
          },
          axisLine: {
            lineStyle: {
              width: 18,
              color: [
                [1 / 3, colors[0]], // 0 - Rojo
                [2 / 3, colors[1]], // 1 - Naranja
                [3 / 3, colors[2]], // 2 - Amarillo
                [1, colors[3]] // 3 - Verde
              ]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 20,
            lineStyle: {
              width: 3,
              color: "#fff"
            }
          },
          axisLabel: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            distance: -50, // 🔥 Ubica los números encima de las divisiones
            formatter: function (value) {
              return value.toFixed(0); // 🔥 Muestra solo valores enteros (0, 1, 2, 3)
            }
          },
          detail: {
            fontSize: 36,
            fontWeight: "bold",
            color: "#1e4b81",
            offsetCenter: [0, "70%"],
            formatter: function () {
              return nivelMadurez;
            }
          },
          data: [{ value: nivelMadurez }]
        }
      ]
    };
  
    return <ReactECharts option={options} style={{ height: "250px", width: "100%" }} />;
  };
  

 const NivelCapacidadChart = ({ data, chartRef }) => {
  // 🔥 Convertir nombres en arrays de máximo 3 líneas
  const categories = data.map((item) => item.nombre.split(" "));

  
  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "60%",
      },
    },
    colors: ["#1e4b81"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: categories, // 🔥 Cada nombre ahora es un array de strings
      labels: {
        rotate: 0, // 🔥 Asegurar que NO haya rotación
        trim: false, // 🔥 Evita recortes con "..."
        style: {
          colors: "#6B6B6B",
          fontSize: "12px",
          fontWeight: "bold",
          textAlign: "center",
        },
      },
    },
    yaxis: {
      min: 0,      // 🔥 El mínimo es 0
      max: 3,      // 🔥 El máximo es 3
      tickAmount: 3, // 🔥 Divide el eje Y en 4 partes (0, 1, 2, 3)
      labels: {
        formatter: (value) => Math.round(value), // 🔥 Asegura solo valores enteros
        style: {
          colors: "#6B6B6B",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      title: {
        text: "Nivel de Capacidad",
        style: { fontSize: "14px", fontWeight: "bold", color: "#1e4b81" },
      },
    },  
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `Nivel: ${value}`,
      },
    },
    grid: {
      borderColor: "#E0E0E0",
      strokeDashArray: 4,
    },
  };

  const series = [
    {
      name: "Nivel de Capacidad",
      data: data.map((item) => item.nivelCapacidad),
    },
  ];

  return (
    <Grid item xs={12}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, sm: 3 },
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: "bold", color: "#1e4b81" }}
        >
          Nivel de Capacidad por Proceso
        </Typography>

        <Box sx={{ width: "100%", height: { xs: 500, sm: 550 } }}>
          <ReactApexChart ref={chartRef}
            options={options}
            series={series}
            type="bar"
            height="100%"
          />
        </Box>
      </Paper>
    </Grid>
  );
};
  
  
  
  return (
    <Box sx={{  minHeight: '100vh', pb: 6 }}>
<Box sx={{ bgcolor: "#f0f0f0", px: 3, py: 2, borderRadius: 2, mb: 3 }}>
  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
    <MuiLink 
      component={RouterLink} 
      to="/mis-autoevaluaciones" 
      sx={{ display: "flex", alignItems: "center", color: "#1e4b81", fontWeight: "bold" }}
    >
      <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
      Inicio
    </MuiLink>
    <Typography sx={{ color: "#d37d36", fontWeight: "bold" }}>
      Autoevaluación
    </Typography>
  </Breadcrumbs>
</Box>


{/* Cabecera */}
<Box sx={{ px: { xs: 2, md: 6 }, mt: 4 }}>
  <Grid container spacing={2}>
    
    {/* 📌 Resultados de Autoevaluación (con el nuevo diseño) */}
    <Grid item xs={12} md={8}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          background: "linear-gradient(135deg, #0D1E2D, #05293B)", 
          color: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, 
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%", 
          textAlign: { xs: "center", md: "left" }, 
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 📄 Contenido textual */}
        <Box sx={{ flex: 1 }}>
        <Typography 
            variant="h5" 
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" } }}
          >
            ¡Resultados obtenidos! 🎯
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ mt: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }} 
          >
            Tu organización ha sido autoevaluada en gobierno, gestión y calidad de datos
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Los resultados de esta autoevaluación ofrecen una perspectiva inicial basada en tus respuestas.
            Para obtener una evaluación más precisa sobre el nivel de madurez organizacional y capacidades específicas,
            te sugerimos someterte a una evaluación formal en el marco de las especificaciones UNE 0077, 0078, 0079 y 0080.
          </Typography>
 {/* 📌 Botón de descarga RESPONSIVO */}
  {/* Botón solo visible si el usuario es PREMIUM PRO */}
  {userRole === "ROLE_PREMIUMPRO" ? (
        <Button
          variant="contained"
          onClick={generatePDF}
          sx={{
            mt: { xs: 2, sm: 1.5 },
            width: { xs: "100%", sm: "auto" },
            maxWidth: "300px",
            padding: { xs: "10px 14px", sm: "12px 24px" },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            borderRadius: "8px",
            color: "#fff",
            background: "linear-gradient(135deg, #d37d36 0%, #b65a1e 100%)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: "linear-gradient(135deg, #1e4b81 0%, #14365a 100%)",
              transform: "scale(1.05)",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          📥 Descargar Informe
        </Button>
      ) : (
        // Si el usuario no tiene el rol, mostramos otro botón deshabilitado
        <MuiTooltip title="Solo disponible para usuarios Premium Pro" arrow>
        <Button
          variant="contained"
          sx={{
            mt: { xs: 2, sm: 1.5 },
            width: { xs: "100%", sm: "auto" },
            maxWidth: "300px",
            padding: { xs: "10px 14px", sm: "12px 24px" },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            borderRadius: "8px",
            color: "#fff",
            background: "#bbb",
            boxShadow: "none",
            cursor: "not-allowed",
            "&:hover": {
              background: "#bbb",
              transform: "none",
              boxShadow: "none",
            },
          }}
        >
          🔒 Descargar Informe
        </Button>
      </MuiTooltip>
      )}
        </Box>

        {/* 🎨 Imagen alineada a la derecha */}
        <Box
          component="img"
          src="/images/dashboard.svg"
          alt="Resultados"
          sx={{
            width: { xs: "120px", sm: "150px", md: "180px" }, 
            maxHeight: "150px",
            objectFit: "contain",
            mt: { xs: 2, md: 0 },
          }}
        />
      </Paper>
    </Grid><Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    sx={{
      p: 2,
      borderRadius: "12px",
      textAlign: "center",
      background: "rgba(255, 255, 255, 0.9)",
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "250px",
    }}
  >
    <Typography variant="h6" fontWeight="bold" color="#1e4b81" mb={2}>
      Nivel de Madurez
    </Typography>

    {/* 🔍 Lógica de visualización */}
    {userRole === "ROLE_FREEMIUM" ? (
      <>
        <Typography variant="body1" sx={{ color: "#555", textAlign: "center", maxWidth: "90%" }}>
          El nivel de madurez solo está disponible para usuarios <strong>Premium</strong> y <strong>Premium Pro</strong>.
        </Typography>
        <Box
          component="img"
          src="/images/upgrade-premium.png"
          alt="Actualiza a Premium"
          sx={{ width: "150px", mt: 2 }}
          
        />
      </>
    ) : resultados.nivelMadurez === -1 ? (
      <>
       <Typography variant="body1" sx={{ color: "black", textAlign: "center", maxWidth: "90%" }}>
  ⚠️ Para calcular el nivel de madurez, debes seleccionar al menos todos los procesos de la dimensión correspondiente al <strong>Nivel 1 de madurez</strong>.
</Typography>
       
        <Button
      variant="contained"
      onClick={() => navigate("/nueva-autoevaluacion")}
      sx={{
        mt: 2,
        
        bgcolor: "#1e4b81",
        color: "#fff",
        fontWeight: "bold",
        "&:hover": { bgcolor: "#d37d36" },
      }}
    >
      Nueva Autoevaluación
    </Button>
      </>
    ) : (
      <NivelMadurezGauge nivelMadurez={resultados.nivelMadurez} />
    )}
  </Paper>
</Grid>


  </Grid>
</Box>


<Box sx={{ px: { xs: 2, md: 6 }, mt: 4 }}>
  <Grid container spacing={4}>

    {/* 📌 Procesos Evaluados */}
    <Grid item xs={12} md={4}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: "10px",
          textAlign: "center",
          height: "100%",
          minHeight: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#1e4b81" mb={2}>
          Procesos Evaluados
        </Typography>

        {/* 📊 Gráfico Radial */}
        <Box sx={{ width: 150, height: 150, position: "relative" }}>
          <ReactApexChart
            options={{
              chart: { type: "radialBar" },
              plotOptions: {
                radialBar: {
                  hollow: { size: "50%" },
                  track: { background: "#E0E0E0" },
                  dataLabels: {
                    show: true,
                    name: { show: false },
                    value: {
                      fontSize: "14px",
                      fontWeight: "bold",
                      formatter: (val) => (Number(val) ? Number(val).toFixed(1) + "%" : "0%")
                    }
                  }
                }
              },
              labels: ["Gestion", "Gobierno", "Calidad"],
              colors: ["#1e4b81", "#d37d36", "#fbc02d"]
            }}
            series={[
              totalesPorTipo.gestion ? (totalesPorTipo.gestion / totalProcesos) * 100 : 0,
              totalesPorTipo.gobierno ? (totalesPorTipo.gobierno / totalProcesos) * 100 : 0,
              totalesPorTipo.calidad ? (totalesPorTipo.calidad / totalProcesos) * 100 : 0
            ]}
            type="radialBar"
            height={150}
          />

          {/* 🔢 Total de Procesos en el Centro */}
          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              color: "#1e4b81"
            }}
          >
            {totalProcesos}
          </Typography>
        </Box>

        {/* 📌 Leyenda */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          {["Gestion", "Gobierno", "Calidad"].map((tipo, index) => (
            <Box key={tipo} sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: ["#1e4b81", "#d37d36", "#fbc02d"][index],
                  borderRadius: "50%",
                  mr: 1
                }}
              />
              <Typography variant="body2">
                {tipo}: {totalesPorTipo[tipo.toLowerCase()] || 0} ({((totalesPorTipo[tipo.toLowerCase()] / totalProcesos) * 100 || 0).toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Grid>

    {/* 📌 Propuestas de Mejora o Mensaje de Felicitación */}
    <Grid item xs={12} md={8}>
  <Paper
    elevation={3}
    sx={{
      p: { xs: 3, md: 4 },
      borderRadius: "10px",
      textAlign: "left",
      minHeight: 300,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    {loading ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 1,
        }}
      >
        <CircularProgress size={24} />
        <Typography>Cargando propuestas...</Typography>
      </Box>
    ) : propuestas.length > 0 ? (
      <>
        <Typography variant="h6" fontWeight="bold" color="#d37d36" mb={2}>
          Propuestas de Mejora 📌
        </Typography>
        {/* Tabla con las primeras 2 propuestas */}
        <TableContainer component={Paper} sx={{ borderRadius: "10px", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#333", width: "10%" }}>Nº</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Tarea</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propuestas.slice(0, 2).map((propuesta, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography fontWeight="bold" sx={{ color: "#1e4b81" }}>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{propuesta.tarea}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Botón "Ver todas" */}
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button
            variant="text"
            endIcon={<NavigateNextIcon />}
            sx={{
              fontWeight: "bold",
              color: "#1e4b81",
              textTransform: "none",
              "&:hover": { color: "#d37d36" },
            }}
            onClick={() => navigate(`/propuestas-mejora/${cuestionarioId}`)}
          >
            Ver todas
          </Button>
        </Box>
      </>
    ) : (
      // Si NO hay propuestas, se muestra mensaje de felicitación
      <Box
        sx={{
          borderRadius: "16px",
          color: "#1e4b81",
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: { xs: "center", md: "left" },
          bgcolor: "white",
          gap: 4,
        }}
      >
        {/* Imagen del Objetivo */}
        <Box
          component="img"
          src="/images/OBJETIVO.svg"
          alt="Objetivo alcanzado"
          sx={{
            width: { xs: "120px", md: "180px" },
            height: "auto",
            objectFit: "contain",
          }}
        />
        {/* Mensaje de Felicitación */}
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.8rem", sm: "2rem" }, color: "#d37d36" }}
          >
            ¡Enhorabuena! 🎉
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, fontSize: { xs: "1rem", sm: "1.2rem" }, color: "#333" }}
          >
            Tu organización ha obtenido buenos resultados en la autoevaluación. <br />
            ¡Es el momento de alcanzar el siguiente nivel de madurez!
          </Typography>
        </Box>
      </Box>
    )}
  </Paper>
</Grid>






 <Grid item xs={12}>
        <NivelCapacidadChart data={resultados.resultadosPorProceso} />
    </Grid>
          {/* Tabla de Procesos */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#d37d36' }}>
                Procesos por Nivel de Capacidad
              </Typography>
          {/* 🔥 Filtros por Nivel */}
<Box sx={{ mb: 3, textAlign: "center" }}>
  <ToggleButtonGroup
    value={nivelSeleccionado}
    exclusive
    onChange={(event, newNivel) => setNivelSeleccionado(newNivel)}
    aria-label="Seleccionar nivel"
    sx={{ background: "#f8f9fa", p: 1, borderRadius: "12px" }}
  >
    {[0, 1, 2, 3].map((nivel) => (
      <ToggleButton
        key={nivel}
        value={nivel}
        sx={{
          fontWeight: "bold",
          color: nivelSeleccionado === nivel ? "#fff" : "#1e4b81",
          background: nivelSeleccionado === nivel ? "#1e4b81" : "transparent",
          borderRadius: "8px",
          textTransform: "none",
          px: 3,
          "&:hover": { background: "#d37d36", color: "#fff" },
        }}
      >
        Nivel {nivel}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
</Box>

{/* 🔥 Tabla Moderna de Procesos */}
<Paper sx={{ p: 3, borderRadius: "12px", background: "#fff", boxShadow: 3 }}>
  <Grid container spacing={2} sx={{ pb: 2, borderBottom: "2px solid #f0f0f0" }}>
    <Grid item xs={6} sx={{ fontWeight: "bold", color: "#333" }}>Proceso</Grid>
    <Grid item xs={3} sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}>Tipo</Grid>
    <Grid item xs={3} sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}>Acciones</Grid>
  </Grid>

  {resultados.resultadosPorProceso
    .filter((r) => r.nivelCapacidad === nivelSeleccionado)
    .map((proceso, index) => {
      // 🔥 Color de fondo según el tipo
      const tipoColores = {
        Gestion: "#FFD8B1",   // Naranja pastel
        Gobierno: "#D6E6F2",  // Azul pastel
        Calidad: "#d9d9d9"    // Gris
      };

      return (
        <Grid
          container
          key={index}
          spacing={2}
          alignItems="center"
          sx={{
            py: 2,
            borderBottom: index !== resultados.resultadosPorProceso.length - 1 ? "1px solid #eee" : "none",
            "&:hover": { background: "#f9f9f9", borderRadius: "10px" }
          }}
        >
          {/* 🔹 Columna: Proceso con Avatar e Icono */}
          <Grid item xs={6} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#1e4b81", width: 36, height: 36 }}>
              <SettingsIcon sx={{ color: "#fff" }} />
            </Avatar>
            <Box>
              <Typography fontWeight="bold">{proceso.nombre}</Typography>
            </Box>
          </Grid>

          {/* 🔹 Columna: Tipo de Proceso con Color */}
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "8px",
                fontWeight: "bold",
                color: "#333",
                background: tipoColores[proceso.tipo] || "#eee",
                display: "inline-block"
              }}
            >
              {proceso.tipo}
            </Box>
          </Grid>

          {/* 🔹 Columna: Botón de Información */}
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <IconButton onClick={() => handleOpenModal(proceso)} sx={{ color: "#1e4b81" }}>
              <InfoIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    })}
</Paper>

            
            </Paper>
          </Grid>
  
        </Grid>
      </Box>
{/* Modal para Detalles del Proceso */}
<Modal open={modalOpen} onClose={handleCloseModal}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 3,
      borderRadius: "12px",
      width: "80vw", // 📌 Se adapta al ancho de la pantalla (80%)
      height: "80vh", // 📌 Se adapta a la altura de la pantalla (80%)
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "hidden",
    }}
  >
    {/* ❌ Botón de cierre */}
    <IconButton
      onClick={handleCloseModal}
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        color: "#6c757d",
        "&:hover": { color: "#000" },
      }}
    >
      <CloseIcon />
    </IconButton>

    {/* 🏷️ Título del Proceso */}
    {selectedProceso && (
      <Typography
        variant="h6"
        fontWeight="bold"
        color="#1e4b81"
        mb={2}
        textAlign="center"
      >
        {selectedProceso.nombre}
      </Typography>
    )}

    {/* 📌 Contenido dividido: Gráfico + Tabla */}
    <Box
      sx={{
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        overflow: "hidden",
      }}
    >
      {/* 📊 Contenedor del Gráfico (Ahora crece dinámicamente en pantallas grandes) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%", // 📌 Ocupa todo el alto del modal disponible
          minWidth: "300px", // 📌 Evita que el gráfico sea muy pequeño
          maxWidth: { xs: "100%", md: "600px", lg: "800px" }, // 📌 En pantallas grandes puede crecer más
        }}
      >
        {graficoRadarData && (
          <ReactApexChart
            options={{
              chart: { type: "radar", toolbar: { show: false } },
              xaxis: {
                categories: graficoRadarData.labels.map((_, index) => `P${index + 1}`),
                labels: {
                  show: true,
                  style: { fontSize: "12px", colors: "#333", fontWeight: "bold" },
                },
              },
              tooltip: { enabled: false },
              colors: ["#1e4b81"],
              stroke: { width: 2 },
              fill: { opacity: 0.2 },
              markers: { size: 4, colors: ["#d37d36"] },
              yaxis: { show: true },
            }}
            series={graficoRadarData.series}
            type="radar"
            height="100%" // 📌 Se ajusta al tamaño del contenedor
            width="100%" // 📌 Se ajusta al tamaño del contenedor
          />
        )}
      </Box>

      {/* 📋 Leyenda de Correspondencia (Ocupa más ancho y permite scroll horizontal) */}
      <Box
        sx={{
          flex: 1.5,
          width: "100%",
          minWidth: "350px",
          bgcolor: "#f8f8f8",
          p: 2,
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          overflowX: "auto",
          maxHeight: "100%",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="#1e4b81" mb={2}>
          📌 Correspondencia de Preguntas
        </Typography>

        {/* ✅ Tabla más grande y con scroll horizontal si es necesario */}
        <TableContainer component={Paper} sx={{ maxHeight: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Nº</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333", minWidth: "200px" }}>
                  Pregunta
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Ponderación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {graficoRadarData.labels.map((label, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e4b81" }}>P{index + 1}</TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "10px", sm: "12px" },
                      minWidth: "200px",
                    }}
                  >
                    {label}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#d37d36" }}>
                    {graficoRadarData.series[0].data[index]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  </Box>
</Modal>










    </Box>
  );
  
  
  
}  
export default DashboardResultados;
