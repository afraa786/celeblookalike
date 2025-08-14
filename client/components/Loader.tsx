export default function Loader() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-red-50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <div className="text-8xl animate-film-reel mb-8">🎥</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Finding Your Bollywood Match...
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Our AI is analyzing your features against thousands of Bollywood stars
          </p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-shimmer"></div>
            </div>
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}