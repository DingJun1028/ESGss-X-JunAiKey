import React, { useState, useEffect } from 'react';
import { Search, Database, BookOpen, Filter, Network, Share2, FileText, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';

interface ResearchHubProps {
  language: Language;
}

export const ResearchHub: React.FC<ResearchHubProps> = ({ language }) => {
  const t = TRANSLATIONS[language].research;
  const { addToast } = useToast();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = (id: string) => {
    setSelectedNode(selectedNode === id ? null : id);
  };

  const handleAiAnalyze = (label: string) => {
      addToast('info', `AI Agent analyzing lineage for: ${label}`, 'Data Lineage Agent');
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-celestial-emerald focus:border-celestial-emerald outline-none transition-all"
          />
        </div>
      </div>

      {/* Feature: Graph RAG / Service Flow Visual */}
      <div className="glass-panel p-6 rounded-2xl border-white/10 overflow-hidden relative">
          <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-celestial-gold" />
                  {language === 'zh-TW' ? 'Graph RAG 知識圖譜' : 'Graph RAG Knowledge Network'}
              </h3>
              <span className="text-xs text-celestial-emerald border border-celestial-emerald/30 px-2 py-1 rounded-full bg-celestial-emerald/10">Active Learning</span>
          </div>
          
          <div className="h-48 relative flex items-center justify-center bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden">
               {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10" />
                      <div className="absolute w-32 h-32 rounded-full border border-white/5 animate-ping opacity-20" />
                  </div>
               ) : (
                  <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                      {/* Connecting Lines (Simulated) */}
                      <div className={`absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-0 transition-opacity duration-300 ${selectedNode && selectedNode !== 'center' ? 'opacity-20' : 'opacity-100'}`}></div>
                      <div className={`absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 transition-opacity duration-300 ${selectedNode && selectedNode !== 'center' ? 'opacity-20' : 'opacity-100'}`}></div>
                      <div className={`absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 transition-opacity duration-300 ${selectedNode && selectedNode !== 'center' ? 'opacity-20' : 'opacity-100'}`}></div>

                      {/* Center Node */}
                      <div 
                            onClick={() => handleNodeClick('center')}
                            className={`absolute w-16 h-16 rounded-full flex items-center justify-center z-20 cursor-pointer transition-all duration-300 ${
                                selectedNode === 'center' 
                                ? 'bg-celestial-purple shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-110 border-white' 
                                : 'bg-celestial-purple/20 border-celestial-purple border animate-pulse'
                            }`}
                      >
                          <Database className={`w-6 h-6 transition-colors ${selectedNode === 'center' ? 'text-white' : 'text-white'}`} />
                      </div>
                      
                      {/* Satellite Nodes */}
                      <div 
                            onClick={() => handleNodeClick('gri')}
                            className={`absolute top-8 left-1/4 w-10 h-10 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-all duration-300 animate-float ${
                                selectedNode === 'gri'
                                ? 'bg-celestial-gold text-black font-bold scale-125 shadow-[0_0_15px_rgba(251,191,36,0.6)] border-transparent'
                                : 'bg-white/5 border border-white/20 text-gray-300'
                            }`}
                      >
                          GRI
                      </div>

                      <div 
                            onClick={() => handleNodeClick('sasb')}
                            className={`absolute bottom-8 right-1/4 w-10 h-10 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-all duration-300 animate-float ${
                                selectedNode === 'sasb'
                                ? 'bg-celestial-gold text-black font-bold scale-125 shadow-[0_0_15px_rgba(251,191,36,0.6)] border-transparent'
                                : 'bg-white/5 border border-white/20 text-gray-300'
                            }`}
                            style={{animationDelay: '1s'}}
                      >
                          SASB
                      </div>

                      <div 
                            onClick={() => handleNodeClick('tcfd')}
                            className={`absolute top-1/2 right-10 w-12 h-12 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-all duration-300 animate-float ${
                                selectedNode === 'tcfd'
                                ? 'bg-celestial-emerald text-black font-bold scale-125 shadow-[0_0_15px_rgba(16,185,129,0.6)] border-transparent'
                                : 'bg-celestial-emerald/10 border border-celestial-emerald/30 text-emerald-400'
                            }`}
                            style={{animationDelay: '2s'}}
                      >
                          TCFD
                      </div>
                  </div>
               )}
          </div>
          
          {/* Info Panel for Selected Node */}
          {selectedNode && !isLoading && (
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 border border-white/20 rounded-xl backdrop-blur-md shadow-xl animate-fade-in z-30 flex items-center gap-3 w-max max-w-[90%]">
                 <div className="w-2 h-2 rounded-full bg-celestial-gold animate-pulse shrink-0"></div>
                 <span className="text-xs text-white font-medium truncate">
                    {selectedNode === 'center' && (language === 'zh-TW' ? '中央知識庫：已連結 3 個標準' : 'Central Knowledge Base: 3 Standards Linked')}
                    {selectedNode === 'gri' && (language === 'zh-TW' ? 'GRI 標準：全面性永續報告框架' : 'GRI Standards: Comprehensive Reporting Framework')}
                    {selectedNode === 'sasb' && (language === 'zh-TW' ? 'SASB 標準：產業特定財務重大性' : 'SASB Standards: Industry-Specific Materiality')}
                    {selectedNode === 'tcfd' && (language === 'zh-TW' ? 'TCFD 框架：氣候相關財務揭露' : 'TCFD Framework: Climate-Related Financial Disclosures')}
                 </span>
             </div>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Data Explorer Rebuilt with OmniEsgCell */}
        <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Database className="w-5 h-5 text-celestial-purple" />
                        {t.dataExplorer}
                    </h3>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                            <Share2 className="w-3 h-3" /> Export
                        </button>
                        <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                            <Filter className="w-3 h-3" /> {t.filters}
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-4 pb-2 border-b border-white/5">
                        <div className="col-span-6">{t.table.metric}</div>
                        <div className="col-span-3 text-right">{t.table.value}</div>
                        <div className="col-span-3 text-right">{t.table.confidence}</div>
                    </div>

                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                           <OmniEsgCell key={i} mode="list" loading={true} />
                        ))
                    ) : (
                        [
                          { id: 1, label: 'Scope 1 Emissions', value: '450 tCO2e', conf: 'high', verified: true, traits: ['performance'], tags: ['Direct'], link: 'live' },
                          { id: 2, label: 'Scope 2 (Electricity)', value: '320 tCO2e', conf: 'high', verified: true, traits: ['optimization'], tags: ['Market-based'] },
                          { id: 3, label: 'Scope 3 (Supply Chain)', value: '2,400 tCO2e', conf: 'low', verified: false, traits: ['gap-filling'], tags: ['Estimates'], link: 'ai' },
                          { id: 4, label: 'Water Usage', value: '1.2 ML', conf: 'medium', verified: true, traits: ['bridging'], tags: ['IoT Sensor'], link: 'live' },
                          { id: 5, label: 'Waste Diversion', value: '85%', conf: 'medium', verified: false, traits: ['tagging'], tags: ['Recycling'] },
                        ].map((item) => (
                            <OmniEsgCell 
                                key={item.id}
                                mode="list"
                                label={item.label}
                                value={item.value}
                                confidence={item.conf as any}
                                verified={item.verified}
                                traits={item.traits as any}
                                tags={item.tags}
                                dataLink={item.link as any}
                                icon={Globe}
                                color={item.id % 2 === 0 ? 'emerald' : 'purple'}
                                onAiAnalyze={() => handleAiAnalyze(item.label)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Knowledge Base */}
        <div className="col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-celestial-gold" />
                    {t.knowledgeBase}
                </h3>
                <div className="space-y-3 flex-1">
                    {isLoading ? (
                         Array.from({ length: 3 }).map((_, i) => (
                            <OmniEsgCell key={i} mode="list" loading={true} />
                         ))
                    ) : (
                        ['TCFD Implementation Guide v2.1', 'GRI 2024 Standards Update', 'Internal Water Policy Doc'].map((doc, idx) => (
                           <OmniEsgCell 
                              key={idx}
                              mode="list"
                              label={doc}
                              subValue="PDF • 2.4MB"
                              value="View"
                              icon={FileText}
                              color="slate"
                              confidence="high"
                              verified={true}
                              traits={['seamless']}
                           />
                        ))
                    )}
                </div>
                <button disabled={isLoading} className="w-full mt-4 py-3 text-sm text-center text-celestial-purple bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50">
                    {t.viewAll}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};