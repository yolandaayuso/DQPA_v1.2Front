import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, TextField } from '@mui/material';
import { styled } from '@mui/system';
import VanillaTilt from "vanilla-tilt"
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Element } from 'react-scroll';
import AOS from 'aos';
import 'aos/dist/aos.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { Link as MuiLink } from '@mui/material'; // Para el enlace estilizado
import { Link as RouterLink } from 'react-router-dom'; // Para la navegación interna
import { scroller } from 'react-scroll';
import { useNavigate, useLocation } from 'react-router-dom';
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '10px 30px',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
}));

const Container = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 16px',
});

const Home = () => {
  const handleScrollToPlanes = () => {
    if (location.pathname !== '/') {
      navigate('/'); // Navega a la home si no estás en ella
      setTimeout(() => {
        scroller.scrollTo('planes', {
          smooth: true,
          duration: 800,
          offset: -70, // Ajusta según el tamaño del navbar fijo
        });
      }, 500); // Ajusta el tiempo de espera si es necesario
    } else {
      scroller.scrollTo('planes', {
        smooth: true,
        duration: 800,
        offset: -70,
      });
    }
  };
  
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [formValues, setFormValues] = useState({
    email: '',
    message: '',
    policyAccepted: false,
  });
  const navigate = useNavigate();
  const location = useLocation(); 
  
const handlePlanSelection = (planType) => {
  navigate(`/register?plan=${planType}`);
};
  const [errors, setErrors] = useState({
    email: false,
    message: false,
    policyAccepted: false,
  });
  // Manejar cambios en los campos del formulario
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormValues((prev) => ({ ...prev, [name]: value }));
};

// Manejar cambios en el checkbox
const handleCheckboxChange = (e) => {
  setFormValues((prev) => ({ ...prev, policyAccepted: e.target.checked }));
};

// Validar el formulario
const handleSubmit = (e) => {
  e.preventDefault();

  const newErrors = {
    email: formValues.email.trim() === '',
    message: formValues.message.trim() === '',
    policyAccepted: !formValues.policyAccepted,
  };

  setErrors(newErrors);

  const hasErrors = Object.values(newErrors).some((error) => error);

  if (!hasErrors) {
    alert('Formulario enviado con éxito.');
    // Lógica adicional para enviar datos al servidor
  }
};

  return (
    <>
<Element name="inicio">
  <Box
    sx={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "left",
      color: "white",
      padding: { xs: "5%", md: "10%" },
      background: "linear-gradient(135deg, #0d1727 0%, #122841 100%)",
      overflow: "hidden",
    }}
  >
    {/* Sutil iluminación en la parte derecha */}
    <Box
      sx={{
        position: "absolute",
        top: "30%",
        right: "15%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, rgba(255,157,0,0.2), transparent)",
        filter: "blur(100px)",
        zIndex: 1,
      }}
    />

    {/* Contenido principal */}
    <Container sx={{ maxWidth: "600px", zIndex: 2 }}>
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4rem" },
          lineHeight: 1.2,
          mb: 2,
          color: "#ffffff",
        }}
        data-aos="fade-up"
      >
        Evalúe sus procesos de datos 
        con{" "}
        <Typography
          component="span"
          sx={{
            fontSize: { xs: "3.5rem", sm: "4rem", md: "4.5rem" }, // MÁS GRANDE
            background: "linear-gradient(90deg, #ff8c00, #d37d36)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          DQPa
        </Typography>
      </Typography>

      <Typography
        variant="h6"
        sx={{ maxWidth: "500px", opacity: 0.85, fontSize: "1.2rem" }}
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Descubra el nivel de capacidad de sus procesos de datos y el nivel de madurez oraganizacional.
        Identifique oportunidades de mejora y optimice el gobienro, gestión y calidad de datos
      </Typography>

      {/* Botones mejorados */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#d37d36",
            color: "#fff",
            "&:hover": { bgcolor: "#b8662b", transform: "scale(1.05)" },
            fontSize: "1.2rem",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
          }}
          data-aos="fade-right"
          onClick={() => navigate("/login")}
        >
          Iniciar prueba
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: "#d37d36",
            color: "#d37d36",
            "&:hover": { borderColor: "#b8662b", color: "#b8662b", transform: "scale(1.05)" },
            fontSize: "1.2rem",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
          }}
          data-aos="fade-left"
          data-aos-delay="200"
          onClick={handleScrollToPlanes}
        >
          Explorar
        </Button>
      </Box>
    </Container>

    {/* Imagen del MacBook con efecto de sombra */}
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        maxWidth: "55%",
        position: "relative",
        zIndex: 2,
        transition: "transform 0.3s ease",
        animation: "float 6s ease-in-out infinite",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          width: "80%",
          height: "15px",
          background: "rgba(0, 0, 0, 0.3)",
          filter: "blur(10px)",
          borderRadius: "50%",
          transform: "translateX(-50%)",
          opacity: 0.5,
        },
      }}
      data-aos="fade-left"
      data-aos-delay="300"
    >
      <img
        src="/images/home5.png"
        alt="Dashboard Preview"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "10px",
        }}
      />
    </Box>

    {/* Fondo ondulado en la parte inferior mejorado */}
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "120px",
        background: "linear-gradient(90deg, #d37d36, #d37d36)",
        clipPath: "path('M0,80 C150,150 350,20 600,100 C850,180 1050,0 1200,50 L1200,200 L0,200 Z')",
      }}
    />
  </Box>

  {/* Animaciones CSS */}
  <style>
    {`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }
    `}
  </style>
