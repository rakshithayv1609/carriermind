import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background:
          "linear-gradient(120deg, #6d5dfc 0%, #3b82f6 50%, #0ea5e9 100%)",
        overflow: "hidden",
        py: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "140%",
          height: "140%",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)",
          zIndex: 0,
          filter: "blur(100px)",
          animation: "lightMove 10s infinite alternate ease-in-out",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "10%",
          left: "50%",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          filter: "blur(120px)",
          animation: "lightMoveAlt 12s infinite alternate ease-in-out",
        },
        "@keyframes lightMove": {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(5%,5%) scale(1.1)" },
        },
        "@keyframes lightMoveAlt": {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(-5%,-5%) scale(1.05)" },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 6,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.2), 0 0 25px rgba(255,255,255,0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow:
                "0 18px 40px rgba(0,0,0,0.25), 0 0 35px rgba(255,255,255,0.35)",
            },
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mb: 1,
              color: "#1671cdff",
              letterSpacing: "0.5px",
            }}
          >
            Create Account
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="subtitle2"
            sx={{
              mb: 4,
              color: "#374151",
              fontWeight: 400,
            }}
          >
            Join <strong>CareerMind</strong> — your AI-powered career mentor
          </Typography>

          <Stack spacing={2}>
            {/* Username Field */}
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "#f9fafb",
                },
              }}
            />

            {/* Email Field */}
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "#f9fafb",
                },
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "#f9fafb",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "#f9fafb",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Register Button */}
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.3,
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                background:
                  "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
                boxShadow:
                  "0 4px 14px rgba(37,99,235,0.4), 0 0 20px rgba(37,99,235,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow:
                    "0 6px 20px rgba(37,99,235,0.5), 0 0 25px rgba(37,99,235,0.4)",
                },
              }}
            >
              Register
            </Button>
          </Stack>

          {/* Login Redirect */}
          <Typography variant="body2" sx={{ mt: 3, color: "#4b5563" }}>
            Already have an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#2563eb",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
