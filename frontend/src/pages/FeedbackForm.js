import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Stack,
  Rating,
  Alert,
  Divider,
  Fade,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback/all");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
      setError("Failed to load feedbacks. Please try again later.");
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!name || !email || !message) {
      setError("Name, Email, and Message are required.");
      return;
    }

    if (rating && (rating < 1 || rating > 5)) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/feedback/submit", {
        name,
        email,
        message,
        rating,
      });

      await fetchFeedbacks();

      setName("");
      setEmail("");
      setMessage("");
      setRating("");

      alert(res.data.message);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: 3,
        background:
          "linear-gradient(135deg, #cfd9ff 0%, #fdfbfb 50%, #e6f2ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={12}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 6,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.95))",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-3px)" },
          }}
        >
          {/* Header */}
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            sx={{
              mb: 2,
              background:
                "linear-gradient(90deg, #1976d2, #42a5f5, #90caf9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 12px rgba(66,165,245,0.3)",
            }}
          >
            💬 Share Your Feedback
          </Typography>

          <Typography
            align="center"
            sx={{
              mb: 5,
              color: "rgba(0,0,0,0.7)",
              fontSize: "1.1rem",
            }}
          >
            Help us improve CareerMind by sharing your thoughts and experience 💡
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, width: "100%", maxWidth: 800 }}>
              {error}
            </Alert>
          )}

          {/* Input Fields */}
          <Stack spacing={3} sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                },
              }}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                },
              }}
            />
            <TextField
              label="Your Feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                },
              }}
            />

            <Box textAlign="center">
              <Typography variant="body1" sx={{ mb: 1, color: "#444" }}>
                How would you rate your experience?
              </Typography>
              <Rating
                name="rating"
                value={Number(rating) || 0}
                onChange={(e, newValue) => setRating(newValue)}
                precision={1}
                size="large"
              />
            </Box>

            {/* Submit Button */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                py: 1.4,
                fontWeight: "bold",
                borderRadius: 4,
                fontSize: "1.1rem",
                background: "linear-gradient(90deg, #2196f3, #21cbf3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #21cbf3, #2196f3)",
                  boxShadow: "0 8px 18px rgba(33,203,243,0.4)",
                },
                transition: "all 0.4s ease",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={22} color="inherit" /> Submitting...
                </Box>
              ) : (
                "🚀 Submit Feedback"
              )}
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 6, width: "80%", mx: "auto" }} />

          {/* Feedback Display */}
          {feedbacks.length > 0 && (
            <Fade in={true} timeout={800}>
              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  maxWidth: 900,
                  mx: "auto",
                  p: 3,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    mb: 4,
                    color: "#1565c0",
                    textAlign: "center",
                    textShadow: "0 0 10px rgba(33,150,243,0.15)",
                  }}
                >
                  🗣️ Community Feedback
                </Typography>

                <Stack spacing={3}>
                  {feedbacks.map((fb) => (
                    <Paper
                      key={fb.id}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background:
                          "linear-gradient(135deg, #e3f2fd, #ffffff, #f1f8ff)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 6px 24px rgba(33,150,243,0.25)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#0d47a1" }}
                      >
                        {fb.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {fb.email} •{" "}
                        {new Date(fb.created_at).toLocaleString()}
                      </Typography>
                      <Box
                        sx={{
                          mt: 1.5,
                          fontSize: "1rem",
                          lineHeight: 1.7,
                          color: "#333",
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {fb.message}
                        </ReactMarkdown>
                      </Box>
                      {fb.rating && (
                        <Rating
                          value={Number(fb.rating)}
                          readOnly
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Fade>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default FeedbackForm;
