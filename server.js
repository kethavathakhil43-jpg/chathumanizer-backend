const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ChatHumanizer API is running' });
});

// Humanize endpoint
app.post('/api/humanize', (req, res) => {
  const { text, tone = 'casual' } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  let result = text;
  
  // Remove robotic words
  result = result.replace(/\b(furthermore|moreover|additionally|consequently|henceforth|thusly)\b/gi, () => {
    const replacements = ['plus', 'also', 'on top of that', 'besides', 'so'];
    return replacements[Math.floor(Math.random() * replacements.length)];
  });
  
  // Add contractions
  result = result.replace(/\b(cannot|do not|does not|will not|is not|are not|has not|have not)\b/gi, (match) => {
    const map = {
      'cannot': "can't", 'do not': "don't", 'does not': "doesn't",
      'will not': "won't", 'is not': "isn't", 'are not': "aren't",
      'has not': "hasn't", 'have not': "haven't"
    };
    return map[match.toLowerCase()] || match;
  });
  
  // Tone adjustments
  if (tone === 'casual') {
    result = `Honestly, ${result.charAt(0).toLowerCase() + result.slice(1)} you know?`;
  } else if (tone === 'friendly') {
    result = `Hey there! ${result} 😊 Let me know what you think!`;
  } else if (tone === 'witty') {
    result = `Well, well — ${result.toLowerCase()} That's the tea. ☕`;
  } else if (tone === 'professional') {
    result = result.replace(/\. /g, '. ').replace(/ i /g, ' I ');
  }
  
  if (!result.endsWith('.')) result += '.';
  result = result.replace(/  +/g, ' ').trim();
  
  res.json({ success: true, text: result });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
