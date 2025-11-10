const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration
const allowedOrigins = [
  "https://v0-satyaimain1-aa.vercel.app",
  "https://v0-satyrnotesproject14112.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()) : []),
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Handle preflight requests
app.options("*", cors())

// Middleware
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// Config endpoint
app.get("/api/config", (req, res) => {
  try {
    const config = {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },
      personalAI: {
        apiKey: process.env.PERSONAL_AI_API_KEY,
        domain: process.env.PERSONAL_AI_DOMAIN,
        baseUrl: process.env.PERSONAL_AI_BASE_URL,
      },
    }

    // Validate that required config exists
    if (!config.firebase.apiKey || !config.personalAI.apiKey) {
      return res.status(500).json({
        error: "Missing required environment variables",
      })
    }

    res.json(config)
  } catch (error) {
    console.error("Error serving config:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({ error: err.message || "Internal server error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Config endpoint: http://localhost:${PORT}/api/config`)
})
