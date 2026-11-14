import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { TodayView } from './components/today/TodayView';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { ManageTasksView } from './components/tasks/ManageTasksView';
import { TopicDetailsModal } from './components/modals/TopicDetailsModal';
import { HabitDetailsModal } from './components/modals/HabitDetailsModal';
import { AddTopicModal } from './components/modals/AddTopicModal';
import { AddSubjectModal } from './components/modals/AddSubjectModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';

// Automatically scroll to the top of the page when navigating between routes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollContainer = document.getElementById('app-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-slate-100 antialiased font-sans">
      <ScrollToTop />

      {/* Sidebar Navigation (Desktop) & Bottom Bar (Mobile) */}
      <Sidebar />

      {/* Main Area: Fixed Top Header + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar is permanently FIXED at top */}
        <Header />

        {/* Dedicated Scroll Container */}
        <div id="app-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden">
          <main className="p-3.5 sm:p-6 lg:p-8 pb-28 md:pb-8 w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/today" replace />} />
              <Route path="/today" element={<TodayView />} />
              <Route path="/tasks" element={<ManageTasksView />} />
              <Route path="/manage-tasks" element={<Navigate to="/tasks" replace />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/calender" element={<Navigate to="/calendar" replace />} />
              <Route path="/analytics" element={<AnalyticsView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/today" replace />} />
            </Routes>
          </main>
        </div>
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
