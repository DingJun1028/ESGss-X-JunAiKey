
import React, { useState, useEffect } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { Leaf, TrendingUp, DollarSign, PieChart, MapPin, Loader2, Zap, Calculator, Fuel, Save } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { performMapQuery } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

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
  const { carbonData, updateCarbonData, addAuditLog, checkBadges } = useCompany();
  
  const [mapQuery, setMapQuery] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [mapResult, setMapResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator'>('dashboard');

  // Calculator State
  const [fuelInput, setFuelInput] = useState(carbonData.fuelConsumption);
  const [elecInput, setElecInput] = useState(carbonData.electricityConsumption);

  // Conversion Factors (Mock)
  const DIESEL_FACTOR = 2.68; // kgCO2e per Liter
  const ELEC_FACTOR = 0.509; // kgCO2e per kWh (Taiwan Grid)

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

  const calculateEmissions = () => {
      const s1 = (fuelInput * DIESEL_FACTOR) / 1000; // tCO2e
      const s2 = (elecInput * ELEC_FACTOR) / 1000; // tCO2e
      
      updateCarbonData({
          fuelConsumption: fuelInput,
          electricityConsumption: elecInput,
          scope1: parseFloat(s1.toFixed(2)),
          scope2: parseFloat(s2.toFixed(2))
      });

      addAuditLog('Carbon Calculation', `Updated inputs: ${fuelInput}L Fuel, ${elecInput}kWh Elec. Result: S1=${s1.toFixed(2)}t, S2=${s2.toFixed(2)}t`);
      
      const newBadges = checkBadges();
      if(newBadges.length > 0) {
          addToast('reward', isZh ? `解鎖成就：${newBadges[0].name}` : `Badge Unlocked: ${newBadges[0].name}`, 'Gamification');
      } else {
          addToast('success', isZh ? '排放數據已更新' : 'Emission data updated', 'Calculator');
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
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-celestial-emerald text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <PieChart className="w-4 h-4" />
                    {isZh ? '儀表板' : 'Dashboard'}
                </button>
                <button 
                    onClick={() => setActiveTab('calculator')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'calculator' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Calculator className="w-4 h-4" />
                    {isZh ? '計算器' : 'Calculator'}
                </button>
            </div>
        </div>

        {activeTab === 'dashboard' ? (
            <>
                {/* Top Cards (Live Data from Context) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <OmniEsgCell 
                        mode="card" 
                        label="Scope 1 (Direct)" 
                        value={`${carbonData.scope1} t`} 
                        trend={{ value: 12, direction: 'down' }}
                        color="emerald"
                        icon={Leaf}
                        traits={['performance']}
                        verified={true}
                    />
                    <OmniEsgCell 
                        mode="card" 
                        label="Scope 2 (Energy)" 
                        value={`${carbonData.scope2} t`} 
                        trend={{ value: 8, direction: 'down' }}
                        color="blue"
                        icon={Zap}
                        traits={['optimization']}
                        verified={true}
                    />
                    <OmniEsgCell 
                        mode="card" 
                        label="Scope 3 (Supply)" 
                        value={`${carbonData.scope3} t`} 
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
                        <div className="flex-1 w-full min-w-0 min-h-[300px]" style={{ height: 300 }}>
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

                    {/* Side Panel: Supplier Map */}
                    <div className="space-y-6">
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
                    </div>
                </div>
            </>
        ) : (
            /* Calculator View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <div className="glass-panel p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-celestial-blue" />
                        {isZh ? '活動數據輸入' : 'Activity Data Input'}
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Fuel className="w-4 h-4 text-emerald-400" />
                                {isZh ? '移動源燃料 (柴油/汽油)' : 'Mobile Combustion (Diesel/Gas)'}
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={fuelInput}
                                    onChange={(e) => setFuelInput(Number(e.target.value))}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">Liters</span>
                            </div>
                            <p className="text-xs text-gray-500">Emission Factor: {DIESEL_FACTOR} kgCO2e/L</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-400" />
                                {isZh ? '外購電力 (Scope 2)' : 'Purchased Electricity (Scope 2)'}
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={elecInput}
                                    onChange={(e) => setElecInput(Number(e.target.value))}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">kWh</span>
                            </div>
                            <p className="text-xs text-gray-500">Emission Factor: {ELEC_FACTOR} kgCO2e/kWh</p>
                        </div>

                        <button 
                            onClick={calculateEmissions}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {isZh ? '計算並更新' : 'Calculate & Update'}
                        </button>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col justify-center items-center text-center">
                    <div className="mb-8">
                        <div className="text-sm text-gray-400 mb-2">{isZh ? '預估總排放量' : 'Estimated Total Emissions'}</div>
                        <div className="text-5xl font-bold text-white font-mono tracking-tight">
                            {((fuelInput * DIESEL_FACTOR + elecInput * ELEC_FACTOR) / 1000).toFixed(2)}
                            <span className="text-lg text-gray-500 ml-2 font-sans">tCO2e</span>
                        </div>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <div className="text-xs text-emerald-400 font-bold uppercase mb-1">Scope 1</div>
                            <div className="text-2xl font-mono text-white">
                                {((fuelInput * DIESEL_FACTOR) / 1000).toFixed(2)}
                            </div>
                        </div>
                        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <div className="text-xs text-blue-400 font-bold uppercase mb-1">Scope 2</div>
                            <div className="text-2xl font-mono text-white">
                                {((elecInput * ELEC_FACTOR) / 1000).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
