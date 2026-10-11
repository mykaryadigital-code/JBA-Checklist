import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 at start of each scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const lineStart = y * scanlineLength;
    rawData[lineStart] = 0; // Filter type 0: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = lineStart + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = data.length;
  const buf = Buffer.alloc(12 + length);
  buf.writeUInt32BE(length, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + length));
  buf.writeUInt32BE(crc, 8 + length);
  return buf;
}

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Draw Brand Icon (Pink Panda gradient + Clipboard + Heart + Checkmark)
function renderIcon(isMaskable) {
  return function(x, y, width, height) {
    const nx = x / width;
    const ny = y / height;

    // Pink Panda background: #ff2b85 to #d70f64
    const r1 = 255, g1 = 43, b1 = 133;
    const r2 = 215, g2 = 15, b2 = 100;
    const t = (nx + ny) / 2;
    let bgR = Math.round(r1 + (r2 - r1) * t);
    let bgG = Math.round(g1 + (g2 - g1) * t);
    let bgB = Math.round(b1 + (b2 - b1) * t);

    // If not maskable, round corners
    if (!isMaskable) {
      const radius = 0.22;
      const dx = Math.min(nx, 1 - nx);
      const dy = Math.min(ny, 1 - ny);
      if (dx < radius && dy < radius) {
        const cornerDist = Math.sqrt((radius - dx) ** 2 + (radius - dy) ** 2);
        if (cornerDist > radius) {
          return [0, 0, 0, 0]; // transparent outside rounded rect
        }
      }
    }

    // Inside bounds: card coordinates
    // Center card: x in [0.22, 0.78], y in [0.20, 0.82]
    const cardScale = isMaskable ? 0.75 : 0.85;
    const cx = (nx - 0.5) / cardScale + 0.5;
    const cy = (ny - 0.5) / cardScale + 0.5;

    // Clipboard card
    if (cx >= 0.20 && cx <= 0.80 && cy >= 0.18 && cy <= 0.82) {
      // Rounded card corners
      const cdx = Math.min(cx - 0.20, 0.80 - cx);
      const cdy = Math.min(cy - 0.18, 0.82 - cy);
      const cr = 0.08;
      if (!(cdx < cr && cdy < cr && Math.sqrt((cr - cdx)**2 + (cr - cdy)**2) > cr)) {
        // Inside card: white-to-light-pink gradient (#ffffff to #fff0f5)
        let cR = 255, cG = 255, cB = 255;
        if (cy > 0.6) {
          cG = 245; cB = 248;
        }

        // Clip at top: cx in [0.38, 0.62], cy in [0.15, 0.22]
        // Row 1: Green circle + check
        const dRow1 = Math.sqrt((cx - 0.32)**2 + (cy - 0.33)**2);
        if (dRow1 < 0.055) {
          return [16, 185, 129, 255]; // emerald green
        }
        if (cx >= 0.42 && cx <= 0.72 && cy >= 0.31 && cy <= 0.35) {
          return [51, 65, 85, 255]; // dark slate text line
        }

        // Row 2: Pink Heart circle
        const dRow2 = Math.sqrt((cx - 0.32)**2 + (cy - 0.49)**2);
        if (dRow2 < 0.055) {
          return [215, 15, 100, 255]; // Pink Panda
        }
        if (cx >= 0.42 && cx <= 0.74 && cy >= 0.47 && cy <= 0.51) {
          return [51, 65, 85, 255]; // dark slate text line
        }

        // Row 3: Blue Shield circle
        const dRow3 = Math.sqrt((cx - 0.32)**2 + (cy - 0.65)**2);
        if (dRow3 < 0.055) {
          return [2, 132, 199, 255]; // Sky blue
        }
        if (cx >= 0.42 && cx <= 0.68 && cy >= 0.63 && cy <= 0.67) {
          return [51, 65, 85, 255]; // dark slate text line
        }

        return [cR, cG, cB, 255];
      }
    }

    // Top Clip on clipboard
    if (cx >= 0.38 && cx <= 0.62 && cy >= 0.13 && cy <= 0.21) {
      return [159, 7, 71, 255]; // deep wine clip
    }

    return [bgR, bgG, bgB, 255];
  };
}

// Generate files
const sizes = [
  { name: 'public/pwa-192x192.png', size: 192, maskable: false },
  { name: 'public/pwa-512x512.png', size: 512, maskable: false },
  { name: 'public/pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'public/apple-touch-icon.png', size: 180, maskable: false },
  { name: 'public/favicon.ico', size: 64, maskable: false },
];

for (const { name, size, maskable } of sizes) {
  const buf = createPNG(size, size, renderIcon(maskable));
  fs.writeFileSync(name, buf);
  console.log(`Generated ${name} (${size}x${size}, ${buf.length} bytes)`);
}
