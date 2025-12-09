
import React, { useState } from 'react';
import { EsgCard, ESGAttribute, MasteryLevel } from '../types';
import { Leaf, Users, Scale, Lock, Info, Shield, Sword, Box, Loader2, Star, Hexagon, EyeOff, Sparkles } from 'lucide-react';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { useToast } from '../contexts/ToastContext';
import { universalIntelligence } from '../services/evolutionEngine';
import { generateLegoImage, expandTermKnowledge } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

interface UniversalCardProps {
  card: EsgCard;
  isLocked?: boolean;
  isSealed?: boolean; // New Prop
  masteryLevel?: MasteryLevel;
  onKnowledgeInteraction?: () => void;
  onPurifyRequest?: () => void; // Trigger for Sealed -> Quiz
  onClick?: () => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({ 
    card, 
    isLocked = false, 
    isSealed = false,
    masteryLevel = 'Novice', 
    onKnowledgeInteraction, 
    onPurifyRequest,
    onClick 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [legoImage, setLegoImage] = useState<string | null>(null);
  const [isGeneratingLego, setIsGeneratingLego] = useState(false);
  const [isExpandingKnowledge, setIsExpandingKnowledge] = useState(false);
  const { addToast } = useToast();

  // Optical Theme Engine
  const getTheme = (attr: ESGAttribute) => {
    switch (attr) {
      case 'Environmental': return {
        color: 'text-[#00FF9D]',
        border: 'border-[#00FF9D]/30',
        glow: 'shadow-[0_0_20px_rgba(0,255,157,0.2)]',
        bg: 'bg-gradient-to-br from-[#00FF9D]/10 to-transparent',
        icon: <Leaf className="w-12 h-12 text-[#00FF9D]" strokeWidth={1} />
      };
      case 'Social': return {
        color: 'text-[#00F0FF]',
        border: 'border-[#00F0FF]/30',
        glow: 'shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        bg: 'bg-gradient-to-br from-[#00F0FF]/10 to-transparent',
        icon: <Users className="w-12 h-12 text-[#00F0FF]" strokeWidth={1} />
      };
      case 'Governance': return {
        color: 'text-[#FFD700]',
        border: 'border-[#FFD700]/30',
        glow: 'shadow-[0_0_20px_rgba(255,215,0,0.2)]',
        bg: 'bg-gradient-to-br from-[#FFD700]/10 to-transparent',
        icon: <Scale className="w-12 h-12 text-[#FFD700]" strokeWidth={1} />
      };
    }
  };

  const theme = getTheme(card.attribute);
  const isLegendary = card.rarity === 'Legendary';

  const handleAiDeepDive = async () => {
      if (isExpandingKnowledge) return;
      setIsExpandingKnowledge(true);
      
      addToast('info', `Connecting to Universal Library for: ${card.term}...`, 'JunAiKey Reasoning');
      
      try {
          // Use real Gemini 3 Pro service for structured expansion (TC Primary)
          const insights = await expandTermKnowledge(card.term, card.definition, 'zh-TW');
          
          if (insights) {
              // Ingest into the Brain
              universalIntelligence.ingestKnowledge(card.id, card.term, insights);
              addToast('success', `Knowledge Matrix Expanded: ${card.term}`, 'Universal Intelligence');
              onKnowledgeInteraction?.(); // Trigger mastery progress
          } else {
              addToast('error', 'AI Expansion Failed', 'Error');
          }
      } catch (e) {
          addToast('error', 'Connection Error', 'System');
      } finally {
          setIsExpandingKnowledge(false);
      }
  };

  const handleLegoize = async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card flip
      if (isGeneratingLego) return;
      
      setIsGeneratingLego(true);
      addToast('info', `Constructing Lego Prototype for ${card.title}...`, 'JunAiKey Creative');
      
      try {
          const imgUrl = await generateLegoImage(card.title, card.description);
          if (imgUrl) {
              setLegoImage(imgUrl);
              addToast('success', 'Lego Model Generated!', 'Creative Engine');
          } else {
              addToast('error', 'Failed to generate Lego image.', 'System');
          }
      } catch (e) {
          addToast('error', 'AI Generation Error', 'System');
      } finally {
          setIsGeneratingLego(false);
      }
  };

  const renderMasteryStars = () => {
      const count = masteryLevel === 'Master' ? 3 : masteryLevel === 'Apprentice' ? 2 : 1;
      return (
          <div className="flex gap-0.5" title={`Mastery: ${masteryLevel}`}>
              {[...Array(count)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-celestial-gold fill-current" />
              ))}
          </div>
      );
  };

  // --- LOCKED STATE: CUTOUT HOLE EFFECT (PERFECTED) ---
  if (isLocked) {
      return (
        <div 
            className="w-[240px] h-[360px] relative rounded-xl overflow-hidden bg-[#1a1f2e] border border-white/5 flex flex-col items-center justify-center group cursor-pointer shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" 
            onClick={onClick}
        >
            {/* The Cutout "Hole" Effect - Deep Inset Shadow simulating a recess */}
            <div className="absolute inset-4 rounded-lg bg-[#0f121a] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] flex items-center justify-center">
                
                {/* Embossed Logo Effect - Carved into the hole */}
                <div className="flex flex-col items-center opacity-20 mix-blend-overlay pointer-events-none">
                    <div className="relative">
                        <Hexagon className="w-24 h-24 text-gray-800 fill-gray-900 drop-shadow-[2px_2px_2px_rgba(255,255,255,0.1)]" />
                        <Leaf className="w-12 h-12 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[1px_1px_1px_rgba(255,255,255,0.1)]" />
                    </div>
                    <span className="mt-4 font-bold text-lg text-gray-800 tracking-widest drop-shadow-[1px_1px_0px_rgba(255,255,255,0.05)]">
                        ESG SUNSHINE
                    </span>
                </div>

                {/* Lock Icon Overlay - Floating above */}
                <div className="absolute bottom-6 flex flex-col items-center opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
                        <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] mt-2">{card.rarity}</span>
                </div>
            </div>
            
            {/* Outer Rim Highlights */}
            <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none" />
        </div>
      );
  }

