
import React, { useState, useEffect } from 'react';
import { View, Language } from './types';
import { Layout } from './components/Layout';
import { MyEsg } from './components/MyEsg';
import { Dashboard } from './components/Dashboard';
import { ResearchHub } from './components/ResearchHub';
import { Academy } from './components/Academy';
import { Diagnostics } from './components/Diagnostics';
import { StrategyHub } from './components/StrategyHub';
import { AiAssistant } from './components/AiAssistant';
import { LoginScreen } from './components/LoginScreen';
import { ToastProvider } from './contexts/ToastContext';
import { CompanyProvider } from './components/providers/CompanyProvider';
import { ToastContainer } from './components/Toast';
import { ReportGen } from './components/ReportGen';
import { CarbonAsset } from './components/CarbonAsset';
import { TalentPassport } from './components/TalentPassport';
import { IntegrationHub } from './components/IntegrationHub';
import { CultureBot } from './components/CultureBot';
import { FinanceSim } from './components/FinanceSim';
import { AuditTrail } from './components/AuditTrail';
import { GoodwillCoin } from './components/GoodwillCoin';
import { Gamification } from './components/Gamification';
import { Settings } from './components/Settings';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.MY_ESG); // Default to My ESG
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
      // console.log("✨ Surprise Engine: Interaction recorded for gamification.");
    };
    window.addEventListener('click', handleSurprise);
    return () => window.removeEventListener('click', handleSurprise);
  }, [isLoggedIn]);

  const renderView = () => {
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
  };

  return (
    <ToastProvider>
      {!isLoggedIn ? (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} language={language} />
      ) : (
        <CompanyProvider>
          <Layout 
            currentView={currentView} 
            onNavigate={setCurrentView}
            language={language}
            onToggleLanguage={handleToggleLanguage}
          >
            {renderView()}
            <AiAssistant language={language} />
          </Layout>
        </CompanyProvider>
      )}
      <ToastContainer />
    </ToastProvider>
  );
};

export default App;
