
import React, { useState, useEffect } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { AlertTriangle, Users, TrendingUp, Globe, ShieldAlert, Target, ArrowRight, Layers, BrainCircuit, Sparkles, X, ChevronRight, FileText } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { generateRiskMitigationPlan } from '../services/ai-service';
import { marked } from 'marked';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';

interface StrategyHubProps {
  language: Language;
}

// ----------------------------------------------------------------------
// Universal Agent: Strategic Risk Node
// ----------------------------------------------------------------------
interface RiskNodeProps extends InjectedProxyProps {
    name: string;
    level: string;
    probability: string;
    onClick: () => void;
}

const RiskNodeBase: React.FC<RiskNodeProps> = ({ 
    name, level, probability, onClick, 
    adaptiveTraits, trackInteraction, isHighFrequency, isAgentActive 
}) => {
    
    // Determine base styles based on level
    const getBaseColor = (lvl: string) => {
        switch (lvl) {
            case 'critical': return 'bg-red-500/80 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse';
            case 'high': return 'bg-amber-500/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
            case 'medium': return 'bg-yellow-500/80 border-yellow-400';
            case 'low': return 'bg-emerald-500/80 border-emerald-400';
            default: return 'bg-gray-500';
        }
    };

    // Agent Logic: If interacted frequently ('evolution' trait), change appearance
    const isEvolved = adaptiveTraits?.includes('evolution');
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive;

    const dynamicClasses = isEvolved 
        ? 'scale-110 shadow-2xl z-20 ring-2 ring-white' 
        : 'hover:scale-110 transition-all duration-300';

    const handleClick = () => {
        trackInteraction?.('click'); // Feed the brain
        onClick();
    };

    return (
        <div 
            onClick={handleClick}
            className={`
                relative group flex items-center justify-center rounded-xl border backdrop-blur-md cursor-pointer shadow-lg
                ${getBaseColor(level)}
                ${dynamicClasses}
                ${probability === 'high' ? 'col-start-3' : probability === 'medium' ? 'col-start-2' : 'col-start-1'}
                ${level === 'critical' || level === 'high' ? 'row-start-1' : level === 'medium' ? 'row-start-2' : 'row-start-3'}
            `}
        >
            <span className="text-[10px] sm:text-xs font-bold text-white text-center px-2 drop-shadow-md">{name}</span>
            
            {/* Agent Indicators */}
            <div className="absolute top-1 right-1 flex gap-1">
                {isLearning && <div className="w-2 h-2 rounded-full bg-celestial-purple animate-ping" />}
                <Sparkles className={`w-3 h-3 text-white ${isEvolved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
            </div>
        </div>
    );
};

// Wrap it to make it an Agent
const StrategicRiskAgent = withUniversalProxy(RiskNodeBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const StrategyHub: React.FC<StrategyHubProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { esgScores, carbonCredits, budget, companyName } = useCompany();
  
  const [analyzingRisk, setAnalyzingRisk] = useState<string | null>(null);
  const [riskInsight, setRiskInsight] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleRiskClick = async (riskName: string) => {
      setAnalyzingRisk(riskName);
      setRiskInsight('');
      setIsAiProcessing(true);
      
      const context = {
          company: companyName,
          scores: esgScores,
          budget_available: budget,
          carbon_inventory: carbonCredits
      };

      try {
          // Use the deep reasoning function which NOW updates the Universal Library
          const plan = await generateRiskMitigationPlan(riskName, context, language);
          setRiskInsight(plan);
      } catch (e) {
          setRiskInsight('AI Analysis Failed. Please check API Key.');
      } finally {
          setIsAiProcessing(false);
      }
  };

  const risks = [
    { id: 'risk-1', name: isZh ? '碳定價衝擊' : 'Carbon Pricing', level: carbonCredits < 1000 ? 'critical' : 'high', probability: 'high' },
    { id: 'risk-2', name: isZh ? '商譽風險' : 'Reputation', level: esgScores.social < 70 ? 'critical' : 'medium', probability: 'medium' },
    { id: 'risk-3', name: isZh ? '合規風險' : 'Compliance', level: esgScores.governance < 80 ? 'high' : 'low', probability: 'high' },
    { id: 'risk-4', name: isZh ? '極端氣候' : 'Extreme Weather', level: 'high', probability: 'medium' }, 
    { id: 'risk-5', name: isZh ? '供應鏈中斷' : 'Supply Chain', level: 'medium', probability: 'high' },
    { id: 'risk-6', name: isZh ? '人才流失' : 'Talent Loss', level: 'low', probability: 'low' },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
            {t.modules.strategy.title}
            <div className="px-2 py-0.5 rounded-full bg-celestial-purple/20 border border-celestial-purple/30 flex items-center gap-1">
               <BrainCircuit className="w-3 h-3 text-celestial-purple" />
               <span className="text-[10px] text-celestial-purple font-mono">THINKING MODE ENABLED</span>
            </div>
          </h2>
          <p className="text-gray-400">{t.modules.strategy.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Heatmap (Now Alive with Agents) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col group min-h-[400px]">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-celestial-blue" />
                  {isZh ? '動態風險熱點圖' : 'Dynamic Risk Heatmap'}
                </h3>
            </div>
            
            <div className="relative flex-1 min-h-[350px] w-full bg-slate-900/30 rounded-xl border border-white/5 p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none p-8 z-0">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/5 border-dashed relative">
                            {i === 4 && <div className="absolute inset-0 bg-white/5 blur-xl animate-pulse" />}
                        </div>
                    ))}
                </div>

                <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 gap-4 z-10">
                    <div className="absolute -left-6 top-1/2 -rotate-90 text-[9px] font-bold text-gray-500 tracking-[0.2em] flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> IMPACT
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 tracking-[0.2em] flex items-center gap-2">
                      PROBABILITY <ArrowRight className="w-3 h-3" />
                    </div>
                    
                    {risks.map((risk) => (
                        <StrategicRiskAgent 
                            key={risk.id}
                            id={risk.name} // The ID used for the Brain
                            label={risk.name}
                            name={risk.name}
                            level={risk.level}
                            probability={risk.probability}
                            onClick={() => handleRiskClick(risk.name)}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* AI Action Cards */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-celestial-purple" />
            {isZh ? '戰略行動建議' : 'Strategic Actions'}
          </h3>
          
          <div className="space-y-4 flex-1">
            <OmniEsgCell 
                id="act-1"
                mode="list" 
                label={isZh ? "啟動內部碳定價" : "Launch Internal Carbon Pricing"}
                value="High Priority" 
                color="gold" 
                icon={Target}
                traits={['optimization']}
                onClick={() => addToast('info', 'Module linked: Carbon Assets', 'System')}
            />
            <OmniEsgCell 
                id="act-2"
                mode="list" 
                label={isZh ? "供應鏈稽核 (Tier 1)" : "Supply Chain Audit (Tier 1)"}
                value="In Progress" 
                color="purple" 
                icon={ShieldAlert}
                traits={['bridging']}
            />
          </div>
        </div>
      </div>

      {/* AI Insight Overlay */}
      {analyzingRisk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-2xl bg-slate-900 border border-celestial-purple/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                  <div className="p-6 bg-celestial-purple/20 border-b border-celestial-purple/30 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-celestial-purple rounded-lg">
                              <BrainCircuit className="w-6 h-6 text-white animate-pulse" />
                          </div>
                          <div>
                              <h3 className="font-bold text-white text-lg">{isZh ? 'JunAiKey 策略分析' : 'JunAiKey Strategic Analysis'}</h3>
                              <p className="text-xs text-celestial-purple/80">{isZh ? `針對風險：${analyzingRisk}` : `Targeting: ${analyzingRisk}`}</p>
                          </div>
                      </div>
                      <button onClick={() => setAnalyzingRisk(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <X className="w-6 h-6 text-white" />
                      </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-900/50 flex-1">
                      {isAiProcessing ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-6">
                              <div className="relative">
                                  <div className="w-16 h-16 rounded-full border-4 border-celestial-purple/30 border-t-celestial-purple animate-spin" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <Sparkles className="w-6 h-6 text-celestial-gold animate-pulse" />
                                  </div>
                              </div>
                              <div className="text-center space-y-2">
                                  <span className="text-lg font-bold text-white">{isZh ? '深度推理中...' : 'Deep Reasoning in Progress...'}</span>
                                  <p className="text-sm text-gray-400">{isZh ? '正在模擬賽局情境與計算 ROI' : 'Simulating Game Theory scenarios & calculating ROI'}</p>
                              </div>
                          </div>
                      ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: marked.parse(riskInsight) as string }} />
                          </div>
                      )}
                  </div>
                  
                  {!isAiProcessing && (
                      <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                          <button onClick={() => setAnalyzingRisk(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">{isZh ? '關閉' : 'Close'}</button>
                          <button className="px-6 py-2 bg-celestial-emerald text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {isZh ? '匯出行動計畫' : 'Export Action Plan'}
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
