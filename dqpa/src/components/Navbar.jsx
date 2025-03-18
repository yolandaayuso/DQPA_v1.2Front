import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Efecto de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        setScrolling(window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Navegación y scroll
  const handleNavigation = (item) => {
    if (item.to.startsWith('/')) {
      navigate(item.to);
    } else {
      if (isHome) {
        scroller.scrollTo(item.to, { smooth: true, duration: 800, offset: -70 });
      } else {
        navigate('/');
        setTimeout(() => scroller.scrollTo(item.to, { smooth: true, duration: 800, offset: -70 }), 500);
      }
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const guestMenu = [
    { label: 'Inicio', to: 'inicio' },
    { label: '¿Qué es DQPa?', to: 'que-es' },
    { label: 'Funcionalidades', to: 'funcionalidades' },
    { label: 'Planes', to: 'planes' },
    { label: 'Contacto', to: 'contacto' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: isHome ? (scrolling ? '#ffffff' : 'transparent') : '#ffffff',
          color: scrolling || !isHome ? '#0a1929' : 'white',
          boxShadow: scrolling || !isHome ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          zIndex: 1201,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              transform: isHome && !scrolling ? 'scale(1.2)' : 'scale(1)',
              mt: 1,
            }}
            onClick={handleLogoClick}
          >
            <img
              src="/images/logo4.png"
              alt="DQPa Logo"
              style={{
                width: isHome && !scrolling ? '60px' : '50px',
                height: isHome && !scrolling ? '60px' : '50px',
                marginRight: '10px',
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: isHome && !scrolling ? '2.5rem' : '2.2rem',
                textTransform: 'capitalize',
                color: scrolling || !isHome ? '#2d3748' : 'white',
                transition: 'font-size 0.3s ease, color 0.3s ease',
                fontFamily: `'Montserrat', sans-serif`,
                letterSpacing: '0.1rem',
                lineHeight: 1.2,
              }}
            >
              DQPa
            </Typography>
          </Box>

          {/* Menú de navegación */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {guestMenu.map((item, index) => (
              <Button
                key={index}
                onClick={() => handleNavigation(item)}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  mx: 1.5,
                  color: scrolling || !isHome ? '#0a1929' : 'white',
                  '&:hover': { color: '#d37d36', bgcolor: 'transparent' },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Botón de Iniciar Sesión */}
            <Button
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'uppercase',
                backgroundColor: '#1e4b81',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                ml: 2,
                px: 3,
                borderRadius: '25px',
                '&:hover': { backgroundColor: '#b6632c' },
              }}
            >
              Iniciar sesión
            </Button>
          </Box>

          {/* Botón del menú móvil */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer Panel */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            bgcolor: '#ffffff',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: 'center' }}
          >
            Menú
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            {guestMenu.map((item, index) => (
              <ListItem disablePadding key={index}>
                <ListItemButton
                  onClick={() => {
                    handleNavigation(item);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Botón de Iniciar Sesión */}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate('/login');
                  setDrawerOpen(false);
                }}
              >
                <ListItemText
                  primary="Iniciar Sesión"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