  // --- UNLOCKED STATE (Sealed or Purified) ---
  const handleInteraction = () => {
      if (isSealed) {
          onPurifyRequest?.();
      } else {
          setIsFlipped(!isFlipped);
          onClick?.();
      }
  };

  return (
    <div 
        className="group relative w-[240px] h-[360px] perspective-1000 cursor-pointer"
        onClick={handleInteraction}
    >
      <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className={`
            absolute inset-0 backface-hidden rounded-xl overflow-hidden backdrop-blur-xl border 
            ${isSealed ? 'border-purple-900/50 bg-slate-950' : `${theme.border} ${theme.bg}`}
            ${!isSealed && (isLegendary ? 'shadow-[0_0_30px_rgba(255,215,0,0.3)]' : theme.glow)}
        `}>
            {/* Sealed Effect Overlay */}
            {isSealed && (
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.3)_0%,_transparent_70%)] animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 p-3">
                        <Lock className="w-4 h-4 text-purple-400 opacity-70" />
                    </div>
                </div>
            )}

            {/* Holographic Foil for Legendary */}
            {!isSealed && isLegendary && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 animate-shimmer pointer-events-none" />}
            
            {/* Lego Image Overlay */}
            {!isSealed && legoImage && (
                <div className="absolute inset-0 z-0 animate-fade-in">
                    <img src={legoImage} alt="Lego Version" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/90" />
                </div>
            )}
            
            {/* Optical Noise Texture */}
            {!isSealed && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />}

            <div className="relative z-10 h-full flex flex-col p-4 justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-gray-400 tracking-widest uppercase">{card.category}</span>
                        {!isSealed && renderMasteryStars()}
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isLegendary && !isSealed ? 'text-yellow-400 border-yellow-400/50' : 'text-gray-400 border-gray-600'}`}>
                        {card.rarity.toUpperCase()}
                    </span>
                </div>

                {/* Central Prism Symbol or Lego Indicator */}
                <div className="flex-1 flex items-center justify-center relative">
                    <div className={`absolute inset-0 bg-gradient-to-b blur-2xl rounded-full ${isSealed ? 'from-purple-900/20 to-transparent' : 'from-white/5 to-transparent'}`} />
                    <div className={`relative transform transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${legoImage ? 'opacity-0' : 'group-hover:scale-110'}`}>
                        {isSealed ? <Hexagon className="w-12 h-12 text-purple-700 animate-pulse" /> : theme.icon}
                    </div>
                    {isSealed && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/50 px-3 py-1 rounded text-[10px] text-purple-300 font-mono tracking-widest backdrop-blur-md border border-purple-500/30">
                                SEALED ARTIFACT
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="space-y-1">
                    <h3 className={`text-lg font-bold font-sans tracking-tight leading-none ${isLegendary && !isSealed ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : 'text-white'}`}>
                        {card.title}
                    </h3>
                    <div className={`h-0.5 w-10 ${!isSealed ? theme.color.replace('text', 'bg') : 'bg-purple-900'} opacity-50`} />
                    <div className="flex justify-between items-end">
                        <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed pt-1 flex-1">
                            {isSealed ? 'Knowledge hidden. Purify to unlock details.' : card.description}
                        </p>
                        
                        {/* Lego AI Button (Only if purified) */}
                        {!isSealed && (
                            <button 
                                onClick={handleLegoize}
                                className={`ml-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/20 transition-all group/btn ${isGeneratingLego ? 'animate-pulse' : ''}`}
                                title="Generate AI Lego Model"
                            >
                                {isGeneratingLego ? <Loader2 className="w-3 h-3 text-celestial-gold animate-spin" /> : <Box className="w-3 h-3 text-gray-400 group-hover/btn:text-celestial-gold" />}
                            </button>
                        )}
                        {/* Purify Button (Only if sealed) */}
                        {isSealed && (
                            <button 
                                className="ml-2 p-2 rounded-lg bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/40 transition-all animate-pulse"
                                title="Start Purification Ritual"
                            >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- BACK SIDE (The Definition) --- */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-slate-900 border ${theme.border} p-4 flex flex-col`}>
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Info className={`w-3.5 h-3.5 ${theme.color}`} />
                        <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Knowledge Node</span>
                    </div>
                    {/* Gemini 3 AI Logic Trigger */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAiDeepDive(); }} 
                        disabled={isExpandingKnowledge}
                        className="p-1.5 rounded-lg bg-celestial-purple/20 hover:bg-celestial-purple/40 text-celestial-purple border border-celestial-purple/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all"
                        title="AI Deep Dive (Expand Knowledge)"
                    >
                        {isExpandingKnowledge ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                    </button>
                </div>

                {/* Dictionary Definition */}
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className={`text-lg font-bold font-serif ${theme.color} mb-1 leading-tight`}>{card.term}</h4>
                            <div className="text-[9px] text-gray-500 font-mono flex gap-2">
                                <span>[noun]</span>
                                <span>•</span>
                                <span>{card.attribute}</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-bold px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                            {masteryLevel}
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-300 leading-relaxed font-light border-l-2 border-white/10 pl-2">
                        {card.definition}
                    </p>
                </div>

                {/* Stats Matrix */}
                <div className="mt-auto pt-2 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5" /> Defense
                            </span>
                            <span className="text-base font-mono text-white font-bold">{card.stats.defense}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <Sword className="w-2.5 h-2.5" /> Offense
                            </span>
                            <span className={`text-base font-mono font-bold ${theme.color}`}>{card.stats.offense}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
