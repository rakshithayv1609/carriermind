
import dotenv from "dotenv";
dotenv.config();// backend/routes/aiRoutes.js
import express from "express";
// ✅ Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();


router.post("/doubt", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const prompt = `You are an expert assistant. Answer the following question clearly and concisely:\n${question}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer });
  } catch (err) {
    console.error("❌ AI Doubt Solver error:", err);
    res.status(500).json({ error: "Failed to solve doubt" });
  }
});

// ✅ AI Code Review
router.post("/code-review", async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const prompt = `
      You are an expert ${language || "programming"} code reviewer.
      Review the following code snippet:
      ${code}

      Give:
      1. Bugs or errors (if any)
      2. Suggestions to improve code
      3. Best practices and optimization tips
      Respond in clear bullet points.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const review = result.response.text();

    res.json({ review });
  } catch (err) {
    console.error("❌ AI Code Review error:", err);
    res.status(500).json({ error: err.message || "Failed to review code" });
  }
});

export default router;
