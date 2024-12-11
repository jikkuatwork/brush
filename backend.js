/**
 * Icon Generation API
 *
 * Endpoint: POST /api/generate
 *
 * Request:
 * {
 *   "description": string    // Description of the icon you want to generate
 * }
 *
 * Response:
 * {
 *   "foreground": string,     // RGBA color for the icon
 *   "background": {
 *     "type": string,        // gradient type
 *     "angle": number,       // gradient angle
 *     "stops": [{
 *       "color": string,     // RGBA color
 *       "position": number   // 0-100
 *     }]
 *   },
 *   "shape": {
 *     "family": string,      // icon family
 *     "id": string          // icon identifier
 *   },
 *   "shortName": string,     // short display name
 *   "description": string    // full description
 * }
 */

import { serve } from "bun"
import { config } from "dotenv"
import fs from "fs"

// Load environment variables
config()

const ALLOWED_ORIGINS = [
  "http://localhost:8000",
  "http://localhost:5173",
  "https://brush-api.toolbomber.com",
];

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Read the prompt template with error handling
let promptTemplate = '';
try {
  promptTemplate = fs.readFileSync("./prompts/icon-search.md", "utf-8");
} catch (error) {
  console.error("Warning: Could not read prompt template:", error.message);
  promptTemplate = `
    I want you to generate an icon design based on the following description. Return a JSON object that follows this structure:
    {
      "foreground": "rgba color string", 
      "background": {
        "type": "gradient type (linear/radial)",
        "angle": number (0-360),
        "stops": [
          {
            "color": "rgba color string",
            "position": number (0-100)
          }
        ]
      },
      "shape": {
        "family": "icon family name",
        "id": "icon identifier"
      },
      "shortName": "short display name",
      "description": "full description"
    }

    Description: 
  `;
}

// Logging setup
const padDate = () => {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = String(d.getFullYear()).slice(2)
  return `${day}-${month}-${year}`
}

const log = {
  request: msg => console.log(`${padDate()} | Request  | ${msg}`),
  response: msg => console.log(`${padDate()} | Response | ${msg}`),
  error: msg => console.error(`${padDate()} | Error    | ${msg}`)
}

const PORT = process.env.PORT || 9696

console.log(`Listening at: :${PORT}\n`)

const server = serve({
  port: PORT,
  async fetch(req) {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Only allow POST requests to /api/generate
    if (req.method !== "POST" || !req.url.endsWith("/api/generate")) {
      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders
      });
    }

    try {
      const body = await req.json()
      const { description } = body
      log.request(
        description.length > 30 ? description.slice(0, 27) + "..." : description
      )

      if (!description) {
        log.request("Error: Missing description")
        return new Response(JSON.stringify({ error: "Missing description" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          },
        })
      }

      // Check OpenAI API key
      if (!process.env.OPENAI_API_KEY) {
        log.error("Missing OpenAI API key");
        return new Response(JSON.stringify({ error: "API key configuration error" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          },
        });
      }

      // Combine template with description
      const prompt = promptTemplate + description

      // Call OpenAI API
      const openaiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        log.error("Invalid OpenAI response:", JSON.stringify(data));
        return new Response(JSON.stringify({ error: "Invalid API response" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          },
        });
      }

      // Parse and return the OpenAI response
      const iconConfig = JSON.parse(data.choices[0].message.content)
      log.response(`shape_id: ${iconConfig.shape.id}`)
      return new Response(JSON.stringify(iconConfig), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
      })
    } catch (error) {
      console.error("Server Error:", error)
      log.error(error.stack || error.message)
      return new Response(JSON.stringify({ 
        error: "Internal Server Error",
        details: error.message 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
      })
    }
  },
})