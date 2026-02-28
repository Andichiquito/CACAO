const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const pngToIco = (await import('png-to-ico')).default;
  const { Jimp } = await import('jimp');

  const projectRoot = path.resolve(__dirname, '..');
  const inputPng = path.join(projectRoot, 'public', 'logos', 'logo-blanco.png');
  const outputIco = path.join(projectRoot, 'public', 'favicon.ico');

  const squareSourcePath = path.join(projectRoot, 'public', 'logos', 'favicon-source.png');
  const icon192Path = path.join(projectRoot, 'public', 'logos', 'logo192.png');
  const icon512Path = path.join(projectRoot, 'public', 'logos', 'logo512.png');

  const img = await Jimp.read(inputPng);
  const srcW = img.bitmap.width;
  const srcH = img.bitmap.height;
  const side = Math.max(srcW, srcH);

  const padded = new Jimp({ width: side, height: side, color: 0x000000ff });
  padded.composite(img, Math.floor((side - srcW) / 2), Math.floor((side - srcH) / 2));

  const icon192 = padded.clone().resize({ w: 192, h: 192, mode: Jimp.RESIZE_BILINEAR });
  const icon512 = padded.clone().resize({ w: 512, h: 512, mode: Jimp.RESIZE_BILINEAR });

  await icon192.write(icon192Path);
  await icon512.write(icon512Path);
  await icon512.clone().write(squareSourcePath);

  const ico = await pngToIco(squareSourcePath, [16, 32, 48, 64]);
  await fs.writeFile(outputIco, ico);

  // eslint-disable-next-line no-console
  console.log(
    `Generated ${path.relative(projectRoot, icon192Path)}, ${path.relative(projectRoot, icon512Path)}, ${path.relative(projectRoot, outputIco)}`
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

