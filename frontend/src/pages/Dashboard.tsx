import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  QueryStats as AnalyticsIcon,
  TrendingUp as TrendingIcon,
  Speed as SpeedIcon,
  Add as AddIcon,
  PlayArrow as TestIcon,
  BarChart as ChartIcon,
  ContentCopy as ContentIcon,
  Telegram as TelegramIcon,
} from '@mui/icons-material';
import { botsAPI, analyticsAPI } from '../services/api';
import CreateBotDialog from '../components/CreateBotDialog';
import BotAnalytics from '../components/BotAnalytics';
import BotTester from '../components/BotTester';
import BotContentManager from '../components/BotContentManager';
import AppHeader from '../components/AppHeader';
import TelegramIntegration from '../components/TelegramIntegration';

interface Bot {
  id: number;
  name: string;
  website_url: string;
  description?: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  channels: string[];
  language: string;
  created_at: string;
  last_trained?: string;
  total_queries: number;
  accuracy_score?: number;
}

interface AnalyticsOverview {
  total_bots: number;
  total_queries: number;
  active_users: number;
  accuracy_avg: number;
  response_time_avg: number;
}

const Dashboard: React.FC = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [dialogType, setDialogType] = useState<'analytics' | 'test' | 'content' | null>(null);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [botsData, analyticsData] = await Promise.all([
        botsAPI.getBots(),
        analyticsAPI.getOverview(),
      ]);
      setBots(botsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'training':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreateBot = () => {
    setCreateDialogOpen(true);
  };

  const handleBotCreated = () => {
    loadDashboardData();
  };

  const handleViewAnalytics = (bot: Bot) => {
    setSelectedBot(bot);
    setDialogType('analytics');
  };

  const handleTestBot = (bot: Bot) => {
    setSelectedBot(bot);
    setDialogType('test');
  };

  const handleManageContent = (bot: Bot) => {
    setSelectedBot(bot);
    setDialogType('content');
  };

  const handleCloseDialog = () => {
    setSelectedBot(null);
    setDialogType(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      <AppHeader />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your FAQ bots and monitor performance
        </Typography>
      </Box>

      {/* Analytics Overview */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BotIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {analytics.total_bots}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Bots
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
                  <AnalyticsIcon color="primary" sx={{ mr: 2 }} />
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
                  <TrendingIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {(analytics.accuracy_avg * 100).toFixed(1)}%
                    </Typography>
                    <Typography color="text.secondary">
                      Avg Accuracy
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
                  <SpeedIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {analytics.response_time_avg.toFixed(1)}s
                    </Typography>
                    <Typography color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Bots List */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2">
            Your Bots
          </Typography>
          <Box display="flex" gap={2}>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<TelegramIcon />}
              onClick={() => setTelegramDialogOpen(true)}
            >
              Telegram Integration
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateBot}
            >
              Create New Bot
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          {bots.map((bot) => (
            <Grid item xs={12} md={6} lg={4} key={bot.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {bot.name}
                    </Typography>
                    <Chip
                      label={bot.status}
                      color={getStatusColor(bot.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {bot.description || 'No description provided'}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Website:</strong> {bot.website_url}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Channels:</strong> {bot.channels.join(', ')}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Language:</strong> {bot.language.toUpperCase()}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Queries:</strong> {bot.total_queries.toLocaleString()}
                  </Typography>
                  
                  {bot.accuracy_score && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Accuracy:</strong> {(bot.accuracy_score * 100).toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={bot.accuracy_score * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(bot.created_at)}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    startIcon={<ChartIcon />}
                    onClick={() => handleViewAnalytics(bot)}
                  >
                    Analytics
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary"
                    startIcon={<TestIcon />}
                    onClick={() => handleTestBot(bot)}
                  >
                    Test
                  </Button>
                  <Button 
                    size="small" 
                    color="info"
                    startIcon={<ContentIcon />}
                    onClick={() => handleManageContent(bot)}
                  >
                    Content
                  </Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Create Bot Dialog */}
      <CreateBotDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onBotCreated={handleBotCreated}
      />

      {/* Bot Analytics Dialog */}
      <Dialog
        open={dialogType === 'analytics' && selectedBot !== null}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Bot Analytics</DialogTitle>
        <DialogContent>
          {selectedBot && (
            <BotAnalytics
              botId={selectedBot.id}
              botName={selectedBot.name}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bot Tester Dialog */}
      <Dialog
        open={dialogType === 'test' && selectedBot !== null}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Test Bot</DialogTitle>
        <DialogContent>
          {selectedBot && (
            <BotTester
              botId={selectedBot.id}
              botName={selectedBot.name}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bot Content Manager Dialog */}
      <Dialog
        open={dialogType === 'content' && selectedBot !== null}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Manage Bot Content</DialogTitle>
        <DialogContent>
          {selectedBot && (
            <BotContentManager
              botId={selectedBot.id}
              botName={selectedBot.name}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Telegram Integration Dialog */}
      <TelegramIntegration
        open={telegramDialogOpen}
        onClose={() => setTelegramDialogOpen(false)}
      />
      </Container>
    </Box>
  );
};

export default Dashboard;
