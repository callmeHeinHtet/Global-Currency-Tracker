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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { getCurrencyInfo } from '../utils/currencyData';

const CurrencyWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
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
      setRates(newRates);
    };

    if (watchlist.length > 0) {
      fetchRates();
      // Update rates every minute
      const interval = setInterval(fetchRates, 60000);
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  const handleAddPair = () => {
    const updatedWatchlist = [...watchlist, newPair];
    setWatchlist(updatedWatchlist);
    localStorage.setItem('currencyWatchlist', JSON.stringify(updatedWatchlist));
    setOpenDialog(false);
  };

  const handleRemovePair = (index) => {
    const updatedWatchlist = watchlist.filter((_, i) => i !== index);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('currencyWatchlist', JSON.stringify(updatedWatchlist));
  };

  const formatPairDisplay = (from, to) => {
    const fromInfo = getCurrencyInfo(from);
    const toInfo = getCurrencyInfo(to);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span>{fromInfo.flag}</span>
        <span>{fromInfo.name}</span>
        <span>→</span>
        <span>{toInfo.flag}</span>
        <span>{toInfo.name}</span>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Watchlist</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Pair
        </Button>
      </Box>

      <List>
        {watchlist.map((pair, index) => {
          const rate = rates[`${pair.from}-${pair.to}`];
          const fromInfo = getCurrencyInfo(pair.from);
          const toInfo = getCurrencyInfo(pair.to);
          return (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemovePair(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={formatPairDisplay(pair.from, pair.to)}
                secondary={`Rate: ${fromInfo.symbol}1 = ${toInfo.symbol}${rate?.toFixed(4) || 'Loading...'}`}
              />
            </ListItem>
          );
        })}
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