'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImagePreview from './ImagePreview';

interface DetectionSectionProps {
  onResult: (result: {
    actor_name: string;
    confidence: number;
    actor_image: string;
  }) => void;
  onLoading: (loading: boolean) => void;
}

export default function DetectionSection({ onResult, onLoading }: DetectionSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onResult(null);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      toast.success('Camera started! Position yourself and click capture');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions or upload an image.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setImageFile(file);
            setSelectedImage(canvas.toDataURL('image/jpeg'));
            stopCamera();
            onResult(null);
            toast.success('Photo captured successfully!');
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const findMatch = async () => {
    if (!imageFile) {
      toast.error('Please select or capture an image first');
      return;
    }

    onLoading(true);
    const formData = new FormData();
    formData.append('file', imageFile); // Ensure backend expects 'image'

    try {
      const response = await fetch('https://variation-giant-kruger-proud.trycloudflare.com/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to process image');

      const data = await response.json();

      // Convert API response to ResultData format
      const resultData = {
        actor_name: data.name || data.name,
        confidence: data.match_percentage != null ? data.match_percentage / 100 : data.confidence,
        actor_image: data.matched_image_url || data.matched_image_url
      };

      onResult(resultData);
      toast.success(`Found your match: ${resultData.actor_name}!`);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (error) {
      console.error('Error finding match:', error);
      toast.error('Failed to find your Bollywood match. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <section id="detection-section" className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto">
        {/* Camera Modal */}
        {cameraStream && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl mb-4" />
              <div className="flex gap-3">
                <button onClick={capturePhoto} className="btn-primary flex-1">📸 Capture</button>
                <button onClick={stopCamera} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Hero Text */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Ready to Discover Your{' '}
            <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
              Bollywood Twin?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose your preferred method to get started with AI-powered face matching
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <div className="animate-slide-in-left">
            <button onClick={startCamera} className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-6">
              <Camera size={24} /> Capture Photo
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">Use your device camera</p>
          </div>

          <div className="animate-slide-in-right">
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary w-full flex items-center justify-center gap-3 text-lg py-6">
              <Upload size={24} /> Upload Image
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">Choose from your gallery</p>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-8">
            <ImagePreview imageUrl={selectedImage} />
            <div className="text-center mt-8">
              <button onClick={findMatch} className="btn-primary inline-flex items-center gap-3 text-xl px-12 py-6 animate-scale-in">
                <Search size={28} /> Find My Bollywood Match
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
