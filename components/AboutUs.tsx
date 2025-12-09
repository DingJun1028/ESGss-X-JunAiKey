
import React from 'react';
import { Language } from '../types';
import { Info, Globe, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';
import { LogoIcon } from './Layout';

interface AboutUsProps {
  language: Language;
}

export const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';

  return (
    <div className="space-y-12 animate-fade-in pb-12 max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
            <div className="w-24 h-24 mx-auto relative mb-6">
                <div className="absolute inset-0 bg-celestial-gold/20 blur-xl rounded-full animate-pulse" />
                <LogoIcon className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                ESGss <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-gold to-emerald-400">Sunshine</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {isZh 
                    ? '讓永續成為企業的數位資產，讓每一次的善舉都被看見。' 
                    : 'Making sustainability a digital asset for enterprises. Making every act of good visible.'}
            </p>
            
            <a 
                href="https://www.esgsunshine.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
                <Globe className="w-4 h-4" />
                {isZh ? '訪問官方網站' : 'Visit Official Website'}
                <ArrowRight className="w-4 h-4" />
            </a>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border-t border-emerald-500/50">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">{isZh ? '我們的使命 (Mission)' : 'Our Mission'}</h3>
                <p className="text-gray-300 leading-relaxed">
                    {isZh 
                        ? '透過 JunAiKey 人工智慧引擎，為企業提供透明、可驗證且具備即時決策能力的 ESG 轉型方案，消弭漂綠風險，建立永續信任。'
                        : 'To provide transparent, verifiable, and actionable ESG transformation solutions powered by JunAiKey AI, eliminating greenwashing risks and building sustainability trust.'}
                </p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border-t border-celestial-gold/50">
                <h3 className="text-xl font-bold text-celestial-gold mb-4">{isZh ? '我們的願景 (Vision)' : 'Our Vision'}</h3>
                <p className="text-gray-300 leading-relaxed">
                    {isZh 
                        ? '打造全球最大的永續數位資產網路，連結資本、政策與知識，實現「全域永續」的普惠未來。'
                        : 'Building the world\'s largest sustainable digital asset network, connecting capital, policy, and knowledge to realize a future of "Universal Sustainability".'}
                </p>
            </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">{isZh ? '核心價值' : 'Core Values'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white mb-2">{isZh ? '誠信透明' : 'Integrity'}</h4>
                    <p className="text-sm text-gray-400">Blockchain Verified</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-celestial-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 text-celestial-purple">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white mb-2">{isZh ? '智能進化' : 'Evolution'}</h4>
                    <p className="text-sm text-gray-400">AI-Driven Growth</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white mb-2">{isZh ? '共創價值' : 'Co-Creation'}</h4>
                    <p className="text-sm text-gray-400">Ecosystem Synergy</p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-white/5 text-gray-500 text-sm">
            <p>&copy; 2025 ESGss Corp. All rights reserved.</p>
            <p className="mt-1">Powered by JunAiKey Engine v13.1.0</p>
        </div>
    </div>
  );
};
