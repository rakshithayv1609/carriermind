import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Fade,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CloudDownload as CloudDownloadIcon,
  Send as SendIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Build as BuildIcon,
  Code as CodeIcon,
} from "@mui/icons-material";

const Resume = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
  });

  const [loading, setLoading] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const progress = useMemo(() => {
    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter((v) => v.trim() !== "").length;
    return (filled / total) * 100;
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateResume = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate resume");

      const data = await response.json();
      setDownloadUrl(`http://localhost:5000${data.file}`);
      setResumeReady(true);
    } catch (error) {
      console.error("Resume Generation Error:", error);
      alert("Something went wrong while generating resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E1F5FE 100%)",
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
      {/* Header */}
      <Fade in timeout={800}>
        <Box textAlign="center" mb={5}>
          <DescriptionIcon
            sx={{
              fontSize: 65,
              color: "#0288d1",
              mb: 1,
              animation: "bounce 2s infinite",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-6px)" },
              },
            }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#01579b",
              letterSpacing: 1,
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            CareerMind Resume Builder
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Craft your perfect resume effortlessly with <b style={{ color: "#0288d1" }}>AI ✨</b>
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={7}>
          <Fade in timeout={1000}>
            <Paper
              elevation={10}
              sx={{
                p: 4,
                borderRadius: 5,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {/* Section Header */}
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
                sx={{
                  background:
                    "linear-gradient(90deg, #0288d1 0%, #03a9f4 100%)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <PersonIcon />
                <Typography variant="h6" fontWeight="bold">
                  Personal Information
                </Typography>
              </Box>

              {[
                { label: "Full Name * ", name: "name" },
                { label: "Email * ", name: "email" },
                { label: "Phone * ", name: "phone" },
                { label: "LinkedIn * ", name: "linkedin" },
                { label: "GitHub * ", name: "github" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={formData[field.name]}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#0288d1",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0288d1",
                        boxShadow: "0 0 6px rgba(2,136,209,0.4)",
                      },
                    },
                  }}
                />
              ))}

              {[
                { icon: <SchoolIcon />, label: "Education * ", name: "education" },
                { icon: <BuildIcon />, label: "Skills * ", name: "skills" },
                { icon: <WorkIcon />, label: "Experience (If there is any)", name: "experience" },
                { icon: <CodeIcon />, label: "Projects * ", name: "projects" },
              ].map((section) => (
                <Box key={section.name} mt={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {section.icon}
                    <Typography variant="h6" fontWeight="bold" color="#0288d1">
                      {section.label}
                    </Typography>
                  </Box>
                  <TextField
                    name={section.name}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={section.name === "experience" || section.name === "projects" ? 3 : 2}
                    value={formData[section.name]}
                    onChange={handleChange}
                    placeholder={`Enter your ${section.label.toLowerCase()}...`}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": { borderColor: "#03a9f4" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#0288d1",
                          boxShadow: "0 0 8px rgba(3,169,244,0.4)",
                        },
                      },
                    }}
                  />
                </Box>
              ))}

              {/* Progress bar */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Profile completion:{" "}
                  <b style={{ color: "#0288d1" }}>{Math.round(progress)}%</b>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    "& .MuiLinearProgress-bar": {
                      background:
                        "linear-gradient(90deg, #0288d1 0%, #03a9f4 100%)",
                    },
                  }}
                />
              </Box>

              {/* Buttons */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<SendIcon />}
                sx={{
                  mt: 4,
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
                onClick={handleGenerateResume}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Resume with AI"}
              </Button>

              {resumeReady && (
                <Fade in={resumeReady} timeout={600}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudDownloadIcon />}
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.2,
                      borderRadius: "12px",
                      borderWidth: "2px",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: "#0288d1",
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                    href={downloadUrl}
                    download
                  >
                    Download Resume
                  </Button>
                </Fade>
              )}
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Resume;
