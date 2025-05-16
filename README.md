# Global Currency Tracker

A modern web application for tracking real-time currency exchange rates, converting between currencies, and monitoring your favorite currency pairs.

## Features

- 🔄 Real-time currency conversion
- 📈 Historical exchange rate charts (7-day history)
- 📋 Currency pair watchlist with auto-refresh
- 🌓 Dark/light mode with system preference detection
- 💾 Persistent settings (watchlist and theme preference)
- 🌐 Powered by ExchangeRate-API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/callmeHeinHtet/global-currency-tracker.git
cd global-currency-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

### Currency Converter
- Enter the amount you want to convert
- Select the source and target currencies
- View the converted amount in real-time
- Use the swap button to quickly reverse the conversion

### Exchange Rate Chart
- View the 7-day historical exchange rate trend
- The chart updates automatically when you change currencies in the converter

### Currency Watchlist
- Add your favorite currency pairs to the watchlist
- Rates update automatically every minute
- Watchlist persists across browser sessions
- Remove pairs you no longer want to track

### Theme Switching
- Click the sun/moon icon in the top-right corner to switch between light and dark modes
- The app remembers your preference for future visits
- Automatically matches your system theme preference on first visit

## Technologies Used

- React
- Material-UI
- Chart.js
- Axios
- ExchangeRate-API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ExchangeRate-API for providing exchange rate data
- Material-UI for the beautiful component library
- Chart.js for the interactive charts 
