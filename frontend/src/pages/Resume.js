import React, { useState, useMemo } from "react";
import API from "../api";
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
      const response = await fetch(`${API}/api/generate-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate resume");

      const data = await response.json();

      setDownloadUrl(`${API}${data.file}`);
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
      }}
    >
      <Fade in timeout={800}>
        <Box textAlign="center" mb={5}>
          <DescriptionIcon
            sx={{
              fontSize: 65,
              color: "#0288d1",
              mb: 1,
            }}
          />

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#01579b",
              letterSpacing: 1,
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
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PersonIcon />
                <Typography variant="h6" fontWeight="bold">
                  Personal Information
                </Typography>
              </Box>

              {[
                { label: "Full Name *", name: "name" },
                { label: "Email *", name: "email" },
                { label: "Phone *", name: "phone" },
                { label: "LinkedIn *", name: "linkedin" },
                { label: "GitHub *", name: "github" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  fullWidth
                  margin="normal"
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              ))}

              {[
                { icon: <SchoolIcon />, label: "Education *", name: "education" },
                { icon: <BuildIcon />, label: "Skills *", name: "skills" },
                { icon: <WorkIcon />, label: "Experience", name: "experience" },
                { icon: <CodeIcon />, label: "Projects *", name: "projects" },
              ].map((section) => (
                <Box key={section.name} mt={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {section.icon}
                    <Typography variant="h6" fontWeight="bold">
                      {section.label}
                    </Typography>
                  </Box>

                  <TextField
                    name={section.name}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={formData[section.name]}
                    onChange={handleChange}
                  />
                </Box>
              ))}

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" mb={1}>
                  Profile completion: <b>{Math.round(progress)}%</b>
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<SendIcon />}
                sx={{ mt: 4 }}
                onClick={handleGenerateResume}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Resume with AI"}
              </Button>

              {resumeReady && (
                <Fade in timeout={600}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
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