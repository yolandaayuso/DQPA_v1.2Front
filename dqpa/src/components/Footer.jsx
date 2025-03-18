import React from 'react';
import { Box, Typography, Grid, IconButton, Link as MuiLink } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll'; // Importar scroller para scroll

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    if (to === '/politica') {
      // Ir directamente a la política de privacidad
      navigate(to);
    } else {
      // Navegar a la home y luego desplazarse a la sección
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo(to, {
          smooth: true,
          duration: 800,
          offset: -70, // Ajusta según el tamaño del navbar fijo
        });
      }, 300); // Esperar a que la página de inicio cargue
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1e3a5f', // Fondo azul oscuro
        color: 'white',
        pt: 8,
        pb: 4,
        px: { xs: 3, md: 8 },
      }}
    >
      {/* Sección superior */}
      <Grid
        container
        spacing={6}
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ maxWidth: '1200px', mx: 'auto' }} // Margen igualado en ambos lados
      >
       {/* Columna 1: Logo (Imagen) y descripción */}
<Grid item xs={12} md={4}>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mb: 2,
    }}
  >
    {/* Imagen del logo */}
    <img
      src="/images/logo4.png" // Ruta absoluta desde `public`
      alt="DQPa Logo"
      style={{
        width: '50px', // Ajusta el tamaño de la imagen
        height: '50px',
        objectFit: 'contain',
      }}
    />
    <Typography
      variant="h5"
      component="div"
      sx={{
        fontWeight: 700, // Peso de fuente robusto
        textTransform: 'capitalize', // Capitalización limpia
        color: '#d37d36', // Gris oscuro o blanco
        transition: 'font-size 0.3s ease, color 0.3s ease',
        fontFamily: `'Montserrat', sans-serif`, // Nueva fuente
        letterSpacing: '0.1rem', // Espaciado más notable
        lineHeight: 1.2, // Altura de línea moderna
      }}
    >
      DQPa
    </Typography>
  </Box>
  <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
    DQPa es la herramienta para evaluar la madurez y capacidad de procesos de datos.
    Mejore la calidad y eficiencia de su organización con nuestra solución.
  </Typography>
</Grid>


        {/* Columna 2: Enlaces rápidos */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: '#d37d36' }}
          >
            Enlaces rápidos
          </Typography>
          <Box>
            {[
              { label: 'Inicio', to: 'inicio' },
              { label: '¿Qué es DQPa?', to: 'que-es' },
              { label: 'Funcionalidades', to: 'funcionalidades' },
              { label: 'Planes', to: 'planes' },
              { label: 'Contacto', to: 'contacto' },
            ].map((link, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                <MuiLink
                  component="button"
                  onClick={() => handleNavigation(link.to)}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'color 0.3s ease',
                    '&:hover': { color: '#d37d36' },
                  }}
                >
                  {link.label}
                </MuiLink>
              </Typography>
            ))}
          </Box>
        </Grid>

        {/* Columna 3: Contacto */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: '#d37d36' }}
          >
            Contáctenos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 2, fontSize: '1.5rem', color: '#d37d36' }} />
            <Typography variant="body2">
              Cam. Moledores, 13005
              <br />
              Ciudad Real, España
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon sx={{ mr: 2, fontSize: '1.5rem', color: '#d37d36' }} />
            <Typography variant="body2">926 29 52 48</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 2, fontSize: '1.5rem', color: '#d37d36' }} />
            <Typography variant="body2">dqpa@dqteam.es</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Enlaces sociales y política de privacidad */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          mt: 4,
          mb: 4,
        }}
      >
        {/* Iconos sociales */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <IconButton
            component="a"
            href="https://www.linkedin.com/company/dqteam-sl/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#d37d36' },
            }}
          >
            <LinkedInIcon fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href="https://dqteam.es"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#d37d36' },
            }}
          >
            <LanguageIcon fontSize="large" />
          </IconButton>
        </Box>

        {/* Enlace a Política de privacidad */}
        <MuiLink
          component="button"
          onClick={() => handleNavigation('/politica')}
          sx={{
            fontSize: '0.9rem',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'color 0.3s ease',
            '&:hover': { color: '#d37d36' },
          }}
        >
          Política de privacidad
        </MuiLink>
      </Box>

      {/* Línea divisoria */}
      <Box sx={{ my: 4, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }} />
      {/* Referencias Artwork */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.8, mb: 1 }}>
          Artwork:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton component="a" href="https://www.freepik.com/author/stories" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', '&:hover': { color: '#d37d36' } }}>
            🎨
          </IconButton>
          <IconButton component="a" href="https://www.freepik.com/author/vectorjuice" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', '&:hover': { color: '#d37d36' } }}>
            🖌️
          </IconButton>
          <IconButton component="a" href="https://www.freepik.com/author/arfmdn99" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', '&:hover': { color: '#d37d36' } }}>
            🖼️
          </IconButton>
          <IconButton component="a" href="https://www.freepik.com/author/blossomstar" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', '&:hover': { color: '#d37d36' } }}>
            🎭
          </IconButton>
          <IconButton component="a" href="https://www.freepik.com/author/pikisuperstar" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', '&:hover': { color: '#d37d36' } }}>
            🌟
          </IconButton>
        </Box>
      </Box>

      {/* Derechos reservados */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.8 }}>
          © {new Date().getFullYear()} DQPa. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
