
import React from 'react';
import { Language } from '../types';
import { Bot, MessageSquare, CheckSquare, Heart, Coffee } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';

interface CultureBotProps {
  language: Language;
}

export const CultureBot: React.FC<CultureBotProps> = ({ language }) => {
  const isZh = language === 'zh-TW';

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                 <Bot className="w-8 h-8 text-celestial-purple" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{isZh ? '文化推廣機器人' : 'Culture Bot'}</h2>
                <p className="text-gray-400">{isZh ? '每日微學習與 ESG 參與' : 'Daily Micro-learning & ESG Engagement'}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Daily Feed */}
            <div className="md:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-celestial-purple/5 to-transparent">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-celestial-gold" />
                        {isZh ? '今日任務 (Daily Quests)' : 'Daily Quests'}
                    </h3>
                    <div className="space-y-3">
                        <OmniEsgCell mode="list" label={isZh ? "閱讀：最新的 CSRD 指南" : "Read: Latest CSRD Guide"} value="+10 pts" color="emerald" icon={CheckSquare} verified={false} />
                        <OmniEsgCell mode="list" label={isZh ? "測驗：碳足跡基礎" : "Quiz: Carbon Footprint Basics"} value="+25 pts" color="purple" icon={MessageSquare} verified={false} />
                        <OmniEsgCell mode="list" label={isZh ? "行動：自帶環保杯" : "Action: Bring Reusable Cup"} value="+5 pts" color="blue" icon={Heart} verified={false} />
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '組織氛圍 (Vibe Check)' : 'Vibe Check'}</h3>
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-center flex-1 p-4 bg-white/5 rounded-xl">
                            <div className="text-2xl font-bold text-emerald-400">88%</div>
                            <div className="text-xs text-gray-400 mt-1">Engagement</div>
                        </div>
                        <div className="text-center flex-1 p-4 bg-white/5 rounded-xl">
                            <div className="text-2xl font-bold text-celestial-gold">High</div>
                            <div className="text-xs text-gray-400 mt-1">Sentiment</div>
                        </div>
                        <div className="text-center flex-1 p-4 bg-white/5 rounded-xl">
                            <div className="text-2xl font-bold text-celestial-purple">4.2</div>
                            <div className="text-xs text-gray-400 mt-1">Quests/User</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat/Bot Interface Placeholder */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-celestial-purple/20 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-celestial-purple"/></div>
                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 text-sm text-gray-200">
                            {isZh ? "早安！今天的減碳小撇步：隨手關閉不必要的電源，可以減少約 5% 的辦公室能耗喔！" : "Good morning! Tip of the day: Turning off idle electronics can save up to 5% of office energy!"}
                        </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-xs">Me</div>
                        <div className="bg-celestial-emerald/20 rounded-2xl rounded-tr-none p-3 text-sm text-white">
                            {isZh ? "我完成了環保杯任務！" : "I completed the reusable cup quest!"}
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 relative">
                    <input 
                        type="text" 
                        placeholder={isZh ? "輸入訊息..." : "Type a message..."}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-purple outline-none"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};
