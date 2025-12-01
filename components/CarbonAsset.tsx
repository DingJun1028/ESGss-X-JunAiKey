
import React, { useState } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { Leaf, TrendingUp, DollarSign, PieChart, MapPin, Loader2, Zap } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { performMapQuery } from '../services/ai-service';

interface CarbonAssetProps {
  language: Language;
}

const EMISSION_DATA = [
  { name: 'Jan', scope1: 120, scope2: 80, scope3: 300 },
  { name: 'Feb', scope1: 115, scope2: 78, scope3: 290 },
  { name: 'Mar', scope1: 130, scope2: 85, scope3: 310 },
  { name: 'Apr', scope1: 110, scope2: 75, scope3: 280 },
  { name: 'May', scope1: 105, scope2: 70, scope3: 270 },
  { name: 'Jun', scope1: 100, scope2: 65, scope3: 260 },
];

export const CarbonAsset: React.FC<CarbonAssetProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [mapQuery, setMapQuery] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [mapResult, setMapResult] = useState<string | null>(null);

  const handleLocateSupplier = async () => {
      if(!mapQuery.trim()) return;
      setIsMapping(true);
      setMapResult(null);
      addToast('info', 'Locating facility via Google Maps Grounding...', 'Maps Agent');
      
      try {
          const result = await performMapQuery(mapQuery, language);
          setMapResult(result.text);
      } catch (e) {
          addToast('error', 'Map query failed.', 'Error');
      } finally {
          setIsMapping(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    {isZh ? '碳資產管理' : 'Carbon Asset Management'}
                    <span className="text-xs px-2 py-1 bg-celestial-emerald/10 text-celestial-emerald border border-celestial-emerald/20 rounded-full">Net Zero Path</span>
                </h2>
                <p className="text-gray-400 mt-2">
                    {isZh ? '監控排放、交易碳權與追蹤 SBTi 目標' : 'Monitor emissions, trade credits, and track SBTi targets'}
                </p>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-celestial-emerald/20 hover:bg-celestial-emerald/30 text-celestial-emerald rounded-xl border border-celestial-emerald/30 transition-all flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {isZh ? '購買碳權' : 'Buy Credits'}
                </button>
            </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OmniEsgCell 
                mode="card" 
                label="Scope 1" 
                value="1,240 t" 
                trend={{ value: 12, direction: 'down' }}
                color="emerald"
                icon={Leaf}
                traits={['performance']}
            />
            <OmniEsgCell 
                mode="card" 
                label="Scope 2" 
                value="850 t" 
                trend={{ value: 8, direction: 'down' }}
                color="blue"
                icon={Zap}
                traits={['optimization']}
            />
            <OmniEsgCell 
                mode="card" 
                label="Scope 3" 
                value="4,500 t" 
                subValue="Estimated"
                trend={{ value: 2, direction: 'up' }}
                color="gold"
                icon={PieChart}
                traits={['gap-filling']}
                confidence="low"
            />
            <OmniEsgCell 
                mode="card" 
                label={isZh ? '碳價 (EU ETS)' : 'Carbon Price'} 
                value="€85.40" 
                trend={{ value: 1.5, direction: 'up' }}
                color="purple"
                icon={TrendingUp}
                dataLink="live"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-white/5 min-h-[400px] flex flex-col min-w-0">
                <h3 className="text-lg font-semibold text-white mb-6">{isZh ? '排放趨勢 (Emissions Trend)' : 'Emissions Trend'}</h3>
                <div className="flex-1 w-full min-w-0 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={EMISSION_DATA}>
                            <defs>
                                <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorS3" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area type="monotone" dataKey="scope3" stackId="1" stroke="#fbbf24" fill="url(#colorS3)" />
                            <Area type="monotone" dataKey="scope1" stackId="1" stroke="#10b981" fill="url(#colorS1)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Side Panel: Supplier Map & Credits */}
            <div className="space-y-6">
                {/* Maps Grounding Feature */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-celestial-gold" />
                        {isZh ? '供應鏈地圖查詢' : 'Supplier Facility Locator'}
                    </h3>
                    <div className="space-y-3">
                        <div className="relative">
                            <input 
                                type="text"
                                value={mapQuery}
                                onChange={(e) => setMapQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLocateSupplier()}
                                placeholder={isZh ? "輸入工廠或供應商名稱..." : "Enter facility or supplier name..."}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-celestial-gold outline-none" 
                            />
                            <button 
                                onClick={handleLocateSupplier}
                                disabled={isMapping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-celestial-gold/20 hover:bg-celestial-gold/40 text-celestial-gold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isMapping ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                            </button>
                        </div>
                        {mapResult && (
                            <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 text-xs text-gray-300 leading-relaxed animate-fade-in">
                                {mapResult}
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '碳權庫存' : 'Credit Inventory'}</h3>
                    <div className="space-y-4">
                        <OmniEsgCell mode="list" label="VCS-2023-Solar" value="500 t" color="emerald" verified={true} />
                        <OmniEsgCell mode="list" label="GS-2022-Forest" value="250 t" color="emerald" verified={true} />
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Total Value</span>
                                <span>$12,450</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-celestial-emerald" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
