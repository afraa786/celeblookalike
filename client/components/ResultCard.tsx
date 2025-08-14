'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface ResultData {
  actor_name: string;
  confidence: number;
  actor_image: string;
}

interface ResultCardProps {
  result: ResultData;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const confidencePercentage = Math.round(result.confidence * 100);
  
  const getIMDbUrl = (actorName: string) => {
    const searchQuery = encodeURIComponent(actorName);
    return `https://www.imdb.com/find?q=${searchQuery}&s=nm`;
  };

  return (
    <div className="animate-scale-in">
      <div className="card card-highlight max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="text-4xl mb-2">🎬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            You Resemble:
          </h2>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent mb-4">
            {result.actor_name}!
          </h3>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Match Score</span>
            <span className="text-sm font-bold text-yellow-600">{confidencePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-lg">
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

        <div className="flex flex-col gap-3">
          <a
            href={getIMDbUrl(result.actor_name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <ExternalLink size={16} />
            View on IMDb
          </a>
          
          <button
            onClick={onReset}
            className="btn-secondary w-full"
          >
            Try Another Photo
          </button>
        </div>
      </div>
    </div>
  );
}