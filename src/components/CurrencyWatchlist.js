import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Box,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { getCurrencyInfo, currencyData } from '../utils/currencyData';
import { alpha } from '@mui/material/styles';

const CurrencyWatchlist = ({ onCurrencySelect }) => {
  const [watchlist, setWatchlist] = useState([
    { from: 'USD', to: 'EUR', rate: null }
  ]);
  const [currencies, setCurrencies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPair, setNewPair] = useState({
    from: 'USD',
    to: 'EUR',
  });

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('currencyWatchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    // Use the same currency data source as CurrencyConverter
    const availableCurrencies = Object.keys(currencyData)
      .sort((a, b) => currencyData[a].name.localeCompare(currencyData[b].name));
    setCurrencies(availableCurrencies);
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      const newRates = {};
      for (const pair of watchlist) {
        try {
          const response = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/${pair.from}`
          );
          newRates[`${pair.from}-${pair.to}`] = response.data.rates[pair.to];
        } catch (error) {
          console.error('Error fetching rate:', error);
        }
      }
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((pair) => ({
          ...pair,
          rate: newRates[`${pair.from}-${pair.to}`] || 0,
        }))
      );
    };

    if (watchlist.length > 0) {
      fetchRates();
      // Update rates every minute
      const interval = setInterval(fetchRates, 60000);
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  const handleAddPair = () => {
    const updatedWatchlist = [...watchlist, {
      ...newPair,
      rate: null
    }];
    setWatchlist(updatedWatchlist);
    localStorage.setItem('currencyWatchlist', JSON.stringify(updatedWatchlist));
    setOpenDialog(false);
  };

  const handleDelete = (index) => {
    const updatedWatchlist = watchlist.filter((_, i) => i !== index);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('currencyWatchlist', JSON.stringify(updatedWatchlist));
  };

  const handlePairClick = (from, to) => {
    if (onCurrencySelect) {
      onCurrencySelect(from, to);
    }
  };

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
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Currency Watchlist
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Add Pair
        </Button>
      </Box>

      <List sx={{ width: '100%' }}>
        {watchlist.map((pair, index) => (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.white, 0.9),
                borderRadius: 2,
                mb: 1,
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.08)
                      : alpha(theme.palette.common.white, 0.95),
                },
              }}
              onClick={() => handlePairClick(pair.from, pair.to)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {pair.from}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    →
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {pair.to}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {getCurrencyInfo(pair.from).name} to {getCurrencyInfo(pair.to).name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                  }}
                >
                  Rate: {getCurrencyInfo(pair.from).symbol}1 = {pair.rate ? pair.rate.toFixed(4) : 'Loading...'} {pair.to}
                </Typography>
              </Box>
            </ListItem>
            {index < watchlist.length - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Currency Pair</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Select
              value={newPair.from}
              onChange={(e) => setNewPair({ ...newPair, from: e.target.value })}
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
            <Select
              value={newPair.to}
              onChange={(e) => setNewPair({ ...newPair, to: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPair} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CurrencyWatchlist; 