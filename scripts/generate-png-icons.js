const fs = require('fs');
const path = require('path');

function createMinimalPNG(width, height) {
  const PNG_HEADER = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = [PNG_HEADER];
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(2, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  
  chunks.push(createChunk('IHDR', ihdrData));
  
  const pixelData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    pixelData[y * (1 + width * 3)] = 0;
    for (let x = 0; x < width; x++) {
      const idx = y * (1 + width * 3) + 1 + x * 3;
      pixelData[idx] = 15;
      pixelData[idx + 1] = 23;
      pixelData[idx + 2] = 42;
    }
  }
  
  const zlib = require('zlib');
  const compressedData = zlib.deflateSync(pixelData);
  chunks.push(createChunk('IDAT', compressedData));
  chunks.push(createChunk('IEND', Buffer.alloc(0)));
  
  return Buffer.concat(chunks);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  
  const crcInput = Buffer.concat([typeBuffer, data]);
  const crc = calculateCRC(crcInput);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crc ^ buf[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const publicDir = path.join(__dirname, '..', 'public');

const icon192 = createMinimalPNG(192, 192);
fs.writeFileSync(path.join(publicDir, 'icon-192x192.png'), icon192);

const icon512 = createMinimalPNG(512, 512);
fs.writeFileSync(path.join(publicDir, 'icon-512x512.png'), icon512);

console.log('PNG icon files generated successfully!');
console.log('Note: These are minimal placeholder icons. For production, replace with proper branded icons.');
