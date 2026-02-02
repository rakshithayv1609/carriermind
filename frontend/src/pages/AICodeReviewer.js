import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const AICodeReviewer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) {
      alert("⚠️ Please paste your code snippet before reviewing!");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/code-review", {
        code,
        language,
      });
      setReview(res.data.review);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to get AI review. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb, #e3f2fd)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          {/* HEADER */}
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            sx={{
              mb: 2,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🤖 AI Code Reviewer
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "#555",
              mb: 5,
              fontSize: "1.1rem",
            }}
          >
            Get quick, AI-driven feedback and suggestions to improve your code.
          </Typography>

          {/* INPUT AREA */}
          <TextField
            fullWidth
            multiline
            minRows={8}
            label="Paste your code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                fontFamily: "monospace",
                color: "#000",
              },
            }}
          />

          {/* LANGUAGE */}
          <TextField
            fullWidth
            label="Programming Language * "
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            variant="outlined"
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
              },
            }}
          />

          {/* BUTTON */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleReview}
            disabled={loading}
            sx={{
              py: 1.4,
              fontSize: "1.1rem",
              fontWeight: "700",
              borderRadius: "12px",
              textTransform: "none",
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0, #2196f3)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(33,150,243,0.3)",
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={22} color="inherit" />
                Analyzing your code...
              </Box>
            ) : (
              "🚀 Review My Code"
            )}
          </Button>

          {/* REVIEW OUTPUT */}
          <Fade in={!!review} timeout={800}>
            <Box
              sx={{
                width: "100%",
                mt: 6,
                backgroundColor: "#f7f9fc",
                borderRadius: 3,
                p: { xs: 3, sm: 4 },
                color: "#212121",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  color: "#1976d2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                💡 AI Feedback
              </Typography>

              <Box
                sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  textAlign: "justify",
                  "& code": {
                    backgroundColor: "#eeeeee",
                    padding: "3px 7px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                  },
                  "& pre": {
                    backgroundColor: "#1e1e1e",
                    color: "#f8f8f2",
                    padding: "15px",
                    borderRadius: "12px",
                    overflowX: "auto",
                  },
                  "& ul": { pl: 3 },
                  "& strong": { color: "#000" },
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {review}
                </ReactMarkdown>
              </Box>
            </Box>
          </Fade>
        </Paper>
      </Container>
    </Box>
  );
};

export default AICodeReviewer;
