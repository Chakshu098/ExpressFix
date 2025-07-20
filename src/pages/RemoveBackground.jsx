import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { imageService } from '@/services/api';
import { Eraser, Download, Loader2, Sparkles } from 'lucide-react';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';
import { useRef } from 'react';

export default function RemoveBackground() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [scoreThreshold, setScoreThreshold] = useState(0.2);
  const [maskPreview, setMaskPreview] = useState('');
  const [mode, setMode] = useState('brush'); // 'brush' or 'eraser'
  const [brushSize, setBrushSize] = useState(20);
  const [painting, setPainting] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState('');
  const paintCanvasRef = useRef();
  const imageRef = useRef();

  const REMOVEBG_API_KEY = '42LmB5pHsuhqEz1nropCpufD';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setWarning('');
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      // Call remove.bg API
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVEBG_API_KEY,
        },
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Background removal failed.';
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.errors && errorJson.errors[0]) {
            if (errorJson.errors[0].code === 'quota_exceeded') {
              errorMsg = 'You have used all your free remove.bg credits. Please upgrade your plan or try again next month.';
            } else if (errorJson.errors[0].code === 'invalid_image') {
              errorMsg = 'Invalid image. Please upload a clear JPG or PNG photo.';
            } else if (errorJson.errors[0].title) {
              errorMsg = errorJson.errors[0].title;
            }
          }
        } catch (e) {
          // fallback to text
          const errorText = await response.text();
          errorMsg += ' ' + errorText;
        }
        setWarning(errorMsg);
        setResultImage('');
        setLoading(false);
        return;
      }
      const blob = await response.blob();
      setResultImage(URL.createObjectURL(blob));
    } catch (error) {
      setWarning('Error removing background. Please check your internet connection and try again.');
      setResultImage('');
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'background-removed.png';
      link.click();
    }
  };

  // Manual painting handlers (initial setup)
  const handleCanvasMouseDown = (e) => {
    setPainting(true);
    paintOnCanvas(e);
  };
  const handleCanvasMouseUp = () => setPainting(false);
  const handleCanvasMouseMove = (e) => {
    if (!painting) return;
    paintOnCanvas(e);
  };
  const paintOnCanvas = (e) => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx.globalCompositeOperation = mode === 'brush' ? 'source-over' : 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fillStyle = mode === 'brush' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,1)';
    ctx.fill();
    setCanvasUrl(canvas.toDataURL());
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <Eraser className="w-5 h-5 text-white" />
                </div>
                Background Removal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm mb-2">
                <b>Note:</b> Automatic background removal works best for clear photos of people. For objects or complex backgrounds, results may vary.
              </div>
              {warning && (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-xl border border-yellow-300 mb-4">
                  {warning}
                </div>
              )}
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
                <p className="text-xs text-gray-500 mt-2">
                  Supports JPG, PNG, and other image formats
                </p>
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
              <Button 
                onClick={handleRemoveBackground}
                disabled={!selectedFile || loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Removing background...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Remove background
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <Eraser className="w-5 h-5 text-white" />
                </div>
                Processed Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resultImage ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-purple-200/30 shadow-lg bg-gray-100 bg-opacity-50" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="a" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="scale(.5)"%3e%3crect fill="%23ffffff" width="10" height="10"/%3e%3crect fill="%23f3f4f6" x="10" y="10" width="10" height="10"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23a)"/%3e%3c/svg%3e")'}}>
                    <img 
                      src={resultImage} 
                      alt="Background Removed" 
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
                  <Eraser className="w-16 h-16 text-purple-300 mb-4" />
                  <p className="text-gray-500">Upload an image and click "Remove Background" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
