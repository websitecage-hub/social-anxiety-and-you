import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import SuccessPage from './components/SuccessPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        {/* Support legacy paths if needed */}
        <Route path="/secret-download-path/*" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}
