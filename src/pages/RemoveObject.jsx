import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/Layout';
import { imageService } from '@/services/api';
import { Scissors, Download, Loader2, Sparkles } from 'lucide-react';

export default function RemoveObject() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleRemoveObject = async () => {
    if (!selectedFile || !description.trim()) return;
    
    setLoading(true);
    try {
      const response = await imageService.removeObject(selectedFile, description);
      setResultImage(response.imageUrl);
    } catch (error) {
      console.error('Error removing object:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'object-removed.png';
      link.click();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                Object Removal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload image
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full h-12 rounded-xl border-purple-200/50 focus:border-purple-400 shadow-sm"
                />
              </div>
              
              {selectedFile && (
                <div className="rounded-xl overflow-hidden border border-purple-200/30 shadow-lg">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[200px] object-contain"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Describe object to remove
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., car in background, tree from the image"
                  className="w-full rounded-xl border-purple-200/50 focus:border-purple-400 shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Be specific about what you want to remove
                </p>
              </div>
              
              <Button 
                onClick={handleRemoveObject}
                disabled={!selectedFile || !description.trim() || loading}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Removing object...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Remove object
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                Processed Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resultImage ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-purple-200/30 shadow-lg">
                    <img 
                      src={resultImage} 
                      alt="Object Removed" 
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                  <Button 
                    onClick={handleDownload}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Scissors className="w-16 h-16 text-purple-300 mb-4" />
                  <p className="text-gray-500">Upload an image and describe what to remove</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
