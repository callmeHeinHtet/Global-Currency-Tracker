export const currencyData = {
  USD: {
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸'
  },
  EUR: {
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺'
  },
  GBP: {
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧'
  },
  JPY: {
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵'
  },
  THB: {
    name: 'Thai Baht',
    symbol: '฿',
    flag: '🇹🇭'
  },
  PHP: {
    name: 'Philippine Peso',
    symbol: '₱',
    flag: '🇵🇭'
  },
  AUD: {
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺'
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦'
  },
  CHF: {
    name: 'Swiss Franc',
    symbol: 'Fr',
    flag: '🇨🇭'
  },
  CNY: {
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳'
  },
  HKD: {
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    flag: '🇭🇰'
  },
  NZD: {
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    flag: '🇳🇿'
  },
  SEK: {
    name: 'Swedish Krona',
    symbol: 'kr',
    flag: '🇸🇪'
  },
  KRW: {
    name: 'South Korean Won',
    symbol: '₩',
    flag: '🇰🇷'
  },
  SGD: {
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬'
  },
  INR: {
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳'
  },
  MYR: {
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾'
  },
  IDR: {
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    flag: '🇮🇩'
  }
};

export const getCurrencyInfo = (code) => {
  return currencyData[code] || {
    name: code,
    symbol: code,
    flag: '🏳️'
  };
}; 