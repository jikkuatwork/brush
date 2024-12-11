export function transformLogoConfig(config) {
    if (!config) {
        throw new Error('No configuration received from OpenAI');
    }

    if (!config.shape?.id) {
        throw new Error('Invalid shape configuration received');
    }

    if (!config.background) {
        throw new Error('Invalid background configuration received');
    }

    if (!config.foreground) {
        throw new Error('Invalid foreground configuration received');
    }

    // Ensure all required properties exist and have correct types
    const transformed = {
        iconId: config.shape.id,
        backgroundColor: config.background,
        iconColor: config.foreground,
        metadata: {
            shortName: config.shortName || 'Logo',
            description: config.description || 'Generated Logo'
        }
    };

    // Validate background configuration
    if (typeof transformed.backgroundColor === 'object') {
        if (!transformed.backgroundColor.type || !transformed.backgroundColor.stops) {
            throw new Error('Invalid gradient configuration');
        }
        
        if (!Array.isArray(transformed.backgroundColor.stops) || 
            transformed.backgroundColor.stops.length === 0) {
            throw new Error('Invalid gradient stops configuration');
        }
    }

    return transformed;
}