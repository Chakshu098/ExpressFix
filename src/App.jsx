import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import WriteArticle from './pages/WriteArticle';
import BlogTitles from './pages/BlogTitles';
import GenerateImages from './pages/GenerateImages';
import RemoveBackground from './pages/RemoveBackground';
import RemoveObject from './pages/RemoveObject';
import ReviewResume from './pages/ReviewResume';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/write-article" element={<WriteArticle />} />
        <Route path="/blog-titles" element={<BlogTitles />} />
        <Route path="/generate-images" element={<GenerateImages />} />
        <Route path="/remove-background" element={<RemoveBackground />} />
        <Route path="/remove-object" element={<RemoveObject />} />
        <Route path="/review-resume" element={<ReviewResume />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
