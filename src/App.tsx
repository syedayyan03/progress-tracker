import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { TodayView } from './components/today/TodayView';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { TopicDetailsModal } from './components/modals/TopicDetailsModal';
import { HabitDetailsModal } from './components/modals/HabitDetailsModal';
import { AddTopicModal } from './components/modals/AddTopicModal';
import { AddSubjectModal } from './components/modals/AddSubjectModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 antialiased font-sans">
      {/* Sidebar Navigation (Desktop) & Bottom Bar (Mobile) */}
      <Sidebar />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<TodayView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/calender" element={<Navigate to="/calendar" replace />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/today" replace />} />
          </Routes>
        </main>
      </div>

      {/* Interactive Modals */}
      <TopicDetailsModal />
      <HabitDetailsModal />
      <AddTopicModal />
      <AddSubjectModal />
      <ConfirmationModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
