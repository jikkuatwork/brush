export async function loadPrompt(path, variables = {}) {
    try {
        const response = await fetch(`/prompts/${path}`);
        if (!response.ok) {
            throw new Error(`Failed to load prompt: ${response.statusText}`);
        }
        
        let content = await response.text();
        
        // Replace variables in the content
        Object.entries(variables).forEach(([key, value]) => {
            content = content.replace(`<${key}>`, value);
        });
        
        return content;
    } catch (error) {
        console.error('Error loading prompt:', error);
        throw error;
    }
}