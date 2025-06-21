import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "ColorV Backend API is running!" });
});

// Colormind API proxy endpoint
app.post("/api/colormind", async (req, res) => {
  try {
    console.log("Proxying request to Colormind API:", req.body);

    const response = await fetch("http://colormind.io/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from Colormind:", data);

    res.json(data);
  } catch (error) {
    console.error("Error proxying to Colormind:", error);
    res.status(500).json({
      error: "Failed to fetch from Colormind API",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `📡 Colormind proxy available at http://localhost:${PORT}/api/colormind`
  );
});
