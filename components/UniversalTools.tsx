
import React, { useState } from 'react';
import { Language } from '../types';
import { Wrench, Book, Calendar as CalendarIcon, StickyNote, Database, Search, ArrowRight, Check, X, Link as LinkIcon, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';

interface UniversalToolsProps {
  language: Language;
}

const GLOSSARY = [
    { term: 'Scope 1', def: 'Direct emissions from owned or controlled sources.' },
    { term: 'Scope 2', def: 'Indirect emissions from the generation of purchased energy.' },
    { term: 'Scope 3', def: 'All other indirect emissions that occur in the value chain.' },
    { term: 'Double Materiality', def: 'Impact on the company (financial) AND impact on the world (environmental/social).' },
    { term: 'CBAM', def: 'Carbon Border Adjustment Mechanism (EU carbon tariff).' },
    { term: 'Greenwashing', def: 'Misleading information about how a company’s products are more environmentally sound.' },
    { term: 'SBTi', def: 'Science Based Targets initiative for reducing emissions.' },
];

const INTEGRATIONS = [
    { id: 'sap', name: 'SAP S/4HANA', status: 'connected', type: 'ERP' },
    { id: 'salesforce', name: 'Salesforce Net Zero', status: 'connected', type: 'CRM' },
    { id: 'google', name: 'Google BigQuery', status: 'disconnected', type: 'Data Lake' },
    { id: 'iot', name: 'Siemens MindSphere', status: 'connected', type: 'IoT' },
];

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTool, setActiveTool] = useState<'notes' | 'library' | 'calendar' | 'integration'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const tools = [
      { id: 'library', icon: Book, label: isZh ? '萬能智庫' : 'Universal Library' },
      { id: 'calendar', icon: CalendarIcon, label: isZh ? '萬能日曆' : 'Universal Calendar' },
      { id: 'integration', icon: Database, label: isZh ? '萬能集成' : 'Universal Integration' },
      { id: 'notes', icon: StickyNote, label: isZh ? '萬能筆記' : 'Universal Notes' },
  ];

  const handleConnect = (id: string) => {
      addToast('info', isZh ? '正在建立安全連線...' : 'Establishing secure handshake...', 'Integration');
      setTimeout(() => {
          addToast('success', isZh ? '連線成功' : 'Connection Established', 'System');
      }, 1500);
  };

  const renderCalendar = () => {
      const days = Array.from({ length: 30 }, (_, i) => i + 1);
      const events = [5, 12, 24, 28]; // Mock event dates
      
      return (
          <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-white">September 2025</h4>
                  <div className="flex gap-2">
                      <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft className="w-4 h-4 text-gray-400" /></button>
                      <button className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                  </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
                  {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                  {[...Array(2)].map((_, i) => <div key={`empty-${i}`} />)} {/* Offset */}
                  {days.map(day => {
                      const hasEvent = events.includes(day);
                      return (
                          <div 
                            key={day} 
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center relative cursor-pointer transition-all hover:bg-white/10 group ${day === 15 ? 'bg-celestial-emerald/20 text-emerald-400 font-bold border border-emerald-500/30' : 'bg-white/5 text-gray-300 border border-white/5'}`}
                            onClick={() => hasEvent && addToast('info', `Event on Sep ${day}: CSRD Audit Prep`, 'Calendar')}
                          >
                              {day}
                              {hasEvent && <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-celestial-gold animate-pulse" />}
                          </div>
                      );
                  })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">{isZh ? '即將到來' : 'Upcoming Events'}</div>
                  <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                          <div className="text-center bg-white/10 px-2 py-1 rounded text-xs font-bold text-white min-w-[3rem]">SEP 24</div>
                          <div className="text-sm text-gray-200">Carbon Data Audit</div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                          <div className="text-center bg-white/10 px-2 py-1 rounded text-xs font-bold text-white min-w-[3rem]">SEP 28</div>
                          <div className="text-sm text-gray-200">Board ESG Meeting</div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Wrench className="w-8 h-8 text-purple-400" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{isZh ? '萬能工具專區' : 'Universal Tools'}</h2>
                <p className="text-gray-400">{isZh ? 'JunAiKey 生態系核心工具組' : 'Core Toolkit of JunAiKey Ecosystem'}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-2">
                {tools.map((tool: any) => (
                    <button 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id as any)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all border ${activeTool === tool.id ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        <tool.icon className="w-5 h-5" />
                        <span className="font-bold text-sm">{tool.label}</span>
                    </button>
                ))}
            </div>

            <div className="lg:col-span-3 glass-panel p-8 rounded-2xl border border-white/10 min-h-[500px] flex flex-col">
                {activeTool === 'notes' && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">{isZh ? '萬能筆記 (Universal Notes)' : 'Universal Notes'}</h3>
                            <button onClick={() => addToast('success', 'Note saved to Knowledge Graph', 'System')} className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300">
                                <RefreshCw className="w-3 h-3" /> Auto-sync
                            </button>
                        </div>
                        <textarea 
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white resize-none outline-none focus:border-purple-500/50 font-mono text-sm leading-relaxed" 
                            placeholder={isZh ? "在這裡輸入您的想法，AI 將自動關聯智庫..." : "Type your thoughts here, AI will auto-link to library..."}
                        />
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                            {['Idea', 'Meeting', 'Task', 'Draft'].map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5 cursor-pointer hover:bg-white/10">#{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {activeTool === 'library' && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-6">{isZh ? '永續術語庫 (Knowledge Graph)' : 'Sustainability Glossary'}</h3>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={isZh ? "搜尋術語..." : "Search terms..."}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
                            {GLOSSARY.filter(g => g.term.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-white text-sm">{item.term}</h4>
                                        <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300">{item.def}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTool === 'calendar' && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-6">{isZh ? 'ESG 萬能日曆' : 'ESG Smart Calendar'}</h3>
                        {renderCalendar()}
                    </div>
                )}

                {activeTool === 'integration' && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-6">{isZh ? '數據連接器 (Data Connectors)' : 'Data Connectors'}</h3>
                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                            {INTEGRATIONS.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${app.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{app.name}</div>
                                            <div className="text-xs text-gray-500">{app.type}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleConnect(app.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            app.status === 'connected' 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {app.status === 'connected' ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                                        {app.status === 'connected' ? (isZh ? '已連接' : 'Connected') : (isZh ? '連接' : 'Connect')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
