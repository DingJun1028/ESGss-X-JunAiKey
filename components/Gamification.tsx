
import React, { useState } from 'react';
import { Language } from '../types';
import { Trophy, Medal, Star, Flame, Leaf, Lock, Search, ShieldCheck, Database, Coins, Award, Sprout, Trees } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { ESG_CARDS } from '../constants';

interface GamificationProps {
  language: Language;
}

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { xp, level, collectedCards, badges } = useCompany();
  const [activeTab, setActiveTab] = useState<'overview' | 'garden'>('overview');

  // Calculate number of trees (1 tree per 500 XP)
  const treeCount = Math.floor(xp / 500);
  const gardenLevel = Math.floor(treeCount / 10) + 1;

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

  const getBadgeIcon = (iconName: string) => {
      switch(iconName) {
          case 'Leaf': return Leaf;
          case 'Database': return Database;
          case 'Award': return Award;
          case 'ShieldCheck': return ShieldCheck;
          case 'Coins': return Coins;
          default: return Star;
      }
  };

  const RenderTree = ({ index }: { index: number }) => {
      // Deterministic pseudo-random based on index
      const type = index % 3; // 0: Pine, 1: Round, 2: Bushy
      const size = 0.8 + (index % 5) * 0.1;
      const delay = (index % 10) * 0.1;
      
      return (
          <div 
            className="flex flex-col items-center justify-end relative group animate-[fadeIn_0.5s_ease-out_forwards]"
            style={{ 
                height: `${40 + (index % 40)}px`, 
                animationDelay: `${delay}s`,
                opacity: 0,
                transform: `scale(${size})`
            }}
          >
              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/20">
                  Tree #{index + 1} • {(index+1)*500} XP
              </div>
              
              {/* SVG Tree */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 overflow-visible">
                  {type === 0 && (
                      // Pine
                      <path d="M50,10 L20,80 H80 Z M50,80 V100" fill="#10b981" stroke="#065f46" strokeWidth="2" />
                  )}
                  {type === 1 && (
                      // Round
                      <>
                        <circle cx="50" cy="40" r="30" fill="#34d399" stroke="#059669" strokeWidth="2" />
                        <path d="M50,70 V100" stroke="#78350f" strokeWidth="4" />
                      </>
                  )}
                  {type === 2 && (
                      // Bushy
                      <>
                        <path d="M50,100 L50,60" stroke="#78350f" strokeWidth="4" />
                        <circle cx="35" cy="50" r="20" fill="#059669" />
                        <circle cx="65" cy="50" r="20" fill="#059669" />
                        <circle cx="50" cy="30" r="25" fill="#10b981" />
                      </>
                  )}
              </svg>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
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
            
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Trophy className="w-4 h-4" />
                    {isZh ? '概覽' : 'Overview'}
                </button>
                <button 
                    onClick={() => setActiveTab('garden')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'garden' ? 'bg-celestial-emerald text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Trees className="w-4 h-4" />
                    {isZh ? '影響力花園' : 'Impact Garden'}
                </button>
            </div>
        </div>

        {/* Stats Header */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 flex flex-col items-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Level</div>
                <div className="text-2xl font-bold text-white">{level}</div>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 flex flex-col items-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total XP</div>
                <div className="text-2xl font-bold text-celestial-emerald">{xp.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 flex flex-col items-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Badges</div>
                <div className="text-2xl font-bold text-celestial-gold">{badges.filter(b => b.isUnlocked).length}/{badges.length}</div>
            </div>
        </div>

        {activeTab === 'garden' ? (
            <div className="glass-panel p-8 rounded-3xl border border-celestial-emerald/30 relative overflow-hidden min-h-[500px] flex flex-col bg-gradient-to-b from-sky-900/20 to-emerald-900/20">
                {/* Background Sun */}
                <div className="absolute top-10 right-10 w-24 h-24 bg-celestial-gold rounded-full blur-2xl opacity-20 animate-pulse" />
                
                <div className="relative z-10 flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Sprout className="w-6 h-6 text-emerald-400" />
                            {isZh ? '我的數位森林' : 'My Digital Forest'}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1">
                            {isZh 
                                ? `您已種植 ${treeCount} 棵樹 (每 500 XP = 1 棵樹)。花園等級：${gardenLevel}` 
                                : `You have planted ${treeCount} trees (1 tree per 500 XP). Garden Level: ${gardenLevel}`}
                        </p>
                    </div>
                    <div className="px-3 py-1 bg-black/40 rounded-full border border-white/10 text-xs text-emerald-400 font-mono">
                        Carbon Offset: {(treeCount * 0.02).toFixed(2)} tCO2e (Est)
                    </div>
                </div>

                {/* The Garden Grid */}
                <div className="flex-1 flex flex-wrap content-end gap-4 pb-8 border-b-8 border-emerald-900/50">
                    {treeCount === 0 && (
                        <div className="w-full text-center text-gray-500 py-12">
                            {isZh ? '尚未種植樹木。獲得 XP 來開始綠化！' : 'No trees yet. Earn XP to start greening!'}
                        </div>
                    )}
                    {Array.from({ length: treeCount }).map((_, i) => (
                        <RenderTree key={i} index={i} />
                    ))}
                </div>
            </div>
        ) : (
            <>
                {/* Badges Section */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Medal className="w-5 h-5 text-celestial-gold" />
                        {isZh ? '成就徽章' : 'Achievement Badges'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {badges.map(badge => {
                            const Icon = getBadgeIcon(badge.icon);
                            return (
                                <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${badge.isUnlocked ? 'bg-white/10 border-celestial-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'bg-white/5 border-white/5 opacity-50 grayscale'}`}>
                                    <div className={`p-3 rounded-full mb-3 ${badge.isUnlocked ? 'bg-celestial-gold/20 text-celestial-gold' : 'bg-gray-700 text-gray-500'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="font-bold text-sm text-white mb-1">{badge.name}</div>
                                    <div className="text-[10px] text-gray-400 leading-tight">{badge.description}</div>
                                    {!badge.isUnlocked && <Lock className="w-3 h-3 text-gray-600 mt-2" />}
                                </div>
                            );
                        })}
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
            </>
        )}
    </div>
  );
};
