import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
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
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ================= RESUMES DIR =================
const resumesDir = path.join(__dirname, "resumes");
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir);
app.use("/resumes", express.static(resumesDir));

// ================= MYSQL CONNECTION =================
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");

  // Create tables if not exists
  db.query(
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error("❌ Failed to create users table:", err);
      else console.log("✅ Users table ready");
    }
  );

  db.query(
    `CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      rating INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error("❌ Failed to create feedback table:", err);
      else console.log("✅ Feedback table ready");
    }
  );
});

// ================= REGISTER =================
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0)
      return res.status(400).json({ error: "User already exists" });

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password],
      (err) => {
        if (err)
          return res.status(500).json({ error: "Failed to register user" });
        res.json({ message: "User registered successfully!" });
      }
    );
  });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Email and password are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = results[0];
    if (user.password !== password)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

// ================= GOOGLE OAUTH =================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const username = profile.displayName;

      db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return done(err);

        if (results.length === 0) {
          db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, ""],
            (err, result) => {
              if (err) return done(err);
              return done(null, { id: result.insertId, username, email });
            }
          );
        } else {
          return done(null, results[0]);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("http://localhost:3000/home")
);

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
