import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-yellow-200 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
        <div className="relative w-10 h-10">
          <Image
            src="/logo.png"
            alt="College Logo"
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-10 h-10 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            🎬
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
            Bollywood Look-Alike Finder
          </h1>
        </div>
      </div>
    </header>
  );
}