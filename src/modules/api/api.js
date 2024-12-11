import { transformLogoConfig } from '../utils/logoTransformer.js';

const API_URL = window.location.search.includes('env=dev') 
  ? 'http://localhost:8484/api/generate'
  : 'https://brush-api.toolbomber.com/api/generate';

export async function generateLogoConfig(description) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
            const errorMessage = data.error?.message || `API Error: ${response.status}`;
            console.error('API Error Details:', data.error);
            throw new Error(errorMessage);
        }

        console.log('Parsed Logo Config:', data);
        const transformedConfig = transformLogoConfig(data);
        console.log('Transformed Logo Config:', transformedConfig);
        return transformedConfig;
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Failed to connect to API. Please check your internet connection.');
        }
        throw error;
    }
}