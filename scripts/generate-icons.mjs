import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
    { name: "pwa-64x64.png", size: 64 },
    { name: "pwa-192x192.png", size: 192 },
    { name: "pwa-512x512.png", size: 512 },
    { name: "maskable-icon-512x512.png", size: 512 },
];

const inputPath = join(__dirname, "../public/images/logo.png");

async function generateIcons() {
    console.log("Generating PWA icons from logo.png...\n");

    for (const { name, size } of sizes) {
        const outputPath = join(__dirname, "../public/images", name);
        try {
            await sharp(inputPath).resize(size, size).toFile(outputPath);
            console.log(`✓ Generated ${name} (${size}x${size})`);
        } catch (error) {
            console.error(`✗ Failed to generate ${name}:`, error.message);
        }
    }

    console.log("\n✓ All PWA icons generated successfully in public/images!");
}

generateIcons();
