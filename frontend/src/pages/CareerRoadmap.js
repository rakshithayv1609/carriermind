import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  Box,
  Chip,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const CareerRoadmap = () => {
  const [formData, setFormData] = useState({
    currentRole: "",
    targetRole: "",
    skills: "",
    experience: "",
    interests: "",
  });

  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Generate Career Roadmap
  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/generate-roadmap",
        formData,
        { withCredentials: true }
      );
      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.status === 503
          ? "AI service is busy. Please try again after a few seconds."
          : "Failed to generate roadmap";
      setSnackbar({ open: true, message, severity: "error" });
    }
    setLoading(false);
  };

  // Download as DOCX
  const downloadRoadmap = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/download-roadmap",
        {
          roadmapText: roadmap,
          name: formData.currentRole || "Career_Roadmap",
        },
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${formData.currentRole || "Career_Roadmap"}.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to download roadmap",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E1F5FE 100%)",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 6 },
        animation: "gradientShift 10s ease infinite",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Container maxWidth="md">
        {/* ================= Header ================= */}
        <Fade in timeout={800}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            mb={5}
          >
            <RocketLaunchIcon
              sx={{
                fontSize: 60,
                color: "#0288d1",
                animation: "float 2s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-6px)" },
                },
              }}
            />
            <Typography
              variant="h3"
              fontWeight="bold"
              color="#01579b"
              sx={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Career Roadmap Generator
            </Typography>
          </Stack>
        </Fade>

        {/* ================= Form Section ================= */}
        <Fade in timeout={1000}>
          <Paper
            elevation={10}
            sx={{
              p: 6,
              borderRadius: 4,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease-in-out",
              maxWidth: roadmap ? "100%" : "800px",
              margin: "0 auto",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#0288d1"
              gutterBottom
              sx={{
                pb: 1,
                borderBottom: "2px solid #03a9f4",
                display: "inline-block",
              }}
            >
              Enter Your Details
            </Typography>

            <Stack spacing={3} mt={2}>
              {[
                { label: "Current Role / Education * ", name: "currentRole" },
                { label: "Target Role / Career Goal * ", name: "targetRole" },
                { label: "Skills (comma separated) * ", name: "skills" },
                { label: "Experience Details * ", name: "experience" },
                { label: "Interests (optional)", name: "interests" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      "&:hover fieldset": { borderColor: "#0288d1" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0288d1",
                        boxShadow: "0 0 8px rgba(2,136,209,0.3)",
                      },
                    },
                  }}
                />
              ))}

              {/* Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                mt={3}
              >
                <Button
                  variant="contained"
                  onClick={generateRoadmap}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <RocketLaunchIcon />
                    )
                  }
                  sx={{
                    flex: 1,
                    py: 1.3,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(90deg, #0288d1 0%, #03a9f4 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #0277bd 0%, #039be5 100%)",
                      transform: "scale(1.02)",
                    },
                    transition: "0.3s",
                  }}
                >
                  {loading ? "Generating..." : "Generate Roadmap"}
                </Button>

                {roadmap && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={downloadRoadmap}
                    startIcon={<DownloadIcon />}
                    sx={{
                      flex: 1,
                      py: 1.3,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(90deg, #43a047 0%, #66bb6a 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #2e7d32 0%, #43a047 100%)",
                        transform: "scale(1.02)",
                      },
                      transition: "0.3s",
                    }}
                  >
                    Download as DOCX
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* ================= Roadmap Display ================= */}
        {roadmap && (
          <Fade in timeout={1200}>
            <Card
              elevation={10}
              sx={{
                p: 4,
                mt: 5,
                borderRadius: 4,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: "#0288d1",
                  borderBottom: "3px solid #03a9f4",
                  display: "inline-block",
                  mb: 2,
                }}
              >
                Your Personalized Career Roadmap
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                {roadmap.split("\n").map((line, idx) => {
                  const cleanLine = line.trim();
                  if (!cleanLine) return null;

                  if (
                    cleanLine.match(
                      /^(Summary|Skills|Projects|Certifications|Timeline|Tips)/i
                    )
                  ) {
                    return (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          bgcolor: "#e3f2fd",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(2,136,209,0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="#0288d1"
                        >
                          {cleanLine}
                        </Typography>
                      </Box>
                    );
                  } else if (cleanLine.startsWith("-")) {
                    return (
                      <Chip
                        key={idx}
                        label={cleanLine.replace("-", "").trim()}
                        variant="outlined"
                        color="info"
                        sx={{
                          mr: 1,
                          mb: 1,
                          borderRadius: "10px",
                          fontWeight: 500,
                        }}
                      />
                    );
                  } else {
                    return (
                      <Typography
                        key={idx}
                        variant="body1"
                        sx={{ mb: 1, pl: 1 }}
                      >
                        {cleanLine}
                      </Typography>
                    );
                  }
                })}
              </Stack>
            </Card>
          </Fade>
        )}

        {/* ================= Snackbar ================= */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CareerRoadmap;
