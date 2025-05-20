import json
import os
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# In a production environment, you would want to:
# 1. Use a proper framework like Flask or FastAPI
# 2. Use an API key for exchange rate access
# 3. Implement caching to avoid excessive API calls
# 4. Set up proper CORS headers
# 5. Implement error handling and logging

class CurrencyConverter:
    def __init__(self):
        # In production, use an API like exchangerate-api.com or openexchangerates.org
        self.api_url = "https://open.er-api.com/v6/latest/{}"
        self.cache = {}
        self.cache_expiry = {}
    
    def get_exchange_rates(self, base_currency):
        """Fetch exchange rates for a given base currency"""
        try:
            # Check if we have cached data that's still valid (less than 1 hour old)
            current_time = __import__('time').time()
            if (base_currency in self.cache and 
                base_currency in self.cache_expiry and 
                current_time - self.cache_expiry[base_currency] < 3600):
                return self.cache[base_currency]
            
            # Make API request
            url = self.api_url.format(base_currency)
            with urllib.request.urlopen(url) as response:
                data = json.loads(response.read().decode())
                
                if data.get("result") == "success":
                    # Cache the results
                    self.cache[base_currency] = data
                    self.cache_expiry[base_currency] = current_time
                    return data
                else:
                    raise Exception(f"API Error: {data.get('error-type', 'Unknown error')}")
        
        except Exception as e:
            print(f"Error fetching exchange rates: {str(e)}")
            # Return mock data if API fails
            return self._get_mock_rates(base_currency)
    
    def convert(self, amount, from_currency, to_currency):
        """Convert an amount from one currency to another"""
        try:
            # Get exchange rates with the from_currency as base
            rates = self.get_exchange_rates(from_currency)
            
            # Extract the rate for the target currency
            if "rates" in rates:
                rate = rates["rates"].get(to_currency)
                if rate:
                    return {
                        "result": True,
                        "from": from_currency,
                        "to": to_currency,
                        "amount": float(amount),
                        "converted": float(amount) * rate,
                        "rate": rate
                    }
            
            return {
                "result": False,
                "error": "Could not find conversion rate"
            }
        
        except Exception as e:
            print(f"Error during conversion: {str(e)}")
            return {
                "result": False,
                "error": str(e)
            }
    
    def _get_mock_rates(self, base_currency):
        """Return mock exchange rates if API fails"""
        # These are example rates - in production, use real data
        mock_rates = {
            "USD": {
                "EUR": 0.92, "GBP": 0.79, "JPY": 153.43, "CAD": 1.37, "AUD": 1.52
            },
            "EUR": {
                "USD": 1.09, "GBP": 0.86, "JPY": 166.69, "CAD": 1.49, "AUD": 1.65
            },
            "GBP": {
                "USD": 1.27, "EUR": 1.16, "JPY": 194.21, "CAD": 1.74, "AUD": 1.93
            }
        }
        
        # If we don't have mock rates for the requested currency, use USD as fallback
        if base_currency not in mock_rates:
            base_currency = "USD"
        
        # Create a response similar to the API
        return {
            "result": "success",
            "base_code": base_currency,
            "rates": mock_rates[base_currency]
        }

class CurrencyServer(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.converter = CurrencyConverter()
        super().__init__(*args, **kwargs)
    
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Enable CORS
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_url = urlparse(self.path)
        
        # Handle rates endpoint
        if parsed_url.path == '/api/rates':
            query = parse_qs(parsed_url.query)
            base = query.get('base', ['USD'])[0]
            
            data = self.converter.get_exchange_rates(base)
            self._set_headers()
            self.wfile.write(json.dumps(data).encode())
        
        # Handle convert endpoint
        elif parsed_url.path == '/api/convert':
            query = parse_qs(parsed_url.query)
            amount = query.get('amount', ['1'])[0]
            from_currency = query.get('from', ['USD'])[0]
            to_currency = query.get('to', ['EUR'])[0]
            
            data = self.converter.convert(amount, from_currency, to_currency)
            self._set_headers()
            self.wfile.write(json.dumps(data).encode())
        
        # Handle unknown endpoints
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

def run_server(server_class=HTTPServer, handler_class=CurrencyServer, port=8000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting currency converter server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Stopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()