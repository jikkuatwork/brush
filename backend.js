import { serve } from "bun";
import { config } from "dotenv";
import cors from "cors";

// Load environment variables
config();

const ALLOWED_ORIGINS = [
  'http://localhost:8000',
  'http://localhost:5173',
  'https://brush-api.toolbomber.com'
];

const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return origin;
    }
    return false;
  }
});

const server = serve({
  port: 8484,
  async fetch(req) {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsMiddleware.headers
      });
    }

    // Only allow POST requests to /api/generate
    if (req.method !== 'POST' || !req.url.endsWith('/api/generate')) {
      return new Response('Not Found', { status: 404 });
    }

    try {
      const body = await req.json();
      const { prompt, apiKey } = body;

      if (!prompt || !apiKey) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Call OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt
          }],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      const data = await openaiResponse.json();

      // Return the OpenAI response
      return new Response(
        JSON.stringify(data),
        { 
          status: openaiResponse.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsMiddleware.headers
          }
        }
      );

    } catch (error) {
      console.error('Server Error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsMiddleware.headers
          }
        }
      );
    }
  }
});