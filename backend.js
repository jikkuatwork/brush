import { serve } from "bun"
import { config } from "dotenv"

// Load environment variables
config()

const ALLOWED_ORIGINS = [
  "http://localhost:8000",
  "http://localhost:5173",
  "https://brush-api.toolbomber.com",
]

// Add timestamp to logs
const getTimestamp = () => new Date().toISOString()

// Logger function
const log = (type, message, data = null) => {
  const timestamp = getTimestamp()
  const logMessage = {
    timestamp,
    type,
    message,
    ...(data && { data }),
  }
  console.log(JSON.stringify(logMessage, null, 2))
}

// CORS headers function
const getCorsHeaders = origin => {
  // Check if the origin is allowed
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin)

  if (!isAllowedOrigin) {
    log("cors", `Origin rejected: ${origin}`)
    return {}
  }

  log("cors", `Origin allowed: ${origin || "no origin"}`)

  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  }
}

const server = serve({
  port: 8484,
  async fetch(req) {
    const requestId = crypto.randomUUID()
    const startTime = performance.now()

    log("request", "Incoming request", {
      id: requestId,
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    })

    const origin = req.headers.get("origin")
    const corsHeaders = getCorsHeaders(origin)

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      log("cors", "OPTIONS request handled", { id: requestId })
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    // Only allow POST requests to /api/generate
    if (req.method !== "POST" || !req.url.endsWith("/api/generate")) {
      log("error", "Invalid endpoint or method", {
        id: requestId,
        method: req.method,
        url: req.url,
      })
      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders,
      })
    }

    try {
      const body = await req.json()
      const { prompt, apiKey } = body

      log("request", "Request body received", {
        id: requestId,
        promptLength: prompt?.length,
        hasApiKey: !!apiKey,
      })

      if (!prompt || !apiKey) {
        log("error", "Missing required fields", {
          id: requestId,
          missingFields: {
            prompt: !prompt,
            apiKey: !apiKey,
          },
        })
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        )
      }

      // Call OpenAI API
      log("openai", "Calling OpenAI API", { id: requestId })
      const openaiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      )

      const data = await openaiResponse.json()

      const endTime = performance.now()
      log("response", "OpenAI API response received", {
        id: requestId,
        status: openaiResponse.status,
        processingTime: `${(endTime - startTime).toFixed(2)}ms`,
        responseSize: JSON.stringify(data).length,
      })

      // Return the OpenAI response
      return new Response(JSON.stringify(data), {
        status: openaiResponse.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      })
    } catch (error) {
      log("error", "Server Error", {
        id: requestId,
        error: error.message,
        stack: error.stack,
      })

      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      })
    }
  },
})

// Log server start
log("server", "Server started", {
  port: 8484,
  allowedOrigins: ALLOWED_ORIGINS,
  environment: process.env.NODE_ENV || "development",
})
