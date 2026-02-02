import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import aiRoutes from "./routes/aiRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

// ✅ Gemini AI
import { GoogleGenerativeAI } from "@google/generative-ai";
// ✅ DOCX generator
import { Document, Packer, Paragraph, TextRun } from "docx";

// Fix __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
// ================= RESUMES DIR =================
const resumesDir = path.join(__dirname, "resumes");
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir);
app.use("/resumes", express.static(resumesDir));


// ================= GEMINI INIT =================
function checkGeminiAPI() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY missing in .env");
    return null;
  }
  console.log("✅ GEMINI_API_KEY loaded");
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}
const genAI = checkGeminiAPI();

// ================= HELPER: Retry for AI =================
const MAX_RETRIES = 3;
async function generateWithRetry(model, prompt) {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (err.status === 503) {
        attempts++;
        console.log(`AI overloaded, retrying... (${attempts}/${MAX_RETRIES})`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        throw err;
      }
    }
  }
  throw new Error("AI service is busy. Please try again later.");
}

// ================= DOCX GENERATOR =================
async function createResumeDocx(data, aiText) {
  const sections = aiText.split("\n").filter((line) => line.trim() !== "");
  const children = [];

  // Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.name, bold: true, size: 28, font: "Calibri" }),
      ],
      alignment: "center",
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${data.email} | ${data.phone}`, size: 18, font: "Calibri" }),
      ],
      alignment: "center",
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${data.linkedin} | ${data.github}`, size: 18, font: "Calibri" }),
      ],
      alignment: "center",
      spacing: { after: 200 },
    })
  );

  const addLine = () => {
    children.push(
      new Paragraph({
        border: { bottom: { color: "AAAAAA", space: 1, value: "single", size: 6 } },
        spacing: { after: 150 },
      })
    );
  };

  addLine();

  sections.forEach((line) => {
    const cleanLine = line.trim().replace(/^(\*|\-)\s*/, "");
    if (cleanLine.match(/^(Summary|Education|Skills|Experience|Projects)/i)) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cleanLine, bold: true, size: 22, font: "Calibri" })],
          spacing: { before: 200, after: 100 },
        })
      );
      addLine();
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cleanLine, size: 20, font: "Times New Roman" })],
          spacing: { after: 100, line: 276 },
        })
      );
    }
  });

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const buffer = await Packer.toBuffer(doc);
  const filename = `${uuidv4()}.docx`;
  const filepath = path.join(resumesDir, filename);
  fs.writeFileSync(filepath, buffer);
  return `/resumes/${filename}`;
}

// ================= RESUME ROUTE =================
app.post("/api/generate-resume", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "Gemini not initialized" });

    const { name, email, phone, linkedin, github, education, skills, experience, projects } = req.body;

    const prompt = `
      You are an expert IT resume writer.
      Generate a full professional ATS-friendly resume in plain text format.
      Include sections: Summary, Education, Skills, Experience, Projects.
      Use strong action verbs and quantified achievements.

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      LinkedIn: ${linkedin}
      GitHub: ${github}
      Education: ${education}
      Skills: ${skills}
      Experience: ${experience}
      Projects: ${projects}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const aiResumeText = await generateWithRetry(model, prompt);
    const fileUrl = await createResumeDocx(req.body, aiResumeText);

    res.json({ file: fileUrl });
  } catch (err) {
    console.error("❌ Resume generation error:", err);
    res.status(503).json({ error: err.message || "Failed to generate resume" });
  }
});

// ================= CAREER ROADMAP ROUTE =================
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "Gemini not initialized" });

    const { currentRole, targetRole, skills, experience, interests } = req.body;
    const prompt = `
      You are an expert career coach.
      Generate a detailed career roadmap for a person.
      Include sections: Summary, Skills, Projects, Certifications, Timeline, Tips.
      Use clear, professional formatting suitable for display in a web page.

      Current Role / Education: ${currentRole}
      Target Role / Career Goal: ${targetRole}
      Skills: ${skills}
      Experience: ${experience}
      Interests: ${interests}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const roadmapText = await generateWithRetry(model, prompt);
    res.json({ roadmap: roadmapText });
  } catch (err) {
    console.error("❌ Roadmap generation error:", err);
    res.status(503).json({ error: err.message || "Failed to generate roadmap" });
  }
});

// ================= DOWNLOAD ROADMAP DOCX =================
app.post("/api/download-roadmap", async (req, res) => {
  try {
    const { roadmapText, name } = req.body;
    const children = [];

    // Header
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${name} - Career Roadmap`, bold: true, size: 28, font: "Calibri" })],
        alignment: "center",
        spacing: { after: 200 },
      })
    );

    roadmapText.split("\n").forEach((line) => {
      const cleanLine = line.trim().replace(/^(\*|\-)\s*/, "");
      if (!cleanLine) return;
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cleanLine, size: 20, font: "Times New Roman" })],
          spacing: { after: 100 },
        })
      );
    });

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const buffer = await Packer.toBuffer(doc);
    const filename = `${name || "Career_Roadmap"}.docx`;
    const filepath = path.join(resumesDir, filename);
    fs.writeFileSync(filepath, buffer);

    res.download(filepath);
  } catch (err) {
    console.error("❌ Download roadmap error:", err);
    res.status(500).json({ error: "Failed to download roadmap" });
  }
});

// Serve uploaded images
app.use("/uploads", express.static("uploads"));
// ================= ROUTES =================
app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
