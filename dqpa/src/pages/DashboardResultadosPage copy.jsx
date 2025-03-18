import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Paper, Grid, Modal } from '@mui/material';
import { Bar, Doughnut, PolarArea, Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
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
import axiosInstance from '../axiosInstance';

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

  const navigate = useNavigate(); // Hook para redirección
  

  // Colores para los gráficos
  const tipoColores = {
    gestion: '#d37d36',
    gobierno: '#1e4b81',
    calidad: '#d9d9d9',
  };

  const polarAreaColors = ['#1e4b81', '#d37d36', '#d9d9d9'];

  useEffect(() => {
    const fetchResultados = async () => {
      try {

        const token = Cookies.get('token');
        // Decodifica el token y extrae el rol
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role; // Usa un valor por defecto si el rol no existe
      setUserRole(role);

        const response = await axiosInstance.get(
          `http://localhost:9092/api/autoevaluaciones/resultados/${cuestionarioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data)
        setResultados(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar resultados:', err);
        setLoading(false);
      }
    };

    fetchResultados();
  }, [cuestionarioId]);
  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(
          `http://localhost:9092/api/autoevaluaciones/${cuestionarioId}/propuestas-con-descripcion`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPropuestas(response.data);
        console.log(response.data)
      } catch (err) {
        console.error('Error al cargar propuestas:', err);
      }
    };
  
    fetchPropuestas();
  }, [cuestionarioId]);
  
  const handleOpenModal = async (proceso) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `http://localhost:9092/api/autoevaluaciones/procesos/${proceso.procesoId}/detalle`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetalleProceso(response.data);
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
    try {
      const token = Cookies.get('token');
      const autoevaluacionId = cuestionarioId;
  
      // Obtener datos del cuestionario, resultados y propuestas
      const [cuestionarioResponse, resultadosResponse, propuestasResponse] = await Promise.all([
        axios.get(`http://localhost:9092/api/autoevaluaciones/obtenerOptimizado/${autoevaluacionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:9092/api/autoevaluaciones/resultados/${autoevaluacionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:9092/api/autoevaluaciones/${autoevaluacionId}/propuestas-con-descripcion`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      const cuestionarioOptimizado = cuestionarioResponse.data;
      const resultados = resultadosResponse.data;
      const propuestas = propuestasResponse.data;
  
      if (!cuestionarioOptimizado || !Array.isArray(cuestionarioOptimizado.cuestionario.preguntasPorProceso)) {
        throw new Error('El cuestionario no contiene preguntas válidas.');
      }
  
      // Configuración inicial del PDF
      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 85; // 3 cm
      const bottomMargin = 70; // Ajuste del margen inferior
      const topMargin = 50; // Margen superior ajustado
      const contentWidth = pageWidth - margin * 2;
      const lineHeight = 18; // Espaciado interlineal 1.5 en puntos
      let currentY = topMargin;
  
      const primaryColor = '#1e4b81';
      const secondaryColor = '#444';
      const blackColor = '#000';
      const lightGray = '#f0f0f0';
      doc.setFont('Times', 'Roman');
  
      const logoUrl = '/images/logoDQPA.png'; // Cambia la ruta del logo si lo deseas.
  
      // Función para agregar encabezado y pie de página
      const addHeaderAndFooter = (pageNum) => {
        doc.setFontSize(10);
        doc.setTextColor(blackColor); // Siempre negro
        doc.text('Informe de Resultados de la Autoevaluación - DQPA', margin, 30);
  
        // Línea debajo del encabezado
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(margin, 35, pageWidth - margin, 35);
  
        // Pie de página
        doc.setFontSize(11);
        doc.text(`Página ${pageNum}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
      };
  
      // Renderizar texto largo con saltos de línea automáticos y justificación
      const renderText = (text, x, maxWidth) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
          addPageIfNeeded();
          doc.text(line, x, currentY, { align: 'justify' });
          currentY += lineHeight;
        });
      };
  
      // Función para manejar saltos de página
      const addPageIfNeeded = () => {
        if (currentY > pageHeight - bottomMargin) {
          doc.addPage();
          addHeaderAndFooter(++currentPage);
          currentY = topMargin;
        }
      };
  
      // Función para iniciar una nueva sección (con el título al principio de la página)
      const startNewSection = (title) => {
        doc.addPage();
        addHeaderAndFooter(++currentPage);
        currentY = topMargin; // Reiniciar posición al inicio de la página
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.setFont('Times', 'Bold');
        doc.text(title, margin, currentY, { align: 'justify' });
        currentY += lineHeight * 2; // Espaciado después del título
      };
  
      let currentPage = 1;
  
      // === Portada ===
      const addCoverPage = () => {
        doc.setDrawColor(lightGray);
        doc.setFillColor(lightGray);
        doc.rect(0, 0, pageWidth, pageHeight, 'F'); // Fondo claro para la portada
  
        doc.setFontSize(24);
        doc.setTextColor(primaryColor);
        doc.setFont('Times', 'Bold');
        doc.text('Informe de Resultados', pageWidth / 2, pageHeight / 2 - 50, { align: 'center' });
  
        doc.setFontSize(18);
        doc.setTextColor(secondaryColor);
        doc.setFont('Times', 'Roman');
        doc.text('Autoevaluación de Calidad de Datos', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  
        doc.setFontSize(12);
        doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  
        // Agregar logo
        if (logoUrl) {
          doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 60, pageHeight / 2 + 40, 120, 120);
        }
  
        doc.addPage();
        currentPage++;
      };
  
      // === Índice ===
      const addIndexPage = () => {
        addHeaderAndFooter(currentPage);
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.setFont('Times', 'Bold');
        doc.text('ÍNDICE', margin, topMargin);
  
        currentY = topMargin + lineHeight * 2;
        const sections = [
          { title: '1. Resumen de la Autoevaluación', page: 2 },
          { title: '2. Detalle del Cuestionario', page: 3 },
          { title: '3. Gráfico de Resultados por Proceso', page: 4 },
          { title: '4. Propuestas de Mejora', page: 5 },
        ];
  
        sections.forEach((section) => {
          doc.setFontSize(12);
          doc.setTextColor(blackColor);
          const dots = '.'.repeat(100 - section.title.length - section.page.toString().length);
          doc.text(`${section.title} ${dots} ${section.page}`, margin, currentY, { align: 'justify' });
          currentY += lineHeight;
        });
  
        doc.addPage();
        currentPage++;
      };
  
      // Agregar portada e índice
      addCoverPage();
      addIndexPage();
  
      // === Sección 1: Resumen de la Autoevaluación ===
      doc.setFontSize(14);
      doc.setTextColor(primaryColor);
      doc.setFont('Times', 'Bold');
      doc.text('1. RESUMEN DE LA AUTOEVALUACIÓN', margin, currentY, { align: 'justify' });
      currentY += lineHeight * 2;
  
      doc.setFontSize(12);
      doc.setTextColor(blackColor);
      doc.setFont('Times', 'Roman');
      renderText(`Fecha de creación: ${cuestionarioOptimizado.cuestionario.fecha || 'No disponible'}`, margin, contentWidth);
      renderText(`Fecha de generación del PDF: ${new Date().toLocaleString('es-ES')}`, margin, contentWidth);
      renderText(`Número de procesos evaluados: ${resultados.resultadosPorProceso.length}`, margin, contentWidth);
      renderText(`Nivel de Madurez: ${resultados.nivelMadurez}`, margin, contentWidth);
  
      doc.autoTable({
        startY: currentY + 10,
        head: [['Proceso', 'Tipo', 'Nivel de Capacidad']],
        body: resultados.resultadosPorProceso.map((proceso) => [
          proceso.nombre,
          proceso.tipo,
          proceso.nivelCapacidad || 'N/A',
        ]),
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: '#fff' },
        margin: { left: margin, right: margin },
      });
  
      // === Sección 2: Detalle del Cuestionario ===
      startNewSection('2. DETALLE DEL CUESTIONARIO');
  
      const groupedQuestions = cuestionarioOptimizado.cuestionario.preguntasPorProceso.reduce((acc, pregunta) => {
        const proceso = pregunta.proceso?.nombre || 'Sin Proceso';
        if (!acc[proceso]) acc[proceso] = [];
        acc[proceso].push(pregunta);
        return acc;
      }, {});
  
      Object.entries(groupedQuestions).forEach(([proceso, preguntas]) => {
        doc.setTextColor(primaryColor);
        doc.setFontSize(12);
        doc.setFont('Times', 'Bold');
        renderText(`Proceso: ${proceso}`, margin, contentWidth);
  
        preguntas.forEach((pregunta, index) => {
          doc.setFont('Times', 'Roman');
          doc.setTextColor(blackColor);
          renderText(`Pregunta ${index + 1}: ${pregunta.descripcion}`, margin, contentWidth);
          renderText(
            `Respuesta: ${
              pregunta.respuestas.find((r) => r._id === pregunta.respuestaSeleccionada)?.descripcion || 'No respondida'
            }`,
            margin,
            contentWidth
          );
          currentY += lineHeight; // Espacio adicional entre preguntas y respuestas
        });
      });
  
      // === Sección 3: Gráfico de Resultados por Proceso ===
      startNewSection('3. GRÁFICO DE RESULTADOS POR PROCESO');
  
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
  
      new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: resultados.resultadosPorProceso.map((r) => r.nombre),
          datasets: [
            {
              label: 'Nivel de Capacidad',
              data: resultados.resultadosPorProceso.map((r) => r.nivelCapacidad),
              backgroundColor: primaryColor,
            },
          ],
        },
        options: { responsive: false, scales: { y: { beginAtZero: true, max: 5 } } },
      });
  
      await new Promise((resolve) => setTimeout(resolve, 500)); // Esperar a que se renderice
      const graphImage = canvas.toDataURL('image/png');
      doc.addImage(graphImage, 'PNG', margin, currentY, contentWidth, 300);
  
      // === Sección 4: Propuestas de Mejora ===
      startNewSection('4. PROPUESTAS DE MEJORA');
  
      propuestas.forEach((propuesta, index) => {
        doc.setTextColor(primaryColor);
        doc.setFontSize(12);
        doc.setFont('Times', 'Bold');
        renderText(`Tarea ${index + 1}: ${propuesta.tarea}`, margin, contentWidth);
  
        doc.setTextColor(secondaryColor);
        doc.setFont('Times', 'Roman');
        renderText(`Proceso: ${propuesta.proceso || 'No especificado'}`, margin, contentWidth);
  
        doc.setTextColor(blackColor);
        renderText(propuesta.descripcion || 'No disponible.', margin, contentWidth);
  
        currentY += lineHeight; // Espacio adicional entre tareas
      });
  
      // Guardar PDF
      const filename = `InformeResultados-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
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

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', pb: 6 }}>
      {/* Cabecera con Breadcrumbs */}
      <Box
        sx={{
          position: 'relative',
          height: 300,
          backgroundImage: `url(${require('./grafo.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Breadcrumb */}
        <Box
          sx={{
            mt: { xs: 8, md: 10 },
            px: { xs: 4, md: 6 },
          }}
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            <MuiLink
              component={RouterLink}
              to="/mis-autoevaluaciones"
              underline="hover"
              sx={{
                color: 'black',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Mis Autoevaluaciones
            </MuiLink>
            <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
              Resultados
            </Typography>
          </Breadcrumbs>
        </Box>
  
        {/* Título y descripción */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            px: { xs: 4, md: 20 },
            mt: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="#1e4b81">
            Resultados de tu autoevaluación
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6c757d',
              lineHeight: 1.6,
              fontSize: '0.9rem', // Tamaño reducido
              mt: 2,
            }}
          >
            Los resultados de esta autoevaluación ofrecen una perspectiva inicial basada en tus
            respuestas. Para obtener una evaluación más precisa sobre el nivel de madurez
            organizacional y capacidades específicas, te sugerimos someterte a una evaluación formal
            en el marco de las especificaciones UNE 0077, 0078 y 0079.
          </Typography>
        </Box>
      </Box>
  
     {/* Contenido principal */}
<Box
sx={{
  position: 'relative', // Importante para posicionar las cajas sobre la imagen
  mt: -8, // Reduce el valor negativo para aumentar el margen con la imagen
  px: { xs: 5, md: 12 }, // Mantén los márgenes laterales
}}
>
  <Grid container spacing={4}>
    {/* Nivel de Madurez */}
    <Grid item xs={12} md={6}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: '10px',
          textAlign: 'center',
          bgcolor: '#ffffff',
          border: '2px solid #b0bec5',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Nivel de Madurez
        </Typography>
        {userRole === 'ROLE_FREEMIUM' ? (
          <>
            <Typography
              variant="body1"
              sx={{
                color: '#6c757d',
                mt: 1,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Actualiza el plan para conocer el nivel de madurez de tu organización.
            </Typography>
            <Button
              variant="contained"
              size="medium"
              sx={{
                mt: 2,
                bgcolor: '#ffa726',
                '&:hover': { bgcolor: '#fb8c00' },
              }}
            >
              Actualizar Plan
            </Button>
          </>
        ) : (
          <>
            <Typography
              variant="h1"
              sx={{
                color: '#1e4b81',
                fontWeight: 'bold',
              }}
            >
              {resultados.nivelMadurez}
            </Typography>
            <Typography variant="body1" sx={{ color: '#6c757d', mt: 1 }}>
              Este nivel representa la madurez total de la organización en Gobierno,
              Gestión y Calidad del dato.
            </Typography>
          </>
        )}
      </Paper>
    </Grid>

    {/* Procesos por Tipo */}
    <Grid item xs={12} md={6}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: '10px',
          bgcolor: '#ffffff',
          border: '2px solid #b0bec5',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
        >
          Procesos evaluados por tipo
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {['gestion', 'gobierno', 'calidad'].map((tipo) => {
            const tipoCantidad = totalesPorTipo[tipo];
            const restante = totalProcesos - tipoCantidad;

            // Definir colores según el tipo
            const tipoColores = {
              gestion: '#d37d36',
              gobierno: '#1e4b81',
              calidad: '#9e9e9e',
            };

            return (
              <Grid item xs={4} key={tipo}>
                <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto' }}>
                  <Doughnut
                    data={{
                      labels: [
                        `Procesos ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
                        'Otros Procesos',
                      ],
                      datasets: [
                        {
                          data: [tipoCantidad, restante],
                          backgroundColor: [tipoColores[tipo], '#e0e0e0'],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        tooltip: { enabled: true },
                        legend: { display: false },
                      },
                      cutout: '70%',
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontWeight: 'bold',
                      color: '#000',
                    }}
                  >
                    {tipoCantidad}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ fontWeight: 'bold', mt: 1 }}
                >
                  {`Procesos ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Grid>


          {/* Resultados por Proceso */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '2px solid #b0bec5',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#d37d36' }}>
                Resultados por Proceso
              </Typography>
              <Grid container spacing={2}>
                {/* Gráfico de barras */}
                <Grid item xs={12} md={6}>
                  <Bar
                    data={{
                      labels: resultados.resultadosPorProceso.map((r) => r.nombre),
                      datasets: [
                        {
                          label: 'Nivel de Capacidad',
                          data: resultados.resultadosPorProceso.map((r) => r.nivelCapacidad),
                          backgroundColor: resultados.resultadosPorProceso.map((r) => {
                            switch (r.nivelCapacidad) {
                              case 1:
                                return '#cce5ff';
                              case 2:
                                return '#99ccff';
                              case 3:
                                return '#6699cc';
                              case 4:
                                return '#336699';
                              case 5:
                                return '#1e4b81';
                              default:
                                return '#e0e0e0';
                            }
                          }),
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1,
                            color: '#1e4b81',
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: '#1e4b81',
                          },
                        },
                      },
                    }}
                  />
                </Grid>
  
                {/* Lista de procesos */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Lista de Procesos
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: '500px',
                      overflowY: resultados.resultadosPorProceso.length >5 ? 'auto' : 'visible',
                      pr: 2,
                    }}
                  >
                    {resultados.resultadosPorProceso.map((proceso) => (
                      <Box
                        key={proceso.procesoId}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                          p: 2,
                          bgcolor: '#f9f9f9',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {proceso.nombre}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenModal(proceso)}
                          sx={{
                            bgcolor: '#d37d36',
                            '&:hover': { bgcolor: '#a63d2d' },
                            textTransform: 'none',
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Descargar Informe */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '2px solid #b0bec5',
                textAlign: 'center',
              }}
            >
              <Box sx={{ fontSize: '48px', color: '#d32f2f', mb: 2 }}>
                <i className="fas fa-file-pdf"></i>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Descargar Informe
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                Genera un informe PDF con los resultados obtenidos y compártelo fácilmente.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={generatePDF}
                sx={{
                  bgcolor: '#1e4b81',
                  '&:hover': { bgcolor: '#d37d36' },
                }}
              >
                Descargar PDF
              </Button>
            </Paper>
          </Grid>
  
          {/* Ver Propuestas */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: '10px',
                bgcolor: '#ffffff',
                border: '2px solid #b0bec5',
                textAlign: 'center',
              }}
            >
              <Box sx={{ fontSize: '48px', color: '#fbc02d', mb: 2 }}>
                <i className="fas fa-lightbulb"></i>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Ver Propuestas
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                Descubre recomendaciones personalizadas para mejorar tus procesos.
              </Typography>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/propuestas-mejora/${cuestionarioId}`)}
                sx={{
                  bgcolor: '#1e4b81',
                  '&:hover': { bgcolor: '#d37d36' },
                }}
              >
                Ver Propuestas
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  
      {/* Modal para Detalles del Proceso */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          {detalleProceso && (
            <>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
              >
                Detalle del Proceso
              </Typography>
              <PolarArea
                data={{
                  labels: detalleProceso.preguntas.map((pregunta) => pregunta.descripcion),
                  datasets: [
                    {
                      label: 'Ponderación',
                      data: detalleProceso.preguntas.map((pregunta) => pregunta.ponderacion),
                      backgroundColor: ['#1e4b81', '#d37d36', '#d9d9d9'],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (tooltipItems) => {
                          const idx = tooltipItems[0].dataIndex;
                          const texto = detalleProceso.preguntas[idx].descripcion;
                          return texto.match(/.{1,50}/g).join('\n');
                        },
                        label: (tooltipItem) => `Ponderación: ${tooltipItem.raw}`,
                      },
                    },
                    legend: { display: false },
                  },
                  scales: {
                    r: {
                      suggestedMin: 0,
                      suggestedMax: 100,
                    },
                  },
                }}
              />
              <Button
                onClick={handleCloseModal}
                sx={{
                  mt: 3,
                  bgcolor: '#1e4b81',
                  color: '#fff',
                  '&:hover': { bgcolor: '#d37d36' },
                  display: 'block',
                  mx: 'auto',
                }}
              >
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
  
}  
export default DashboardResultados;
