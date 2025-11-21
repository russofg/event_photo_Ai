import React, { useState } from 'react';
import { PresetPrompt, ART_STYLES } from '../types';

interface PromptSelectorProps {
  prompt: string;
  setPrompt: (value: string) => void;
  selectedStyleId: string;
  setSelectedStyleId: (value: string) => void;
  presets: PresetPrompt[];
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({ 
  prompt, 
  setPrompt, 
  selectedStyleId,
  setSelectedStyleId,
  presets 
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  return (
    <div className="space-y-8">
      
      {/* Presets - Big Cards for Kiosk */}
      <div>
        <label className="block text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm">1</span>
          Elige tu Escenario
        </label>
        <div className="grid grid-cols-2 gap-4">
          {presets.map((preset) => {
            const isSelected = prompt === preset.text;
            return (
              <button
                key={preset.id}
                onClick={() => setPrompt(preset.text)}
                className={`
                  relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 group
                  ${isSelected
                    ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-500 hover:bg-gray-750'
                  }
                `}
              >
                <div className={`text-5xl mb-3 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {preset.icon}
                </div>
                <span className={`text-lg font-bold text-center ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {preset.label}
                </span>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Toggle for custom input (hidden by default for kiosk simplicity) */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-sm text-gray-500 underline hover:text-gray-300"
          >
            {showCustomInput ? 'Ocultar entrada manual' : '¿Prefieres escribir algo específico?'}
          </button>
        </div>

        {showCustomInput && (
           <textarea
           value={prompt}
           onChange={(e) => setPrompt(e.target.value)}
           placeholder="Describe tu escenario..."
           className="w-full mt-2 h-24 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
         />
        )}
      </div>

      {/* Style Selector - Horizontal Scroll or Grid */}
      <div>
        <label className="block text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm">2</span>
          Elige el Estilo
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          {ART_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyleId(style.id)}
              className={`
                relative overflow-hidden rounded-xl p-4 h-24 text-left transition-all duration-200 group border-2 flex flex-col justify-end
                ${selectedStyleId === style.id 
                  ? 'border-purple-500 bg-gray-800 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                }
              `}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${style.previewColor} opacity-20 group-hover:opacity-30 transition-opacity`} />
              <span className={`block text-lg font-bold z-10 relative ${selectedStyleId === style.id ? 'text-white' : 'text-gray-300'}`}>
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};