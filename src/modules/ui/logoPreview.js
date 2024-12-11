import $ from 'jquery';
import { createLogo } from './logo';

function convertSvgToBase64(svgElement) {
    const svgContent = new XMLSerializer().serializeToString(svgElement);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
}

async function convertToPng(svgElement, width = 512, height = 512) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/png');
        };
        img.onerror = reject;
        img.src = convertSvgToBase64(svgElement);
    });
}

async function downloadLogo($logoElement, format = 'png') {
    const svgElement = $logoElement.find('svg')[0];
    let blob, filename;

    if (format === 'png') {
        blob = await convertToPng(svgElement);
        filename = 'logo.png';
    } else {
        const svgContent = new XMLSerializer().serializeToString(svgElement);
        blob = new Blob([svgContent], { type: 'image/svg+xml' });
        filename = 'logo.svg';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
            <button class="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow-lg opacity-40 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white download-btn" title="Download PNG">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
            </button>
        </div>
    `);

    const $logo = await createLogo(logoConfig || {
        iconId: getRandomIcon(),
        backgroundColor: getRandomColor(),
        iconColor: '#ffffff'
    });

    $container.find('.absolute.inset-0').append($logo);

    $container.find('.download-btn').on('click', () => {
        downloadLogo($logo, 'png');
    });

    return $container;
}

function getRandomIcon() {
    const icons = ['pets', 'favorite', 'star', 'local_cafe', 'eco', 'psychology', 'lightbulb', 'palette'];
    return icons[Math.floor(Math.random() * icons.length)];
}

function getRandomColor() {
    const colors = [
        '#4F46E5',
        '#2563EB',
        '#7C3AED',
        '#DB2777',
        '#DC2626',
        '#EA580C',
        '#16A34A',
        '#0D9488',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}