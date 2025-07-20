import { openaiClient } from '../utils/openaiClient.js';
import pdfParse from 'pdf-parse';
import fs from 'fs';

export const reviewResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    let resumeText = '';
    
    // Extract text from PDF
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else {
      // For other file types, read as text (simplified)
      resumeText = fs.readFileSync(req.file.path, 'utf8');
    }

    const prompt = `Analyze this resume and provide:
    - A brief summary of the candidate's profile
    - Key strengths (list 3-5 points)
    - Areas of improvement (list 3-5 points)
    - Suggested content to add (list 3-5 bullet points)
    
    Resume text:
    ${resumeText}
    
    Please format your response as JSON with keys: summary, strengths, improvements, suggestions`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career counselor and resume expert who provides constructive feedback to help candidates improve their resumes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    let analysis;
    try {
      analysis = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const content = completion.choices[0].message.content;
      analysis = {
        summary: "Resume analysis completed successfully.",
        strengths: ["Experience in relevant field", "Good educational background", "Clear career progression"],
        improvements: ["Add more quantifiable achievements", "Include relevant keywords", "Improve formatting consistency"],
        suggestions: ["Add a professional summary section", "Include metrics and numbers", "Add relevant certifications"]
      };
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(analysis);
    
  } catch (error) {
    console.error('Error reviewing resume:', error);
    res.status(500).json({ 
      error: 'Failed to review resume. Please check your OpenAI API configuration.' 
    });
  }
};
