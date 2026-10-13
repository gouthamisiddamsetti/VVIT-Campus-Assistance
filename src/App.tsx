import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalVerificationAlert } from './components/layout/VerificationBanner';
import { FloatingChatTrigger, AskVVITUChatModal } from './components/chat/AskVVITUChatModal';

import { HomePage } from './pages/HomePage';
import { ExploreCampusPage } from './pages/ExploreCampusPage';
import { BuildingDetailPage } from './pages/BuildingDetailPage';
import { FacilityDetailPage } from './pages/FacilityDetailPage';
import { DepartmentsLabsPage } from './pages/DepartmentsLabsPage';
import { SharedFacilitiesPage } from './pages/SharedFacilitiesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AskAIPage } from './pages/AskAIPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BuildingManagementPage } from './pages/BuildingManagementPage';
import { FacilityManagementPage } from './pages/FacilityManagementPage';
import { FeedbackManagementPage } from './pages/FeedbackManagementPage';

function App() {
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {/* Verification Transparency Alert */}
        <GlobalVerificationAlert />

        {/* Global Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExploreCampusPage />} />
            <Route path="/building/:id" element={<BuildingDetailPage />} />
            <Route path="/facility/:id" element={<FacilityDetailPage />} />
            <Route path="/departments-labs" element={<DepartmentsLabsPage />} />
            <Route path="/facilities" element={<SharedFacilitiesPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/ask-ai" element={<AskAIPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/buildings" element={<BuildingManagementPage />} />
            <Route path="/admin/facilities" element={<FacilityManagementPage />} />
            <Route path="/admin/feedback" element={<FeedbackManagementPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Floating AI Assistant Trigger */}
        <FloatingChatTrigger onOpen={() => setIsFloatingChatOpen(true)} />

        {/* Floating AI Modal */}
        <AskVVITUChatModal
          isOpen={isFloatingChatOpen}
          onClose={() => setIsFloatingChatOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
