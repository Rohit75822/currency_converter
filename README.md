# Currency Converter with Glowing UI

A beautiful and functional currency converter with real-time exchange rates, built with React, TypeScript, and Python.

## Features

- Real-time currency conversion with accurate exchange rates
- Support for multiple major world currencies
- Conversion history tracking
- Beautiful interface with glow effects
- Responsive design that works across all devices
- Visual feedback during currency conversion
- Exchange rate data display
- One-click rate refresh

## Tech Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS with custom CSS for glow effects
- Backend: Python HTTP server
- State Management: React Hooks
- Icons: Lucide React

## Getting Started

### Running the Frontend

```bash
npm run dev
```

### Running the Python Backend (Optional)

```bash
cd server
python currency_converter.py
```

## Project Structure

- `/src` - Frontend React application
  - `/components` - UI components
  - `/services` - API services
  - `/hooks` - Custom React hooks
  - `/data` - Static data
- `/server` - Python backend for currency conversion

## How It Works

The application uses a Python backend to fetch real-time currency data from exchange rate APIs. The frontend is built with React and styled with Tailwind CSS and custom CSS for the glow effects. The application supports conversion between major world currencies with accurate exchange rates.

## Credits

- Exchange rate data: Open Exchange Rates API (simulated)
- Icons: Lucide React
- UI Design: Custom implementation with Tailwind CSS