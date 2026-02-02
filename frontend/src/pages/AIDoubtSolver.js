import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Box,
  Fade,
  Divider,
  Chip,
  Tooltip,
  Zoom,
} from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Modern code highlight theme

const AIDoubtSolver = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return alert("Please type a question");
    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/doubt", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      alert("Failed to get answer from AI");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1a237e, #283593, #1565c0)",
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, sm: 4, md: 6 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            borderRadius: 5,
            p: { xs: 3, sm: 5 },
            background: "linear-gradient(145deg, #ffffff, #f3f6f9)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.25), inset 0 1px 4px rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            transition: "all 0.4s ease-in-out",
            "&:hover": { boxShadow: "0 10px 40px rgba(0,0,0,0.3)" },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Zoom in>
              <PsychologyAltIcon sx={{ fontSize: 60, color: "#3949ab", mb: 1 }} />
            </Zoom>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg, #1976d2, #42a5f5, #4fc3f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1,
              }}
            >
              AI Doubt Solver
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Get instant AI-powered answers to your technical or career questions.
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }}>
            <Chip
              label="Ask your question below"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Divider>

          {/* Input Section */}
          <Box>
            <TextField
              fullWidth
              label="Type your question here... * "
              multiline
              minRows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                },
              }}
            />

            <Tooltip title="Click to ask AI" arrow>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAsk}
                disabled={loading}
                endIcon={!loading && <SendIcon />}
                sx={{
                  py: 1.4,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "10px",
                  background: "linear-gradient(90deg, #00bcd4, #2196f3, #3f51b5)",
                  color: "#fff",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    background: "linear-gradient(90deg, #3f51b5, #2196f3)",
                    boxShadow: "0 6px 12px rgba(63,81,181,0.3)",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" /> Thinking...
                  </Box>
                ) : (
                  "Ask AI"
                )}
              </Button>
            </Tooltip>
          </Box>

          {/* Answer Section */}
          <Fade in={!!answer} timeout={800}>
            <Box
              sx={{
                mt: 5,
                backgroundColor: "#fdfdfd",
                borderRadius: 4,
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                p: { xs: 2.5, sm: 4 },
                transition: "all 0.4s ease-in-out",
                "&:hover": { boxShadow: "0 6px 25px rgba(0,0,0,0.12)" },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  color: "#283593",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AutoAwesomeIcon color="primary" /> AI Answer
              </Typography>

              <Box
                sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "#212121",
                  backgroundColor: "#fafafa",
                  borderRadius: "12px",
                  p: 3,
                  border: "1px solid #f0f0f0",
                  "& code": {
                    backgroundColor: "#e3f2fd",
                    padding: "3px 7px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                  },
                  "& pre": {
                    backgroundColor: "#263238",
                    color: "#fff",
                    padding: "15px",
                    borderRadius: "10px",
                    overflowX: "auto",
                  },
                  "& ul": { pl: 3, mb: 1 },
                  "& strong": { color: "#1a237e" },
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {answer}
                </ReactMarkdown>
              </Box>
            </Box>
          </Fade>
        </Paper>
      </Container>
    </Box>
  );
};

export default AIDoubtSolver;
