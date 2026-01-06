import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
    { name: "../public/favicon-16x16.png", size: 16 },
    { name: "../public/favicon-32x32.png", size: 32 },
    { name: "../public/apple-touch-icon.png", size: 180 },
    { name: "../public/android-chrome-192x192.png", size: 192 },
    { name: "../public/android-chrome-512x512.png", size: 512 },
    { name: "../public/images/pwa-64x64.png", size: 64 },
    { name: "../public/images/pwa-192x192.png", size: 192 },
    { name: "../public/images/pwa-512x512.png", size: 512 },
    { name: "../public/images/maskable-icon-512x512.png", size: 512 },
];

const inputPath = join(__dirname, "../public/images/logo.png");

async function generateIcons() {
    console.log("Generating icons from public/images/logo.png...\n");

    for (const { name, size } of sizes) {
        const outputPath = join(__dirname, name);
        try {
            await sharp(inputPath).resize(size, size).toFile(outputPath);
            console.log(`Generated ${name} (${size}x${size})`);
        } catch (error) {
            console.error(`Failed to generate ${name}:`, error.message);
        }
    }

    console.log("\nAll icons generated successfully.");
}

generateIcons();
