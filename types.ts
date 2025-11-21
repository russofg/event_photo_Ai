export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
}

export interface PresetPrompt {
  id: string;
  label: string;
  text: string;
  icon: string;
}

export interface ArtStyle {
  id: string;
  label: string;
  promptModifier: string;
  previewColor: string;
}

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'realistic',
    label: 'Fotorealista',
    promptModifier: 'fotografía de alta resolución, 4k, texturas de piel realistas, iluminación cinematográfica, estilo fotográfico',
    previewColor: 'from-gray-700 to-gray-900'
  },
  {
    id: 'comic',
    label: 'Cómic',
    promptModifier: 'estilo de cómic americano moderno, líneas de tinta definidas, colores vibrantes, sombreado cel-shaded, arte vectorial detallado',
    previewColor: 'from-yellow-400 to-red-500'
  },
  {
    id: 'anime',
    label: 'Anime',
    promptModifier: 'estilo anime japonés de alta calidad, Studio Ghibli, colores suaves, iluminación atmosférica, detallado',
    previewColor: 'from-pink-400 to-purple-500'
  },
  {
    id: 'oil',
    label: 'Pintura al Óleo',
    promptModifier: 'pintura al óleo clásica sobre lienzo, pinceladas visibles, texturas ricas, iluminación dramática estilo rembrandt',
    previewColor: 'from-amber-600 to-yellow-800'
  },
  {
    id: 'cyberpunk',
    label: 'Digital / Cyberpunk',
    promptModifier: 'arte digital futurista, luces de neón, atmósfera cyberpunk, renderizado 3D nítido, efecto glitch sutil',
    previewColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'pixar',
    label: '3D Cartoon',
    promptModifier: 'renderizado 3D estilo película de animación de Pixar o Disney, iluminación volumétrica suave, texturas renderizadas, adorable',
    previewColor: 'from-orange-400 to-red-400'
  }
];