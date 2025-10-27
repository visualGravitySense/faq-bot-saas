import React, { useState } from 'react';
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
  Chip,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { botsAPI } from '../services/api';

interface CreateBotDialogProps {
  open: boolean;
  onClose: () => void;
  onBotCreated: () => void;
}

const CreateBotDialog: React.FC<CreateBotDialogProps> = ({
  open,
  onClose,
  onBotCreated,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    description: '',
    language: 'en',
    channels: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleChannelChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      channels: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await botsAPI.createBot(formData);
      onBotCreated();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        website_url: '',
        description: '',
        language: 'en',
        channels: [],
      });
    } catch (err) {
      setError('Failed to create bot. Please try again.');
      console.error('Create bot error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Bot</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Bot Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            fullWidth
            required
            placeholder="e.g., University FAQ Bot"
          />
          
          <TextField
            label="Website URL"
            value={formData.website_url}
            onChange={handleInputChange('website_url')}
            fullWidth
            required
            placeholder="https://your-university.edu"
            helperText="The bot will scrape content from this website"
          />
          
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            fullWidth
            multiline
            rows={3}
            placeholder="Brief description of what this bot will help with..."
          />
          
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={formData.language}
              onChange={handleInputChange('language')}
              label="Language"
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ru">Russian</MenuItem>
              <MenuItem value="et">Estonian</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Channels</InputLabel>
            <Select
              multiple
              value={formData.channels}
              onChange={handleChannelChange}
              label="Channels"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="telegram">Telegram</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="web">Web Widget</MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="info">
            <Typography variant="body2">
              After creating the bot, it will automatically start training by scraping 
              content from the provided website. This process usually takes 5-10 minutes.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.website_url}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            'Create Bot'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBotDialog;
