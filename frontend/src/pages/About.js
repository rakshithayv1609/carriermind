import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  // Full-length descriptions
  const features = [
    {
      title: "1. Resume Generator",
      text: `Resume Generator is one of the key features of CareerMind. In this feature, users can enter details such as their full name, email, phone number, LinkedIn profile, GitHub profile, education background, multiple skills (separated by commas), experience details, and projects. Once all information is entered, the user can press the “Generate Resume with AI” button. The AI analyzes all the details provided and generates a perfectly aligned, professional-looking resume format. It also offers a “Download Resume” button, allowing users to easily download the generated document.`,
    },
    {
      title: "2. Career Roadmap Generator",
      text: `Career Roadmap Generator is another standout feature of CareerMind. Here, users input their current role or education level, target role or career goal, list of skills (separated by commas), experience details, and optional interests. Once submitted, AI processes the input and provides a comprehensive, personalized career roadmap. The roadmap includes details like required skills, recommended types of projects, certifications, practical tips for success, and a suggested timeline for achieving the desired job. Additionally, the user can download the roadmap content as a document for future use.`,
    },
    {
      title: "3. Interview Preparation QnA",
      text: `Interview Preparation QnA helps users prepare effectively for interviews. Users can enter any specific interview topic, such as Web Development, Core Programming, or Computer Science Fundamentals. AI analyzes the given topic and generates a well-structured list of questions and answers relevant to that subject. This allows users to prepare confidently for technical and non-technical interviews with curated Q&A content designed to strengthen understanding and recall.`,
    },
    {
      title: "4. Doubt Solver",
      text: `Doubt Solver is an AI-powered feature that helps users get instant answers to any technical question. For example, users can type questions like “What is int?” or “How does recursion work?” The AI then analyzes the question, identifies the concept, and returns a neatly formatted, clear, and accurate explanation. This feature is designed to help learners clarify doubts in real-time without needing to browse multiple resources.`,
    },
    {
      title: "5. AI Code Reviewer",
      text: `AI Code Reviewer allows users to paste their code and select a programming language. Once the input is submitted, AI scans the code for potential bugs, errors, inefficiencies, and logical issues. It provides suggestions for improvements, best practices, and optimization tips. In addition, it also generates an improved version of the given code with cleaner formatting, better structure, and enhanced readability. This feature is perfect for developers who want AI-assisted guidance to write optimized and professional-grade code.`,
    },
    {
      title: "6. Feedback",
      text: `Feedback is an important feature where users can share their opinions and experiences about the CareerMind platform. They can enter their name, email, overall experience, and rating (from 1 to 5). Upon submission, AI displays all user feedbacks and stores them permanently in the database. This ensures transparency, continuous improvement, and better user satisfaction as developers can analyze and enhance the platform based on real feedback.`,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #f9f9ff, #fcecff)",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#3654d9ff",
          minHeight: "80px",
          display: "flex",
          justifyContent: "center",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              letterSpacing: "1px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            CareerMind 🚀
          </Typography>

          <Button
            color="inherit"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              color: "white",
              textTransform: "none",
              border: "1px solid white",
              borderRadius: "20px",
              padding: "5px 15px",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate("/home")}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* About Section */}
      <Box
        sx={{
          flex: 1,
          padding: { xs: "40px 20px", md: "60px 100px" },
          color: "#333",
          fontFamily: "Georgia, serif",
          lineHeight: 1.8,
          overflowX: "hidden",
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#3654d9ff",
            marginBottom: "15px",
            textShadow: "2px 2px 3px rgba(0,0,0,0.15)",
          }}
        >
          About CareerMind
        </Typography>

        {/* Centered Highlight Quote */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "50px",
            animation: "fadeInZoom 1s ease-in-out",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#7b1fa2",
              fontStyle: "italic",
              background:
                "linear-gradient(90deg, rgba(54,84,217,0.1), rgba(234,138,255,0.15))",
              borderRadius: "10px",
              padding: "15px 25px",
              maxWidth: "700px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            “Empowering your journey from learning to earning with the power of
            AI.”
          </Typography>
        </Box>

        {/* Overview */}
        <Typography
          variant="body1"
          sx={{
            marginBottom: "40px",
            textAlign: "justify",
            animation: "fadeIn 1s ease-in",
          }}
        >
          <strong>CareerMind</strong> is an AI-powered platform that empowers
          learners and professionals to grow their skills, prepare for
          interviews, and accelerate their career growth. It offers intelligent
          tools that guide users from building resumes and generating career
          roadmaps to solving doubts, preparing for interviews, and improving
          code quality — all in one seamless experience.
        </Typography>

        {/* Features Section */}
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              marginBottom: "35px",
              animation: `fadeInUp 0.8s ease forwards`,
              animationDelay: `${index * 0.2}s`,
              opacity: 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#3654d9ff",
                fontWeight: "bold",
                borderLeft: "5px solid #ea8affff",
                paddingLeft: "15px",
                marginBottom: "10px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#444",
                textAlign: "justify",
              }}
            >
              {feature.text}
            </Typography>
          </Box>
        ))}

        {/* Closing Message */}
        <Typography
          variant="body1"
          sx={{
            marginTop: "40px",
            textAlign: "center",
            fontStyle: "italic",
            color: "#555",
            background:
              "linear-gradient(90deg, rgba(234,138,255,0.15), rgba(54,84,217,0.1))",
            borderRadius: "10px",
            padding: "15px 25px",
            display: "inline-block",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          CareerMind is not just a platform — it’s your AI-powered career
          companion for lifelong learning, innovation, and professional success.
        </Typography>
      </Box>

      {/* Footer */}
      <Divider />
      <Box
        component="footer"
        sx={{
          backgroundColor: "#ea8affff",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="body2" color="black">
          © {new Date().getFullYear()} CareerMind. All rights reserved.
        </Typography>
      </Box>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInZoom {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
}

export default About;
