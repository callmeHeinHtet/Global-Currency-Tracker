import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CurrencyConverter from './components/CurrencyConverter';
import ExchangeRateChart from './components/ExchangeRateChart';
import CurrencyWatchlist from './components/CurrencyWatchlist';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(
    localStorage.getItem('themeMode') || (prefersDarkMode ? 'dark' : 'light')
  );
  const [selectedCurrencies, setSelectedCurrencies] = useState({
    from: 'USD',
    to: 'EUR',
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
        },
      }),
    [mode]
  );

  const handleCurrencyChange = (from, to) => {
    setSelectedCurrencies({ from, to });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🌍 Global Currency Tracker
            </Typography>
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <CurrencyConverter
            onCurrencyChange={handleCurrencyChange}
          />
          <ExchangeRateChart
            fromCurrency={selectedCurrencies.from}
            toCurrency={selectedCurrencies.to}
          />
          <CurrencyWatchlist />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
