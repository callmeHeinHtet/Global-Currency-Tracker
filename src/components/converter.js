import React, { useEffect, useState } from 'react';

const API_KEY = 'de83670f89aa3e243182d964'; // Replace with your key from exchangerate-api.com
const API_URL = `https://v6.exchangerate-api.com/v6/${de83670f89aa3e243182d964}/latest/USD`;

function Converter() {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setRates(data.conversion_rates));
  }, []);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const result = (amount / rates[fromCurrency]) * rates[toCurrency];
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  return (
    <div className="converter">
      <div>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
          {Object.keys(rates).map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
        <span>→</span>
        <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
          {Object.keys(rates).map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>
      <h2>
        {amount} {fromCurrency} = {convertedAmount} {toCurrency}
      </h2>
    </div>
  );
}

export default Converter;
