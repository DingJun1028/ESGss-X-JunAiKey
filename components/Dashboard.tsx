import React, { useState, useEffect } from 'react';
import { getMockMetrics, CHART_DATA, TRANSLATIONS } from '../constants';
import { Wind, Activity, FileText, Zap, BrainCircuit } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Language } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { ChartSkeleton } from './ChartSkeleton';
import { useToast } from '../contexts/ToastContext';

interface DashboardProps {
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = TRANSLATIONS[language].dashboard;
  const metrics = getMockMetrics(language);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2000); // 2 seconds loading simulation
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

  const handleAiAnalyze = (metricLabel: string) => {
      addToast('info', `AI Analyzing ${metricLabel}... Generating deep insights based on double materiality.`, 'Intelligence Orchestrator');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             {t.title} 
             {!isLoading && <span className="text-[10px] px-2 py-1 bg-celestial-emerald/10 text-celestial-emerald border border-celestial-emerald/20 rounded-full animate-pulse">LIVE SYNC</span>}
          </h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
            <button className="px-3 py-1 text-xs rounded border border-white/20 text-gray-300 hover:bg-white/10 transition-all">Daily</button>
            <button className="px-3 py-1 text-xs rounded bg-celestial-purple text-white shadow-lg shadow-purple-500/20">Monthly</button>
            <button className="px-3 py-1 text-xs rounded border border-white/20 text-gray-300 hover:bg-white/10 transition-all">Yearly</button>
        </div>
      </div>

      {/* KPI Cards (Quantum Lego Bricks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => (
              <OmniEsgCell key={i} mode="card" loading={true} />
            ))
          : metrics.map((metric) => (
              <OmniEsgCell
                key={metric.id}
                mode="card"
                label={metric.label}
                value={metric.value}
                subValue={t.vsLastMonth}
                color={metric.color}
                icon={getIcon(metric.color)}
                trend={{
                    value: metric.change,
                    direction: metric.trend
                }}
                confidence="high"
                verified={true}
                traits={metric.traits}
                tags={metric.tags}
                dataLink={metric.dataLink}
                onAiAnalyze={() => handleAiAnalyze(metric.label)}
              />
            ))
        }
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-white/5 relative group overflow-hidden min-h-[400px] min-w-0">
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
              <div className="h-[300px] w-full min-w-0">
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
            </>
          )}
        </div>

        {/* Notifications / Feed (Using List Mode Cells) */}
        <div className="glass-panel p-6 rounded-2xl relative flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">{t.feedTitle}</h3>
          
          <div className="space-y-3 flex-1">
             {isLoading ? (
                <>
                    <OmniEsgCell mode="list" loading={true} />
                    <OmniEsgCell mode="list" loading={true} />
                    <OmniEsgCell mode="list" loading={true} />
                </>
             ) : (
                <>
                    <OmniEsgCell mode="list" label="Energy Anomaly" value="+15%" color="gold" icon={Zap} traits={['gap-filling']} subValue="Plant B • 2m ago" />
                    <OmniEsgCell mode="list" label="Q2 Goal Met" value="Done" color="emerald" icon={Activity} traits={['performance']} subValue="Water Reduction" />
                    <OmniEsgCell mode="list" label="EU CSRD Update" value="New" color="purple" icon={FileText} traits={['learning']} subValue="Regulatory Bot" dataLink="ai" />
                </>
             )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm text-gray-400 mb-2">{t.marketingTitle}</h4>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
               <span className="text-xs text-gray-400">Campaign View Rate</span>
               <div className="text-right">
                  {isLoading ? (
                     <div className="h-6 w-12 bg-white/10 rounded animate-pulse" />
                  ) : (
                     <>
                        <span className="text-lg font-bold text-white">42%</span>
                        <span className="text-emerald-500 text-[10px] ml-1 block">↑ 2.1%</span>
                     </>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};