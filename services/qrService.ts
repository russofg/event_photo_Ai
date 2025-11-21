/**
 * Genera un código QR usando la API de QRServer
 * @param url URL para codificar en el QR
 * @param size Tamaño del QR en píxeles
 * @returns URL de la imagen del QR
 */
export const generateQRCode = (url: string, size: number = 400): string => {
  const encodedUrl = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}`;
};

/**
 * Sube una imagen a ImgBB y retorna la URL pública
 * ImgBB es gratuito, confiable y no tiene problemas de CORS
 * @param base64Image Imagen en formato base64
 * @returns URL pública o null si falla
 */
export const uploadToImgBB = async (
  base64Image: string
): Promise<string | null> => {
  try {
    // Extraer solo la parte base64 (sin el prefijo data:image/png;base64,)
    const base64Data = base64Image.split(",")[1];

    // API Key de ImgBB
    const API_KEY = "d2a164a18ca7b393d6a27aefebb479da";

    // Crear FormData
    const formData = new FormData();
    formData.append("image", base64Data);

    // Subir a ImgBB
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data && data.data.url) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Error desconocido de ImgBB");
    }
  } catch (error) {
    console.error("Error subiendo a ImgBB:", error);
    return null;
  }
};

/**
 * Convierte base64 a Blob para descarga local
 */
export const base64ToBlob = (base64Image: string): Blob => {
  const base64Data = base64Image.split(",")[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "image/png" });
};
