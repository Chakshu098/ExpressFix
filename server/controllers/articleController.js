import { openaiClient } from '../utils/openaiClient.js';

export const generateArticle = async (req, res) => {
  try {
    const { topic, length } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const wordCount = length === 'long' ? '400-800' : '200-400';
    
    const prompt = `Write a detailed SEO-friendly article on the topic: "${topic}". 
    The article should be ${wordCount} words long, well-structured with clear headings, 
    and include valuable insights. Make it engaging and informative.`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer who creates high-quality, SEO-optimized articles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: length === 'long' ? 1200 : 600,
      temperature: 0.7
    });

    const article = completion.choices[0].message.content;
    
    res.json({ 
      article,
      topic,
      wordCount: article.split(' ').length
    });
    
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ 
      error: 'Failed to generate article. Please check your OpenAI API key configuration.' 
    });
  }
};
