import asyncio
import aiohttp
import json
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import re
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.model = None
        self.embeddings_cache = {}
        
    async def initialize_model(self):
        """Initialize the sentence transformer model"""
        try:
            # Use a lightweight model for demo purposes
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("AI model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI model: {e}")
            # Fallback to a simple keyword-based approach
            self.model = None
    
    async def scrape_website_content(self, url: str) -> List[Dict[str, Any]]:
        """Scrape content from a website and extract Q&A pairs"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=30) as response:
                    if response.status != 200:
                        raise Exception(f"Failed to fetch URL: {response.status}")
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract text content
                    content = self._extract_text_content(soup)
                    
                    # Generate Q&A pairs from content
                    qa_pairs = self._generate_qa_pairs(content)
                    
                    return qa_pairs
                    
        except Exception as e:
            logger.error(f"Error scraping website {url}: {e}")
            return []
    
    def _extract_text_content(self, soup: BeautifulSoup) -> str:
        """Extract clean text content from HTML"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    
    def _generate_qa_pairs(self, content: str) -> List[Dict[str, Any]]:
        """Generate Q&A pairs from content using simple heuristics"""
        qa_pairs = []
        
        # Split content into sentences
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        # Create simple Q&A pairs
        for i, sentence in enumerate(sentences[:50]):  # Limit to first 50 sentences
            if len(sentence) > 30:  # Only use substantial sentences
                # Generate a simple question
                question = self._generate_question_from_sentence(sentence)
                if question:
                    qa_pairs.append({
                        'question': question,
                        'answer': sentence,
                        'confidence': 0.8,  # Default confidence
                        'source': 'scraped_content'
                    })
        
        return qa_pairs
    
    def _generate_question_from_sentence(self, sentence: str) -> Optional[str]:
        """Generate a simple question from a sentence"""
        # Simple heuristics to generate questions
        if 'is' in sentence.lower() or 'are' in sentence.lower():
            return f"What {sentence.lower().split('is')[0].strip()}?"
        elif 'can' in sentence.lower():
            return f"How {sentence.lower().replace('can', 'do you')}?"
        elif 'will' in sentence.lower():
            return f"When {sentence.lower().replace('will', 'does')}?"
        elif 'has' in sentence.lower() or 'have' in sentence.lower():
            return f"What {sentence.lower().split('has')[0].strip()}?"
        else:
            # Generic question
            return f"Tell me about {sentence.split()[0].lower()}"
    
    async def create_embeddings(self, texts: List[str]) -> np.ndarray:
        """Create embeddings for texts using sentence transformer"""
        if self.model is None:
            # Fallback to simple keyword matching
            return self._create_simple_embeddings(texts)
        
        try:
            embeddings = self.model.encode(texts)
            return embeddings
        except Exception as e:
            logger.error(f"Error creating embeddings: {e}")
            return self._create_simple_embeddings(texts)
    
    def _create_simple_embeddings(self, texts: List[str]) -> np.ndarray:
        """Create simple keyword-based embeddings as fallback"""
        # Simple TF-IDF-like approach
        all_words = set()
        for text in texts:
            words = re.findall(r'\b\w+\b', text.lower())
            all_words.update(words)
        
        word_to_idx = {word: i for i, word in enumerate(all_words)}
        embeddings = []
        
        for text in texts:
            words = re.findall(r'\b\w+\b', text.lower())
            embedding = [0] * len(all_words)
            for word in words:
                if word in word_to_idx:
                    embedding[word_to_idx[word]] += 1
            embeddings.append(embedding)
        
        return np.array(embeddings)
    
    async def find_similar_questions(self, query: str, qa_pairs: List[Dict[str, Any]], 
                                   threshold: float = 0.7) -> List[Dict[str, Any]]:
        """Find similar questions using semantic search"""
        if not qa_pairs:
            return []
        
        # Extract questions and answers
        questions = [qa['question'] for qa in qa_pairs]
        answers = [qa['answer'] for qa in qa_pairs]
        
        # Create embeddings
        query_embedding = await self.create_embeddings([query])
        question_embeddings = await self.create_embeddings(questions)
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, question_embeddings)[0]
        
        # Find similar questions above threshold
        similar_indices = np.where(similarities >= threshold)[0]
        
        results = []
        for idx in similar_indices:
            results.append({
                'question': questions[idx],
                'answer': answers[idx],
                'confidence': float(similarities[idx]),
                'source': qa_pairs[idx].get('source', 'unknown')
            })
        
        # Sort by confidence
        results.sort(key=lambda x: x['confidence'], reverse=True)
        
        return results
    
    async def train_bot(self, bot_id: int, website_url: str) -> Dict[str, Any]:
        """Train a bot by scraping content and creating embeddings"""
        try:
            # Scrape content from website
            qa_pairs = await self.scrape_website_content(website_url)
            
            if not qa_pairs:
                return {
                    'success': False,
                    'message': 'No content found on the website',
                    'qa_pairs': []
                }
            
            # Create embeddings for all Q&A pairs
            questions = [qa['question'] for qa in qa_pairs]
            embeddings = await self.create_embeddings(questions)
            
            # Store embeddings (in a real app, this would be stored in a database)
            self.embeddings_cache[bot_id] = {
                'qa_pairs': qa_pairs,
                'embeddings': embeddings,
                'questions': questions
            }
            
            return {
                'success': True,
                'message': f'Bot trained successfully with {len(qa_pairs)} Q&A pairs',
                'qa_pairs': qa_pairs,
                'total_pairs': len(qa_pairs)
            }
            
        except Exception as e:
            logger.error(f"Error training bot {bot_id}: {e}")
            return {
                'success': False,
                'message': f'Training failed: {str(e)}',
                'qa_pairs': []
            }
    
    async def query_bot(self, bot_id: int, question: str) -> Dict[str, Any]:
        """Query a trained bot"""
        if bot_id not in self.embeddings_cache:
            return {
                'success': False,
                'message': 'Bot not trained yet',
                'answer': 'Please train the bot first before querying.'
            }
        
        try:
            bot_data = self.embeddings_cache[bot_id]
            qa_pairs = bot_data['qa_pairs']
            
            # Find similar questions
            similar_questions = await self.find_similar_questions(question, qa_pairs)
            
            if not similar_questions:
                return {
                    'success': True,
                    'answer': 'I apologize, but I couldn\'t find a relevant answer to your question. Please try rephrasing your question or contact support for assistance.',
                    'confidence': 0.0,
                    'source_url': None
                }
            
            # Return the best match
            best_match = similar_questions[0]
            
            return {
                'success': True,
                'answer': best_match['answer'],
                'confidence': best_match['confidence'],
                'source_url': best_match.get('source', 'unknown')
            }
            
        except Exception as e:
            logger.error(f"Error querying bot {bot_id}: {e}")
            return {
                'success': False,
                'message': f'Query failed: {str(e)}',
                'answer': 'An error occurred while processing your question.'
            }

# Global AI service instance
ai_service = AIService()
