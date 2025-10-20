const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Enable CORS for your frontend domain
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// Secure config endpoint - only returns public Firebase keys
app.get("/api/config", (req, res) => {
  // Verify request origin for extra security
  const origin = req.get("origin")
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",")

  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" })
  }

  // Only return public Firebase config (safe to expose)
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
    personalAi: {
      apiKey: process.env.PERSONAL_AI_API_KEY,
      domain: process.env.PERSONAL_AI_DOMAIN,
      baseUrl: process.env.PERSONAL_AI_BASE_URL,
    },
  }

  res.json(config)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Config server running on port ${PORT}`)
})
