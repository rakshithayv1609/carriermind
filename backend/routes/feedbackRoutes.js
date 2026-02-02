import express from "express";
import { db } from "../server.js";

const router = express.Router();

// ================= Submit feedback =================
router.post("/submit", (req, res) => {
  const { name, email, message, rating } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const query = `
    INSERT INTO feedback (name, email, message, rating)
    VALUES (?, ?, ?, ?)
  `;
  const values = [name, email, message, rating || null];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ DB insert error:", err);
      return res.status(500).json({ error: "Failed to save feedback" });
    }
    res.status(201).json({ message: "Feedback submitted successfully!", id: result.insertId });
  });
});

// ================= Get all feedbacks =================
router.get("/all", (req, res) => {
  const query = "SELECT * FROM feedback ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ DB fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
    res.json(results);
  });
});

export default router;
