const fs = require('fs');
const path = require('path');

const svgContent = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f172a"/>
  <text x="256" y="330" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="#10b981" text-anchor="middle">$</text>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');

fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), svgContent.replace(/width="512" height="512"/, 'width="192" height="192"').replace(/font-size="280"/, 'font-size="100"').replace(/y="330"/, 'y="130"'));
fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), svgContent);

console.log('Icon files generated successfully!');
