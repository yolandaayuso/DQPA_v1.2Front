import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";
import ImageIcon from "@mui/icons-material/Image";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {  useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Asegúrate de instalarlo con: npm install jwt-decode
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

 

// 🔹 Contenedor principal
const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "#F4F6F8",
  padding: "1rem 0rem",// Reduce aún más el margen lateral
  textAlign: "left",
});
const GoToQuizButton = styled(Button)({
  background: "#1e4b81", // Azul oscuro
  color: "#fff",
  fontSize: "1rem",
  fontWeight: "bold",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  transition: "0.3s",
  "&:hover": {
    background: "#163a66", // Un azul más oscuro al pasar el mouse
    transform: "scale(1.05)",
  },
});

// 🔹 Timeline vertical más compacto
const Timeline = styled(Box)({
  position: "relative",
  maxWidth: "100%",// Hace que ocupe todo el ancho disponible
  width: "95%", // Deja solo un pequeño margen lateral
  
  "&:before": {
    content: '""',
    position: "absolute",
    left: "22px",
    top: 0,
    bottom: 0,
    width: "3px",
    background: "#1e4b81", // Azul oscuro
  },
});

// 🔹 Elemento de la timeline
const TimelineItem = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "20px",
  position: "relative",
});

// 🔹 Punto en la línea de tiempo
const TimelineDot = styled(Box)({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  background: "#d37d36", // Naranja oscuro
  position: "absolute",
  left: "16px",
  top: "6px",
  border: "2px solid white",
  boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
});

// 🔹 Tarjeta de contenido más compacta
const StepCard = styled(Paper)({
  marginLeft: "40px", // Menos espacio lateral
  padding: "0.6rem 1.2rem", // Menos padding para hacerla más discreta
  borderRadius: "8px",
  boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
  width: "100%",
  background: "#ffffff",
  borderLeft: "4px solid #1e4b81", // Borde azul oscuro para elegancia
  transition: "0.2s",
  "&:hover": {
    transform: "scale(1.01)",
  },
});

// 🔹 Espacio para la imagen de procesos ajustable dinámicamente
const ImagePlaceholder = styled(Box)({
  width: "100%", // Usa todo el ancho disponible
  maxWidth: "650px", // Máximo permitido
  background: "#DCE3F0",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "25px",
  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
  overflow: "hidden", // Evita que sobresalga
});

// 🔹 Imagen ajustable automáticamente
const StyledImage = styled("img")({
  width: "auto", // Ajusta el ancho según el contenido
  height: "auto", // Mantiene la proporción original
  maxWidth: "100%", // No sobrepasa el contenedor
  maxHeight: "100%", // Evita que sea más grande de lo necesario
  borderRadius: "10px",
});




const InstruccionesPage = () => {
  const navigate = useNavigate();
  const { cuestionarioId } = useParams();
  const token = Cookies.get("token");
  const userRole= jwtDecode(token).role;
  

  const imageSrc = userRole === "ROLE_PREMIUMPRO" 
  ? "/images/nivelMadurez3.jpg" 
  : "/images/nivelMadurez2.jpg"; // Valor por defecto para ROLE_PREMIUM

  return (
    <Container>
     <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "950px",
    mt: { xs: 2, md: 3 }, // 🔹 Más margen arriba (6 en móviles, 8 en pantallas grandes)
    mb: 3,
    flexWrap: "wrap", // Permite que los elementos bajen de línea si no caben
    gap: 2, // Espacio entre elementos en móviles
  }}
>
  <Typography
    variant="h6"
    sx={{ 
      fontWeight: "bold", 
      color: "#1e4b81", 
      flex: 1, // Permite que el texto ocupe más espacio sin empujar el botón
      minWidth: "200px" // Evita que el título se achique demasiado
    }}
  >
    Instrucciones del Cuestionario
  </Typography>
  <GoToQuizButton 
    sx={{ 
      flexShrink: 0, // Evita que el botón se reduzca demasiado en móviles
      whiteSpace: "nowrap" // Evita que el texto del botón se divida en dos líneas
    }} 
    onClick={() => navigate(`/cuestionario/${cuestionarioId}`)}
  >
    Ir al Cuestionario
  </GoToQuizButton>
