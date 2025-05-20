import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { currencies } from '../data/currencies';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCurrency = currencies.find(currency => currency.code === value);
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          className="relative w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <span className="mr-2">{selectedCurrency?.flag}</span>
            <span className="font-medium">{selectedCurrency?.code}</span>
            <span className="ml-2 text-gray-400 text-sm truncate">{selectedCurrency?.name}</span>
            <ChevronDown size={16} className="ml-auto text-gray-400" />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="py-1">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center ${
                    currency.code === value ? 'bg-gray-700/50 text-cyan-400' : 'text-white'
                  }`}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                  }}
                >
                  <span className="mr-2">{currency.flag}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="ml-2 text-gray-400 text-sm truncate">{currency.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};