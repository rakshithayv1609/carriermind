import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Fade,
  Stack,
  Box,
} from "@mui/material";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DownloadIcon from "@mui/icons-material/Download";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function InterviewQnA() {
  const [topic, setTopic] = useState("");
  const [qna, setQna] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate interview questions
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/interview/generate", { topic });
      setQna(res.data.qna);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Download as Word Doc with professional formatting
  const handleDownload = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `Interview Q&A for "${topic}"`,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            ...qna.map((item, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${item.question}`,
                    bold: true,
                    size: 26,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Answer: ${item.answer}`,
                    size: 24,
                  }),
                ],
                indent: { left: 300 },
                spacing: { after: 200 },
              }),
            ]).flat(),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Interview_QnA_${topic.replace(/\s+/g, "_")}.docx`);
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E1F5FE 100%)",
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      <Container maxWidth="md">
        {/* ===== Header ===== */}
        <Fade in timeout={800}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            mb={5}
          >
            <QuestionAnswerIcon
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
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              Interview Q&A Generator
            </Typography>
          </Stack>
        </Fade>

        {/* ===== Input Section ===== */}
        <Fade in timeout={1000}>
          <Card
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 5,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease-in-out",
              mb: 5,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#0288d1"
              gutterBottom
              sx={{
                borderBottom: "2px solid #03a9f4",
                display: "inline-block",
                pb: 1,
              }}
            >
              Enter a Topic to Generate Q&A
            </Typography>

            <Stack spacing={3} mt={2}>
              <TextField
                label="Interview Topic"
                variant="outlined"
                fullWidth
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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

              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
                sx={{
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
                {loading ? "Generating..." : "Generate Questions"}
              </Button>
            </Stack>
          </Card>
        </Fade>

        {/* ===== Display Section ===== */}
        {qna.length > 0 && (
          <Fade in timeout={1200}>
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="#0288d1"
                mb={3}
                textAlign="center"
              >
                Generated Q&A for "{topic}"
              </Typography>

              <Grid container spacing={3}>
                {qna.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card
                      sx={{
                        borderRadius: "16px",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.9) 100%)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{
                            color: "#01579b",
                            mb: 1,
                          }}
                        >
                          {index + 1}. {item.question}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            ml: 1,
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                          }}
                        >
                          <strong>Answer:</strong> {item.answer}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Stack alignItems="center" mt={5}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownload}
                  startIcon={<DownloadIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(90deg, #43a047 0%, #66bb6a 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #2e7d32 0%, #43a047 100%)",
                      transform: "scale(1.05)",
                    },
                    transition: "0.3s",
                  }}
                >
                  Download Q&A (Word Doc)
                </Button>
              </Stack>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
