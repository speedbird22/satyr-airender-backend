require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 8080

// 🔓 Allow all origins temporarily for debugging
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// 🩺 Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// ⚙️ Config endpoint
app.get("/api/config", (req, res) => {
  const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
    PERSONAL_AI_API_KEY,
    PERSONAL_AI_DOMAIN,
    PERSONAL_AI_BASE_URL,
  } = process.env

  if (
    !FIREBASE_API_KEY ||
    !FIREBASE_AUTH_DOMAIN ||
    !FIREBASE_PROJECT_ID ||
    !FIREBASE_STORAGE_BUCKET ||
    !FIREBASE_MESSAGING_SENDER_ID ||
    !FIREBASE_APP_ID ||
    !FIREBASE_MEASUREMENT_ID ||
    !PERSONAL_AI_API_KEY ||
    !PERSONAL_AI_DOMAIN ||
    !PERSONAL_AI_BASE_URL
  ) {
    return res.status(500).json({ error: "Missing config values" })
  }

  res.json({
    firebaseConfig: {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID,
      measurementId: FIREBASE_MEASUREMENT_ID,
    },
    personalAIConfig: {
      apiKey: PERSONAL_AI_API_KEY,
      domain: PERSONAL_AI_DOMAIN,
      baseUrl: PERSONAL_AI_BASE_URL,
    },
  })
})

// 🛠 Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Config endpoint: http://localhost:${PORT}/api/config`)
})
