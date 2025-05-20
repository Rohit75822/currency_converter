import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import { BackgroundBeams } from './components/ui/background-beams';

function App() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden flex items-center justify-center">
      <div className="container max-w-md mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Currency Converter
        </h1>
        <p className="text-gray-400 text-center mb-8">Get accurate exchange rates instantly</p>
        
        <CurrencyConverter />
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Currency Converter. All exchange rates are updated in real-time.</p>
        </footer>
      </div>
      <BackgroundBeams />
    </div>
  );
}

export default App;