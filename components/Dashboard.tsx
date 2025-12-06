
import React, { useState, useEffect } from 'react';
import { getMockMetrics, CHART_DATA, TRANSLATIONS } from '../constants';
import { Wind, Activity, FileText, Zap, BrainCircuit, LayoutTemplate, Plus, Trash2, Grid, X, Globe, Map } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Language, DashboardWidget, WidgetType } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { ChartSkeleton } from './ChartSkeleton';
import { useToast } from '../contexts/ToastContext';
import { analyzeDataAnomaly } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { GlobalOperations } from './GlobalOperations';

interface DashboardProps {
  language: Language;
}

// Reusable Render Components for Widgets
const MainChartWidget: React.FC = () => (
  <div className="h-full w-full min-w-0 min-h-[300px]" style={{ height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={CHART_DATA}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          itemStyle={{ color: '#e2e8f0' }}
        />
        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
        <Area type="monotone" dataKey="baseline" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorBase)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const FeedWidget: React.FC<{ handleAiAnalyze: (label: string) => void }> = ({ handleAiAnalyze }) => (
  <div className="space-y-3 flex-1">
      <OmniEsgCell id="feed-energy" mode="list" label="Energy Anomaly" value="+15%" color="gold" icon={Zap} traits={['gap-filling']} subValue="Plant B • 2m ago" onAiAnalyze={() => handleAiAnalyze('Energy')} />
      <OmniEsgCell id="feed-goal" mode="list" label="Q2 Goal Met" value="Done" color="emerald" icon={Activity} traits={['performance']} subValue="Water Reduction" />
      <OmniEsgCell id="feed-csrd" mode="list" label="EU CSRD Update" value="New" color="purple" icon={FileText} traits={['learning']} subValue="Regulatory Bot" dataLink="ai" onAiAnalyze={() => handleAiAnalyze('CSRD')} />
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = TRANSLATIONS[language].dashboard;
  const metrics = getMockMetrics(language);
  const { addToast } = useToast();
  const { customWidgets, addCustomWidget, removeCustomWidget, esgScores, totalScore } = useCompany();
  const [isLoading, setIsLoading] = useState(true);
  
  // View State: 'executive' (Default), 'global' (Map), or 'custom' (My Dashboard)
  const [viewMode, setViewMode] = useState<'executive' | 'global' | 'custom'>('executive');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const getIcon = (color: string) => {
      switch(color) {
          case 'emerald': return Wind;
          case 'gold': return Activity;
          case 'purple': return FileText;
          case 'blue': return Zap;
          default: return Activity;
      }
  }

  const handleAiAnalyze = async (metricLabel: string) => {
      addToast('info', `AI Analyzing ${metricLabel}... Generating deep insights.`, 'Intelligence Orchestrator');
      try {
          const metric = metrics.find(m => {
            const labelText = typeof m.label === 'string' ? m.label : m.label.text;
            return labelText === metricLabel;
          });
          const value = metric ? metric.value : 'Unknown';
          await analyzeDataAnomaly(metricLabel, value, "Historical Avg", "Detected significant deviation.", language);
          addToast('success', 'Analysis Complete. Insights updated.', 'AI Analysis Finished');
      } catch (error) {
          addToast('error', 'Failed to perform analysis.', 'System Error');
      }
  };

  const handleAddWidget = (type: WidgetType, title: string, config?: any, gridSize: 'small' | 'medium' | 'large' = 'small') => {
      addCustomWidget({ type, title, config, gridSize });
      addToast('success', `${title} added to My Dashboard`, 'Customization');
      setIsCatalogOpen(false);
  };

  // --- Map Provider Data to Metrics ---
  const liveMetrics = metrics.map(m => {
      const labelText = typeof m.label === 'string' ? m.label : m.label.text;
      
      // Override values based on CompanyProvider state
      if (labelText.includes('ESG Score') || labelText.includes('ESG 評分')) {
          return { ...m, value: totalScore.toString() };
      }
      if (labelText.includes('Governance') || labelText.includes('治理')) {
          return { ...m, value: esgScores.governance.toString() };
      }
      if (labelText.includes('Social') || labelText.includes('社會')) {
          return { ...m, value: esgScores.social > 80 ? 'High' : esgScores.social > 60 ? 'Medium' : 'Low' };
      }
      return m;
  });

  // --- Executive View (Standard) ---
  const renderExecutiveView = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => <OmniEsgCell key={i} mode="card" loading={true} />)
          : liveMetrics.map((metric) => (
              <OmniEsgCell
                key={metric.id}
                id={metric.id}
                mode="card"
                label={metric.label}
                value={metric.value}
                subValue={t.vsLastMonth}
                color={metric.color}
                icon={getIcon(metric.color)}
                trend={{ value: metric.change, direction: metric.trend }}
                confidence="high"
                verified={true}
                traits={metric.traits}
                tags={metric.tags}
                dataLink={metric.dataLink}
                onAiAnalyze={() => handleAiAnalyze(typeof metric.label === 'string' ? metric.label : metric.label.text)}
              />
            ))
        }
      </div>

      {/* Main Chart & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-white/5 relative group overflow-hidden min-h-[400px] flex flex-col">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  {t.chartTitle}
                  <span className="text-[10px] text-gray-500 border border-white/10 px-2 rounded-full">Recharts Engine</span>
              </h3>
              <div className="flex-1 w-full min-h-[300px]">
                 <MainChartWidget />
              </div>
            </>
          )}
        </div>

        <div className="glass-panel p-6 rounded-2xl relative flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">{t.feedTitle}</h3>
          {isLoading ? <OmniEsgCell mode="list" loading={true} /> : <FeedWidget handleAiAnalyze={handleAiAnalyze} />}
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm text-gray-400 mb-2">{t.marketingTitle}</h4>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
               <span className="text-xs text-gray-400">View Rate</span>
               <div className="text-right">
                  {isLoading ? <div className="h-6 w-12 bg-white/10 rounded animate-pulse" /> : <span className="text-lg font-bold text-white">42%</span>}
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             {viewMode === 'executive' ? t.title : viewMode === 'global' ? (language === 'zh-TW' ? '全球戰情室' : 'Global Operations') : (language === 'zh-TW' ? '我的儀表板' : 'My Dashboard')}
             {!isLoading && <span className="text-[10px] px-2 py-1 bg-celestial-emerald/10 text-celestial-emerald border border-celestial-emerald/20 rounded-full animate-pulse">LIVE SYNC</span>}
          </h2>
          <p className="text-gray-400">{viewMode === 'executive' ? t.subtitle : viewMode === 'global' ? 'Global Facility Monitoring' : (language === 'zh-TW' ? '自訂您的專屬監控視圖' : 'Customize your monitoring view')}</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button 
                onClick={() => setViewMode('executive')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'executive' ? 'bg-celestial-purple text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                <LayoutTemplate className="w-4 h-4" />
                {language === 'zh-TW' ? '企業視圖' : 'Exec'}
            </button>
            <button 
                onClick={() => setViewMode('global')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'global' ? 'bg-celestial-blue text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                <Globe className="w-4 h-4" />
                {language === 'zh-TW' ? '全球地圖' : 'Global'}
            </button>
            <button 
                onClick={() => setViewMode('custom')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'custom' ? 'bg-celestial-emerald text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
            >
                <Grid className="w-4 h-4" />
                {language === 'zh-TW' ? '我的' : 'My View'}
            </button>
        </div>
      </div>

      {/* Content Rendering based on View Mode */}
      {viewMode === 'executive' && renderExecutiveView()}
      
      {viewMode === 'global' && (
          <div className="animate-fade-in">
              <GlobalOperations />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {/* Additional Global Metrics */}
                  <OmniEsgCell mode="card" label="Total Facilities" value="12" subValue="Across 3 Regions" icon={Map} color="blue" />
                  <OmniEsgCell mode="card" label="Global Efficiency" value="94.2%" trend={{value: 2.1, direction: 'up'}} icon={Zap} color="emerald" traits={['optimization']} />
                  <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-center items-center text-center">
                      <div className="text-sm text-gray-400 mb-2">Next Audit</div>
                      <div className="text-xl font-bold text-white">12 Days</div>
                      <div className="text-xs text-celestial-gold mt-1">Berlin Plant</div>
                  </div>
              </div>
          </div>
      )}

      {viewMode === 'custom' && (
        <div className="space-y-6">
            {customWidgets.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                    <LayoutTemplate className="w-12 h-12 mb-4 opacity-50" />
                    <p>Your dashboard is empty.</p>
                    <button onClick={() => setIsCatalogOpen(true)} className="mt-4 px-4 py-2 bg-celestial-emerald/20 text-celestial-emerald rounded-lg hover:bg-celestial-emerald/30 transition-colors">
                        Add Your First Widget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {customWidgets.map((widget) => {
                        let content = null;
                        const colSpan = widget.gridSize === 'medium' ? 'lg:col-span-2' : widget.gridSize === 'large' ? 'lg:col-span-3' : 'lg:col-span-1';
                        
                        if (widget.type === 'kpi_card') {
                            const m = liveMetrics.find(x => x.id === widget.config?.metricId) || liveMetrics[0];
                            content = (
                                <OmniEsgCell
                                    id={m.id}
                                    mode="card"
                                    label={m.label}
                                    value={m.value}
                                    color={m.color}
                                    icon={getIcon(m.color)}
                                    traits={m.traits}
                                    confidence="high"
                                    onAiAnalyze={() => handleAiAnalyze(typeof m.label === 'string' ? m.label : m.label.text)}
                                />
                            );
                        } else if (widget.type === 'chart_area') {
                            content = (
                                <div className="glass-panel p-6 rounded-2xl h-full border-white/5 flex flex-col">
                                    <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
                                    <div className="flex-1 w-full min-h-[250px]">
                                        <MainChartWidget />
                                    </div>
                                </div>
                            );
                        } else if (widget.type === 'feed_list') {
                            content = (
                                <div className="glass-panel p-6 rounded-2xl h-full border-white/5">
                                    <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
                                    <FeedWidget handleAiAnalyze={handleAiAnalyze} />
                                </div>
                            );
                        } else if (widget.type === 'mini_map') {
                             // Re-use simplified map for custom dashboard
                             content = (
                                 <div className="glass-panel rounded-2xl h-full overflow-hidden border-white/5 relative h-[300px]">
                                     <GlobalOperations />
                                 </div>
                             )
                        }

                        return (
                            <div key={widget.id} className={`${colSpan} relative group`}>
                                 {content}
                                 <button 
                                    onClick={() => removeCustomWidget(widget.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40 z-20"
                                    title="Remove Widget"
                                 >
                                    <Trash2 className="w-3 h-3" />
                                 </button>
                            </div>
                        );
                    })}
                     <button 
                        onClick={() => setIsCatalogOpen(true)}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all min-h-[200px]"
                    >
                        <Plus className="w-8 h-8 mb-2" />
                        <span>Add Widget</span>
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Widget Catalog Modal */}
      {isCatalogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Grid className="w-5 h-5 text-celestial-gold" />
                          {language === 'zh-TW' ? '小工具目錄' : 'Widget Catalog'}
                      </h3>
                      <button onClick={() => setIsCatalogOpen(false)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Metric Widgets */}
                      {liveMetrics.map(m => (
                          <button 
                            key={`add-${m.id}`} 
                            onClick={() => handleAddWidget('kpi_card', typeof m.label === 'string' ? m.label : m.label.text, { metricId: m.id }, 'small')}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-purple/10 hover:border-celestial-purple/30 transition-all text-left group"
                          >
                             <div className={`p-2 rounded-lg ${m.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                 {React.createElement(getIcon(m.color), { className: "w-5 h-5" })}
                             </div>
                             <div>
                                 <div className="font-bold text-white">{typeof m.label === 'string' ? m.label : m.label.text}</div>
                                 <div className="text-xs text-gray-400">KPI Card • Small</div>
                             </div>
                             <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                          </button>
                      ))}
                      
                      {/* Chart Widget */}
                      <button 
                        onClick={() => handleAddWidget('chart_area', 'Emissions Trend', {}, 'medium')}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-emerald/10 hover:border-celestial-emerald/30 transition-all text-left group md:col-span-2"
                      >
                             <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                 <Activity className="w-5 h-5" />
                             </div>
                             <div>
                                 <div className="font-bold text-white">Main Area Chart</div>
                                 <div className="text-xs text-gray-400">Graph • Medium (2 cols)</div>
                             </div>
                             <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                      </button>

                      {/* Map Widget */}
                      <button 
                        onClick={() => handleAddWidget('mini_map', 'Global View', {}, 'medium')}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-celestial-blue/10 hover:border-celestial-blue/30 transition-all text-left group md:col-span-2"
                      >
                             <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                 <Globe className="w-5 h-5" />
                             </div>
                             <div>
                                 <div className="font-bold text-white">Mini Global Map</div>
                                 <div className="text-xs text-gray-400">Map • Medium (2 cols)</div>
                             </div>
                             <Plus className="w-5 h-5 text-gray-500 group-hover:text-white ml-auto" />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
