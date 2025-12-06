
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { View, Language } from './types';
import { Layout } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { ToastProvider } from './contexts/ToastContext';
import { CompanyProvider } from './components/providers/CompanyProvider';
import { ToastContainer } from './components/Toast';
import { AiAssistant } from './components/AiAssistant';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { OnboardingSystem } from './components/OnboardingSystem';
import { TRANSLATIONS } from './constants';

// Lazy Load Modules for Performance
const MyEsg = lazy(() => import('./components/MyEsg').then(module => ({ default: module.MyEsg })));
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const ResearchHub = lazy(() => import('./components/ResearchHub').then(module => ({ default: module.ResearchHub })));
const Academy = lazy(() => import('./components/Academy').then(module => ({ default: module.Academy })));
const Diagnostics = lazy(() => import('./components/Diagnostics').then(module => ({ default: module.Diagnostics })));
const StrategyHub = lazy(() => import('./components/StrategyHub').then(module => ({ default: module.StrategyHub })));
const ReportGen = lazy(() => import('./components/ReportGen').then(module => ({ default: module.ReportGen })));
const CarbonAsset = lazy(() => import('./components/CarbonAsset').then(module => ({ default: module.CarbonAsset })));
const TalentPassport = lazy(() => import('./components/TalentPassport').then(module => ({ default: module.TalentPassport })));
const IntegrationHub = lazy(() => import('./components/IntegrationHub').then(module => ({ default: module.IntegrationHub })));
const CultureBot = lazy(() => import('./components/CultureBot').then(module => ({ default: module.CultureBot })));
const FinanceSim = lazy(() => import('./components/FinanceSim').then(module => ({ default: module.FinanceSim })));
const AuditTrail = lazy(() => import('./components/AuditTrail').then(module => ({ default: module.AuditTrail })));
const GoodwillCoin = lazy(() => import('./components/GoodwillCoin').then(module => ({ default: module.GoodwillCoin })));
const Gamification = lazy(() => import('./components/Gamification').then(module => ({ default: module.Gamification })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.MY_ESG);
  const [language, setLanguage] = useState<Language>('zh-TW');

  useEffect(() => {
    // Load preference on mount
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleToggleLanguage = () => {
    const newLang = language === 'zh-TW' ? 'en-US' : 'zh-TW';
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };
  
  // Surprise Engine (Simple simulation)
  useEffect(() => {
    if (!isLoggedIn) return;
    const handleSurprise = () => {
      // In a full app, this would show a toast or unlock a badge
    };
    window.addEventListener('click', handleSurprise);
    return () => window.removeEventListener('click', handleSurprise);
  }, [isLoggedIn]);

  const renderView = () => {
    // Each route is wrapped in Suspense to handle lazy loading states
    // And wrapped in ErrorBoundary to handle module-specific crashes
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen message="Loading Module Resource..." />}>
          {(() => {
            switch (currentView) {
              case View.MY_ESG: return <MyEsg language={language} />;
              case View.DASHBOARD: return <Dashboard language={language} />;
              case View.RESEARCH_HUB: return <ResearchHub language={language} />;
              case View.ACADEMY: return <Academy language={language} />;
              case View.DIAGNOSTICS: return <Diagnostics language={language} />;
              case View.STRATEGY: return <StrategyHub language={language} />;
              case View.REPORT: return <ReportGen language={language} />;
              case View.CARBON: return <CarbonAsset language={language} />;
              case View.TALENT: return <TalentPassport language={language} />;
              case View.INTEGRATION: return <IntegrationHub language={language} />;
              case View.CULTURE: return <CultureBot language={language} />;
              case View.FINANCE: return <FinanceSim language={language} />;
              case View.AUDIT: return <AuditTrail language={language} />;
              case View.GOODWILL: return <GoodwillCoin language={language} />;
              case View.GAMIFICATION: return <Gamification language={language} />;
              case View.SETTINGS: return <Settings language={language} />;
              default: return <MyEsg language={language} />;
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <ToastProvider>
      {!isLoggedIn ? (
        <ErrorBoundary>
           <LoginScreen onLogin={() => setIsLoggedIn(true)} language={language} />
        </ErrorBoundary>
      ) : (
        <CompanyProvider>
          <OnboardingSystem />
          <Layout 
            currentView={currentView} 
            onNavigate={setCurrentView}
            language={language}
            onToggleLanguage={handleToggleLanguage}
          >
            {renderView()}
            <ErrorBoundary>
               <AiAssistant language={language} />
            </ErrorBoundary>
          </Layout>
        </CompanyProvider>
      )}
      <ToastContainer />
    </ToastProvider>
  );
};

export default App;
