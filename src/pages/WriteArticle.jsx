import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/Layout';
import { articleService, fetchWikipediaArticle } from '@/services/api';
import { Edit3, Copy, Download, Loader2, Sparkles } from 'lucide-react';

export default function WriteArticle() {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('short');
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await fetchWikipediaArticle(topic);
      let text = data.extract || '';
      let minWords = length === 'short' ? 200 : 400;
      let maxWords = length === 'short' ? 400 : 800;
      let words = text.split(/\s+/);
      // If not enough words, just show all
      if (words.length < minWords) {
        text = words.join(' ');
      } else {
        text = words.slice(0, maxWords).join(' ');
        if (words.length > maxWords) text += '...';
      }
      setArticle(text);
    } catch (error) {
      setArticle('Could not fetch article from Wikipedia.');
      console.error('Error fetching Wikipedia article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([article], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'article.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                AI Article Writer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Article Topic
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="The future of artificial intelligence"
                  className="w-full h-12 rounded-xl border-purple-200/50 focus:border-purple-400 shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Article Length
                </label>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant={length === 'short' ? 'default' : 'outline'}
                    onClick={() => setLength('short')}
                    className={`flex-1 h-12 rounded-xl whitespace-normal break-words ${length === 'short' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                      : 'border-purple-200 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    Short (200 - 400 words)
                  </Button>
                  <Button
                    variant={length === 'long' ? 'default' : 'outline'}
                    onClick={() => setLength('long')}
                    className={`flex-1 h-12 rounded-xl whitespace-normal break-words ${length === 'long' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                      : 'border-purple-200 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    Long (400 - 800 words)
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating article...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate article
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                Generated article
              </CardTitle>
            </CardHeader>
            <CardContent>
              {article ? (
                <div className="space-y-4">
                  <Textarea
                    value={article}
                    readOnly
                    className="min-h-[400px] text-sm rounded-xl border-purple-200/50 bg-white/60 backdrop-blur-sm"
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleCopy} variant="outline" className="flex-1 h-12 rounded-xl border-purple-200 hover:bg-purple-50">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="flex-1 h-12 rounded-xl border-purple-200 hover:bg-purple-50">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Edit3 className="w-16 h-16 text-purple-300 mb-4" />
                  <p className="text-gray-500">Enter a topic and click "Generate article" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
