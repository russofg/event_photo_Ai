import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { PromptSelector } from "./components/PromptSelector";
import { generateEditedImageVariations } from "./services/geminiService";
import { AppStatus, PresetPrompt, ART_STYLES } from "./types";
import { uploadToImgBB, generateQRCode } from "./services/qrService";

const PRESETS: PresetPrompt[] = [
  {
    id: "messi",
    label: "Con Messi",
    text: "Una selfie de grupo donde TODAS las personas de la foto original aparecen junto a Lionel Messi. Messi se une al grupo como un amigo más. Si hay varias personas en la foto original, todas salen en la imagen final junto a Messi.",
    icon: "⚽",
  },
  {
    id: "taylor",
    label: "Con Taylor Swift",
    text: 'Una foto espectacular en el escenario del "Eras Tour". El grupo de personas de la foto original posando abrazados junto a Taylor Swift. Ella lleva un traje body brillante de lentejuelas (azul o rosa) y sostiene un micrófono. Iluminación de concierto, confeti y ambiente de fiesta pop.',
    icon: "🎤",
  },
  {
    id: "elvis",
    label: "Elvis Presley",
    text: "Una foto vibrante y retro en Las Vegas. El grupo de personas de la foto original posando con actitud rockera junto al legendario Elvis Presley. Elvis lleva su icónico traje blanco con cuello alto y lentejuelas, peinado pompadour y gafas de sol. Fondo con luces de neón brillantes y atmósfera de los años 70.",
    icon: "🎸",
  },
  {
    id: "trump",
    label: "Con Trump",
    text: "Una selfie de grupo épica donde TODAS las personas de la foto original aparecen posando junto a Donald Trump. Trump lleva su traje azul clásico y corbata roja, haciendo su gesto de pulgar arriba. Fondo elegante de la Casa Blanca.",
    icon: "🇺🇸",
  },
  {
    id: "harrypotter",
    label: "Harry Potter",
    text: "Una escena mágica dentro del castillo de Hogwarts. El grupo de personas original vistiendo túnicas de mago de Gryffindor, posando junto a Harry Potter (con la apariencia de Daniel Radcliffe en las películas). Sostienen varitas mágicas, velas flotantes en el techo, ambiente mágico y cinematográfico.",
    icon: "⚡",
  },
  {
    id: "vader",
    label: "Darth Vader",
    text: "Una foto épica de ciencia ficción dentro de los pasillos imperiales de la Estrella de la Muerte. El grupo original posa junto al imponente Darth Vader. Vader tiene su sable de luz rojo encendido. Iluminación dramática, contraste alto, atmósfera de Star Wars.",
    icon: "🌌",
  },
  {
    id: "wanted",
    label: "Se Busca",
    text: 'Un póster antiguo y desgastado de "SE BUSCA" (WANTED) del Lejano Oeste clavado en una pared de madera rústica. Las personas de la foto aparecen retratadas dentro del cartel con efecto sepia, textura de papel viejo, sombreros de vaquero y aspecto de forajidos.',
    icon: "🤠",
  },
  {
    id: "astronaut",
    label: "Astronautas",
    text: "Las personas de la foto original vestidas con trajes espaciales futuristas de alta tecnología, caminando sobre la superficie roja de Marte con la Tierra visible en el cielo estrellado de fondo.",
    icon: "🚀",
  },
  {
    id: "hollywood",
    label: "Estrella de Cine",
    text: "Caminando por la alfombra roja rodeado de paparazzis, vistiendo un traje de gala elegante.",
    icon: "🎬",
  },
  {
    id: "fantasy",
    label: "Guerrero Medieval",
    text: "Vistiendo una armadura plateada brillante y una capa roja, sosteniendo una espada en un paisaje de montaña épico.",
    icon: "⚔️",
  },
];

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    ART_STYLES[0].id
  );

  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [isUploadingQR, setIsUploadingQR] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedFile || !prompt) {
      console.log("Faltan datos: archivo o prompt");
      return;
    }

    console.log("🚀 Iniciando generación...");
    console.log("Archivo:", selectedFile.name, selectedFile.type);
    console.log("Prompt:", prompt);
    console.log("Estilo:", selectedStyleId);

    setStatus(AppStatus.PROCESSING);
    setErrorMessage(null);
    setGeneratedImages([]);
    setSelectedImageIndex(0);

    try {
      console.log("📡 Llamando a Gemini API...");
      const results = await generateEditedImageVariations(
        selectedFile,
        prompt,
        selectedStyleId
      );

      console.log("✅ Respuesta recibida:", results.length, "imágenes");

      if (results.length > 0) {
        setGeneratedImages(results);
        setStatus(AppStatus.SUCCESS);
        console.log("🎉 Imágenes generadas correctamente");
      } else {
        console.error("❌ No se generaron imágenes");
        setErrorMessage("No pudimos generar la imagen. Intenta otra vez.");
        setStatus(AppStatus.ERROR);
      }
    } catch (error: any) {
      console.error("❌ ERROR COMPLETO:", error);
      console.error("Tipo de error:", error?.constructor?.name);
      console.error("Mensaje:", error?.message);
      console.error("Stack:", error?.stack);

      // Mensajes de error más específicos
      let errorMsg = "Error de conexión. Por favor intenta nuevamente.";
      if (error?.message?.includes("429")) {
        errorMsg =
          "Límite de API alcanzado. Espera unos minutos e intenta de nuevo.";
      } else if (
        error?.message?.includes("API key") ||
        error?.message?.includes("api key")
      ) {
        errorMsg = "Error con la API Key. Verifica tu configuración.";
      } else if (error?.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setGeneratedImages([]);
    setErrorMessage(null);
    setSelectedFile(null);
    setPrompt("");
    setQrCodeUrl(null);
    setShowQRModal(false);
    setDownloadUrl(null);
  };

  const handleGenerateQR = async () => {
    const selectedImage = generatedImages[selectedImageIndex];

    setIsUploadingQR(true);
    setShowQRModal(true);

    try {
      // Subir imagen a ImgBB (servicio de hosting de imágenes gratuito)
      const imageUrl = await uploadToImgBB(selectedImage);

      if (imageUrl) {
        // Generar código QR con la URL de la imagen
        const qrUrl = generateQRCode(imageUrl, 400);
        setQrCodeUrl(qrUrl);
        setDownloadUrl(imageUrl);
      } else {
        setErrorMessage("Error subiendo la foto. Intenta nuevamente.");
        setShowQRModal(false);
      }
    } catch (error) {
      console.error("Error generando QR:", error);
      setErrorMessage("Error generando código QR. Intenta nuevamente.");
      setShowQRModal(false);
    } finally {
      setIsUploadingQR(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden">
      {/* Simple Event Header */}
      <div className="py-4 text-center bg-gray-900/50 border-b border-gray-800 sticky top-0 z-30 backdrop-blur-lg">
        <h1 className="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          AI Photo Booth
        </h1>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* View: Success / Results */}
        {status === AppStatus.SUCCESS ? (
          <div className="flex items-center justify-center min-h-[85vh] animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 w-full max-w-7xl">
              {/* Left: Main Photo */}
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Elige la mejor foto
                </h2>

                <div className="relative w-full max-w-3xl aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-700">
                  <img
                    src={generatedImages[selectedImageIndex]}
                    alt="Result"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right: Sidebar with Variations and Actions */}
              <div className="flex flex-col justify-center space-y-6">
                {/* Variations Section */}
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-4 text-gray-300 uppercase tracking-wider">
                    Variaciones
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${
                          selectedImageIndex === idx
                            ? "ring-4 ring-blue-500 scale-105 shadow-2xl shadow-blue-500/50"
                            : "opacity-70 hover:opacity-100 hover:scale-102"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Variation ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedImageIndex === idx && (
                          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleGenerateQR}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-bold text-xl shadow-lg active:transform active:scale-95 transition-all"
                  >
                    <span className="text-2xl">📱</span>
                    OBTENER CÓDIGO QR
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 py-4 rounded-2xl font-semibold text-lg shadow-lg active:transform active:scale-95 transition-all border border-gray-600"
                  >
                    <span className="text-xl">✕</span>
                    Descartar / Reiniciar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View: Input / Processing */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Camera */}
            <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700 shadow-xl">
              <ImageUploader
                onImageSelected={setSelectedFile}
                selectedImage={selectedFile}
              />
            </div>

            {/* Right: Options */}
            <div
              className={`transition-all duration-500 ${
                selectedFile
                  ? "opacity-100 translate-y-0"
                  : "opacity-50 translate-y-10 pointer-events-none grayscale"
              }`}
            >
              <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700 shadow-xl">
                <PromptSelector
                  prompt={prompt}
                  setPrompt={setPrompt}
                  selectedStyleId={selectedStyleId}
                  setSelectedStyleId={setSelectedStyleId}
                  presets={PRESETS}
                />

                <button
                  onClick={handleGenerate}
                  disabled={
                    !selectedFile || !prompt || status === AppStatus.PROCESSING
                  }
                  className={`
                      w-full mt-8 py-6 rounded-2xl font-black text-2xl shadow-2xl uppercase tracking-wider transition-all
                      ${
                        status === AppStatus.PROCESSING
                          ? "bg-purple-900/50 text-purple-300 cursor-wait"
                          : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] animate-gradient hover:scale-[1.02] text-white"
                      }
                    `}
                >
                  {status === AppStatus.PROCESSING
                    ? "Creando Magia..."
                    : "✨ GENERAR IMAGEN ✨"}
                </button>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
            <div className="w-32 h-32 border-t-4 border-l-4 border-purple-500 rounded-full animate-spin mb-8"></div>
            <h2 className="text-4xl font-bold text-white mb-4 animate-pulse">
              Procesando...
            </h2>
            <p className="text-xl text-purple-300 mb-2">
              La IA está redibujando tu realidad.
            </p>
            <p className="text-sm text-gray-400">
              Esto puede tomar 15-30 segundos...
            </p>
          </div>
        )}

        {/* Error Message Toast */}
        {status === AppStatus.ERROR && errorMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md animate-fadeIn">
            <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-red-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-bold mb-1">Error</p>
                  <p className="text-sm">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setStatus(AppStatus.IDLE)}
                  className="text-white/80 hover:text-white text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Código QR */}
        {showQRModal && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center text-center p-8">
            <div className="bg-white rounded-3xl p-8 max-w-md relative animate-fadeIn">
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📱 Escanea para descargar
              </h2>

              {isUploadingQR ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Subiendo foto a la nube...</p>
                </div>
              ) : qrCodeUrl ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-2xl shadow-inner mb-4">
                    <img
                      src={qrCodeUrl}
                      alt="Código QR"
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <p className="text-green-800 text-sm font-semibold mb-2">
                      ✅ ¡Listo para escanear!
                    </p>
                    <p className="text-gray-600 text-xs">
                      Tu foto está lista para descargar. Escanea el QR con tu
                      celular.
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    Escanea este código con tu celular para descargar la foto
                    directamente
                  </p>

                  {downloadUrl && (
                    <p className="text-xs text-gray-400 mb-4 break-all">
                      Link directo: {downloadUrl}
                    </p>
                  )}
                </>
              ) : (
                <div className="py-12">
                  <p className="text-red-600">Error generando el código QR</p>
                </div>
              )}

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-white text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span>Hecho con amor</span>
          <span
            className="text-red-400 animate-pulse inline-block"
            style={{ animation: "pulse 1s ease-in-out infinite" }}
          >
            ❤️
          </span>
          <span>por</span>
          <span className="font-bold">Mate Code</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
