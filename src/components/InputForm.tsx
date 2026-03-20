'use client';

import { useState, useRef } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

interface InputFormProps {
  onSubmit: (payload: { query: string; image?: string; location?: { lat: number; lng: number } }) => Promise<void>;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(undefined);
      setImageName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 5) {
      // Attempt location fetch for Hyperlocal weather context
      let locationObj = undefined;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          );
          locationObj = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch {
          console.warn("Location denied or timed out. Falling back to default.");
        }
      }
      
      await onSubmit({ query: query.trim(), image, location: locationObj });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the issue with your crops, or tap the microphone..."
          className="w-full p-4 pr-24 text-gray-800 bg-white/80 border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none h-32 backdrop-blur-sm"
          disabled={isLoading}
        />
        <div className="absolute right-3 bottom-3 flex space-x-2">
           <button 
             type="button" 
             onClick={startListening} 
             disabled={isLoading}
             title="Voice to Text"
             className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-800 hover:bg-green-200 shadow-sm border border-green-200'}`}
           >
             🎤
           </button>
           <button 
             type="button" 
             onClick={() => fileInputRef.current?.click()} 
             disabled={isLoading}
             title="Upload Image"
             className="p-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors shadow-sm border border-blue-200"
           >
             📷
           </button>
           <input 
             type="file" 
             accept="image/*" 
             ref={fileInputRef} 
             onChange={handleImageChange} 
             className="hidden" 
           />
        </div>
      </div>

      {imageName && (
        <div className="flex items-center space-x-2 text-sm text-green-900 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm w-full font-medium">
          <span>🖼️ {imageName} attached securely.</span>
          <button type="button" onClick={() => { setImageName(null); setImage(undefined); }} className="text-red-500 font-bold hover:text-red-700 ml-auto bg-red-50 px-2 py-1 rounded">Remove</button>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || query.trim().length < 5}
        className="w-full py-3 px-6 text-white bg-green-600/90 hover:bg-green-700 rounded-xl font-bold text-lg shadow-xl backdrop-blur-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed group border border-white/20"
      >
        {isLoading ? '🤖 Analyzing Device Datastreams...' : 'Get Farming Advice'}
      </button>
    </form>
  );
}
