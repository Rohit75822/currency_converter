import React, { useState, useEffect } from 'react';
import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { CurrencySelect } from './CurrencySelect';
import { GlowingButton } from './ui/glowing-button';
import { useToast } from '../hooks/useToast';
import { fetchExchangeRates, convertCurrency } from '../services/currencyService';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [history, setHistory] = useState<Array<{from: string, to: string, amount: string, result: string}>>([]);
  
  const { showToast } = useToast();

  const loadExchangeRates = async () => {
    try {
      setIsLoading(true);
      const data = await fetchExchangeRates(fromCurrency);
      
      if (data && data.rates) {
        setExchangeRate(data.rates[toCurrency]);
        setLastUpdated(new Date().toLocaleTimeString());
        convertAmount(amount, data.rates[toCurrency]);
        showToast('Exchange rates updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to fetch exchange rates', 'error');
      console.error('Error fetching exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExchangeRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency]);

  const convertAmount = (value: string, rate: number = exchangeRate) => {
    if (value && !isNaN(Number(value)) && rate) {
      const convertedAmount = convertCurrency(parseFloat(value), rate);
      setResult(convertedAmount.toFixed(2));
      return convertedAmount.toFixed(2);
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    convertAmount(value);
  };

  const handleConvert = () => {
    const convertedResult = convertAmount(amount);
    if (convertedResult) {
      // Add to history
      const newEntry = {
        from: fromCurrency,
        to: toCurrency,
        amount,
        result: convertedResult
      };
      setHistory([newEntry, ...history.slice(0, 4)]);
      showToast('Conversion successful', 'success');
    } else {
      showToast('Please enter a valid amount', 'error');
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-800 glow-container">
      <div className="space-y-6">
        {/* Input Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          <CurrencySelect
            value={fromCurrency}
            onChange={(value) => setFromCurrency(value)}
            label="From"
          />
          
          <button 
            onClick={swapCurrencies}
            className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-cyan-500"
          >
            <ArrowDownUp size={16} className="text-cyan-400" />
          </button>
          
          <CurrencySelect
            value={toCurrency}
            onChange={(value) => setToCurrency(value)}
            label="To"
          />
        </div>

        {/* Exchange Rate Info */}
        <div className="text-sm text-gray-400 flex justify-between items-center">
          <div>
            <span>Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw 
              size={14} 
              className={`text-cyan-400 ${isLoading ? 'animate-spin' : ''}`}
            />
            <button 
              onClick={loadExchangeRates} 
              className="text-cyan-400 hover:text-cyan-300"
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Result Display */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Result</div>
          <div className="text-2xl font-bold text-white">
            {result ? (
              <>
                {result} <span className="text-cyan-400">{toCurrency}</span>
              </>
            ) : (
              <span className="text-gray-500">Enter an amount to convert</span>
            )}
          </div>
        </div>

        {/* Convert Button */}
        <GlowingButton onClick={handleConvert} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Convert'}
        </GlowingButton>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-xs text-gray-500 text-center">
            Last updated: {lastUpdated}
          </div>
        )}

        {/* Conversion History */}
        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Conversions</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-2 text-sm border border-gray-800">
                  <div className="flex justify-between">
                    <span>{item.amount} {item.from}</span>
                    <span className="text-cyan-400">→</span>
                    <span>{item.result} {item.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;