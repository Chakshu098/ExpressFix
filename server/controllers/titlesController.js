import { openaiClient } from '../utils/openaiClient.js';

export const generateTitles = async (req, res) => {
  try {
    const { subject, category } = req.body;
    
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const prompt = `Generate 10 creative and catchy blog titles for the subject: "${subject}" 
    in the ${category} category. Make them engaging, SEO-friendly, and compelling for readers. 
    Return only the titles, each on a new line, without numbers or bullets.`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative copywriter who specializes in creating compelling blog titles that drive engagement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.8
    });

    const titlesText = completion.choices[0].message.content;
    const titles = titlesText.trim().split('\n').filter(title => title.trim().length > 0);
    
    res.json({ 
      titles,
      subject,
      category
    });
    
  } catch (error) {
    console.error('Error generating titles:', error);
    res.status(500).json({ 
      error: 'Failed to generate titles. Please check your OpenAI API key configuration.' 
    });
  }
};
