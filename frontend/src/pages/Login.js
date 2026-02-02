import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "linear-gradient(120deg, #6d5dfc 0%, #3b82f6 50%, #0ea5e9 100%)",
        overflow: "hidden",
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
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: "#1e3a8a" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "#374151" }}>
            Login to your <strong>CareerMind</strong> account
          </Typography>

          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  sx: { borderRadius: 2, backgroundColor: "#f9fafb" },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  sx: { borderRadius: 2, backgroundColor: "#f9fafb" },
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

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  py: 1.3,
                  borderRadius: "30px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  background: "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.4), 0 0 20px rgba(37,99,235,0.3)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                    boxShadow: "0 6px 20px rgba(37,99,235,0.5), 0 0 25px rgba(37,99,235,0.4)",
                  },
                }}
              >
                Login
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              py: 1.3,
              textTransform: "none",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#2563eb",
              borderColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#f0f7ff",
                borderColor: "#1e40af",
              },
            }}
          >
            Login with Google
          </Button>

          <Typography variant="body2" sx={{ mt: 3, color: "#4b5563" }}>
            Don't have an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#2563eb",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Register
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