</Element>



{/* ¿Qué es DQPa? */}
<Element name="que-es">
  <Box
    sx={{
      py: { xs: 8, sm: 10 },
      bgcolor: "#FFFFFF",
      position: "relative",
      overflow: "hidden",
    }}
    data-aos="fade-up"
  >
    <Container>
      {/* Contenido con imagen a la derecha y texto a la izquierda */}
      <Grid container spacing={6} alignItems="center">
        {/* Texto a la izquierda */}
        <Grid item xs={12} md={6} data-aos="fade-right">
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 2,
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                color: "#1e4b81",
              }}
            >
              ¿Qué es <span style={{ color: "#d37d36" }}>DQPa</span>?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              }}
            >
              <strong>DQPa</strong> es una herramienta de autoevaluación
              diseñada para ayudar a las organizaciones a analizar sus procesos
              de datos, identificar áreas de mejora y alcanzar niveles de
              madurez organizacional en términos de{" "}
              <strong>gobierno, gestión y calidad de datos</strong>.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              }}
            >
              Basada en las Especificaciones UNE 0077, 0078, 0079 y 0080, DQPa
              le ofrece una visión clara del estado actual de su organización y
              una hoja de ruta estructurada para la mejora continua.
            </Typography>

            {/* Beneficios con iconos */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BarChartIcon sx={{ fontSize: 30, color: "#d37d36", mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold" sx={{ color: "#1e4b81" }}>
                    Evaluaciones Basadas en Marcos de Referencia
                  </Typography>
                  <Typography variant="body2">
                    DQPa sigue estándares reconocidos como UNE 0077-0080 para
                    ofrecer diagnósticos precisos y estructurados.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmojiObjectsIcon sx={{ fontSize: 30, color: "#d37d36", mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold" sx={{ color: "#1e4b81" }}>
                   Indeitificación de Brechas y Oportunidades
                  </Typography>
                  <Typography variant="body2">
                    Compara el nivel de madurez de su organización con las
                    mejores prácticas de los estándares y obtenga las tareas necesarias para mejorar.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Imagen a la derecha */}
        <Grid item xs={12} md={6} data-aos="fade-left">
          <img
            src={require("./ques3.png")}
            alt="¿Qué es DQPa?"
            style={{
              width: "100%",
              maxWidth: "550px",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
</Element>

<Element name="funcionalidades">
  <Box
    sx={{
      py: { xs: 8, sm: 10 },
      bgcolor: "#FFFFFF", // Fondo ligeramente gris para diferenciar la sección
      position: "relative",
    }}
  >
    <Container>
      {/* Título */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 6,
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          color: "#1e4b81",
        }}
        data-aos="fade-down"
      >
        Funcionalidades de <span style={{ color: "#d37d36" }}>DQPa</span>
      </Typography>

      {/* Grid uniforme */}
      <Grid container spacing={4} justifyContent="center">
        {/* Contenido de las cards */}
        {[
          {
            title: "Autoevaluación precisa",
            desc: "Evalúe el nivel de capacidad de sus procesos organizativos de datos con precisión.",
            icon: <AssessmentIcon sx={{ fontSize: 50 }} />,
          },
          {
            title: "Toma de decisiones",
            desc: "Facilita la toma de decisiones basadas en resultados obtenidos mediante autoevaluación.",
            icon: <InsightsIcon sx={{ fontSize: 50 }} />,
          },
          {
            title: "Propuestas efectivas",
            desc: "Genera propuestas de mejora personalizadas para optimizar sus procesos organizativos.",
            icon: <EmojiObjectsIcon sx={{ fontSize: 50 }} />,
          },
          {
            title: "Resultados intuitivos",
            desc: "Visualice resultados claros e interactivos con gráficos detallados.",
            icon: <BarChartIcon sx={{ fontSize: 50 }} />,
          },
          {
            title: "Informes detallados",
            desc: "Proporcione informes completos que respalden sus estrategias de gestión de datos.",
            icon: <DescriptionIcon sx={{ fontSize: 50 }} />,
          },
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: "15px",
                bgcolor: "white",
                border: "1px solid #e0e0e0", // Borde sutil para las cards
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              {/* Icono dentro de un círculo con fondo */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#1e4b81",
                  mb: 2,
                  color: "white",
                }}
              >
                {feature.icon}
              </Box>

              {/* Título */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  color: "#1e4b81",
                  fontSize: { xs: "1.2rem", sm: "1.4rem" },
                }}
              >
                {feature.title}
              </Typography>

              {/* Descripción */}
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.6,
                  maxWidth: "85%",
                }}
              >
                {feature.desc}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
</Element>



{/* Beneficios Clave */}
<Element name="beneficios-clave">
  <Box
    sx={{
      py: 12,
      bgcolor: '#FFFFFF', // Cambiado a blanco
      position: 'relative',
      overflow: 'hidden',
    }}

  >
    <Container>
      {/* Título centralizado con animación */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 6,
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          color: "#1e4b81",
        }}
        data-aos="fade-down"
      >
       Por qué elegir <span style={{ color: "#d37d36" }}>DQPa</span> 
      </Typography>

      {/* Contenido dividido en dos columnas */}
      <Grid container spacing={6} alignItems="center">
        {/* Imagen con animaciones */}
        <Grid item xs={12} md={6} data-aos="fade-right">
          <Box
            sx={{
              position: 'relative',
              borderRadius: '15px', // Redondea las esquinas
              overflow: 'hidden',
            }}
          >
            <img
              src={require('./evaluacion2.jpeg')}
              alt="Beneficios Clave"
              style={{
                width: '100%',
                display: 'block',
                transition: 'transform 0.5s ease-in-out',
              }}
              className="image-hover-zoom"
            />
          </Box>
        </Grid>

        {/* Texto explicativo */}
        <Grid item xs={12} md={6} data-aos="fade-left">
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 4, color: '#1e4b81' }}
              data-aos="fade-left"
            >
              Analice, evalúe y mejore su organización
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              DQPa le permite evaluar el estado actual (As Is) de su organización 
              en términos de <strong>gobierno, gestión y calidad de datos</strong>. Según las directrices de la UNE 0085, esta evaluación inicial es clave para identificar 
              brechas y diseñar un plan de mejora.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Descubra cómo optimizar sus procesos de datos para alcanzar el nivel de madurez organizacional deseado en términos de gobierno, gestión y calidad de datos.
            </Typography>

            {/* Botón estilizado */}
            <StyledButton
      variant="contained"
      sx={{
        mt: 4,
        bgcolor: '#d37d36',
        '&:hover': { bgcolor: '#c16f31' },
        animation: 'pulse 2s infinite',
      }}
      data-aos="fade-up"
      data-aos-delay="300"
      onClick={() => navigate('/login')} // Redirige al hacer clic
    >
      Prueba DQPa
    </StyledButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
