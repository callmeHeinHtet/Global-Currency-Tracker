import React, { useState, useEffect } from 'react';
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
} from 'chart.js';
import { Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import { getCurrencyInfo } from '../utils/currencyData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExchangeRateChart = ({ fromCurrency, toCurrency }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        // Get data for the last 7 days
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const rates = [];
        for (const date of dates) {
          const response = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
          );
          rates.push(response.data.rates[toCurrency]);
        }

        const fromInfo = getCurrencyInfo(fromCurrency);
        const toInfo = getCurrencyInfo(toCurrency);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: `${fromInfo.name} to ${toInfo.name} Exchange Rate`,
              data: rates,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchHistoricalData();
    }
  }, [fromCurrency, toCurrency]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '7-Day Exchange Rate History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Exchange Rate Trend
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {fromInfo.flag} {fromInfo.name} to {toInfo.flag} {toInfo.name}
        </Typography>
      </Box>
      <Line options={options} data={chartData} />
    </Paper>
  );
};

export default ExchangeRateChart; 