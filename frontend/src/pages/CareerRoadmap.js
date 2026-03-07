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

import API from "../api";   // ✅ import API base URL

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const generateRoadmap = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/generate-roadmap`,
        formData
      );

      setRoadmap(res.data.roadmap);

    } catch (err) {
      console.error(err);

      const message =
        err.response?.status === 503
          ? "AI service is busy. Please try again after a few seconds."
          : "Failed to generate roadmap";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }

    setLoading(false);
  };

  const downloadRoadmap = async () => {
    try {
      const res = await axios.post(
        `${API}/api/download-roadmap`,
        {
          roadmapText: roadmap,
          name: formData.currentRole || "Career_Roadmap",
        },
        {
          responseType: "blob",
        }
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
      }}
    >
      <Container maxWidth="md">

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
              }}
            />

            <Typography
              variant="h3"
              fontWeight="bold"
              color="#01579b"
            >
              Career Roadmap Generator
            </Typography>

          </Stack>
        </Fade>

        <Fade in timeout={1000}>
          <Paper
            elevation={10}
            sx={{
              p: 6,
              borderRadius: 4,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              maxWidth: roadmap ? "100%" : "800px",
              margin: "0 auto",
            }}
          >

            <Typography
              variant="h6"
              fontWeight="bold"
              color="#0288d1"
              gutterBottom
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
                />
              ))}

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
                >
                  {loading ? "Generating..." : "Generate Roadmap"}
                </Button>

                {roadmap && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={downloadRoadmap}
                    startIcon={<DownloadIcon />}
                  >
                    Download as DOCX
                  </Button>
                )}

              </Stack>

            </Stack>

          </Paper>
        </Fade>

        {roadmap && (
          <Fade in timeout={1200}>
            <Card elevation={10} sx={{ p: 4, mt: 5, borderRadius: 4 }}>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
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
                      <Typography key={idx} fontWeight="bold">
                        {cleanLine}
                      </Typography>
                    );
                  }

                  else if (cleanLine.startsWith("-")) {
                    return (
                      <Chip
                        key={idx}
                        label={cleanLine.replace("-", "").trim()}
                        variant="outlined"
                        color="info"
                      />
                    );
                  }

                  else {
                    return (
                      <Typography key={idx}>
                        {cleanLine}
                      </Typography>
                    );
                  }

                })}

              </Stack>

            </Card>
          </Fade>
        )}

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