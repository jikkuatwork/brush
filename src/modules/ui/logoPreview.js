import $ from 'jquery';
import { createLogo } from './logo';

function downloadSVG($logoElement) {
    const svgElement = $logoElement.find('svg')[0];
    const svgContent = new XMLSerializer().serializeToString(svgElement);
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function createLogoPreview(logoConfig = null) {
    const $container = $(`
        <div class="relative bg-gray-100 w-32 h-32 mt-2 rounded-lg flex items-center justify-center group overflow-hidden">
            <div class="w-24 h-24 relative">
                <div style="padding-bottom: 100%" class="w-full"></div>
                <div class="absolute inset-0">
                    <!-- Logo will be inserted here -->
                </div>
            </div>
            <button class="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow-lg opacity-40 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white download-svg-btn" title="Download SVG">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
            </button>
        </div>
    `);

    // Create logo with either provided config or random values
    const $logo = await createLogo(logoConfig || {
        iconId: getRandomIcon(),
        backgroundColor: getRandomColor(),
        iconColor: '#ffffff'
    });

    // Insert the logo
    $container.find('.absolute.inset-0').append($logo);

    // Setup download handler
    $container.find('.download-svg-btn').on('click', () => {
        downloadSVG($logo);
    });

    return $container;
}

// Helper functions for random values
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