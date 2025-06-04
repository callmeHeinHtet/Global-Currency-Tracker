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
  alpha,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import axios from 'axios';
import { getCurrencyInfo, currencyData } from '../utils/currencyData';

const CurrencyConverter = ({ onCurrencyChange, initialFromCurrency = 'USD', initialToCurrency = 'EUR' }) => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    setFromCurrency(initialFromCurrency);
    setToCurrency(initialToCurrency);
  }, [initialFromCurrency, initialToCurrency]);

  useEffect(() => {
    // Fetch available currencies
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const availableCurrencies = Object.keys(response.data.rates)
          .filter(code => currencyData[code])
          .sort((a, b) => currencyData[a].name.localeCompare(currencyData[b].name));
        setCurrencies(availableCurrencies);
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

  const handleFromCurrencyChange = (event) => {
    const newFromCurrency = event.target.value;
    setFromCurrency(newFromCurrency);
  };

  const handleToCurrencyChange = (event) => {
    const newToCurrency = event.target.value;
    setToCurrency(newToCurrency);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = amount * exchangeRate;
  const fromCurrencyInfo = getCurrencyInfo(fromCurrency);
  const toCurrencyInfo = getCurrencyInfo(toCurrency);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        maxWidth: '100%',
        width: '100%',
        mt: 3,
        overflow: 'hidden',
        background: (theme) => 
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)',
        border: (theme) => `1px solid ${
          theme.palette.mode === 'dark' 
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(theme.palette.common.black, 0.1)
        }`,
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          mb: 3,
          color: (theme) => theme.palette.mode === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 700,
        }}
      >
        Currency Converter
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.white, 0.9),
              borderRadius: 2,
              '&:hover': {
                bgcolor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.common.white, 1),
              },
            },
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          width: '100%',
        }}>
          <Select
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            sx={{
              flex: 1,
              bgcolor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.white, 0.9),
              borderRadius: 2,
              '&:hover': {
                bgcolor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.common.white, 1),
              },
            }}
          >
            {currencies.map((currency) => {
              const info = getCurrencyInfo(currency);
              return (
                <MenuItem key={currency} value={currency}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    py: 0.5,
                  }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                      {info.flag}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currency}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {info.name}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>

          <IconButton 
            onClick={handleSwapCurrencies}
            className="swap-button"
            sx={{
              p: 1.5,
              bgcolor: (theme) => theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            <SwapHorizIcon />
          </IconButton>

          <Select
            value={toCurrency}
            onChange={handleToCurrencyChange}
            sx={{
              flex: 1,
              bgcolor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.white, 0.9),
              borderRadius: 2,
              '&:hover': {
                bgcolor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.common.white, 1),
              },
            }}
          >
            {currencies.map((currency) => {
              const info = getCurrencyInfo(currency);
              return (
                <MenuItem key={currency} value={currency}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    py: 0.5,
                  }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                      {info.flag}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currency}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {info.name}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        <Box sx={{ 
          mt: 2, 
          p: 3,
          borderRadius: 2,
          bgcolor: (theme) => 
            theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.white, 0.9),
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Exchange Rate
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: (theme) => theme.palette.primary.main,
            }}>
              {fromCurrencyInfo.symbol}{amount} = {toCurrencyInfo.symbol}{convertedAmount?.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CurrencyConverter; 