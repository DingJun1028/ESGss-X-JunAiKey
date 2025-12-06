
import React, { useState } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { Leaf, TrendingUp, PieChart, MapPin, Loader2, Zap, Calculator, Fuel, Save, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { performMapQuery } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { QuantumSlider } from './minimal/QuantumSlider';

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
  const { carbonData, updateCarbonData, addAuditLog, checkBadges, companyName } = useCompany();
  
  const [mapQuery, setMapQuery] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [mapResult, setMapResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'pricing'>('dashboard');

  // Internal Carbon Pricing State
  const [shadowPrice, setShadowPrice] = useState(50); // USD per ton
  const [projectedCost, setProjectedCost] = useState(0);

  // Calculator State
  const [fuelInput, setFuelInput] = useState(carbonData.fuelConsumption);
  const [elecInput, setElecInput] = useState(carbonData.electricityConsumption);

  const DIESEL_FACTOR = 2.68; 
  const ELEC_FACTOR = 0.509;

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
      const s1 = (fuelInput * DIESEL_FACTOR) / 1000;
      const s2 = (elecInput * ELEC_FACTOR) / 1000;
      updateCarbonData({ fuelConsumption: fuelInput, electricityConsumption: elecInput, scope1: parseFloat(s1.toFixed(2)), scope2: parseFloat(s2.toFixed(2)) });
      addAuditLog('Carbon Calculation', `S1=${s1.toFixed(2)}t, S2=${s2.toFixed(2)}t`);
      checkBadges();
      addToast('success', isZh ? '排放數據已更新' : 'Emission data updated', 'Calculator');
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    {isZh ? '碳資產管理' : 'Carbon Asset Management'}
                    <span className="text-xs px-2 py-1 bg-celestial-emerald/10 text-celestial-emerald border border-celestial-emerald/20 rounded-full">Net Zero Path</span>
                </h2>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-celestial-emerald text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <PieChart className="w-4 h-4" /> {isZh ? '儀表板' : 'Dashboard'}
                </button>
                <button onClick={() => setActiveTab('calculator')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'calculator' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <Calculator className="w-4 h-4" /> {isZh ? '計算器' : 'Calculator'}
                </button>
                <button onClick={() => setActiveTab('pricing')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pricing' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <DollarSign className="w-4 h-4" /> {isZh ? '內部定價' : 'Pricing Sim'}
                </button>
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-white/5 min-h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-6">{isZh ? '排放趨勢' : 'Emissions Trend'}</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={EMISSION_DATA}>
                                <defs>
                                    <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorS3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }} itemStyle={{ color: '#e2e8f0' }} />
                                <Area type="monotone" dataKey="scope3" stackId="1" stroke="#fbbf24" fill="url(#colorS3)" />
                                <Area type="monotone" dataKey="scope1" stackId="1" stroke="#10b981" fill="url(#colorS1)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-celestial-gold" />
                            {isZh ? '供應鏈地圖查詢' : 'Supplier Facility Locator'}
                        </h3>
                        <div className="space-y-3">
                            <input type="text" value={mapQuery} onChange={(e) => setMapQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLocateSupplier()} placeholder={isZh ? "輸入工廠名稱..." : "Enter facility name..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-celestial-gold outline-none" />
                            {mapResult && <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 text-xs text-gray-300 leading-relaxed animate-fade-in">{mapResult}</div>}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'calculator' && (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Calculator className="w-6 h-6 text-celestial-blue" /> {isZh ? '活動數據輸入' : 'Activity Data Input'}</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Fuel (Liters)</label>
                        <input type="number" value={fuelInput} onChange={(e) => setFuelInput(Number(e.target.value))} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Electricity (kWh)</label>
                        <input type="number" value={elecInput} onChange={(e) => setElecInput(Number(e.target.value))} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <button onClick={calculateEmissions} className="w-full py-4 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"><Save className="w-5 h-5 inline mr-2" /> {isZh ? '更新數據' : 'Update Data'}</button>
                </div>
            </div>
        )}

        {activeTab === 'pricing' && (
            <div className="glass-panel p-8 rounded-2xl border border-celestial-gold/20 bg-gradient-to-br from-celestial-gold/5 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2">{isZh ? '內部碳定價模擬器' : 'Internal Carbon Pricing Simulator'}</h3>
                <p className="text-sm text-gray-400 mb-8">{isZh ? '設定影子價格以評估其對各部門損益的潛在影響。' : 'Set a shadow price to evaluate potential impact on departmental P&L.'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <QuantumSlider 
                            label={isZh ? '影子價格 (Shadow Price)' : 'Shadow Price'}
                            value={shadowPrice} min={0} max={300} unit="USD/t" color="gold"
                            onChange={setShadowPrice}
                        />
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{isZh ? '總排放量 (Scope 1+2)' : 'Total Emissions (S1+S2)'}</div>
                            <div className="text-2xl font-bold text-white">{(carbonData.scope1 + carbonData.scope2).toFixed(1)} tCO2e</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center text-center p-6 bg-celestial-gold/10 rounded-2xl border border-celestial-gold/30">
                        <div className="text-sm text-celestial-gold font-bold uppercase mb-2">{isZh ? '預估內部碳費' : 'Projected Internal Carbon Fee'}</div>
                        <div className="text-5xl font-mono font-bold text-white tracking-tight">
                            ${((carbonData.scope1 + carbonData.scope2) * shadowPrice).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            {isZh ? '此費用將從營運預算中扣除，轉入去碳化基金。' : 'This fee would be deducted from OpEx and moved to Decarbonization Fund.'}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
