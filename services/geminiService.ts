import { GoogleGenAI } from "@google/genai";
import { ART_STYLES } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
export const fileToGenerativePart = async (
  file: File
): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve({
        data: base64Data,
        mimeType: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Sends the image and prompt to Gemini to generate multiple variations.
 */
export const generateEditedImageVariations = async (
  imageFile: File,
  userPrompt: string,
  styleId: string
): Promise<string[]> => {
  console.log("🔧 geminiService: Iniciando generación");
  console.log("API Key disponible:", !!process.env.API_KEY);

  try {
    console.log("📸 Convirtiendo imagen a base64...");
    const imagePart = await fileToGenerativePart(imageFile);
    console.log(
      "✅ Imagen convertida, tamaño:",
      imagePart.data.length,
      "caracteres"
    );

    const selectedStyle =
      ART_STYLES.find((s) => s.id === styleId) || ART_STYLES[0];
    console.log("🎨 Estilo seleccionado:", selectedStyle.label);

    // Create 2 variations with slight nuances
    const variations = [
      "Plano medio grupal, iluminación frontal favorecedora.",
      "Estilo selfie gran angular para que entren todos.",
    ];

    // Define the task for a single variation
    const generateSingleVariation = async (
      variationNuance: string,
      index: number
    ): Promise<string | null> => {
      console.log(
        `🎬 Generando variación ${index + 1}/${variations.length}...`
      );

      // INSTRUCCIONES CRÍTICAS ACTUALIZADAS PARA GRUPOS
      const systemInstruction = `
        TAREA: Edición fotográfica inteligente e integración de personajes en grupos.
        
        INPUT: Recibes una imagen que contiene UNA o VARIAS personas (el "GRUPO ORIGINAL").
        OBJETIVO: Generar una nueva imagen colocando a TODO el "GRUPO ORIGINAL" en el escenario: "${userPrompt}".
        
        REGLAS DE ORO (STRICT):
        1. INTEGRIDAD DEL GRUPO (CRÍTICO): 
           - Debes contar visualmente cuántas personas hay en la imagen input.
           - TODAS esas personas deben aparecer en la imagen final. 
           - Si en la foto original hay 2 personas, en el resultado TIENEN que salir esas 2 personas. Si hay 3, salen 3.
           - NUNCA elimines a un amigo o acompañante de la foto original.
        
        2. IDENTIDAD FACIAL:
           - Copia fielmente los rasgos faciales de CADA persona del grupo original.
        
        3. LÓGICA DE INSERCIÓN (Ej. Messi):
           - Si el prompt pide agregar a alguien (ej. Messi), esta persona se SUMA al grupo.
           - Fórmula: (Personas del Input) + (Personaje Solicitado) = Total Personas en Output.
           - El personaje solicitado debe interactuar con el grupo (abrazando, posando al lado) pero NO reemplazar a nadie.
        
        ESTILO VISUAL:
        - Aplica el estilo: ${selectedStyle.promptModifier}.
        - Nuance técnica: ${variationNuance}.
      `;

      console.log(`📡 Enviando petición a Gemini (variación ${index + 1})...`);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: imagePart.data,
                mimeType: imagePart.mimeType,
              },
            },
            {
              text: systemInstruction,
            },
          ],
        },
        config: {
          temperature: 0.6, // Keep low to preserve faces
        },
      });

      console.log(`✅ Respuesta recibida de Gemini (variación ${index + 1})`);

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || "image/png";
            console.log(
              `🖼️ Imagen generada (variación ${index + 1}), tipo: ${mimeType}`
            );
            return `data:${mimeType};base64,${base64EncodeString}`;
          }
        }
      }

      console.warn(
        `⚠️ No se encontró imagen en la respuesta (variación ${index + 1})`
      );
      return null;
    };

    // Run requests in parallel
    console.log(
      "🚀 Ejecutando",
      variations.length,
      "peticiones en paralelo..."
    );
    const results = await Promise.all(
      variations.map((nuance, index) => generateSingleVariation(nuance, index))
    );

    // Filter out failed requests
    const validResults = results.filter((res): res is string => res !== null);
    console.log("✅ Total de imágenes válidas:", validResults.length);

    return validResults;
  } catch (error: any) {
    console.error("❌ ERROR en geminiService:", error);
    console.error("Mensaje de error:", error?.message);
    console.error("Stack:", error?.stack);
    throw error;
  }
};