</Box>



      {/* 🔹 Timeline de instrucciones */}
      <Timeline>
        <TimelineItem>
          <TimelineDot />
          <StepCard>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
              Objetivo del Cuestionario
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
              Autoevalua el estado de tus procesos de datos y determina su nivel de capacidad.
            </Typography>
          </StepCard>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot />
          <StepCard>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
              Estructura del Cuestionario
            </Typography>
            <>
  <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
    Se basa en los procesos que usted ha seleccionado anteriormente, con preguntas específicas para cada uno de ellos, que evalúan los resultados de proceso necesarios, según se especifica en las normas UNE correspondientes: UNE 0077 para los procesos de Gobierno, UNE 0078 para los procesos de Gestión, y UNE 0079 para los procesos de Calidad.
  </Typography>
  <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
    Cada pregunta relacionada con los procesos consta de tres posibles respuestas (sólo puede seleccionarse una), cada una asignada con una puntuación distinta. Con ellas se evalúa el nivel 1 de cada proceso.
  </Typography>
</>

          </StepCard>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot />
          <StepCard>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
              Soporte y Ejemplos
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
            Para brindarte un mayor apoyo en la comprensión y respuesta del cuestionario, cada pregunta viene acompañada de un icono de ayuda. 
  Al pulsar en este icono, se mostrarán ejemplos ilustrativos que te ayudarán a entender mejor el contexto de la pregunta y cómo responderla de manera adecuada.
</Typography>

<Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
  Además, en la parte derecha de la pantalla, encontrarás un resumen que te proporcionará información valiosa sobre tu progreso en el cuestionario. 
  Este resumen se actualizará dinámicamente a medida que completes cada proceso y respondas las preguntas generales. 
  Podrás visualizar qué procesos has completado ya que aparecerá un tick en ellos y qué preguntas has respondido, lo que te permitirá tener un seguimiento claro de tu avance en la evaluación.
</Typography>
          </StepCard>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot />
          <StepCard>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
              Guardado Automático
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
Es posible alternar entre los diferentes procesos seleccionados en cualquier momento. Todas sus respuestas se guardarán automáticamente, garantizando que no perderá ningún progreso al cambiar de sección.
                </Typography>
          </StepCard>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot />
          <StepCard>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
              Retomar el Cuestionario
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
              Puedes salir y volver en cualquier momento sin perder tu progreso.
            </Typography>
          </StepCard>
        </TimelineItem>

        {userRole === "ROLE_PREMIUM" && (
          <TimelineItem>
            <TimelineDot />
            <StepCard>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
                Preguntas Generales Nivel 2
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
              Adiccionalmente a las preguntas de cada proceso deberá responder a un conjunto de preguntas generales nivel 2 que aplican a todos los procesos seleccionados, las cuales se encuentran en su nivel correspondiente              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
              Puede verse en la imagen siguiente, el resumen de cómo se consigue alcanzar el nivel de madurez 2.              </Typography>
            </StepCard>
          </TimelineItem>
        )}

        {userRole === "ROLE_PREMIUMPRO" && (
          <TimelineItem>
            <TimelineDot />
            <StepCard>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e4b81", fontSize: "1rem" }}>
                Preguntas Generales Nivel 2 y 3
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
              Adiccionalmente a las preguntas de cada proceso deberá responder a un conjunto de preguntas generales nivel 2 que aplican a todos los procesos seleccionados, las cuales se encuentran en su nivel correspondiente              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mt: 0.3 }}>
              Puede verse en la imagen siguiente, el resumen de cómo se consigue alcanzar el nivel de madurez 3.              </Typography>
            </StepCard>
          </TimelineItem>
        )}
      </Timeline>
{/* 🔹 Mostrar la imagen solo si el rol es ROLE_PREMIUM o ROLE_PREMIUMPRO */}
{(userRole === "ROLE_PREMIUM" || userRole === "ROLE_PREMIUMPRO") && (
  <ImagePlaceholder>
    <StyledImage
      src={userRole === "ROLE_PREMIUMPRO" 
        ? "/images/nivelesMadurez3.jpg" 
        : "/images/nivelesMadurez2.jpg"}
      alt="Nivel de Madurez"
    />
  </ImagePlaceholder>
)}


    </Container>
  );
};

export default InstruccionesPage;