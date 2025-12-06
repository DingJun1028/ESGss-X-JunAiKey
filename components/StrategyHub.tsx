
import React, { useState, useEffect } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { AlertTriangle, Users, TrendingUp, Globe, ShieldAlert, Target, ArrowRight, Layers, BrainCircuit, Sparkles } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';

interface StrategyHubProps {
  language: Language;
}

export const StrategyHub: React.FC<StrategyHubProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { esgScores, carbonCredits } = useCompany();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAiTrigger = () => {
     addToast('info', 'AI Strategy Agent analyzing heatmaps...', 'Neural Link');
  };

  // Dynamic Risk Calculation Logic
  // Using God Mode inputs to simulate real analysis
  const calculateRisks = () => {
      // 1. Carbon Pricing Risk (Depends on Carbon Credits)
      // Low credits (< 1000) = High Risk
      const carbonRiskLevel = carbonCredits < 1000 ? 'critical' : carbonCredits < 5000 ? 'high' : 'medium';
      
      // 2. Reputation Risk (Depends on Social Score)
      // Low Social Score (< 70) = High Risk
      const reputationRiskLevel = esgScores.social < 60 ? 'critical' : esgScores.social < 80 ? 'medium' : 'low';

      // 3. Compliance Risk (Depends on Governance Score)
      const complianceRiskLevel = esgScores.governance < 60 ? 'critical' : esgScores.governance < 85 ? 'medium' : 'low';

      return [
        { name: isZh ? '碳定價衝擊' : 'Carbon Pricing', level: carbonRiskLevel, probability: 'high' },
        { name: isZh ? '商譽風險' : 'Reputation', level: reputationRiskLevel, probability: 'medium' },
        { name: isZh ? '合規風險' : 'Compliance', level: complianceRiskLevel, probability: 'high' },
        { name: isZh ? '極端氣候事件' : 'Extreme Weather', level: 'high', probability: 'medium' }, // External factor, kept constant
        { name: isZh ? '供應鏈中斷' : 'Supply Chain', level: 'medium', probability: 'high' },
        { name: isZh ? '人才流失' : 'Talent Loss', level: esgScores.social < 70 ? 'high' : 'low', probability: 'low' },
      ];
  };

  const risks = calculateRisks();

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/80 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse';
      case 'high': return 'bg-amber-500/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'medium': return 'bg-yellow-500/80 border-yellow-400';
      case 'low': return 'bg-emerald-500/80 border-emerald-400';
      default: return 'bg-gray-500';
    }
  };

  // Mock Data demonstrating the "8 Evolutionary Traits"
  const metrics = [
    {
      label: isZh ? '氣候風險值 (CVaR)' : 'Climate Value at Risk',
      value: '$4.2M',
      subValue: isZh ? 'AI 填補推算' : 'AI Gap-Filled Estimation',
      trend: { value: 2.5, direction: 'down' as const },
      color: 'gold' as const,
      icon: AlertTriangle,
      confidence: 'medium' as const,
      traits: ['gap-filling', 'optimization'], 
      dataLink: 'ai' as const
    },
    {
      label: isZh ? '利害關係人議合' : 'Stakeholder Engagement',
      value: `${esgScores.social}/100`, // Linked to real data
      subValue: isZh ? '持續學習中...' : 'Self-Learning...',
      trend: { value: 5.4, direction: 'up' as const },
      color: 'purple' as const,
      icon: Users,
      confidence: 'high' as const,
      traits: ['learning', 'evolution'], 
      tags: ['Social', 'Gov']
    },
    {
      label: isZh ? '綠色營收占比' : 'Green Revenue Share',
      value: '18.5%',
      subValue: isZh ? '性能飆升' : 'Performance Surge',
      trend: { value: 12.2, direction: 'up' as const },
      color: 'emerald' as const,
      icon: TrendingUp,
      confidence: 'high' as const,
      verified: true,
      traits: ['performance', 'tagging', 'bridging'], 
      tags: ['EU Taxonomy', 'KPI']
    },
    {
      label: isZh ? '天衣無縫整合' : 'Seamless Integration',
      value: '100%',
      subValue: 'Native Cloud',
      trend: { value: 0, direction: 'neutral' as const },
      color: 'blue' as const,
      icon: ShieldAlert,
      confidence: 'high' as const,
      traits: ['seamless'], 
      dataLink: 'live' as const
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
            {t.modules.strategy.title}
            <div className="px-2 py-0.5 rounded-full bg-celestial-purple/20 border border-celestial-purple/30 flex items-center gap-1">
               <BrainCircuit className="w-3 h-3 text-celestial-purple" />
               <span className="text-[10px] text-celestial-purple font-mono">NEURAL LINK CONNECTED</span>
            </div>
          </h2>
          <p className="text-gray-400">{t.modules.strategy.desc}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-xs text-emerald-400 font-medium font-mono">{isZh ? 'Quantum Bricks: ACTIVE' : 'Quantum Bricks: ACTIVE'}</span>
        </div>
      </div>

      {/* Omni-ESG-Cells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => (
              <OmniEsgCell key={i} mode="card" loading={true} />
            ))
          : metrics.map((m, idx) => (
              <OmniEsgCell
                key={idx}
                mode="card"
                label={m.label}
                value={m.value}
                subValue={m.subValue}
                trend={m.trend}
                color={m.color}
                icon={m.icon}
                confidence={m.confidence}
                verified={m.verified}
                traits={m.traits as any}
                tags={m.tags}
                dataLink={m.dataLink}
                onAiAnalyze={handleAiTrigger}
              />
            ))
        }
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Risk Heatmap Section */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col group min-h-[400px]">
          {isLoading ? (
            <div className="w-full h-full flex flex-col gap-6 animate-pulse">
               <div className="flex justify-between">
                  <div className="h-6 w-48 bg-white/10 rounded" />
                  <div className="h-6 w-24 bg-white/10 rounded" />
               </div>
               <div className="flex-1 bg-slate-900/30 rounded-xl border border-white/5 relative">
                   <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-8">
                      {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="bg-white/5 rounded-xl border border-white/5" />
                      ))}
                   </div>
               </div>
            </div>
          ) : (
            <>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-2 text-xs text-celestial-purple bg-white/5 px-2 py-1 rounded border border-white/10 hover:bg-white/10">
                    <Sparkles className="w-3 h-3" /> AI Simulation
                  </button>
              </div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-celestial-blue" />
                  {isZh ? '氣候實體與轉型風險熱點圖' : 'Climate & Transition Risk Heatmap'}
                </h3>
                <div className="flex gap-2 text-[10px] bg-slate-900/50 p-1.5 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">Critical</span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">High</span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>
                </div>
              </div>
              
              <div className="relative flex-1 min-h-[350px] w-full bg-slate-900/30 rounded-xl border border-white/5 p-8 flex items-center justify-center overflow-hidden">
                {/* Dynamic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-celestial-purple/5 to-transparent pointer-events-none" />

                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none p-8 z-0">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/5 border-dashed relative">
                            {i === 4 && <div className="absolute inset-0 bg-white/5 blur-xl animate-pulse" />}
                        </div>
                    ))}
                </div>

                {/* Matrix Items */}
                <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 gap-4 z-10">
                    {/* Axis Labels */}
                    <div className="absolute -left-6 top-1/2 -rotate-90 text-[9px] font-bold text-gray-500 tracking-[0.2em] flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> IMPACT
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 tracking-[0.2em] flex items-center gap-2">
                      PROBABILITY <ArrowRight className="w-3 h-3" />
                    </div>
                    
                    {risks.map((risk, i) => (
                        <div key={i} className={`
                            relative group flex items-center justify-center rounded-xl border backdrop-blur-md cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg
                            ${getHeatmapColor(risk.level)}
                            ${risk.probability === 'high' ? 'col-start-3' : risk.probability === 'medium' ? 'col-start-2' : 'col-start-1'}
                            ${risk.level === 'critical' || risk.level === 'high' ? 'row-start-1' : risk.level === 'medium' ? 'row-start-2' : 'row-start-3'}
                        `}>
                            <span className="text-[10px] sm:text-xs font-bold text-white text-center px-2 drop-shadow-md leading-tight">{risk.name}</span>
                            
                            {/* Hover Tooltip - Agentic Style */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900/95 border border-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 text-center pointer-events-none shadow-2xl z-20 backdrop-blur-xl translate-y-2 group-hover:translate-y-0">
                                <div className="text-xs font-bold text-white mb-1 border-b border-white/10 pb-1 flex justify-between items-center">
                                    {risk.name}
                                    <Sparkles className="w-3 h-3 text-celestial-gold" />
                                </div>
                                <div className="text-[10px] text-gray-400 mb-1">Impact: {risk.level.toUpperCase()}</div>
                                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 py-1 px-2 rounded-full mt-1">
                                    <ShieldAlert className="w-3 h-3" /> Mitigation Active
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Strategic Initiatives List using OmniEsgCell List Mode */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-celestial-purple" />
            {isZh ? '關鍵策略行動' : 'Key Strategic Initiatives'}
          </h3>
          
          <div className="space-y-4 flex-1">
            {isLoading 
              ? Array.from({ length: 3 }).map((_, i) => (
                  <OmniEsgCell key={i} mode="list" loading={true} />
                ))
              : [1, 2, 3].map((i) => (
                <OmniEsgCell 
                  key={i}
                  mode="list"
                  label={isZh ? `供應鏈去碳化 Phase ${i}` : `Supply Chain Phase ${i}`}
                  subValue={isZh ? `Q${i} 2024 • SBTi 目標` : `Q${i} 2024 • SBTi Target`}
                  value={`${30 * i}%`}
                  trend={{ value: 5 + i, direction: 'up' }}
                  confidence="high"
                  verified={true}
                  color="purple"
                  icon={Target}
                  traits={i === 1 ? ['learning'] : i === 2 ? ['performance', 'optimization'] : ['seamless', 'bridging']}
                  tags={['SBTi', 'Scope 3']}
                  onAiAnalyze={handleAiTrigger}
                />
              ))
            }
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
             <button onClick={handleAiTrigger} disabled={isLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-celestial-gold/10 to-transparent border border-celestial-gold/30 text-sm text-celestial-gold hover:bg-celestial-gold/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50">
                <div className="absolute inset-0 bg-celestial-gold/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 blur-xl"/>
                <BrainCircuit className="w-4 h-4 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">{isZh ? 'AI 策略建議產生器 (Agent)' : 'AI Strategy Agent'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
