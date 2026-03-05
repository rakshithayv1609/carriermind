// src/services/aiService.js
import axios from "axios";

// Fetch job matches from backend AI service
export const fetchJobMatches = async (profile, skills) => {
  try {
    const response = await axios.post("http://https://carriermind.onrender.com/api/jobs/match", {
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
