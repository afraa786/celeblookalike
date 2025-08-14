'use client';

import Image from 'next/image';

interface ImagePreviewProps {
  imageUrl: string | null;
  className?: string;
}

export default function ImagePreview({ imageUrl, className = '' }: ImagePreviewProps) {
  if (!imageUrl) return null;

  return (
    <div className={`animate-fade-in-up ${className}`}>
      <div className="card max-w-sm mx-auto text-center">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-medium">
            Image ready for analysis
          </p>
        </div>
      </div>
    </div>
  );
}