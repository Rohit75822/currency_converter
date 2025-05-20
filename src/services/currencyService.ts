// This service connects to the Python backend for currency conversion

interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// In a real application, this would call a Python backend
// For now, we'll simulate it with a mock API call
export const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRateResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Fetch from actual API (in production)
    // const response = await fetch(`/api/rates?base=${baseCurrency}`);
    // return await response.json();
    
    // For demo, return mock data with realistic exchange rates
    return getMockExchangeRates(baseCurrency);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

export const convertCurrency = (amount: number, exchangeRate: number): number => {
  return amount * exchangeRate;
};

// Mock exchange rates based on common currency relationships
// In production, this would be replaced with actual API calls to the Python backend
const getMockExchangeRates = (baseCurrency: string): ExchangeRateResponse => {
  const baseRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.92, GBP: 0.79, JPY: 153.43, CAD: 1.37, AUD: 1.52, CHF: 0.90, 
      CNY: 7.25, INR: 83.50, SGD: 1.35, NZD: 1.65, BRL: 5.15, RUB: 89.25,
      KRW: 1380.50, MXN: 16.85, ZAR: 18.45, HKD: 7.82, SEK: 10.55, NOK: 10.85,
      DKK: 6.85, PLN: 3.95, THB: 36.25, AED: 3.67, TRY: 32.15
    }
  };
  
  // Generate all possible currency pairs based on USD rates
  const allRates: Record<string, Record<string, number>> = {};
  
  // First, make a copy of USD rates for all currencies
  Object.keys(baseRates.USD).forEach(currency => {
    if (!allRates[currency]) allRates[currency] = {};
    
    // Set rate against USD
    allRates[currency].USD = 1 / baseRates.USD[currency];
    
    // Set rates against all other currencies
    Object.keys(baseRates.USD).forEach(otherCurrency => {
      if (currency !== otherCurrency) {
        allRates[currency][otherCurrency] = baseRates.USD[otherCurrency] / baseRates.USD[currency];
      }
    });
  });
  
  // Add USD rates
  allRates.USD = { ...baseRates.USD, USD: 1 };
  
  // Include the baseCurrency itself with a rate of 1
  if (!allRates[baseCurrency]) {
    allRates[baseCurrency] = {};
  }
  allRates[baseCurrency][baseCurrency] = 1;
  
  return {
    base: baseCurrency,
    date: new Date().toISOString().split('T')[0],
    rates: allRates[baseCurrency] || { USD: 1, EUR: 0.92, GBP: 0.79 } // fallback
  };
};