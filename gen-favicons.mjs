import sharp from 'sharp';

const src = 'source/favicon.png';
const targets = [
  { out: 'source/favicon-16x16.png', size: 16 },
  { out: 'source/favicon-32x32.png', size: 32 },
  { out: 'source/apple-touch-icon.png', size: 180 },
  { out: 'source/favicon.png', size: 512 },
];

for (const { out, size } of targets) {
  await sharp(src).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out);
  console.log('wrote', out, size);
}