</Element>


      {/* Planes */}
      <Element name="planes">
        <Box sx={{ py: 10, bgcolor: '#FFFFFF' }} >
          <Container>
          <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 6,
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          color: "#1e4b81",
        }}
        data-aos="fade-down"
      >
       Planes de <span style={{ color: "#d37d36" }}>DQPa</span> 
      </Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  title: 'Plan Freemium',
                  features: [
                    { text: 'Autoevaluación del nivel de capacidad 2 para 5 procesos', included: true },
                    { text: 'Una única autoevaluación', included: true },
                    { text: 'Visualización de resultados y propuestas de mejora', included: true },
                    { text: 'Autoevaluación del nivel de madurez organizacional', included: false },
                    { text: 'Descarga de resultados', included: false },
                  ],
                },
                {
                  title: 'Plan Premium',
                  features: [
                    { text: 'Autoevaluación del nivel de capacidad 2 para 9 procesos', included: true },
                    { text: 'Dos autoevaluaciones', included: true },
                    { text: 'Visualización de resultados y propuestas de mejora', included: true },
                    { text: 'Autoevaluación del nivel de madurez organizacional', included: true },
                    { text: 'Descarga de resultados', included: false },
                  ],
                },
                {
                  title: 'Plan Premium Pro',
                  features: [
                    { text: 'Autoevaluación del nivel de capacidad 3 para 19 procesos', included: true },
                    { text: 'Autoevaluaciones ilimitadas', included: true },
                    { text: 'Visualización de resultados y propuestas de mejora', included: true },
                    { text: 'Autoevaluación del nivel 3 de madurez organizacional', included: true },
                    { text: 'Descarga de resultados', included: true },
                  ],
                },
              ].map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      textAlign: 'left',
                      borderRadius: '15px',
                      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                      p: 3,
                    }}
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1e4b81' }}>
                      {plan.title}
                    </Typography>
                    {plan.features.map((feature, i) => (
                      <Typography
                        key={i}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          color: feature.included ? '#1e4b81' : '#999',
                        }}
                      >
                        {feature.included ? (
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#1e4b81', mr: 1 }} />
                        ) : (
                          <HighlightOffIcon sx={{ fontSize: 18, color: '#999', mr: 1 }} />
                        )}
                        {feature.text}
                      </Typography>
                    ))}
                  <Button
  variant="contained"
  sx={{
    mt: 3,
    bgcolor: index === 2 ? '#d37d36' : '#1e4b81',
    color: 'white',
    borderRadius: '10px',
    '&:hover': {
      bgcolor: index === 2 ? '#c16f31' : '#153d6b',
    },
  }}
  fullWidth
  onClick={() =>
    handlePlanSelection(index === 0 ? 'freemium' : index === 1 ? 'premium' : 'premiumPro')
  }
