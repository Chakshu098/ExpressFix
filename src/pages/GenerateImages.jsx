import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/Layout';
import { Image, Download, Sparkles } from 'lucide-react';

// Sample gallery images (replace with your own or use free stock images)
const galleryImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101053476-598de5341b7b?auto=format&fit=crop&w=400&q=80',
  // ... (repeat or add more unique Unsplash/stock image URLs up to 100 total) ...
];

const GenerateImages = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const idx = Math.floor(Math.random() * galleryImages.length);
    setImageUrl(galleryImages[idx]);
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'random-image.png';
      link.click();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Prompt and Button */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt-based Random Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                className="w-full p-2 rounded border mb-4"
                  value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Enter your prompt (e.g. a cat on a bike)"
              />
              <Button onClick={handleGenerate} className="mb-4 w-full">
                Generate Image
              </Button>
            </CardContent>
          </Card>
          {/* Right: Single Image Canvas */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center">
                <div className="bg-white rounded-xl p-6 flex flex-col items-center" style={{ minWidth: 350, maxWidth: 500, minHeight: 400, margin: '0 auto', boxShadow: '0 2px 16px #0001' }}>
              {imageUrl ? (
                    <>
                    <img 
                      src={imageUrl} 
                        alt="Random"
                        style={{ width: '100%', height: 320, objectFit: 'contain', background: '#f3f4f6', borderRadius: 8 }}
                      />
                      <Button onClick={handleDownload} className="mt-4 w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                    </>
                  ) : (
                    <div className="text-gray-400 text-center py-20 w-full">Enter a prompt and click Generate Image</div>
                  )}
                </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default GenerateImages;