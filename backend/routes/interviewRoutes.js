import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // Improved prompt to ensure valid JSON output
    const prompt = `
You are an AI assistant that generates interview questions and answers.
Please generate exactly 10 questions and answers for the topic: "${topic}".
Return the result as valid JSON ONLY, in this exact format:

[
  {
    "question": "First question text here",
    "answer": "Answer text here"
  },
  {
    "question": "Second question text here",
    "answer": "Answer text here"
  },
  ...
]

Do NOT include any explanation, markdown, backticks, or extra text. Only return the JSON array.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    // Parse the JSON
    let qna;
    try {
      qna = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON from Gemini AI output:", text);
      return res.status(500).json({
        error: "AI output could not be parsed as JSON. Check backend logs.",
      });
    }

    // Respond with clean Q&A array
    res.json({ qna });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate interview Q&A" });
  }
});

export default router;
