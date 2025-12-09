
import React, { useState } from 'react';
import { Language } from '../types';
import { Stethoscope, CheckSquare, BarChart, Settings } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface HealthCheckProps {
  language: Language;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'form' | 'config'>('form');
  const [formData, setFormData] = useState({
      strategy: 3,
      governance: 3,
      social: 3,
      env: 3
  });
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
      setIsGenerated(true);
      addToast('success', isZh ? '健檢報告已生成' : 'Health Check Report Generated', 'System');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex justify-between items-end">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <Stethoscope className="w-8 h-8 text-red-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{isZh ? '全方位健檢' : 'Enterprise Health Check'}</h2>
                    <p className="text-gray-400">{isZh ? '產出完整的品牌戰略健檢分析' : 'Generate Comprehensive Brand Strategy Health Analysis'}</p>
                </div>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'form' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>{isZh ? '填寫問卷' : 'Questionnaire'}</button>
                <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'config' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}>{isZh ? '後台設定' : 'Backend Config'}</button>
            </div>
        </div>

        {activeTab === 'form' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">{isZh ? '自我評估表單' : 'Self-Assessment Form'}</h3>
                    {[
                        { id: 'strategy', label: isZh ? '品牌永續戰略清晰度' : 'Brand Sustainability Strategy Clarity' },
                        { id: 'governance', label: isZh ? '治理結構與當責性' : 'Governance Structure & Accountability' },
                        { id: 'social', label: isZh ? '員工與社區參與度' : 'Employee & Community Engagement' },
                        { id: 'env', label: isZh ? '碳管理數據完整性' : 'Carbon Data Integrity' }
                    ].map((item) => (
                        <div key={item.id} className="space-y-2">
                            <label className="text-sm text-gray-300 flex justify-between">
                                {item.label}
                                <span className="font-bold text-red-400">{(formData as any)[item.id]}/5</span>
                            </label>
                            <input 
                                type="range" min="1" max="5" step="1"
                                value={(formData as any)[item.id]}
                                onChange={(e) => setFormData({...formData, [item.id]: parseInt(e.target.value)})}
                                className="w-full accent-red-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Low</span>
                                <span>High</span>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleGenerate} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all mt-4">
                        {isZh ? '生成診斷報告' : 'Generate Report'}
                    </button>
                </div>

                {isGenerated && (
                    <div className="glass-panel p-8 rounded-2xl border border-red-500/30 bg-slate-900/80 animate-fade-in flex flex-col justify-center items-center text-center">
                        <div className="w-24 h-24 rounded-full border-8 border-red-500/20 border-t-red-500 flex items-center justify-center mb-6">
                            <span className="text-3xl font-bold text-white">72</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{isZh ? '健康度：尚可' : 'Health: Moderate'}</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">
                            {isZh 
                                ? '您的品牌戰略清晰，但在數據完整性方面存在風險。建議優先導入數位化碳盤查工具。' 
                                : 'Strategy is clear, but data integrity poses a risk. Prioritize digital carbon accounting tools.'}
                        </p>
                        <button className="flex items-center gap-2 text-red-400 font-bold hover:underline">
                            <BarChart className="w-4 h-4" /> {isZh ? '查看完整分析 PDF' : 'View Full PDF'}
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    {isZh ? '評分模型權重配置 (後台)' : 'Scoring Model Config (Backend)'}
                </h3>
                <div className="space-y-4 max-w-lg">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex-1 text-sm text-white">Strategy Weight</div>
                        <input type="number" className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1 text-right text-white" defaultValue="30" />
                        <span className="text-xs text-gray-500">%</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex-1 text-sm text-white">Governance Weight</div>
                        <input type="number" className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1 text-right text-white" defaultValue="20" />
                        <span className="text-xs text-gray-500">%</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex-1 text-sm text-white">Social Weight</div>
                        <input type="number" className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1 text-right text-white" defaultValue="20" />
                        <span className="text-xs text-gray-500">%</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex-1 text-sm text-white">Environment Weight</div>
                        <input type="number" className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1 text-right text-white" defaultValue="30" />
                        <span className="text-xs text-gray-500">%</span>
                    </div>
                    <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold">
                        {isZh ? '保存配置' : 'Save Config'}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};