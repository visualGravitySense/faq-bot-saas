import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  QueryStats,
  Speed,
  Language,
  SmartToy,
} from '@mui/icons-material';
import { botsAPI, analyticsAPI } from '../services/api';

interface BotAnalyticsProps {
  botId: number;
  botName: string;
}

interface BotAnalyticsData {
  bot_id: number;
  total_queries: number;
  accuracy_score: number;
  status: string;
  last_trained: string;
  daily_queries: number;
  weekly_queries: number;
  monthly_queries: number;
  top_questions: Array<{
    question: string;
    count: number;
    accuracy: number;
  }>;
  response_times: {
    average: number;
    min: number;
    max: number;
  };
}

const BotAnalytics: React.FC<BotAnalyticsProps> = ({ botId, botName }) => {
  const [analytics, setAnalytics] = useState<BotAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, [botId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await botsAPI.getBotAnalytics(botId);
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Analytics: {botName}
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Performance" />
        <Tab label="Top Questions" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <QueryStats color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {analytics.total_queries.toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Queries
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUp color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {(analytics.accuracy_score * 100).toFixed(1)}%
                    </Typography>
                    <Typography color="text.secondary">
                      Accuracy Score
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Speed color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {analytics.response_times.average.toFixed(1)}s
                    </Typography>
                    <Typography color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SmartToy color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Chip
                      label={analytics.status}
                      color={analytics.status === 'active' ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Bot Status
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Query Volume
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Daily: {analytics.daily_queries} queries
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(analytics.daily_queries / 100) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Weekly: {analytics.weekly_queries} queries
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(analytics.weekly_queries / 1000) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Monthly: {analytics.monthly_queries} queries
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(analytics.monthly_queries / 5000) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Response Times
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Average: {analytics.response_times.average}s
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((analytics.response_times.average / 5) * 100, 100)}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fastest: {analytics.response_times.min}s
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Slowest: {analytics.response_times.max}s
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Most Frequently Asked Questions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Accuracy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.top_questions.map((question, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2">
                          {question.question}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={question.count}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {(question.accuracy * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={question.accuracy * 100}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BotAnalytics;
