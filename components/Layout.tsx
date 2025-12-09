
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, GraduationCap, Search, Settings, Activity, Sun, Bell, Languages,
  Target, UserCheck, Leaf, FileText, Network, Bot, Calculator, ShieldCheck, Coins, Trophy, X, Zap, Star, Home, Radio, Command, Briefcase, Stethoscope, Wrench, Crown
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

// Updated to use the real image file as requested.
export const LogoIcon = ({ className }: { className?: string }) => (
  <img 
    src="https://thumbs4.imagebam.com/7f/89/20/ME18KXN8_t.png" 
    alt="ESGss Logo" 
    className={`object-contain ${className}`}
  />
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, language, onToggleLanguage, children }) => {
  const t = TRANSLATIONS[language];
  const { userName, userRole, xp, level, goodwillBalance, latestEvent, totalScore } = useCompany();
  const { notifications, clearNotifications } = useToast();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const currentLevelBaseXp = (level - 1) * 1000;
  const xpProgress = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / 1000) * 100));
  const isCritical = totalScore < 60;

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

  const navItems = [
      { id: View.MY_ESG, icon: Home, label: t.nav.myEsg },
      { id: View.DASHBOARD, icon: LayoutDashboard, label: t.nav.dashboard },
      { id: View.YANG_BO, icon: Crown, label: t.nav.yangBo },
      { id: View.BUSINESS_INTEL, icon: Briefcase, label: t.nav.businessIntel },
      { id: View.HEALTH_CHECK, icon: Stethoscope, label: t.nav.healthCheck },
      { id: View.RESEARCH_HUB, icon: Search, label: t.nav.researchHub },
      { id: View.ACADEMY, icon: GraduationCap, label: t.nav.academy },
      { id: View.CARBON, icon: Leaf, label: t.nav.carbon },
      { id: View.REPORT, icon: FileText, label: t.nav.report },
      { id: View.INTEGRATION, icon: Network, label: t.nav.integration },
      { id: View.UNIVERSAL_TOOLS, icon: Wrench, label: t.nav.universalTools },
      { id: View.GOODWILL, icon: Coins, label: t.nav.goodwill },
  ];

  return (
    <div className={`min-h-screen bg-celestial-900 text-gray-200 relative overflow-hidden font-sans selection:bg-celestial-emerald/30 transition-colors duration-1000 ${isCritical ? 'border-4 border-red-500/20' : ''}`}>
      
      {/* Background Ambience: Aurora Flow (Optimized with will-change-transform) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        
        <div 
            className={`absolute top-[-20%] left-[-20%] w-[120%] h-[80%] rounded-[100%] blur-[120px] opacity-30 animate-blob mix-blend-screen transform -rotate-12 ${isCritical ? 'bg-red-900' : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900'}`} 
            style={{ willChange: 'transform' }}
        />
        
        <div 
            className={`absolute top-[10%] right-[-20%] w-[120%] h-[70%] rounded-[100%] blur-[100px] opacity-20 animate-blob animation-delay-2000 mix-blend-screen transform rotate-12 ${isCritical ? 'bg-orange-900' : 'bg-gradient-to-l from-emerald-900 via-teal-900 to-cyan-900'}`} 
            style={{ willChange: 'transform' }}
        />
        
        <div 
            className="absolute bottom-[-10%] left-[10%] w-[100%] h-[50%] rounded-[100%] blur-[120px] opacity-10 animate-blob animation-delay-4000 mix-blend-screen bg-gradient-to-t from-amber-900 via-yellow-900 to-transparent" 
            style={{ willChange: 'transform' }}
        />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-150 contrast-200" />
      </div>

      <VoiceControl onNavigate={onNavigate} language={language} />

      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onNavigate={onNavigate} 
        language={language}
        toggleLanguage={onToggleLanguage}
      />

      <div className="relative z-10 flex h-screen">
        
        <aside className="w-20 lg:w-64 hidden md:flex flex-col border-r border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
          {/* Immersive Sidebar Branding */}
          <div className="h-28 shrink-0 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5 gap-3 relative overflow-hidden group">
            {/* Ambient Glow Behind Logo */}
            <div className="absolute top-1/2 left-8 w-12 h-12 bg-celestial-gold/20 blur-[20px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-1/2 left-4 w-16 h-16 bg-celestial-emerald/10 blur-[30px] rounded-full pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="relative z-10">
               <LogoIcon className="w-12 h-12 shrink-0 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="flex flex-col relative z-10 hidden lg:flex">
                <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                  ESGss
                </span>
                <span className="font-bold text-[10px] text-celestial-emerald tracking-[0.2em] uppercase glow-text-emerald">
                  JunAiKey
                </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            <div className="text-[10px] uppercase text-gray-500 px-4 mb-2 hidden lg:block font-semibold tracking-wider">Strategy & Intel</div>
            <NavItem active={currentView === View.MY_ESG} onClick={() => onNavigate(View.MY_ESG)} icon={<Home className="w-5 h-5" />} label={t.nav.myEsg} />
            <NavItem active={currentView === View.YANG_BO} onClick={() => onNavigate(View.YANG_BO)} icon={<Crown className="w-5 h-5 text-celestial-gold" />} label={t.nav.yangBo} />
            <NavItem 
                active={currentView === View.BUSINESS_INTEL} 
                onClick={() => onNavigate(View.BUSINESS_INTEL)} 
                icon={<Briefcase className="w-5 h-5 text-celestial-blue" />} 
                label={t.nav.businessIntel}
                badge="NEW"
            />
            <NavItem active={currentView === View.HEALTH_CHECK} onClick={() => onNavigate(View.HEALTH_CHECK)} icon={<Stethoscope className="w-5 h-5" />} label={t.nav.healthCheck} />
            <NavItem active={currentView === View.STRATEGY} onClick={() => onNavigate(View.STRATEGY)} icon={<Target className="w-5 h-5" />} label={t.nav.strategy} />

            <div className="text-[10px] uppercase text-gray-500 px-4 mt-6 mb-2 hidden lg:block font-semibold tracking-wider">Core Ops</div>
            <NavItem active={currentView === View.DASHBOARD} onClick={() => onNavigate(View.DASHBOARD)} icon={<LayoutDashboard className="w-5 h-5" />} label={t.nav.dashboard} />
            <NavItem active={currentView === View.CARBON} onClick={() => onNavigate(View.CARBON)} icon={<Leaf className="w-5 h-5" />} label={t.nav.carbon} />
            <NavItem active={currentView === View.REPORT} onClick={() => onNavigate(View.REPORT)} icon={<FileText className="w-5 h-5" />} label={t.nav.report} />
            <NavItem active={currentView === View.INTEGRATION} onClick={() => onNavigate(View.INTEGRATION)} icon={<Network className="w-5 h-5" />} label={t.nav.integration} />
            <NavItem active={currentView === View.UNIVERSAL_TOOLS} onClick={() => onNavigate(View.UNIVERSAL_TOOLS)} icon={<Wrench className="w-5 h-5" />} label={t.nav.universalTools} />

            <div className="text-[10px] uppercase text-gray-500 px-4 mt-6 mb-2 hidden lg:block font-semibold tracking-wider">Growth</div>
            <NavItem active={currentView === View.RESEARCH_HUB} onClick={() => onNavigate(View.RESEARCH_HUB)} icon={<Search className="w-5 h-5" />} label={t.nav.researchHub} />
            <NavItem active={currentView === View.ACADEMY} onClick={() => onNavigate(View.ACADEMY)} icon={<GraduationCap className="w-5 h-5" />} label={t.nav.academy} />
            <NavItem active={currentView === View.TALENT} onClick={() => onNavigate(View.TALENT)} icon={<UserCheck className="w-5 h-5" />} label={t.nav.talent} />
            <NavItem active={currentView === View.CULTURE} onClick={() => onNavigate(View.CULTURE)} icon={<Bot className="w-5 h-5" />} label={t.nav.culture} />
            <NavItem active={currentView === View.FINANCE} onClick={() => onNavigate(View.FINANCE)} icon={<Calculator className="w-5 h-5" />} label={t.nav.finance} />
            <NavItem active={currentView === View.AUDIT} onClick={() => onNavigate(View.AUDIT)} icon={<ShieldCheck className="w-5 h-5" />} label={t.nav.audit} />
            <NavItem active={currentView === View.GOODWILL} onClick={() => onNavigate(View.GOODWILL)} icon={<Coins className="w-5 h-5" />} label={t.nav.goodwill} />
            <NavItem active={currentView === View.GAMIFICATION} onClick={() => onNavigate(View.GAMIFICATION)} icon={<Trophy className="w-5 h-5" />} label={t.nav.gamification} />
            <NavItem active={currentView === View.DIAGNOSTICS} onClick={() => onNavigate(View.DIAGNOSTICS)} icon={<Activity className="w-5 h-5" />} label={t.nav.diagnostics} />
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

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-sm shrink-0 relative z-30">
            <div className="flex items-center gap-4 flex-1">
                <div className="md:hidden flex items-center gap-2 relative">
                     {/* Mobile Header Glow */}
                     <div className="absolute inset-0 bg-celestial-gold/20 blur-xl rounded-full pointer-events-none" />
                     <div className="w-10 h-10 flex items-center justify-center relative z-10">
                        <LogoIcon className="w-full h-full drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                     </div>
                </div>
                
                <div className="hidden lg:flex items-center gap-2 text-xs overflow-hidden max-w-lg bg-black/20 rounded-full px-3 py-1 border border-white/5">
                    <Radio className="w-3 h-3 text-red-400 animate-pulse shrink-0" />
                    <span className="text-gray-500 font-bold shrink-0">LIVE FEED:</span>
                    <div className="animate-[slide-left_15s_linear_infinite] whitespace-nowrap text-gray-300">
                        {latestEvent || "System Normal. Monitoring global sustainability indices..."}
                    </div>
                </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
                <button 
                    onClick={() => setIsCommandOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-sm transition-all group"
                >
                    <Search className="w-4 h-4 group-hover:text-white" />
                    <span className="hidden lg:inline">Search...</span>
                    <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-500">⌘K</kbd>
                </button>

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

          <main className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
            <div className="max-w-7xl mx-auto pb-24">
                {children}
            </div>
          </main>
        </div>

        {/* Improved Mobile Navigation: Horizontal Scroll */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40">
            <div className="flex items-center overflow-x-auto h-full px-4 gap-6 no-scrollbar snap-x">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center min-w-[3rem] snap-center ${currentView === item.id ? 'text-celestial-emerald' : 'text-gray-500'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[9px] whitespace-nowrap">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
      ${active 
        ? 'bg-gradient-to-r from-celestial-emerald/20 to-transparent text-white border-l-2 border-celestial-emerald' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
      }`}
  >
    <span className={`${active ? 'text-celestial-emerald' : 'text-gray-400 group-hover:text-white'}`}>
      {icon}
    </span>
    <span className="hidden lg:block text-sm font-medium text-left truncate flex-1">{label}</span>
    {badge && (
        <span className="hidden lg:block text-[9px] font-bold px-1.5 py-0.5 rounded bg-celestial-blue text-white shadow-lg animate-pulse">{badge}</span>
    )}
  </button>
);
