import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Resume Generator",
      description: "AI feedback on resumes with ATS readiness.",
      color: "#E3F2FD",
      image: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
      path: "/resume",
    },
    {
      title: "Career Roadmaps",
      description: "Personalized 90-day skill growth plans.",
      color: "#E8F5E9",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      path: "/roadmaps",
    },
    {
      title: "Interview Preparation QnA",
      description: "Interview questions and answers for efficient preparation.",
      color: "#FFF3E0",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135689.png",
      path: "/jobs",
    },
    {
      title: "Doubt Solver",
      description: "AI + community answers for your queries.",
      color: "#FFEBEE",
      image: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
      path: "/doubts",
    },
    {
      title: "AI Code Reviewer",
      description: "Get instant code feedback & improvements.",
      color: "#F3E5F5",
      image: "https://cdn-icons-png.flaticon.com/512/1383/1383260.png",
      path: "/code-review",
    },
    {
      title: "Feedback",
      description: "Tell us how helpful and useful your experience was.",
      color: "#E1F5FE",
      image: "https://cdn-icons-png.flaticon.com/512/889/889140.png",
      path: "/ui",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",

        // 🌈 Light gradient animated background
        background: "linear-gradient(135deg, #f7faff, #e6f0ff, #f9eaff)",
        animation: "bgMove 12s ease infinite",
        "@keyframes bgMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* HEADER */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #4c6ef5, #6a82fb)",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1px",
              cursor: "pointer",
              fontFamily: "Georgia",
            }}
            onClick={() => navigate("/")}
          >
            CareerMind ✨
          </Typography>

          <Button
            sx={{
              background: "white",
              color: "#4c6ef5",
              textTransform: "none",
              fontWeight: "bold",
              padding: "6px 18px",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "#f1f4ff",
              },
            }}
            onClick={() => navigate("/about")}
          >
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* FEATURES SECTION */}
      <Box sx={{ padding: "30px", flex: 1 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: "bold" }}>
          Features & Feedback 💡
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => navigate(feature.path)}
                sx={{
                  backgroundColor: feature.color,
                  cursor: "pointer",
                  textAlign: "center",
                  borderRadius: "18px",
                  boxShadow: "0px 5px 12px rgba(0,0,0,0.15)",
                  transition: "0.4s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0px 8px 18px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={feature.image}
                  alt={feature.title}
                  sx={{ objectFit: "contain", padding: "10px" }}
                />
                <CardContent>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FOOTER */}
      <Divider />
      <Box
        sx={{
          background: "linear-gradient(90deg, #ffb6ff, #a38df5)",
          padding: "18px",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          boxShadow: "0 -4px 10px rgba(0,0,0,0.25)",
        }}
      >
        © {new Date().getFullYear()} CareerMind — Empowering Your Future 🚀
      </Box>
    </Box>
  );
}

export default Home;
