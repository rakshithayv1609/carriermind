// src/services/aiService.js
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "http://localhost:5000";

// Fetch job matches from backend AI service
export const fetchJobMatches = async (profile, skills) => {
  try {
    const response = await axios.post(`${API_BASE}/api/jobs/match`, {
      profile,
      skills,
    });

    // Backend should return { matches: [...] }
    return response.data.matches || [];
  } catch (error) {
    console.error(
      "❌ Job matching API error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
