import React, { useState, useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara. Asegúrate de dar permisos o usa la opción de subir archivo.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current frame
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror effect for selfie consistency
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to File
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
            onImageSelected(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    onImageSelected(null as any); // Reset parent state
    // Don't auto restart camera, let user choose again
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl">
        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* View State 1: Camera Active */}
        {isCameraActive && !selectedImage && (
          <div className="relative w-full h-full flex flex-col">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover transform -scale-x-100" // Mirror preview
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 gap-4">
              <button 
                onClick={stopCamera}
                className="bg-gray-600 text-white p-3 rounded-full shadow-lg"
                title="Cancelar cámara"
              >
                ❌
              </button>
              <button 
                onClick={capturePhoto}
                className="bg-white rounded-full p-4 shadow-lg border-4 border-purple-500 active:scale-95 transition-transform hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
            </div>
            <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-white text-xs">
              🔴 EN VIVO
            </div>
          </div>
        )}

        {/* View State 2: Image Captured/Uploaded */}
        {selectedImage && (
          <div className="w-full h-full relative group">
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Captured" 
              className="w-full h-full object-contain bg-gray-900" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={handleRetake}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full font-bold border border-white/50 hover:bg-white/30 transition-all"
              >
                🔄 Cambiar foto
              </button>
            </div>
          </div>
        )}

        {/* View State 3: Idle / Select Mode */}
        {!isCameraActive && !selectedImage && (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 bg-gray-900">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-6">Elige cómo empezar</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <button 
                onClick={startCamera}
                className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                📸 Usar Cámara
              </button>
              <button 
                onClick={triggerFileUpload}
                className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                📁 Subir Foto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};