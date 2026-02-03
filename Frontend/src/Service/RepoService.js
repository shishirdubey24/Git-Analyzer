import axios from "axios";

// Change this if your backend uses a different port.
const API_BASE_URL = "https://git-analyzer-u3b8.onrender.com";

export const analyzeRepository = async (repoUrl) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/git`, {
      repoUrl: repoUrl,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
