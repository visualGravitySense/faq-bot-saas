import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Telegram as TelegramIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { telegramAPI } from '../services/api';

interface TelegramBot {
  bot_id: number;
  bot_name: string;
  is_active: boolean;
  total_queries: number;
}

interface TelegramStats {
  active_bots: number;
  total_queries: number;
  active_users: number;
  bots: number[];
}

interface TelegramIntegrationProps {
  open: boolean;
  onClose: () => void;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({ open, onClose }) => {
  const [bots, setBots] = useState<TelegramBot[]>([]);
  const [stats, setStats] = useState<TelegramStats | null>(null);
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New bot form
  const [newBot, setNewBot] = useState({
    bot_id: '',
    bot_name: '',
    bot_token: '',
    webhook_url: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [botsResponse, statsResponse, statusResponse] = await Promise.all([
        telegramAPI.getBots(),
        telegramAPI.getStats(),
        telegramAPI.getStatus()
      ]);
      
      setBots(botsResponse.data.bots || []);
      setStats(statsResponse.data);
      setIsServiceRunning(statusResponse.data.is_running);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load Telegram data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartService = async () => {
    setLoading(true);
    try {
      await telegramAPI.startService();
      setIsServiceRunning(true);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start service');
    } finally {
      setLoading(false);
    }
  };

  const handleStopService = async () => {
    setLoading(true);
    try {
      await telegramAPI.stopService();
      setIsServiceRunning(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to stop service');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBot = async () => {
    if (!newBot.bot_id || !newBot.bot_name) {
      setError('Bot ID and name are required');
      return;
    }

    setLoading(true);
    try {
      await telegramAPI.registerBot({
        bot_id: parseInt(newBot.bot_id),
        bot_name: newBot.bot_name,
        bot_token: newBot.bot_token || undefined,
        webhook_url: newBot.webhook_url || undefined
      });
      
      setNewBot({ bot_id: '', bot_name: '', bot_token: '', webhook_url: '' });
      setShowAddForm(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add bot');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBot = async (botId: number) => {
    setLoading(true);
    try {
      await telegramAPI.unregisterBot(botId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove bot');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <TelegramIcon color="primary" />
          <Typography variant="h6">Telegram Bot Integration</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Service Status */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Service Status</Typography>
              <Box display="flex" gap={1}>
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
                {isServiceRunning ? (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={handleStopService}
                    disabled={loading}
                  >
                    Stop Service
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayIcon />}
                    onClick={handleStartService}
                    disabled={loading}
                  >
                    Start Service
                  </Button>
                )}
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={isServiceRunning ? "Running" : "Stopped"}
                color={isServiceRunning ? "success" : "default"}
                size="small"
              />
              {loading && <CircularProgress size={20} />}
            </Box>
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {stats.active_bots}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Bots
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary">
                      {stats.total_queries}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Queries
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {stats.active_users}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Bot Management */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Registered Bots</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddForm(true)}
                disabled={!isServiceRunning}
              >
                Add Bot
              </Button>
            </Box>

            {showAddForm && (
              <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Add New Bot</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Bot ID"
                      value={newBot.bot_id}
                      onChange={(e) => setNewBot({ ...newBot, bot_id: e.target.value })}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Bot Name"
                      value={newBot.bot_name}
                      onChange={(e) => setNewBot({ ...newBot, bot_name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Bot Token (Optional)"
                      value={newBot.bot_token}
                      onChange={(e) => setNewBot({ ...newBot, bot_token: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Webhook URL (Optional)"
                      value={newBot.webhook_url}
                      onChange={(e) => setNewBot({ ...newBot, webhook_url: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" gap={1} mt={2}>
                  <Button variant="contained" onClick={handleAddBot} disabled={loading}>
                    Add Bot
                  </Button>
                  <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
                </Box>
              </Box>
            )}

            {bots.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No bots registered. Add a bot to get started.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {bots.map((bot) => (
                  <Grid item xs={12} sm={6} md={4} key={bot.bot_id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {bot.bot_name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveBot(bot.bot_id)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ID: {bot.bot_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Queries: {bot.total_queries}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Chip
                            label={bot.is_active ? "Active" : "Inactive"}
                            color={bot.is_active ? "success" : "default"}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TelegramIntegration;
