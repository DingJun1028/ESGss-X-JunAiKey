
import React, { useState } from 'react';
import { Language, ESGCategory } from '../types';
import { Trophy, Trees, LayoutGrid, Leaf, Users, Scale, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { ESG_CARDS } from '../constants';
import { UniversalCard } from './UniversalCard';
import { useToast } from '../contexts/ToastContext';

interface GamificationProps {
  language: Language;
}

type SortOption = 'RARITY' | 'NAME' | 'DEFENSE' | 'OFFENSE';
type SortDirection = 'asc' | 'desc';

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { level, collectedCards } = useCompany();
  const { addToast } = useToast();
  const [filterCategory, setFilterCategory] = useState<ESGCategory | 'ALL'>('ALL');
  
  // Sorting State
  const [sortOption, setSortOption] = useState<SortOption>('RARITY');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const categories = [
      { id: 'ALL', label: 'All', icon: LayoutGrid },
      { id: 'Green_Ops', label: 'E-1 Green Ops', icon: Leaf, color: 'text-[#00FF9D]' },
      { id: 'Eco_System', label: 'E-2 Ecosystem', icon: Trees, color: 'text-[#00FF9D]' },
      { id: 'Human_Capital', label: 'S-1 Human Cap', icon: Users, color: 'text-[#00F0FF]' },
      { id: 'Social_Impact', label: 'S-2 Impact', icon: Users, color: 'text-[#00F0FF]' },
      { id: 'Foundation', label: 'G-1 Governance', icon: Scale, color: 'text-[#FFD700]' },
      { id: 'Partnership', label: 'G-2 Partner', icon: Scale, color: 'text-[#FFD700]' },
  ];

  // Helper for rarity weight
  const getRarityWeight = (r: string) => {
      switch(r) {
          case 'Legendary': return 4;
          case 'Epic': return 3;
          case 'Rare': return 2;
          case 'Common': return 1;
          default: return 0;
      }
  };

  // Filter Cards
  const filteredCards = ESG_CARDS.filter(card => 
      filterCategory === 'ALL' ? true : card.category === filterCategory
  );

  // Sort Cards
  const sortedCards = [...filteredCards].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
          case 'RARITY':
              comparison = getRarityWeight(a.rarity) - getRarityWeight(b.rarity);
              break;
          case 'NAME':
              comparison = a.title.localeCompare(b.title);
              break;
          case 'DEFENSE':
              comparison = a.stats.defense - b.stats.defense;
              break;
          case 'OFFENSE':
              comparison = a.stats.offense - b.stats.offense;
              break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 text-white">
                    <Trophy className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{isZh ? 'ESG 萬能卡牌聖庫' : 'Universal ESG Repository'}</h2>
                    <p className="text-gray-400">{isZh ? '將無形的影響力，鑄造為有形的數位資產' : 'Forging intangible impact into tangible digital assets'}</p>
                </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Level</div>
                    <div className="text-xl font-bold text-white font-mono">{level}</div>
                </div>
                <div className="text-right border-l border-white/10 pl-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Collection</div>
                    <div className="text-xl font-bold text-celestial-gold font-mono">{collectedCards.length}/{ESG_CARDS.length}</div>
                </div>
            </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar w-full sm:w-auto">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap
                            ${filterCategory === cat.id 
                                ? 'bg-white/10 border-white/30 text-white' 
                                : 'bg-transparent border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <cat.icon className={`w-3 h-3 ${cat.color || 'text-white'}`} />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/10 backdrop-blur-sm shrink-0">
                <span className="text-[10px] text-gray-500 font-bold px-2 uppercase">Sort By</span>
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-transparent text-xs text-gray-300 font-medium outline-none px-2 py-1.5 cursor-pointer hover:text-white [&>option]:bg-slate-900"
                >
                    <option value="RARITY">{isZh ? '稀有度 (Rarity)' : 'Rarity'}</option>
                    <option value="NAME">{isZh ? '名稱 (Name)' : 'Name'}</option>
                    <option value="DEFENSE">{isZh ? '防禦值 (Defense)' : 'Defense Score'}</option>
                    <option value="OFFENSE">{isZh ? '創價值 (Offense)' : 'Offense Score'}</option>
                </select>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button 
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                >
                    {sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {sortedCards.map((card) => {
                const isUnlocked = collectedCards.includes(card.id) || card.rarity === 'Legendary'; // Force unlock Legendary for demo
                return (
                    <div key={card.id} className="animate-fade-in">
                        <UniversalCard 
                            card={card} 
                            isLocked={!isUnlocked} 
                            onClick={() => {
                                if (!isUnlocked) {
                                    addToast('error', 'Card Locked. Complete quests to unlock.', 'System');
                                } else if (!card.isPurified) {
                                    addToast('info', 'Knowledge Quiz Initiated...', 'Purification Ritual');
                                }
                            }}
                        />
                    </div>
                );
            })}
        </div>

        {/* Empty State */}
        {sortedCards.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-3xl">
                <Filter className="w-12 h-12 mb-4 opacity-20" />
                <p>No cards found in this category.</p>
            </div>
        )}
    </div>
  );
};
