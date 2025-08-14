'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DetectionSection from '@/components/DetectionSection';
import ResultSection from '@/components/ResultSection';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';

interface ResultData {
  actor_name: string;
  confidence: number;
  actor_image: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);

  const handleReset = () => {
    setResult(null);
    setIsLoading(false);
    // Scroll back to detection section
    document.getElementById('detection-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        
        {!result && !isLoading && (
          <DetectionSection 
            onResult={setResult} 
            onLoading={setIsLoading}
          />
        )}
        
        {isLoading && <Loader />}
        
        {result && !isLoading && (
          <ResultSection 
            result={result} 
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            fontWeight: '500',
            borderRadius: '12px',
            border: '1px solid #fbbf24',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}