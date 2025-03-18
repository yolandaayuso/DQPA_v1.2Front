import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { jwtDecode } from "jwt-decode";

const drawerWidth = 260;
const collapsedWidth = 72;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const token = Cookies.get("token");
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  useEffect(() => {
    if (isMobile) setCollapsed(false); // 🔥 Asegurar que en móvil no se colapse
  }, [isMobile]);

  const menuItems =
    userRole === "ROLE_ADMIN"
      ? [
          { text: "Usuarios", icon: <HomeIcon />, path: "/admin-dashboard/usuarios" },
          { text: "Preguntas", icon: <AddCircleOutlineIcon />, path: "/admin-dashboard/preguntas" },
          { text: "Procesos", icon: <AddCircleOutlineIcon />, path: "/admin-dashboard/procesos" },
        ]
      : [
          { text: "Inicio", icon: <HomeIcon />, path: "/mis-autoevaluaciones" },
          { text: "Nueva Autoevaluación", icon: <AddCircleOutlineIcon />, path: "/nueva-autoevaluacion" },
        ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* 🔹 LOGO */}
      <Box sx={{ textAlign: "center", padding: "20px 0" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/images/logo4.png" alt="Logo" style={{ height: 50, marginBottom: 8 }} />
          {!collapsed && (
            <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
              DQPa
            </Typography>
          )}
        </Box>
      </Box>

      {/* 🔹 MENÚ DE OPCIONES */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={collapsed ? item.text : ""} placement="right" arrow>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                margin: "8px",
                borderRadius: "10px",
                transition: "all 0.3s ease",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "12px" : "10px 18px",
                "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                "&.Mui-selected": { background: "rgba(255, 255, 255, 0.15)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: "unset", display: "flex", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      {/* 🔹 BOTÓN DE CERRAR SESIÓN */}
      <Box sx={{ padding: "20px" }}>
        <Divider sx={{ bgcolor: "white", marginBottom: "10px" }} />
        <Tooltip title={collapsed ? "Cerrar Sesión" : ""} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              bgcolor: "#d37d36",
              color: "white",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "12px" : "10px 18px",
              "&:hover": { bgcolor: "#1e4b81", transform: "scale(1.05)" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: "unset", display: "flex", justifyContent: "center" }}>
              <ExitToAppIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Cerrar Sesión" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 🔹 NAVBAR PARA MÓVILES */}
      <AppBar position="fixed" sx={{ display: { md: "none" }, backgroundColor: "#0D1B2A" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1 }}>
            <img src="/images/logo4.png" alt="Logo" style={{ height: 40 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              DQPa
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔹 BOTÓN FLOTANTE PARA COLAPSAR/EXPANDIR */}
      {!isMobile && (
        <IconButton
          onClick={toggleCollapse}
          sx={{
            position: "fixed",
            top: "50%",
            left: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
            color: "#1e4b81",
            borderRadius: "50%",
            transition: "all 0.3s ease",
            zIndex: 1201,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          {collapsed ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
        </IconButton>
      )}

      {/* 🔹 SIDEBAR */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            transition: "width 0.3s ease",
            background: "linear-gradient(180deg, #0D1B2A 0%, #102A43 100%)",
            color: "white",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
