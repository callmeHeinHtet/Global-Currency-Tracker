import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Box,
  Chip,
  Skeleton,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { getCurrencyInfo } from '../utils/currencyData';

const CurrencyNews = ({ fromCurrency, toCurrency }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  // Simulated news data (replace with actual API call when available)
  const fetchNews = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fromInfo = getCurrencyInfo(fromCurrency);
      const toInfo = getCurrencyInfo(toCurrency);
      
      // Simulated news data
      const mockNews = [
        {
          id: 1,
          title: `${fromInfo.name} Strengthens Against ${toInfo.name}`,
          summary: `Recent economic data shows strong performance in ${fromInfo.region}, leading to gains against ${toInfo.name}.`,
          source: 'Financial Times',
          url: 'https://ft.com',
          date: new Date().toLocaleDateString(),
          sentiment: 'positive',
          impact: 'high'
        },
        {
          id: 2,
          title: `${fromInfo.centralBank} Maintains Interest Rates`,
          summary: `The ${fromInfo.centralBank} has decided to maintain current interest rates, citing stable inflation and economic growth.`,
          source: 'Reuters',
          url: 'https://reuters.com',
          date: new Date().toLocaleDateString(),
          sentiment: 'neutral',
          impact: 'medium'
        },
        {
          id: 3,
          title: `Trade Balance Impact on ${toInfo.name}`,
          summary: `${toInfo.region}'s trade balance figures show a deficit, potentially affecting ${toInfo.name} exchange rates.`,
          source: 'Bloomberg',
          url: 'https://bloomberg.com',
          date: new Date().toLocaleDateString(),
          sentiment: 'negative',
          impact: 'medium'
        }
      ];

      setNews(mockNews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [fromCurrency, toCurrency]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleExpandClick = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Market News & Analysis
      </Typography>

      <List>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <ListItem key={index} divider>
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </ListItem>
          ))
        ) : (
          news.map((item) => (
            <ListItem
              key={item.id}
              divider
              sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`Sentiment: ${item.sentiment}`}
                          size="small"
                          color={getSentimentColor(item.sentiment)}
                        />
                        <Chip
                          label={`Impact: ${item.impact}`}
                          size="small"
                          color={getImpactColor(item.impact)}
                        />
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.summary}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Source: {item.source} • {item.date}
                        </Typography>
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </Link>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleExpandClick(item.id)}
                  >
                    {expanded[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                  <Link href={item.url} target="_blank" rel="noopener">
                    <IconButton size="small">
                      <OpenInNewIcon />
                    </IconButton>
                  </Link>
                </Box>
              </Box>
              
              <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mt: 1 }}>
                  <Typography variant="body2" paragraph>
                    {item.summary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Source: {item.source} | {item.date}
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default CurrencyNews; 