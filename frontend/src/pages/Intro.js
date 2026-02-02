import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Intro() {
  const navigate = useNavigate();
  const theme = useTheme();

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
  };

  const features = [
    { title: "Resume Generator", desc: "ATS-ready resumes with AI suggestions.", color: "#E3F2FD" },
    { title: "Career Roadmaps", desc: "AI-guided 90-day personalized learning paths.", color: "#F1F8E9" },
    { title: "Interview Preparation", desc: "Mock interviews with AI scoring & analysis.", color: "#FFF3E0" },
    { title: "Doubt Solver", desc: "AI + Community answers for every technical question.", color: "#FCE4EC" },
    { title: "AI Code Reviewer", desc: "Code optimization, best practices & bug detection.", color: "#EDE7F6" },
    { title: "UI Feedback", desc: "Your feedback improves the app experience!", color: "#BBDEFB" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        fontFamily: "Poppins",

        // 🌈 Soft pastel animated background
        background: "linear-gradient(135deg, #fafaff, #eef3ff, #fff5f8)",
        backgroundSize: "300% 300%",
        animation: "bgFlow 14s ease infinite",

        "@keyframes bgFlow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Container maxWidth="lg">

        {/* LOGO + TITLE */}
        <Typography
          variant="h2"
          align="center"
          fontWeight={900}
          sx={{
            background: "linear-gradient(90deg, #0072ff, #7ab6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
            mb: 2,
            textShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          CareerMind ✨
        </Typography>

        {/* TAGLINE */}
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{
            maxWidth: "820px",
            mx: "auto",
            fontSize: "1.3rem",
            lineHeight: 1.7,
            mb: { xs: 7, md: 10 },
          }}
        >
          Your AI-powered guide for resumes, interview prep, roadmaps,
          doubt-solving, and smart code reviews — all in one place.
        </Typography>

        {/* SECTION TITLE */}
        <Typography
          variant="h4"
          align="center"
          fontWeight={800}
          sx={{
            mb: 6,
            color: "#333",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Features & Tools
        </Typography>

        {/* FEATURE GRID */}
        <Grid container spacing={4} justifyContent="center">
          {features.map((item, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Paper
                  elevation={5}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 5,
                    bgcolor: item.color,
                    transition: "0.4s",
                    position: "relative",
                    overflow: "hidden",

                    "&:hover": {
                      transform: "translateY(-10px) scale(1.03)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      backgroundColor: "#ffffffbb",
                      backdropFilter: "blur(4px)",
                    },

                    // ✨ glossy shine effect
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: "-120%",
                      left: "-120%",
                      width: "250%",
                      height: "250%",
                      background:
                        "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
                      transform: "rotate(25deg)",
                      transition: "0.6s",
                    },
                    "&:hover:after": {
                      top: "120%",
                      left: "120%",
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                      px: 1,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* BUTTON */}
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 7,
              py: 1.8,
              borderRadius: "40px",
              fontSize: "1.2rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(90deg, #4d9cff, #6db4ff)",
              boxShadow: "0 6px 20px rgba(80,150,255,0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #287fff, #569dff)",
                boxShadow: "0 8px 24px rgba(80,150,255,0.5)",
              },
            }}
            onClick={() => navigate("/home")}
          >
            Get Started
          </Button>
        </Box>

        {/* ABOUT SECTION (ADDED) */}
        <Box
          sx={{
            mt: 12,
            textAlign: "center",
            bgcolor: "white",
            py: 10,
            px: { xs: 3, md: 10 },
            borderRadius: 6,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{
              color: "linear-gradient(90deg, #0072ff, #7ab6ff)" /* visual only; actual gradient applied to text below */,
            }}
          >
            About CareerMind
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
            sx={{
              lineHeight: 1.9,
              fontSize: "1.15rem",
            }}
          >
            CareerMind is your AI-powered guide to mastering professional growth.
            Whether you're a student or a working professional, it helps you build powerful
            resumes, improve coding skills, prepare for interviews, and explore job opportunities —
            all powered by intelligent insights. Our tools combine AI recommendations with practical,
            real-world guidance to help you achieve your career goals faster.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default Intro;
