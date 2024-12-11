import { loadPrompt } from '../utils/prompts.js';
import { transformLogoConfig } from '../utils/logoTransformer.js';

const API_URL = window.location.search.includes('env=dev') 
  ? 'http://localhost:8484/api/generate'
  : 'https://brush-api.toolbomber.com/api/generate';

export async function generateLogoConfig(description) {
    const apiKey = window.app.config.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OpenAI API key not found. Please add it in settings.');
    }

    try {
        const prompt = await loadPrompt('icon-search.md', { TEXT_INPUT_CONTENT: description });
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                apiKey: apiKey.trim()
            })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
            const errorMessage = data.error?.message || `API Error: ${response.status}`;
            console.error('API Error Details:', data.error);
            throw new Error(errorMessage);
        }

        if (!data.choices?.[0]?.message?.content) {
            console.error('Invalid Response:', data);
            throw new Error('Invalid response format from API');
        }

        let config;
        try {
            config = JSON.parse(data.choices[0].message.content);
            console.log('Parsed Logo Config:', config);
        } catch (e) {
            console.error('JSON Parse Error:', e, 'Content:', data.choices[0].message.content);
            throw new Error('Failed to parse API response');
        }

        const transformedConfig = transformLogoConfig(config);
        console.log('Transformed Logo Config:', transformedConfig);
        return transformedConfig;
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Failed to connect to API. Please check your internet connection.');
        }
        throw error;
    }
}