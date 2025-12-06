
import React from 'react';
import { Language } from '../types';
import { Trophy, Medal, Star, Flame, Leaf, Lock, Search } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { ESG_CARDS } from '../constants';

interface GamificationProps {
  language: Language;
}

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { xp, level, collectedCards } = useCompany();

  // Mock Leaders
  const leaders = [
    { name: 'DingJun Hong', score: xp, dept: 'ESG Office', isMe: true }, // Sync with real XP
    { name: 'Sarah Chen', score: 1100, dept: 'Marketing', isMe: false },
    { name: 'Mike Ross', score: 980, dept: 'Legal', isMe: false },
  ];

  // Helper to get rarity color
  const getRarityColor = (rarity: string) => {
      switch(rarity) {
          case 'Legendary': return 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] bg-gradient-to-b from-amber-500/20 to-transparent';
          case 'Epic': return 'border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] bg-gradient-to-b from-purple-500/20 to-transparent';
          case 'Rare': return 'border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)] bg-gradient-to-b from-blue-500/20 to-transparent';
          default: return 'border-gray-600 bg-white/5';
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20 text-white">
                    <Trophy className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{isZh ? '遊戲化成長 & 收藏' : 'Gamification & Collection'}</h2>
                    <p className="text-gray-400">{isZh ? '排行榜、成就與 ESG 知識卡片' : 'Leaderboards, Achievements & ESG Knowledge Cards'}</p>
                </div>
            </div>
            <div className="flex gap-4 text-center">
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Level</div>
                    <div className="text-2xl font-bold text-white">{level}</div>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total XP</div>
                    <div className="text-2xl font-bold text-celestial-emerald">{xp.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Cards</div>
                    <div className="text-2xl font-bold text-celestial-purple">{collectedCards.length}/{ESG_CARDS.length}</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 h-fit">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    {isZh ? '本月排行榜' : 'Monthly Leaderboard'}
                </h3>
                <div className="space-y-4">
                    {leaders.sort((a,b) => b.score - a.score).map((user, i) => (
                        <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border relative overflow-hidden transition-all ${user.isMe ? 'bg-celestial-purple/20 border-celestial-purple/50' : 'bg-slate-900/50 border-white/5'}`}>
                            {i === 0 && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />}
                            <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${i===0?'bg-amber-400 text-black shadow-lg shadow-amber-500/50':i===1?'bg-gray-400 text-black':'bg-orange-700 text-white'}`}>
                                {i+1}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-white flex items-center gap-2">
                                    {user.name}
                                    {user.isMe && <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded text-gray-200">YOU</span>}
                                </div>
                                <div className="text-xs text-gray-500">{user.dept}</div>
                            </div>
                            <div className="font-mono text-celestial-gold font-bold">{user.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Collection Binder */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-celestial-gold" />
                        {isZh ? '知識卡片收藏冊' : 'Knowledge Card Binder'}
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search cards..." className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-white/30" />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ESG_CARDS.map((card) => {
                        const isUnlocked = collectedCards.includes(card.id);
                        return (
                            <div 
                                key={card.id} 
                                className={`
                                    relative aspect-[3/4] rounded-xl border-2 transition-all duration-500 group perspective-1000
                                    ${isUnlocked ? getRarityColor(card.rarity) : 'border-white/5 bg-slate-900/80 grayscale opacity-60'}
                                    ${isUnlocked ? 'hover:-translate-y-2 hover:shadow-2xl hover:rotate-1' : ''}
                                `}
                            >
                                {isUnlocked ? (
                                    <div className="absolute inset-0 flex flex-col p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`w-2 h-2 rounded-full ${card.rarity === 'Legendary' ? 'bg-amber-400 animate-pulse' : card.rarity === 'Epic' ? 'bg-purple-400' : 'bg-blue-400'}`} />
                                            <span className="text-[9px] uppercase font-bold tracking-wider opacity-70">{card.rarity}</span>
                                        </div>
                                        
                                        {/* Card Art (Placeholder) */}
                                        <div className="flex-1 bg-black/20 rounded-lg mb-3 overflow-hidden border border-white/5 relative group-hover:border-white/20 transition-colors">
                                            <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-white leading-tight">{card.title}</h4>
                                            <p className="text-[9px] text-gray-400 line-clamp-2">{card.description}</p>
                                        </div>

                                        {/* Flip Effect / Tooltip for Knowledge */}
                                        <div className="absolute inset-0 bg-slate-900/95 p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center backdrop-blur-xl z-20 pointer-events-none">
                                            <span className="text-xs font-bold text-celestial-gold mb-2">Did you know?</span>
                                            <p className="text-xs text-gray-200">{card.knowledgePoint}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                        <Lock className="w-8 h-8 text-gray-600 mb-2" />
                                        <span className="text-xs font-bold text-gray-600">Locked</span>
                                        <span className="text-[9px] text-gray-700 mt-1">Found in {card.collectionSet} Packs</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};
