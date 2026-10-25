/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const svgPath = path.join(__dirname, 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable-192.png', size: 192 },
    { name: 'icon-maskable-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-32.png', size: 32 },
  ];

  for (const target of targets) {
    const dest = path.join(__dirname, target.name);
    await sharp(svgBuffer)
      .resize(target.size, target.size)
      .png()
      .toFile(dest);
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);
  }

  // Also copy apple-touch-icon to public root for maximum device compatibility
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'apple-touch-icon.png'));

  console.log('All icons generated successfully!');
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
