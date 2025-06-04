export const currencyData = {
  USD: {
    name: 'USA Dollar',
    symbol: '$',
    flag: '🇺🇸',
    description: 'The world\'s primary reserve currency',
    centralBank: 'Federal Reserve System',
    region: 'USA'
  },
  EUR: {
    name: 'European Union Euro',
    symbol: '€',
    flag: '🇪🇺',
    description: 'Official currency of the European Union',
    centralBank: 'European Central Bank',
    region: 'European Union'
  },
  GBP: {
    name: 'British Pound Sterling',
    symbol: '£',
    flag: '🇬🇧',
    description: 'The United Kingdom\'s official currency',
    centralBank: 'Bank of England',
    region: 'United Kingdom'
  },
  JPY: {
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    description: 'Japan\'s official currency',
    centralBank: 'Bank of Japan',
    region: 'Japan'
  },
  THB: {
    name: 'Thailand Baht',
    symbol: '฿',
    flag: '🇹🇭',
    description: 'Thailand\'s official currency',
    centralBank: 'Bank of Thailand',
    region: 'Thailand'
  },
  PHP: {
    name: 'Philippines Peso',
    symbol: '₱',
    flag: '🇵🇭',
    description: 'The Philippines\' official currency',
    centralBank: 'Bangko Sentral ng Pilipinas',
    region: 'Philippines'
  },
  AUD: {
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    description: 'Australia\'s official currency',
    centralBank: 'Reserve Bank of Australia',
    region: 'Australia'
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦',
    description: 'Canada\'s official currency',
    centralBank: 'Bank of Canada',
    region: 'Canada'
  },
  CHF: {
    name: 'Swiss Franc',
    symbol: 'Fr',
    flag: '🇨🇭',
    description: 'Switzerland\'s official currency',
    centralBank: 'Swiss National Bank',
    region: 'Switzerland'
  },
  CNY: {
    name: 'Chinese Yuan Renminbi',
    symbol: '¥',
    flag: '🇨🇳',
    description: 'China\'s official currency',
    centralBank: 'People\'s Bank of China',
    region: 'China'
  },
  HKD: {
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    flag: '🇭🇰',
    description: 'Hong Kong\'s official currency',
    centralBank: 'Hong Kong Monetary Authority',
    region: 'Hong Kong'
  },
  NZD: {
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    flag: '🇳🇿',
    description: 'New Zealand\'s official currency',
    centralBank: 'Reserve Bank of New Zealand',
    region: 'New Zealand'
  },
  SEK: {
    name: 'Swedish Krona',
    symbol: 'kr',
    flag: '🇸🇪',
    description: 'Sweden\'s official currency',
    centralBank: 'Sveriges Riksbank',
    region: 'Sweden'
  },
  KRW: {
    name: 'South Korean Won',
    symbol: '₩',
    flag: '🇰🇷',
    description: 'South Korea\'s official currency',
    centralBank: 'Bank of Korea',
    region: 'South Korea'
  },
  SGD: {
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    description: 'Singapore\'s official currency',
    centralBank: 'Monetary Authority of Singapore',
    region: 'Singapore'
  },
  INR: {
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    description: 'India\'s official currency',
    centralBank: 'Reserve Bank of India',
    region: 'India'
  },
  MYR: {
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾',
    description: 'Malaysia\'s official currency',
    centralBank: 'Bank Negara Malaysia',
    region: 'Malaysia'
  },
  IDR: {
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    flag: '🇮🇩',
    description: 'Indonesia\'s official currency',
    centralBank: 'Bank Indonesia',
    region: 'Indonesia'
  },
  VND: {
    name: 'Vietnamese Dong',
    symbol: '₫',
    flag: '🇻🇳',
    description: 'Vietnam\'s official currency',
    centralBank: 'State Bank of Vietnam',
    region: 'Vietnam'
  },
  MMK: {
    name: 'Myanmar Kyat',
    symbol: 'K',
    flag: '🇲🇲',
    description: 'Myanmar\'s official currency',
    centralBank: 'Central Bank of Myanmar',
    region: 'Myanmar'
  },
  LAK: {
    name: 'Lao Kip',
    symbol: '₭',
    flag: '🇱🇦',
    description: 'Laos\'s official currency',
    centralBank: 'Bank of the Lao P.D.R.',
    region: 'Laos'
  },
  KHR: {
    name: 'Cambodian Riel',
    symbol: '៛',
    flag: '🇰🇭',
    description: 'Cambodia\'s official currency',
    centralBank: 'National Bank of Cambodia',
    region: 'Cambodia'
  },
  BND: {
    name: 'Brunei Dollar',
    symbol: 'B$',
    flag: '🇧🇳',
    description: 'Brunei\'s official currency',
    centralBank: 'Monetary Authority of Brunei Darussalam',
    region: 'Brunei'
  }
};

export const getCurrencyInfo = (code) => {
  return currencyData[code] || {
    name: code,
    symbol: code,
    flag: '🏳️',
    description: 'Currency information not available',
    centralBank: 'Unknown',
    region: 'Unknown'
  };
}; 