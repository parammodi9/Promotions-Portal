import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PromotionsPage from './pages/PromotionsPage';
import UploadPage from './pages/UploadPage';
import CalendarPage from './pages/CalendarPage';
import ChecklistPage from './pages/ChecklistPage';
import ExportPage from './pages/ExportPage';
import { PromotionProvider } from './context/PromotionContext';

function App() {
  return (
    <PromotionProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </Layout>
      </Router>
    </PromotionProvider>
  );
}

export default App;