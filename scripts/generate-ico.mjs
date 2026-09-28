import sharp from 'sharp';
import fs from 'fs';

export async function createWindows300Ico(inputPngPath, outputIcoPath) {
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const images = [];

  for (const size of sizes) {
    const { data } = await sharp(inputPngPath)
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const headerSize = 40;
    const xorSize = size * size * 4;
    const andRowBytes = Math.ceil(size / 32) * 4;
    const andMaskSize = andRowBytes * size;
    const imageSize = headerSize + xorSize + andMaskSize;

    const imgBuf = Buffer.alloc(imageSize);
    let offset = 0;

    imgBuf.writeUInt32LE(40, offset); offset += 4;
    imgBuf.writeInt32LE(size, offset); offset += 4;
    imgBuf.writeInt32LE(size * 2, offset); offset += 4;
    imgBuf.writeUInt16LE(1, offset); offset += 2;
    imgBuf.writeUInt16LE(32, offset); offset += 2;
    imgBuf.writeUInt32LE(0, offset); offset += 4;
    imgBuf.writeUInt32LE(xorSize + andMaskSize, offset); offset += 4;
    imgBuf.writeInt32LE(0, offset); offset += 4;
    imgBuf.writeInt32LE(0, offset); offset += 4;
    imgBuf.writeUInt32LE(0, offset); offset += 4;
    imgBuf.writeUInt32LE(0, offset); offset += 4;

    for (let y = size - 1; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        const srcIdx = (y * size + x) * 4;
        const r = data[srcIdx];
        const g = data[srcIdx + 1];
        const b = data[srcIdx + 2];
        const a = data[srcIdx + 3];

        imgBuf[offset] = b;
        imgBuf[offset + 1] = g;
        imgBuf[offset + 2] = r;
        imgBuf[offset + 3] = a;
        offset += 4;
      }
    }

    imgBuf.fill(0, offset, offset + andMaskSize);
    offset += andMaskSize;

    images.push({ size, buf: imgBuf });
  }

  const headerLen = 6;
  const dirEntryLen = 16;
  const numImages = images.length;
  let totalSize = headerLen + numImages * dirEntryLen;
  for (const img of images) {
    totalSize += img.buf.length;
  }

  const icoBuf = Buffer.alloc(totalSize);
  icoBuf.writeUInt16LE(0, 0);
  icoBuf.writeUInt16LE(1, 2);
  icoBuf.writeUInt16LE(numImages, 4);

  let currentDataOffset = headerLen + numImages * dirEntryLen;
  for (let i = 0; i < numImages; i++) {
    const img = images[i];
    const entryOffset = headerLen + i * dirEntryLen;

    icoBuf.writeUInt8(img.size === 256 ? 0 : img.size, entryOffset);
    icoBuf.writeUInt8(img.size === 256 ? 0 : img.size, entryOffset + 1);
    icoBuf.writeUInt8(0, entryOffset + 2);
    icoBuf.writeUInt8(0, entryOffset + 3);
    icoBuf.writeUInt16LE(1, entryOffset + 4);
    icoBuf.writeUInt16LE(32, entryOffset + 6);
    icoBuf.writeUInt32LE(img.buf.length, entryOffset + 8);
    icoBuf.writeUInt32LE(currentDataOffset, entryOffset + 12);

    img.buf.copy(icoBuf, currentDataOffset);
    currentDataOffset += img.buf.length;
  }

  fs.writeFileSync(outputIcoPath, icoBuf);
}

if (process.argv[1]?.endsWith('generate-ico.mjs')) {
  createWindows300Ico('public/pwa-512x512.png', 'src-tauri/icons/icon.ico')
    .then(() => console.log('Generated Windows 3.00 compliant icon.ico'));
}
