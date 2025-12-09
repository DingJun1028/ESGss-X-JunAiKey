
import React, { useState } from 'react';
import { EsgCard, ESGAttribute } from '../types';
import { Leaf, Users, Scale, Lock, Info, BarChart3, Shield, Sword } from 'lucide-react';

interface UniversalCardProps {
  card: EsgCard;
  isLocked?: boolean;
  onClick?: () => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({ card, isLocked = false, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Optical Theme Engine
  const getTheme = (attr: ESGAttribute) => {
    switch (attr) {
      case 'Environmental': return {
        color: 'text-[#00FF9D]',
        border: 'border-[#00FF9D]/30',
        glow: 'shadow-[0_0_20px_rgba(0,255,157,0.2)]',
        bg: 'bg-gradient-to-br from-[#00FF9D]/10 to-transparent',
        icon: <Leaf className="w-16 h-16 text-[#00FF9D]" strokeWidth={1} />
      };
      case 'Social': return {
        color: 'text-[#00F0FF]',
        border: 'border-[#00F0FF]/30',
        glow: 'shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        bg: 'bg-gradient-to-br from-[#00F0FF]/10 to-transparent',
        icon: <Users className="w-16 h-16 text-[#00F0FF]" strokeWidth={1} />
      };
      case 'Governance': return {
        color: 'text-[#FFD700]',
        border: 'border-[#FFD700]/30',
        glow: 'shadow-[0_0_20px_rgba(255,215,0,0.2)]',
        bg: 'bg-gradient-to-br from-[#FFD700]/10 to-transparent',
        icon: <Scale className="w-16 h-16 text-[#FFD700]" strokeWidth={1} />
      };
    }
  };

  const theme = getTheme(card.attribute);
  const isLegendary = card.rarity === 'Legendary';

  return (
    <div 
        className="group relative w-[280px] h-[440px] perspective-1000 cursor-pointer"
        onClick={() => { setIsFlipped(!isFlipped); onClick?.(); }}
    >
      <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden backdrop-blur-xl border ${theme.border} ${theme.bg} ${isLegendary ? 'shadow-[0_0_30px_rgba(255,215,0,0.3)]' : theme.glow}`}>
            {/* Holographic Foil for Legendary */}
            {isLegendary && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 animate-shimmer pointer-events-none" />}
            
            {/* Optical Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

            <div className="relative z-10 h-full flex flex-col p-6 justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">{card.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${isLegendary ? 'text-yellow-400 border-yellow-400/50' : 'text-gray-400 border-gray-600'}`}>
                        {card.rarity.toUpperCase()}
                    </span>
                </div>

                {/* Central Prism Symbol */}
                <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent blur-2xl rounded-full" />
                    <div className="relative transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {theme.icon}
                    </div>
                </div>

                {/* Footer */}
                <div className="space-y-1">
                    <h3 className={`text-xl font-bold font-sans tracking-tight leading-none ${isLegendary ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : 'text-white'}`}>
                        {card.title}
                    </h3>
                    <div className={`h-0.5 w-12 ${theme.color.replace('text', 'bg')} opacity-50`} />
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed pt-2">
                        {card.description}
                    </p>
                </div>
            </div>

            {/* Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center border-2 border-white/10 rounded-2xl">
                    <Lock className="w-10 h-10 text-gray-500 mb-2" />
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Locked</span>
                </div>
            )}
        </div>

        {/* --- BACK SIDE (The Definition) --- */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-slate-900 border ${theme.border} p-6 flex flex-col`}>
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
                    <Info className={`w-4 h-4 ${theme.color}`} />
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Knowledge Node</span>
                </div>

                {/* Dictionary Definition */}
                <div className="flex-1 space-y-4">
                    <div>
                        <h4 className={`text-2xl font-bold font-serif ${theme.color} mb-1`}>{card.term}</h4>
                        <div className="text-[10px] text-gray-500 font-mono flex gap-2">
                            <span>[noun]</span>
                            <span>•</span>
                            <span>{card.attribute}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed font-light border-l-2 border-white/10 pl-3">
                        {card.definition}
                    </p>
                </div>

                {/* Stats Matrix */}
                <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Defense
                            </span>
                            <span className="text-lg font-mono text-white font-bold">{card.stats.defense}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <Sword className="w-3 h-3" /> Offense
                            </span>
                            <span className={`text-lg font-mono font-bold ${theme.color}`}>{card.stats.offense}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
