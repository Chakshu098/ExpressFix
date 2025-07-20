import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { 
  Edit3, 
  Hash, 
  Image, 
  Eraser, 
  Scissors, 
  FileText,
  Zap
} from 'lucide-react';

const tools = [
  {
    id: 'write-article',
    title: 'Write Article',
    description: 'Generate SEO-friendly articles from topics',
    icon: Edit3,
    color: 'from-blue-500 to-indigo-600',
    route: '/write-article'
  },
  {
    id: 'blog-titles',
    title: 'Blog Titles',
    description: 'Create catchy titles for your content',
    icon: Hash,
    color: 'from-purple-500 to-pink-500',
    route: '/blog-titles'
  },
  {
    id: 'generate-images',
    title: 'Generate Images',
    description: 'Create AI-powered images from text',
    icon: Image,
    color: 'from-green-500 to-teal-500',
    route: '/generate-images'
  },
  {
    id: 'remove-background',
    title: 'Remove Background',
    description: 'Remove backgrounds from images',
    icon: Eraser,
    color: 'from-orange-500 to-red-500',
    route: '/remove-background'
  },
  {
    id: 'review-resume',
    title: 'Review Resume',
    description: 'Get AI feedback on your resume',
    icon: FileText,
    color: 'from-emerald-500 to-green-600',
    route: '/review-resume'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Choose a tool to get started with AI-powered content creation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {tools.map((tool) => (
              <Card key={tool.id} className="group bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl card-hover overflow-hidden">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{tool.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
                  <Button 
                    onClick={() => navigate(tool.route)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Try Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
