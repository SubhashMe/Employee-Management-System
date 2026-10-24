import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EMSProvider, useEMS } from './context/EMSContext';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SearchModal } from './components/layout/SearchModal';

import { OverviewPage } from './pages/OverviewPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AttendancePage } from './pages/AttendancePage';
import { PerformancePage } from './pages/PerformancePage';
import { PayrollPage } from './pages/PayrollPage';
import { RelationsPage } from './pages/RelationsPage';
import { OffboardingPage } from './pages/OffboardingPage';

const DashboardShell: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab, setActiveTab } = useEMS();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Protected route check
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal />

      {/* Corporate Responsive Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Modern Corporate Header with Search & Notifications */}
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewPage onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'onboarding' && <OnboardingPage />}
          {activeTab === 'attendance' && <AttendancePage />}
          {activeTab === 'performance' && <PerformancePage />}
          {activeTab === 'payroll' && <PayrollPage />}
          {activeTab === 'relations' && <RelationsPage />}
          {activeTab === 'offboarding' && <OffboardingPage />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <EMSProvider>
        <DashboardShell />
      </EMSProvider>
    </AuthProvider>
  );
}

export default App;