>
  {index === 2 ? 'Contáctenos' : 'Elija plan'}
</Button>

                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Element>
{/* Contacto */}
{/* Contacto */}
<Element name="contacto">
  <Box
    sx={{
      py: 10,
      bgcolor: 'transparent', // Fondo transparente para mostrar la imagen
      color: 'black',
      backgroundImage: `url(${require('./grafo.png')})`,
      backgroundSize: 'cover', // Asegura que la imagen cubra todo el fondo
      backgroundPosition: 'center', // Centra la imagen
      backgroundRepeat: 'no-repeat', // Evita repeticiones
    }}
    data-aos="fade-up"
  >
    <Container>
    <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 6,
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          color: "#1e4b81",
        }}
        data-aos="fade-down"
      >
      Contáctenos
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {/* Información de contacto */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '15px', // Bordes redondeados más grandes
              border: '2px solid #1e4b81', // Borde destacado
              p: 4,
              color: '#1e4b81',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', // Distribución ajustada
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Animaciones suaves
              '&:hover': {
                transform: 'translateY(-5px)', // Efecto de elevación
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada al pasar el cursor
              },
            }}
            data-aos="zoom-in"
          >
            {/* Teléfono */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <PhoneIcon sx={{ fontSize: 50, color: '#d37d36', mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Llámenos al
                </Typography>
                <Typography variant="body1">926 29 52 48</Typography>
              </Box>
            </Box>

            {/* Ubicación */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocationOnIcon sx={{ fontSize: 50, color: '#d37d36', mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Ubicación
                </Typography>
                <Typography variant="body1">
                  Cam. Moledores, 13005
                  <br />
                  Ciudad Real
                </Typography>
              </Box>
            </Box>

            {/* Correo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <EmailIcon sx={{ fontSize: 50, color: '#d37d36', mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Escríbenos
                </Typography>
                <Typography variant="body1">dqpa@dqteam.es</Typography>
              </Box>
            </Box>

            {/* Íconos de LinkedIn y página web */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: 4, // Margen superior
              }}
            >
              {/* Ícono de LinkedIn */}
              <a
                href="https://www.linkedin.com/company/dqteam-sl/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon
                  sx={{
                    fontSize: 40,
                    color: '#1e4b81',
                    '&:hover': {
                      color: '#d37d36', // Cambio de color al pasar el cursor
                    },
                  }}
                />
              </a>

              {/* Ícono de la página web */}
              <a
                href="https://dqteam.es"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LanguageIcon
                  sx={{
                    fontSize: 40,
                    color: '#1e4b81',
                    '&:hover': {
                      color: '#d37d36', // Cambio de color al pasar el cursor
                    },
                  }}
                />
              </a>
            </Box>
          </Box>
        </Grid>

        {/* Formulario */}
        <Grid item xs={12} md={8}>
          <Box
            component="form"
            onSubmit={handleSubmit} // Llama a la función de validación
            sx={{
              bgcolor: 'white',
              borderRadius: '15px',
              border: '2px solid #1e4b81',
              p: 4,
              color: '#1e4b81',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
            data-aos="zoom-in"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: '1.2rem' }}
            >
              Queremos saber más sobre sus necesidades.
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>
              Complete el formulario para obtener más información o resolver cualquier duda.
            </Typography>

            <Grid container spacing={2}>
              {/* Campo de correo */}
              <Grid item xs={12}>
                <TextField
                  label="Correo electrónico"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  error={errors.email}
                  helperText={errors.email && 'El correo es obligatorio'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '& fieldset': {
                        borderColor: '#1e4b81',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d37d36',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#d37d36',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Campo de mensaje */}
              <Grid item xs={12}>
                <TextField
                  label="Escribe aquí tu mensaje"
                  name="message"
                  value={formValues.message}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  error={errors.message}
                  helperText={errors.message && 'El mensaje es obligatorio'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '& fieldset': {
                        borderColor: '#1e4b81',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d37d36',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#d37d36',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Check de privacidad */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formValues.policyAccepted}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: '10px' }}
                  />
                  <Typography variant="body2">
  He leído y acepto la{' '}
  <MuiLink
    component={RouterLink}
    to="/politica"
    sx={{
      textDecoration: 'none',
      color: '#d37d36',
      '&:hover': { textDecoration: 'underline' },
    }}
  >
    política de privacidad
  </MuiLink>{' '}
  *
</Typography>

                </Box>
                {errors.policyAccepted && (
                  <Typography variant="body2" sx={{ color: 'red', mt: 1 }}>
                    Debes aceptar la política de privacidad.
                  </Typography>
                )}
              </Grid>

              {/* Botón de envío */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: '#d37d36',
                    '&:hover': {
                      bgcolor: '#c16f31',
                    },
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                  fullWidth
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>


  </Box>
</Element>



    </>
  );
};

export default Home;
