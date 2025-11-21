import sharp from "sharp";
import { promises as fs } from "fs";

async function convertSvgToPng() {
  try {
    const svgBuffer = await fs.readFile("./build/icon.svg");

    // Generar PNG de 1024x1024 para tener máxima calidad
    await sharp(svgBuffer).resize(1024, 1024).png().toFile("./build/icon.png");

    console.log("✅ Icono PNG generado exitosamente en build/icon.png");
  } catch (error) {
    console.error("❌ Error al convertir SVG a PNG:", error);
    process.exit(1);
  }
}

convertSvgToPng();
