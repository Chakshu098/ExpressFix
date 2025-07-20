import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { resumeService } from '@/services/api';
import { FileText, Loader2, CheckCircle, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
// Try the most compatible import for Vite
import Tesseract from 'tesseract.js';
// If this fails, try: import * as Tesseract from 'tesseract.js';
import mammoth from 'mammoth';

export default function ReviewResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleReviewResume = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    try {
      if (selectedFile.name.toLowerCase().endsWith('.docx')) {
        setError('Extracting text from DOCX...');
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        setError('');
        const analysis = analyzeResumeText(text);
        setAnalysis(analysis);
        setLoading(false);
        return;
      }
      console.log('Starting OCR process...');
      setError('Running OCR on your PDF. This may take a while...');
      const fileReader = new FileReader();
      fileReader.onload = async function() {
        try {
          console.log('File loaded, converting to Uint8Array...');
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({data: typedarray}).promise;
          let ocrText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`Processing page ${i} of ${pdf.numPages}`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport }).promise;
            console.log('Canvas rendered, running Tesseract...');
            const { data: { text: ocrResult } } = await Tesseract.recognize(canvas, 'eng');
            console.log('Tesseract result:', ocrResult);
            ocrText += ocrResult + ' ';
          }
          setError('');
          // Analyze resume text
          console.log('Analyzing extracted text...');
          const analysis = analyzeResumeText(ocrText);
          setAnalysis(analysis);
          setLoading(false);
        } catch (err) {
          setError('Could not extract text from PDF using OCR. Please try a different file.');
          setAnalysis(null);
          setLoading(false);
          console.error('OCR error:', err);
        }
      };
      fileReader.onerror = function(e) {
        setError('Failed to read the PDF file.');
        setAnalysis(null);
        setLoading(false);
        console.error('FileReader error:', e);
      };
      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      setError('Unexpected error during resume analysis.');
      setAnalysis(null);
      setLoading(false);
      console.error('Error analyzing resume:', error);
    }
  };

  // Simple ATS analysis function
  function analyzeResumeText(text) {
    const sections = ['experience', 'education', 'skills', 'projects', 'summary', 'contact'];
    const strengths = [];
    const improvements = [];
    const suggestions = [];
    let score = 0;
    // Section presence
    sections.forEach(section => {
      if (text.toLowerCase().includes(section)) {
        strengths.push(`Has a ${section.charAt(0).toUpperCase() + section.slice(1)} section.`);
        score += 15;
      } else {
        improvements.push(`Missing a ${section.charAt(0).toUpperCase() + section.slice(1)} section.`);
        suggestions.push(`Add a ${section.charAt(0).toUpperCase() + section.slice(1)} section.`);
      }
    });
    // Length check
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 200) {
      improvements.push('Resume is too short.');
      suggestions.push('Add more detail to your resume.');
    } else if (wordCount > 1000) {
      improvements.push('Resume is too long.');
      suggestions.push('Shorten your resume to 1-2 pages.');
    } else {
      strengths.push('Resume length is appropriate.');
      score += 10;
    }
    // Bullet points
    const bulletCount = (text.match(/[•\-\*]/g) || []).length;
    if (bulletCount > 5) {
      strengths.push('Uses bullet points for readability.');
      score += 10;
    } else {
      improvements.push('Not enough bullet points.');
      suggestions.push('Use bullet points to organize information.');
    }
    // Advanced contact info detection
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /\b(\+\d{1,3}[- ]?)?(\d{10}|\d{3}[- ]\d{3}[- ]\d{4})\b/;
    const linkedinRegex = /linkedin\.com\/[a-zA-Z0-9\-_/]+/i;
    const githubRegex = /github\.com\/[a-zA-Z0-9\-_/]+/i;
    const websiteRegex = /https?:\/\/[\w\.-]+\.[a-z]{2,}/i;
    if (
      emailRegex.test(text) ||
      phoneRegex.test(text) ||
      linkedinRegex.test(text) ||
      githubRegex.test(text) ||
      websiteRegex.test(text)
    ) {
      strengths.push('Contact information is present.');
      score += 10;
    } else {
      improvements.push('Missing contact information.');
      suggestions.push('Add your email, phone, LinkedIn, or website.');
    }
    // Cap score at 100
    score = Math.min(score, 100);
    // Summary
    const summary = `ATS Score: ${score}/100. This is a simulated score based on section presence, length, formatting, and contact info.`;
    return { summary, strengths, improvements, suggestions };
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Resume Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Resume
                </label>
                <Input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                  className="w-full h-12 rounded-xl border-purple-200/50 focus:border-purple-400 shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supports PDF (text-based) and DOCX
                </p>
              </div>
              
              {selectedFile && (
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl border border-red-300 mb-4">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleReviewResume}
                disabled={!selectedFile || loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Review Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Summary
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{analysis.summary}</p>
                  </div>
                  
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths?.map((strength, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {analysis.improvements?.map((improvement, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-3">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      Suggested Additions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions?.map((suggestion, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FileText className="w-16 h-16 text-purple-300 mb-4" />
                  <p className="text-gray-500">Upload your resume and click "Review Resume" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
