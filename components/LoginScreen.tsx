import React, { useState } from 'react';
import { Sun, Lock, User, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  language: 'zh-TW' | 'en-US';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isZh = language === 'zh-TW';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Supabase Auth Delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-celestial-900 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-celestial-purple/20 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-celestial-emerald/20 rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="glass-panel p-8 rounded-3xl border-t border-white/20 shadow-2xl shadow-celestial-purple/20">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-celestial-emerald to-celestial-purple flex items-center justify-center shadow-lg shadow-celestial-emerald/30 mb-4 animate-float">
               <Sun className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">ESG<span className="font-light text-gray-400">Sunshine</span></h1>
            <p className="text-xs text-celestial-gold mt-2 uppercase tracking-widest">Celestial Nexus v12</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {!isDevMode && (
              <>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-celestial-emerald transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isZh ? "企業信箱" : "Enterprise Email"}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-celestial-emerald/50 focus:ring-1 focus:ring-celestial-emerald/50 transition-all"
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-celestial-purple transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isZh ? "密碼" : "Password"}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 transition-all"
                    required
                  />
                </div>
              </>
            )}

            {isDevMode && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400 mb-1">{isZh ? "開發者模式已啟用" : "Developer Mode Enabled"}</h4>
                  <p className="text-xs text-gray-400">
                    {isZh 
                      ? "Auth 驗證已繞過。將以「CSO 管理員」權限登入系統。" 
                      : "Auth bypassed. Logging in with 'CSO Admin' privileges."}
                  </p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-celestial-emerald to-celestial-purple text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isZh ? "進入平台" : "Enter Platform"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {isZh ? "安全連接: Supabase Auth" : "Secured by Supabase Auth"}
            </span>
            <button 
              onClick={() => setIsDevMode(!isDevMode)}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {isDevMode ? <ToggleRight className="w-8 h-8 text-celestial-emerald" /> : <ToggleLeft className="w-8 h-8" />}
              <span>DevMode</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};