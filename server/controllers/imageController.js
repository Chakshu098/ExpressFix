import { openaiClient } from '../utils/openaiClient.js';
import { replicateClient } from '../utils/replicateClient.js';

export const generateImage = async (req, res) => {
  try {
    const { prompt, style } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let finalPrompt = prompt;
    if (style === 'Ghibli Style') {
      finalPrompt = `${prompt}, in the style of Studio Ghibli animation, beautiful, detailed`;
    }

    const response = await openaiClient.images.generate({
      model: 'dall-e-3',
      prompt: finalPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    const imageUrl = response.data[0].url;
    
    res.json({ 
      imageUrl,
      prompt: finalPrompt,
      style
    });
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image. Please check your OpenAI API key configuration.' 
    });
  }
};

export const removeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // For demo purposes, return the original image
    // In production, integrate with Replicate API for background removal
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    res.json({ 
      imageUrl,
      message: 'Background removal completed (demo mode)'
    });
    
  } catch (error) {
    console.error('Error removing background:', error);
    res.status(500).json({ 
      error: 'Failed to remove background. Please check your Replicate API configuration.' 
    });
  }
};

export const removeObject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'Object description is required' });
    }

    // For demo purposes, return the original image
    // In production, integrate with Replicate API for object removal
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    res.json({ 
      imageUrl,
      description,
      message: 'Object removal completed (demo mode)'
    });
    
  } catch (error) {
    console.error('Error removing object:', error);
    res.status(500).json({ 
      error: 'Failed to remove object. Please check your Replicate API configuration.' 
    });
  }
};
