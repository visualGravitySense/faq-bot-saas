import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { botsAPI } from '../services/api';

interface BotTesterProps {
  botId: number;
  botName: string;
}

interface BotResponse {
  question: string;
  answer: string;
  confidence: number;
  source_url?: string;
}

const BotTester: React.FC<BotTesterProps> = ({ botId, botName }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<BotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{
    question: string;
    answer: string;
    confidence: number;
    timestamp: Date;
  }>>([]);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const botResponse = await botsAPI.queryBot(botId, question);
      setResponse(botResponse);
      
      // Add to chat history
      setChatHistory(prev => [
        ...prev,
        {
          question,
          answer: botResponse.answer,
          confidence: botResponse.confidence,
          timestamp: new Date(),
        }
      ]);
      
      setQuestion('');
    } catch (err) {
      setError('Failed to get response from bot. Please try again.');
      console.error('Bot query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Test Bot: {botName}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ask a Question
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your bot a question... (e.g., 'How do I apply for admission?')"
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !question.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SendIcon />
                  )}
                </Button>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {response && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <BotIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" color="primary">
                      Bot Response
                    </Typography>
                    <Chip
                      label={`${(response.confidence * 100).toFixed(1)}% confidence`}
                      size="small"
                      color={getConfidenceColor(response.confidence) as any}
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {response.answer}
                  </Typography>
                  {response.source_url && (
                    <Typography variant="caption" color="text.secondary">
                      Source: {response.source_url}
                    </Typography>
                  )}
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chat History
              </Typography>
              
              {chatHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No questions asked yet. Start testing your bot!
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {chatHistory.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                        <PersonIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                        "{item.question}"
                      </Typography>
                      
                      <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                        <BotIcon color="primary" sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                          Bot Response
                        </Typography>
                        <Chip
                          label={`${(item.confidence * 100).toFixed(1)}%`}
                          size="small"
                          color={getConfidenceColor(item.confidence) as any}
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {item.answer}
                      </Typography>
                      
                      {index < chatHistory.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BotTester;
