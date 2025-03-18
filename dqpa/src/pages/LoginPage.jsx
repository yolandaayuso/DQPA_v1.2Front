import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9092";

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {

        email,
        password,
      });

      const { token } = response.data;
      Cookies.set("token", token, { expires: 1, secure: true, sameSite: "strict" });

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      setError("");
      setSuccess("¡Inicio de sesión exitoso!");

      setTimeout(() => {
        navigate(userRole === "ROLE_ADMIN" ? "/admin-dashboard" : "/mis-autoevaluaciones");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error al iniciar sesión.");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Formulario - Columna izquierda */}
      <Grid
        item
        xs={12}
        md={6}
        lg={5}
        sx={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 3, md: 6 }, // 🔹 Ajuste de márgenes
        }}
      >
        <Grid item sx={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
          {/* Logo */}
          <img
            src="/images/logo4.png"
            alt="DQPa Logo"
            style={{
              width: "60px",
              marginBottom: "15px",
            }}
          />

          {/* Título */}
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "#1e4b81" }}>
            Iniciar Sesión
          </Typography>

          {/* Mensajes */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* Formulario */}
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#1e4b81" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#1e4b81" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#d37d36",
              "&:hover": { bgcolor: "#c16f31" },
              color: "white",
              fontWeight: "bold",
              py: 1.5,
            }}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>

          {/* Enlaces adicionales */}
          <Grid container spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
          
            <Grid item>
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: "#1e4b81",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Imagen - Columna derecha */}
      <Grid
        item
        xs={12}
        md={6}
        lg={7}
        sx={{
          backgroundColor: "#f4f5f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, md: 4 }, // 🔹 Menos padding arriba
          textAlign: "center",
        }}
      >
        <motion.img
          src="/images/login.svg"
          alt="Ilustración de Inicio de Sesión"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          style={{ width: "90%", maxWidth: "650px", height: "auto" }} // 🔹 Tamaño ajustado
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
