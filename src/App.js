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
  Grid,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CurrencyConverter from './components/CurrencyConverter';
import AdvancedChart from './components/AdvancedChart';
import CurrencyWatchlist from './components/CurrencyWatchlist';
import CurrencyNews from './components/CurrencyNews';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const [selectedCurrencies, setSelectedCurrencies] = useState({
    from: 'USD',
    to: 'EUR'
  });

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563EB',
            light: '#60A5FA',
            dark: '#1E40AF',
          },
          secondary: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
          background: {
            default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
            paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#F1F5F9' : '#1E293B',
            secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
          },
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          },
          h6: {
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: mode === 'dark' 
                  ? '0 4px 6px -1px rgb(0 0 0 / 0.3)'
                  : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '10px 24px',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode],
  );

  const handleCurrencyChange = (from, to) => {
    setSelectedCurrencies({ from, to });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}>
        <AppBar 
          position="static" 
          color="transparent" 
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Global Currency Tracker
            </Typography>
            <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CurrencyConverter 
                onCurrencyChange={handleCurrencyChange}
                initialFromCurrency={selectedCurrencies.from}
                initialToCurrency={selectedCurrencies.to}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CurrencyWatchlist onCurrencySelect={handleCurrencyChange} />
            </Grid>
            <Grid item xs={12}>
              <AdvancedChart 
                fromCurrency={selectedCurrencies.from} 
                toCurrency={selectedCurrencies.to}
              />
            </Grid>
            <Grid item xs={12}>
              <CurrencyNews 
                fromCurrency={selectedCurrencies.from}
                toCurrency={selectedCurrencies.to}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
