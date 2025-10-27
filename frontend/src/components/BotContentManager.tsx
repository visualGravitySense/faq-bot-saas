import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  SmartToy as BotIcon,
  ContentCopy as ContentIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { botsAPI } from '../services/api';

interface BotContentManagerProps {
  botId: number;
  botName: string;
}

interface QAPair {
  question: string;
  answer: string;
  confidence: number;
  source: string;
}

const BotContentManager: React.FC<BotContentManagerProps> = ({ botId, botName }) => {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newQA, setNewQA] = useState({ question: '', answer: '' });

  useEffect(() => {
    loadBotContent();
  }, [botId]);

  const loadBotContent = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would come from API
      const mockQAPairs: QAPair[] = [
        {
          question: "How do I apply for admission?",
          answer: "To apply for admission, you need to complete the online application form, submit your academic transcripts, and provide two letters of recommendation. The application deadline is March 15th.",
          confidence: 0.92,
          source: "scraped_content"
        },
        {
          question: "What are the tuition fees?",
          answer: "Tuition fees vary by program. For undergraduate programs, the annual tuition is $15,000 for domestic students and $25,000 for international students. Graduate programs range from $20,000 to $30,000 per year.",
          confidence: 0.88,
          source: "scraped_content"
        },
        {
          question: "When is the application deadline?",
          answer: "The application deadline for the fall semester is March 15th, and for the spring semester is October 15th. Late applications may be considered on a case-by-case basis.",
          confidence: 0.95,
          source: "scraped_content"
        },
        {
          question: "What documents do I need?",
          answer: "Required documents include: official transcripts, two letters of recommendation, a personal statement, and proof of English proficiency (for international students).",
          confidence: 0.90,
          source: "scraped_content"
        },
        {
          question: "How can I contact the admissions office?",
          answer: "You can contact the admissions office by phone at (555) 123-4567, email at admissions@university.edu, or visit our office Monday through Friday, 9 AM to 5 PM.",
          confidence: 0.87,
          source: "scraped_content"
        }
      ];
      setQaPairs(mockQAPairs);
    } catch (err) {
      setError('Failed to load bot content');
      console.error('Content loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQA = () => {
    if (newQA.question.trim() && newQA.answer.trim()) {
      const newPair: QAPair = {
        question: newQA.question,
        answer: newQA.answer,
        confidence: 1.0, // Manually added Q&A has full confidence
        source: "manual"
      };
      setQaPairs(prev => [...prev, newPair]);
      setNewQA({ question: '', answer: '' });
      setAddDialogOpen(false);
    }
  };

  const handleDeleteQA = (index: number) => {
    setQaPairs(prev => prev.filter((_, i) => i !== index));
  };

  const filteredQAPairs = qaPairs.filter(qa =>
    qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'scraped_content': return 'primary';
      case 'manual': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Content Manager: {botName}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Q&A
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Content" />
        <Tab label="Scraped Content" />
        <Tab label="Manual Content" />
      </Tabs>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search questions and answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQAPairs.map((qa, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {qa.question}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {qa.answer.length > 100 
                      ? `${qa.answer.substring(0, 100)}...` 
                      : qa.answer
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${(qa.confidence * 100).toFixed(1)}%`}
                    color={getConfidenceColor(qa.confidence) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={qa.source}
                    color={getSourceColor(qa.source) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteQA(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredQAPairs.length === 0 && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <ContentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try adjusting your search terms' : 'Add some Q&A pairs to get started'}
          </Typography>
        </Box>
      )}

      {/* Add Q&A Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Q&A Pair</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Question"
              fullWidth
              multiline
              rows={2}
              value={newQA.question}
              onChange={(e) => setNewQA(prev => ({ ...prev, question: e.target.value }))}
              placeholder="e.g., How do I apply for admission?"
            />
            <TextField
              label="Answer"
              fullWidth
              multiline
              rows={4}
              value={newQA.answer}
              onChange={(e) => setNewQA(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Provide a detailed answer to the question..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddQA}
            disabled={!newQA.question.trim() || !newQA.answer.trim()}
          >
            Add Q&A
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BotContentManager;
