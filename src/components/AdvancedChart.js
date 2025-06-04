import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  Skeleton,
  alpha,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from 'axios';
import { getCurrencyInfo } from '../utils/currencyData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TIMEFRAMES = {
  '1D': { days: 1, label: '1 Day' },
  '1W': { days: 7, label: '1 Week' },
  '1M': { days: 30, label: '1 Month' },
  '3M': { days: 90, label: '3 Months' },
  '1Y': { days: 365, label: '1 Year' },
};

const INDICATORS = {
  'None': [],
  'SMA': [{ name: 'Simple Moving Average', period: 7, color: '#10B981' }],
  'EMA': [{ name: 'Exponential Moving Average', period: 7, color: '#F59E0B' }],
  'Both': [
    { name: 'Simple Moving Average', period: 7, color: '#10B981' },
    { name: 'Exponential Moving Average', period: 7, color: '#F59E0B' }
  ]
};

const calculateSMA = (data, period) => {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

const calculateEMA = (data, period) => {
  const ema = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA uses SMA as initial value
  const firstSMA = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(firstSMA);
  
  for (let i = 1; i < data.length; i++) {
    const currentEMA = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    ema.push(currentEMA);
  }
  
  // Add null values at the start to align with the data
  const nullValues = Array(period - 1).fill(null);
  return [...nullValues, ...ema];
};

const AdvancedChart = ({ fromCurrency = 'USD', toCurrency = 'EUR' }) => {
  const [timeframe, setTimeframe] = useState('1W');
  const [indicator, setIndicator] = useState('None');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Exchange Rate',
      data: [],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHitRadius: 10,
      borderWidth: 2,
    }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [percentageChange, setPercentageChange] = useState(0);
  const [highLow, setHighLow] = useState({ high: 0, low: 0 });

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!fromCurrency || !toCurrency) return;
      
      setLoading(true);
      setError(null);
      try {
        const { days } = TIMEFRAMES[timeframe];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Format dates for API
        const endDateStr = endDate.toISOString().split('T')[0];
        const startDateStr = startDate.toISOString().split('T')[0];

        // Try Frankfurter API first
        try {
          const response = await axios.get(
            `https://api.frankfurter.app/${startDateStr}..${endDateStr}?from=${fromCurrency}&to=${toCurrency}`
          );

          if (response.data && response.data.rates) {
            const dates = [];
            const rates = [];

            // Sort dates to ensure chronological order
            const sortedDates = Object.keys(response.data.rates).sort();
            
            sortedDates.forEach(date => {
              dates.push(date);
              rates.push(response.data.rates[date][toCurrency]);
            });

            if (rates.length < 2) {
              throw new Error('Insufficient data points');
            }

            // Calculate percentage change and high/low
            const firstValidRate = rates[0];
            const lastValidRate = rates[rates.length - 1];
            const change = ((lastValidRate - firstValidRate) / firstValidRate) * 100;
            setPercentageChange(change);

            setHighLow({
              high: Math.max(...rates),
              low: Math.min(...rates)
            });

            // Create gradient background
            const getGradient = (ctx) => {
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              if (change >= 0) {
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');  // Green
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
              } else {
                gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');   // Red
                gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
              }
              return gradient;
            };

            // Create datasets array
            const datasets = [
              {
                label: 'Exchange Rate',
                data: rates,
                borderColor: change >= 0 ? '#10B981' : '#EF4444',
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  return getGradient(ctx);
                },
                fill: true,
                tension: 0.4,
                pointRadius: (ctx) => {
                  const index = ctx.dataIndex;
                  return index === 0 || index === rates.length - 1 ? 4 : 0;
                },
                pointBackgroundColor: change >= 0 ? '#10B981' : '#EF4444',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointHitRadius: 10,
                borderWidth: 2,
              }
            ];

            // Add technical indicators if selected
            if (indicator === 'SMA' || indicator === 'Both') {
              const smaData = calculateSMA(rates, 7);
              if (smaData.some(val => val !== null)) {
                datasets.push({
                  label: 'SMA (7)',
                  data: smaData,
                  borderColor: '#6366F1',
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: false,
                });
              }
            }

            if (indicator === 'EMA' || indicator === 'Both') {
              const emaData = calculateEMA(rates, 7);
              if (emaData.some(val => val !== null)) {
                datasets.push({
                  label: 'EMA (7)',
                  data: emaData,
                  borderColor: '#F59E0B',
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: false,
                });
              }
            }

            setChartData({
              labels: dates,
              datasets,
            });
            setLoading(false);
          } else {
            throw new Error('Invalid API response format');
          }
        } catch (error) {
          // If Frankfurter API fails, try alternative API or show error
          console.error('Error with Frankfurter API:', error);
          setError('This currency pair is not supported or there was an error fetching the data.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchHistoricalData:', error);
        setError('Failed to load chart data. Please try again later.');
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [fromCurrency, toCurrency, timeframe, indicator]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Exchange Rate Trend
          </Typography>
          {error ? (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: percentageChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • High: {highLow.high.toFixed(4)} • Low: {highLow.low.toFixed(4)}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            size="small"
            sx={{
              minWidth: 120,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {Object.keys(INDICATORS).map((ind) => (
              <MenuItem key={ind} value={ind}>
                {ind}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={(e, newValue) => newValue && setTimeframe(newValue)}
          sx={{
            '& .MuiToggleButton-root': {
              border: 'none',
              mx: 0.5,
              borderRadius: '8px !important',
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
        >
          {Object.keys(TIMEFRAMES).map((tf) => (
            <ToggleButton
              key={tf}
              value={tf}
              sx={{
                px: 2,
                py: 0.5,
                fontSize: '0.875rem',
              }}
            >
              {TIMEFRAMES[tf].label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: 400,
          position: 'relative',
        }}
      >
        {loading ? (
          <Skeleton 
            variant="rectangular" 
            height={400} 
            sx={{ 
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ) : (
          chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 750,
                  easing: 'easeInOutQuart'
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      maxRotation: 0,
                      autoSkip: true,
                      maxTicksLimit: 10,
                    },
                  },
                  y: {
                    grid: {
                      color: 'rgba(128, 128, 128, 0.1)',
                    },
                    ticks: {
                      callback: (value) => value.toFixed(4),
                    },
                    beginAtZero: false,
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                      boxWidth: 12,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                      size: 14,
                      weight: 'bold',
                    },
                    bodyFont: {
                      size: 13,
                    },
                    bodySpacing: 8,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value.toFixed(4)}`;
                      },
                    },
                  },
                },
              }}
            />
          )
        )}
      </Box>
    </Paper>
  );
};

export default AdvancedChart; 