'use client';

import Image from 'next/image';
import { ExternalLink, RotateCcw } from 'lucide-react';

interface ResultData {
  actor_name: string;
  confidence: number;
  actor_image: string;
}

interface ResultSectionProps {
  result: ResultData;
  onReset: () => void;
}

export default function ResultSection({ result, onReset }: ResultSectionProps) {
  const confidencePercentage = Math.round(result.confidence * 100);
  
  const getIMDbUrl = (actorName: string) => {
    const searchQuery = encodeURIComponent(actorName);
    return `https://www.imdb.com/find?q=${searchQuery}&s=nm`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="result-section" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="animate-scale-in">
          {/* Main Result Card */}
          <div className="card card-highlight max-w-2xl mx-auto text-center mb-8">
            <div className="mb-8">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                You Resemble:
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent mb-6">
                {result.actor_name}!
              </h3>
            </div>

            {/* Match Score */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-700">Match Score</span>
                <span className="text-2xl font-bold text-yellow-600">{confidencePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-2000 ease-out"
                  style={{ width: `${confidencePercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {confidencePercentage >= 80 ? 'Incredible match!' : 
                 confidencePercentage >= 60 ? 'Great resemblance!' : 
                 'Interesting similarity!'}
              </p>
            </div>

            {/* Actor Image */}
            <div className="mb-8">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl animate-pulse-slow">
                <Image
                  src={result.actor_image}
                  alt={result.actor_name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/200x200?text=Actor+Image';
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={getIMDbUrl(result.actor_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink size={18} />
                View on IMDb
              </a>
              
              <button
                onClick={onReset}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Try Another Photo
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center animate-fade-in-up">
            <p className="text-gray-600 mb-4">
              Want to try with a different photo or share with friends?
            </p>
            <button
              onClick={scrollToTop}
              className="text-yellow-600 hover:text-yellow-700 font-medium underline transition-colors"
            >
              Start Over from the Beginning
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}