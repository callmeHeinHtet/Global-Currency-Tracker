import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import axios from 'axios';
import { getCurrencyInfo } from '../utils/currencyData';

const CurrencyConverter = ({ onCurrencyChange }) => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Fetch available currencies
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        setCurrencies(Object.keys(response.data.rates));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    // Fetch exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        setExchangeRate(response.data.rates[toCurrency]);
        if (onCurrencyChange) {
          onCurrencyChange(fromCurrency, toCurrency);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, onCurrencyChange]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = amount * exchangeRate;
  const fromCurrencyInfo = getCurrencyInfo(fromCurrency);
  const toCurrencyInfo = getCurrencyInfo(toCurrency);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Currency Converter
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {fromCurrencyInfo.symbol}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          fullWidth
        >
          {currencies.map((currency) => {
            const info = getCurrencyInfo(currency);
            return (
              <MenuItem key={currency} value={currency}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{info.flag}</span>
                  <span>{info.name}</span>
                </Box>
              </MenuItem>
            );
          })}
        </Select>

        <IconButton onClick={handleSwapCurrencies}>
          <SwapHorizIcon />
        </IconButton>

        <Select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          fullWidth
        >
          {currencies.map((currency) => {
            const info = getCurrencyInfo(currency);
            return (
              <MenuItem key={currency} value={currency}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{info.flag}</span>
                  <span>{info.name}</span>
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="h6">
          {fromCurrencyInfo.symbol}{amount} {fromCurrencyInfo.name} = {toCurrencyInfo.symbol}{convertedAmount?.toFixed(2)} {toCurrencyInfo.name}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CurrencyConverter; 