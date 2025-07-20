import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { Hash, Copy, Loader2, Sparkles } from 'lucide-react';

const categories = [
  'General', 'Technology', 'Business', 'Health', 
  'Lifestyle', 'Education', 'Travel', 'Food'
];

export default function BlogTitles() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    // Enhanced, meaningful, and beautiful blog title templates
    const templates = [
      `Unlocking the Power of ${keyword} in ${selectedCategory}`,
      `How ${keyword} is Revolutionizing the ${selectedCategory} Industry`,
      `10 Surprising Ways ${keyword} Impacts ${selectedCategory}`,
      `A Beginner’s Guide to ${keyword} in Modern ${selectedCategory}`,
      `The Role of ${keyword} in Shaping the Future of ${selectedCategory}`,
      `Why ${keyword} is the Next Big Thing in ${selectedCategory}`,
      `Expert Insights: ${keyword} Trends in ${selectedCategory}`,
      `How to Leverage ${keyword} for Success in ${selectedCategory}`,
      `The Pros and Cons of ${keyword} in ${selectedCategory}`,
      `Inspiring Stories of ${keyword} Transforming ${selectedCategory}`,
      `The Ultimate Guide to ${keyword} in ${selectedCategory}`,
      `What Everyone Should Know About ${keyword} and ${selectedCategory}`,
      `The Hidden Secrets of ${keyword} in ${selectedCategory}`,
      `How ${keyword} Can Boost Your ${selectedCategory} Strategy`,
      `Lessons Learned from ${keyword} Leaders in ${selectedCategory}`
    ];
    setTimeout(() => {
      setTitles(templates);
      setLoading(false);
    }, 500); // Simulate loading
  };

  const handleCopyTitle = (title) => {
    navigator.clipboard.writeText(title);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                AI Title Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Keyword
                </label>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="The future of artificial intelligence"
                  className="w-full h-12 rounded-xl border-purple-200/50 focus:border-purple-400 shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className={`text-sm h-10 rounded-xl ${selectedCategory === category 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                        : 'border-purple-200 text-gray-700 hover:bg-purple-50'
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={!keyword.trim() || loading}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating titles...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate titles
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                Generated titles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {titles.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {titles.map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-gray-800 font-medium flex-1">{title}</span>
                      <Button
                        onClick={() => handleCopyTitle(title)}
                        variant="ghost"
                        size="sm"
                        className="ml-3 hover:bg-purple-100 rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Hash className="w-16 h-16 text-purple-300 mb-4" />
                  <p className="text-gray-500">Enter keywords and click "Generate Titles" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
