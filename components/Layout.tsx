
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, GraduationCap, Search, Settings, Activity, Sun, Bell, Languages,
  Target, UserCheck, Leaf, FileText, Network, Bot, Calculator, ShieldCheck, Coins, Trophy, X, Zap, Star, Home, Radio, Command
} from 'lucide-react';
import { View, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { VoiceControl } from './VoiceControl';
import { CommandPalette } from './CommandPalette';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];
  const { userName, userRole, xp, level, goodwillBalance, latestEvent, totalScore } = useCompany();
  const { notifications, clearNotifications } = useToast();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Calculate XP percentage for current level (Level N starts at (N-1)*1000)
  const currentLevelBaseXp = (level - 1) * 1000;
  const nextLevelXp = level * 1000;
  const xpProgress = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / 1000) * 100));

  // Visual Alarm for Low Score
  const isCritical = totalScore < 60;

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen bg-celestial-900 text-gray-200 relative overflow-hidden font-sans selection:bg-celestial-emerald/30 transition-colors duration-1000 ${isCritical ? 'border-4 border-red-500/20' : ''}`}>
      
      {/* Background Ambience: Aurora Flow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Aurora Stream 1 (Purple/Blue) */}
        <div className={`absolute top-[-20%] left-[-20%] w-[120%] h-[80%] rounded-[100%] blur-[120px] opacity-30 animate-blob mix-blend-screen transform -rotate-12 ${isCritical ? 'bg-red-900' : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900'}`} />
        
        {/* Aurora Stream 2 (Emerald/Teal) */}
        <div className={`absolute top-[10%] right-[-20%] w-[120%] h-[70%] rounded-[100%] blur-[100px] opacity-20 animate-blob animation-delay-2000 mix-blend-screen transform rotate-12 ${isCritical ? 'bg-orange-900' : 'bg-gradient-to-l from-emerald-900 via-teal-900 to-cyan-900'}`} />
        
        {/* Aurora Stream 3 (Gold Accent) */}
        <div className="absolute bottom-[-10%] left-[10%] w-[100%] h-[50%] rounded-[100%] blur-[120px] opacity-10 animate-blob animation-delay-4000 mix-blend-screen bg-gradient-to-t from-amber-900 via-yellow-900 to-transparent" />
        
        {/* Noise Overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-150 contrast-200" />
      </div>

      {/* Voice Control Interface */}
      <VoiceControl onNavigate={onNavigate} language={language} />

      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onNavigate={onNavigate} 
        language={language}
        toggleLanguage={onToggleLanguage}
      />

      {/* Main Container */}
      <div className="relative z-10 flex h-screen">
        
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 hidden md:flex flex-col border-r border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="h-20 shrink-0 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-celestial-emerald to-celestial-purple flex items-center justify-center shadow-lg shadow-celestial-emerald/20">
               <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 font-bold text-xl text-white hidden lg:block tracking-tight">ESGss<span className="font-light text-gray-400"> X JunAiKey</span></span>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            <div className="text-[10px] uppercase text-gray-500 px-4 mb-2 hidden lg:block font-semibold tracking-wider">Core</div>
            <NavItem active={currentView === View.MY_ESG} onClick={() => onNavigate(View.MY_ESG)} icon={<Home className="w-5 h-5" />} label={t.nav.myEsg} />
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
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-sm shrink-0 relative z-30">
            <div className="flex items-center gap-4 flex-1">
                <div className="md:hidden flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-celestial-emerald to-celestial-purple flex items-center justify-center">
                        <Sun className="w-5 h-5 text-white" />
                     </div>
                </div>
                
                {/* Live Ticker */}
                <div className="hidden lg:flex items-center gap-2 text-xs overflow-hidden max-w-lg bg-black/20 rounded-full px-3 py-1 border border-white/5">
                    <Radio className="w-3 h-3 text-red-400 animate-pulse shrink-0" />
                    <span className="text-gray-500 font-bold shrink-0">LIVE FEED:</span>
                    <div className="animate-[slide-left_15s_linear_infinite] whitespace-nowrap text-gray-300">
                        {latestEvent || "System Normal. Monitoring global sustainability indices..."}
                    </div>
                </div>
            </div>
            
            {/* Gamification HUD (Global Status Pod) */}
            <div className="hidden md:flex items-center gap-6">
                {/* Search Trigger */}
                <button 
                    onClick={() => setIsCommandOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-sm transition-all group"
                >
                    <Search className="w-4 h-4 group-hover:text-white" />
                    <span className="hidden lg:inline">Search...</span>
                    <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-500">⌘K</kbd>
                </button>

                {/* Level Pod */}
                <div className="flex items-center gap-3 bg-slate-900/60 border border-white/10 rounded-full pr-4 pl-1 py-1 group hover:border-white/20 transition-all cursor-pointer" onClick={() => onNavigate(View.GAMIFICATION)} title="Click to view full profile">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-celestial-purple to-blue-600 flex items-center justify-center font-bold text-xs text-white border-2 border-slate-900 shadow-lg">
                        {level}
                    </div>
                    <div className="flex flex-col w-32">
                        <div className="flex justify-between text-[10px] text-gray-300 font-medium mb-1">
                            <span>Level {level}</span>
                            <span>{Math.floor(xpProgress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-celestial-purple to-blue-400 relative"
                                style={{ width: `${xpProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coin Pod */}
                <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-full px-3 py-1.5 hover:bg-celestial-gold/10 hover:border-celestial-gold/30 transition-all cursor-pointer group" onClick={() => onNavigate(View.GOODWILL)}>
                    <Coins className="w-4 h-4 text-celestial-gold group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-bold text-celestial-gold font-mono">{goodwillBalance.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-4">
                <button 
                  onClick={onToggleLanguage}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm text-gray-300"
                >
                  <Languages className="w-4 h-4" />
                  <span>{language === 'zh-TW' ? 'EN' : '繁中'}</span>
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`relative transition-colors ${isNotificationsOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-celestial-gold animate-pulse"></span>
                        )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top-right z-50">
                            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <span className="text-sm font-bold text-white">Notifications ({notifications.length})</span>
                                <button onClick={() => setIsNotificationsOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-white" /></button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-xs">No notifications</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-xs font-bold ${n.type === 'success' ? 'text-emerald-400' : n.type === 'warning' ? 'text-amber-400' : n.type === 'error' ? 'text-red-400' : n.type === 'reward' ? 'text-celestial-gold' : 'text-blue-400'}`}>
                                                    {n.type === 'reward' && <Star className="w-3 h-3 inline mr-1 fill-current" />}
                                                    {n.title || 'System'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-300 group-hover:text-white transition-colors">{n.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-2 bg-white/5 text-center">
                                <button onClick={clearNotifications} className="text-xs text-gray-400 hover:text-white transition-colors">Clear all</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-white">{userName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{userRole}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20 overflow-hidden cursor-pointer hover:ring-2 hover:ring-celestial-purple transition-all" onClick={() => onNavigate(View.SETTINGS)}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
          </header>

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
            <div className="max-w-7xl mx-auto pb-24">
                {children}
            </div>
          </main>
        </div>

        {/* Mobile Nav (Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-2 z-40">
            <button onClick={() => onNavigate(View.MY_ESG)} className={`p-2 rounded-lg ${currentView === View.MY_ESG ? 'text-celestial-emerald' : 'text-gray-500'}`}><Home className="w-6 h-6"/></button>
            <button onClick={() => onNavigate(View.DASHBOARD)} className={`p-2 rounded-lg ${currentView === View.DASHBOARD ? 'text-celestial-emerald' : 'text-gray-500'}`}><LayoutDashboard className="w-6 h-6"/></button>
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
