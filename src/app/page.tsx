'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultCard from '@/components/ResultCard';
import { AssistResponse } from '@/lib/schema';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssistResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: { query: string; image?: string; location?: { lat: number; lng: number } }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Failed to get advice. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-start bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')` }}
    >
      {/* Dark overlay with blur effect for contrast */}
      <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 w-full max-w-4xl mt-6 sm:mt-12 mx-auto space-y-8 bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/50">
        <div className="text-center">
          <div className="flex justify-center mb-4 space-x-4 animate-pulse">
             <span className="text-5xl" title="Crops">🌾</span> 
             <span className="text-5xl" title="Weather Check">🌤️</span>
          </div>
          <h1 className="text-4xl font-extrabold text-green-900 tracking-tight sm:text-5xl drop-shadow-sm">
            Farmer Assistant
          </h1>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto font-medium">
            Describe your crop situation to get AI-powered, actionable farming advice based on weather, soil conditions, and deep agricultural knowledge.
          </p>
        </div>

        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        <ResultCard result={result} />
      </div>
    </main>
  );
}
