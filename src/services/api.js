import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const articleService = {
  generateArticle: async (topic, length) => {
    const response = await api.post('/article', { topic, length });
    return response.data;
  }
};

export const titlesService = {
  generateTitles: async (subject, category) => {
    const response = await api.post('/titles', { subject, category });
    return response.data;
  }
};

export const imageService = {
  generateImage: async (prompt, style) => {
    // Use Hugging Face Stable Diffusion demo API
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You can add a Hugging Face API key here if you have one, for higher rate limits
      },
      body: JSON.stringify({ inputs: prompt })
    });
    if (!response.ok) throw new Error('Image generation failed');
    const blob = await response.blob();
    return { imageUrl: URL.createObjectURL(blob) };
  },
  
  removeBackground: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/remove-bg', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  removeObject: async (imageFile, description) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', description);
    const response = await api.post('/remove-object', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const resumeService = {
  reviewResume: async (resumeFile) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const response = await api.post('/review-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export async function fetchWikipediaArticle(title) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  if (!response.ok) throw new Error('Article not found');
  return response.json();
}

export async function fetchGoogleBlogTitles(keyword, category) {
  // For demo: use Bing Web Search API (or similar) or fallback to scraping Google if you have a backend proxy
  // Here, we use a simple web search via the 'site:medium.com' trick for demonstration
  const query = `${keyword} ${category} site:medium.com`;
  const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`);
  if (!response.ok) throw new Error('Failed to fetch blog titles');
  const data = await response.json();
  // DuckDuckGo API returns related topics, which can be used as titles
  if (data.RelatedTopics && data.RelatedTopics.length > 0) {
    return data.RelatedTopics.map(t => t.Text).filter(Boolean);
  }
  return [];
}
