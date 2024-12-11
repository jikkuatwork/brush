import $ from 'jquery';

let gradientCounter = 0;

function createGradientDef(background) {
    if (!background || typeof background !== 'object') return '';
    
    if (background.type === 'linear-gradient') {
        const gradientId = `gradient-${Date.now()}-${gradientCounter++}`;
        const angle = background.angle || 45;
        const x2 = 50 + Math.cos((angle - 90) * Math.PI / 180) * 70.71;
        const y2 = 50 + Math.sin((angle - 90) * Math.PI / 180) * 70.71;
        
        const stops = background.stops.map(stop => 
            `<stop offset="${stop.position}%" stop-color="${stop.color}"/>`
        ).join('\n');

        return {
            def: `
                <defs>
                    <linearGradient id="${gradientId}" 
                                   x1="0%" y1="0%" 
                                   x2="${x2}%" y2="${y2}%">
                        ${stops}
                    </linearGradient>
                </defs>
            `,
            id: gradientId
        };
    }
    return { def: '', id: null };
}

function getBackgroundFill(background, gradientId) {
    console.log('Background Config:', background);
    
    if (typeof background === 'string') {
        return background;
    }
    
    if (background?.type === 'linear-gradient' && gradientId) {
        return `url(#${gradientId})`;
    }
    
    // Fallback
    console.warn('Invalid background config, using fallback:', background);
    return '#000000';
}

export async function createLogo({ iconId, backgroundColor, iconColor }) {
    console.log('Creating logo with:', { iconId, backgroundColor, iconColor });
    
    const gradient = createGradientDef(backgroundColor);
    
    const $logo = $(`
        <div class="relative w-full h-full rounded-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <metadata>
                    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                            xmlns:dc="http://purl.org/dc/elements/1.1/">
                        <rdf:Description>
                            <dc:title>LogoMaker v1</dc:title>
                            <dc:creator>LogoMaker AI</dc:creator>
                        </rdf:Description>
                    </rdf:RDF>
                </metadata>
                ${gradient.def}
                <rect width="512" height="512" fill="${getBackgroundFill(backgroundColor, gradient.id)}"/>
                <g transform="translate(128, 128) scale(0.5, 0.5)">
                    <!-- Icon SVG will be inserted here -->
                </g>
            </svg>
        </div>
    `);

    try {
        const iconUrl = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${iconId || 'error'}/default/24px.svg`;
        const response = await fetch(iconUrl);
        if (!response.ok) {
            throw new Error(`Failed to load icon: ${response.statusText}`);
        }

        const svgText = await response.text();
        const pathMatch = svgText.match(/<path[^>]*>|<polygon[^>]*>/);
        
        if (pathMatch) {
            const iconSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 -960 960 960" 
                     width="512" 
                     height="512" 
                     fill="${iconColor}">
                    ${pathMatch[0]}
                </svg>
            `;
            $logo.find('g').html(iconSvg);
        } else {
            throw new Error('No path found in SVG');
        }
    } catch (error) {
        console.error('Error loading icon:', error);
        // Add a fallback icon
        $logo.find('g').html(`
            <svg viewBox="0 -960 960 960" width="512" height="512" fill="${iconColor}">
                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z"/>
            </svg>
        `);
    }

    return $logo;
}

// Helper functions for fallback/random values
function getRandomIcon() {
    const icons = ['pets', 'favorite', 'star', 'local_cafe', 'eco', 'psychology', 'lightbulb', 'palette'];
    return icons[Math.floor(Math.random() * icons.length)];
}

function getRandomColor() {
    const colors = [
        '#4F46E5', // Indigo
        '#2563EB', // Blue
        '#7C3AED', // Purple
        '#DB2777', // Pink
        '#DC2626', // Red
        '#EA580C', // Orange
        '#16A34A', // Green
        '#0D9488', // Teal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}