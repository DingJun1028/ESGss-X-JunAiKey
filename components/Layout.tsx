import React from 'react';
import { 
  LayoutDashboard, GraduationCap, Search, Settings, Activity, Sun, Bell, Languages,
  Target, UserCheck, Leaf, FileText, Network, Bot, Calculator, ShieldCheck, Coins, Trophy 
} from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-celestial-900 text-gray-200 relative overflow-hidden font-sans selection:bg-celestial-emerald/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-celestial-purple/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-celestial-emerald/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-celestial-gold/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex h-screen">
        
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 hidden md:flex flex-col border-r border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="h-20 shrink-0 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-celestial-emerald to-celestial-purple flex items-center justify-center shadow-lg shadow-celestial-emerald/20">
               <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 font-bold text-xl text-white hidden lg:block tracking-tight">ESG<span className="font-light text-gray-400">Sunshine</span></span>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            <div className="text-[10px] uppercase text-gray-500 px-4 mb-2 hidden lg:block font-semibold tracking-wider">Core</div>
            <NavItem active={currentView === View.DASHBOARD} onClick={() => onNavigate(View.DASHBOARD)} icon={<LayoutDashboard className="w-5 h-5" />} label={t.nav.dashboard} />
            <NavItem active={currentView === View.RESEARCH_HUB} onClick={() => onNavigate(View.RESEARCH_HUB)} icon={<Search className="w-5 h-5" />} label={t.nav.researchHub} />
            <NavItem active={currentView === View.ACADEMY} onClick={() => onNavigate(View.ACADEMY)} icon={<GraduationCap className="w-5 h-5" />} label={t.nav.academy} />
            <NavItem active={currentView === View.DIAGNOSTICS} onClick={() => onNavigate(View.DIAGNOSTICS)} icon={<Activity className="w-5 h-5" />} label={t.nav.diagnostics} />

            <div className="text-[10px] uppercase text-gray-500 px-4 mt-6 mb-2 hidden lg:block font-semibold tracking-wider">Management</div>
            <NavItem active={currentView === View.STRATEGY} onClick={() => onNavigate(View.STRATEGY)} icon={<Target className="w-5 h-5" />} label={t.nav.strategy} />
            <NavItem active={currentView === View.CARBON} onClick={() => onNavigate(View.CARBON)} icon={<Leaf className="w-5 h-5" />} label={t.nav.carbon} />
            <NavItem active={currentView === View.TALENT} onClick={() => onNavigate(View.TALENT)} icon={<UserCheck className="w-5 h-5" />} label={t.nav.talent} />
            <NavItem active={currentView === View.REPORT} onClick={() => onNavigate(View.REPORT)} icon={<FileText className="w-5 h-5" />} label={t.nav.report} />

            <div className="text-[10px] uppercase text-gray-500 px-4 mt-6 mb-2 hidden lg:block font-semibold tracking-wider">Growth</div>
            <NavItem active={currentView === View.INTEGRATION} onClick={() => onNavigate(View.INTEGRATION)} icon={<Network className="w-5 h-5" />} label={t.nav.integration} />
            <NavItem active={currentView === View.CULTURE} onClick={() => onNavigate(View.CULTURE)} icon={<Bot className="w-5 h-5" />} label={t.nav.culture} />
            <NavItem active={currentView === View.FINANCE} onClick={() => onNavigate(View.FINANCE)} icon={<Calculator className="w-5 h-5" />} label={t.nav.finance} />
            <NavItem active={currentView === View.AUDIT} onClick={() => onNavigate(View.AUDIT)} icon={<ShieldCheck className="w-5 h-5" />} label={t.nav.audit} />
            <NavItem active={currentView === View.GOODWILL} onClick={() => onNavigate(View.GOODWILL)} icon={<Coins className="w-5 h-5" />} label={t.nav.goodwill} />
            <NavItem active={currentView === View.GAMIFICATION} onClick={() => onNavigate(View.GAMIFICATION)} icon={<Trophy className="w-5 h-5" />} label={t.nav.gamification} />
          </nav>

          <div className="shrink-0 p-4 border-t border-white/5">
            <NavItem 
              active={currentView === View.SETTINGS} 
              onClick={() => onNavigate(View.SETTINGS)} 
              icon={<Settings className="w-5 h-5" />} 
              label={t.nav.settings} 
            />
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Bar */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-sm shrink-0">
            <div className="md:hidden flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-celestial-emerald to-celestial-purple flex items-center justify-center">
                    <Sun className="w-5 h-5 text-white" />
                 </div>
            </div>
            
            <div className="hidden md:block">
                <span className="text-sm text-gray-400">Enterprise Edition • v12.0.4</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button 
                  onClick={onToggleLanguage}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm text-gray-300"
                >
                  <Languages className="w-4 h-4" />
                  <span>{language === 'zh-TW' ? 'EN' : '繁中'}</span>
                </button>

                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-celestial-gold"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-white">Alex Chen</div>
                        <div className="text-xs text-gray-500">Chief Sustainability Officer</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20 overflow-hidden">
                        <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
          </header>

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            <div className="max-w-7xl mx-auto pb-24">
                {children}
            </div>
          </main>
        </div>

        {/* Mobile Nav (Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-2 z-40">
            <button onClick={() => onNavigate(View.DASHBOARD)} className={`p-2 rounded-lg ${currentView === View.DASHBOARD ? 'text-celestial-emerald' : 'text-gray-500'}`}><LayoutDashboard className="w-6 h-6"/></button>
            <button onClick={() => onNavigate(View.RESEARCH_HUB)} className={`p-2 rounded-lg ${currentView === View.RESEARCH_HUB ? 'text-celestial-emerald' : 'text-gray-500'}`}><Search className="w-6 h-6"/></button>
            <button onClick={() => onNavigate(View.CARBON)} className={`p-2 rounded-lg ${currentView === View.CARBON ? 'text-celestial-emerald' : 'text-gray-500'}`}><Leaf className="w-6 h-6"/></button>
            <button onClick={() => onNavigate(View.ACADEMY)} className={`p-2 rounded-lg ${currentView === View.ACADEMY ? 'text-celestial-emerald' : 'text-gray-500'}`}><GraduationCap className="w-6 h-6"/></button>
        </div>

      </div>
    </div>
  );
};

// Nav Helper
const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${active 
        ? 'bg-gradient-to-r from-celestial-emerald/20 to-transparent text-white border-l-2 border-celestial-emerald' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
      }`}
  >
    <span className={`${active ? 'text-celestial-emerald' : 'text-gray-400 group-hover:text-white'}`}>
      {icon}
    </span>
    <span className="hidden lg:block text-sm font-medium text-left truncate">{label}</span>
  </button>
);