import express from "express";

const router = express.Router();

// Temporary in-memory feedback (no DB)
router.post("/", (req, res) => {
  const { name, email, message, rating } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  // Just log it (since no DB)
  console.log("📩 Feedback received:", {
    name,
    email,
    message,
    rating,
  });

  res.json({ message: "Feedback submitted successfully ✅" });
});

export default router;

