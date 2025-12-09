
import React, { useState, useMemo } from 'react';
import { Language, ESGCategory, EsgCard } from '../types';
import { Trophy, Trees, LayoutGrid, Leaf, Users, Scale, Filter, ArrowUp, ArrowDown, BookOpen, Gift, Shield, Crown, Sword, Sparkles, X, BrainCircuit, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { getEsgCards } from '../constants';
import { UniversalCard } from './UniversalCard';
import { useToast } from '../contexts/ToastContext';
import { useCardPurification } from '../hooks/useCardPurification';

interface GamificationProps {
  language: Language;
}

type SortOption = 'RARITY' | 'NAME' | 'DEFENSE' | 'OFFENSE';
type SortDirection = 'asc' | 'desc';
type Tab = 'system' | 'album' | 'knowledge' | 'ark' | 'badges';

// --- Purification Modal Component ---
const PurificationModal: React.FC<{ card: EsgCard; onClose: () => void; isPurified: boolean }> = ({ card, onClose, isPurified }) => {
    const { 
        step, currentQuiz, loading, startReading, startQuiz, submitAnswer, resetProcess, retry 
    } = useCardPurification(card, isPurified, onClose);

    // Initial trigger to enter flow
    React.useEffect(() => {
        if(step === 'idle') startReading();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-20"><X/></button>
                
                {/* Header / Top Art */}
                <div className="h-32 bg-gradient-to-br from-purple-900 to-slate-900 relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                    {/* STEP 1: READING (Knowledge Node) */}
                    {step === 'reading' && (
                        <div className="space-y-6 text-center animate-fade-in">
                            <h3 className="text-2xl font-bold text-white">Purification Ritual</h3>
                            <p className="text-gray-400 text-sm">Absorb the knowledge to cleanse the artifact.</p>
                            
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                <h4 className="text-lg font-bold text-purple-300 mb-2">{card.term}</h4>
                                <p className="text-sm text-gray-200 leading-relaxed">{card.definition}</p>
                            </div>

                            <button onClick={startQuiz} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                <BrainCircuit className="w-5 h-5" />
                                {loading ? 'Generating Quiz...' : 'Start Knowledge Check'}
                            </button>
                        </div>
                    )}

                    {/* STEP 2: QUIZ */}
                    {step === 'quizzing' && currentQuiz && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center text-xs font-bold text-purple-400 uppercase tracking-widest">
                                <span>Question 1/1</span>
                                <span>Identity Verification</span>
                            </div>
                            <h3 className="text-lg font-bold text-white leading-snug">{currentQuiz.question}</h3>
                            
                            <div className="space-y-3">
                                {currentQuiz.options.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => submitAnswer(idx)}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500 text-left text-sm text-gray-200 transition-all"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 'success' && (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Purification Complete!</h3>
                                <p className="text-gray-400 text-sm">Stats unlocked. Mastery increased.</p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
                                    <span className="text-xs text-gray-500">DEFENSE</span>
                                    <span className="font-bold text-white">{card.stats.defense}</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
                                    <span className="text-xs text-gray-500">OFFENSE</span>
                                    <span className="font-bold text-white">{card.stats.offense}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
                                Return to Album
                            </button>
                        </div>
                    )}

                    {/* STEP 4: FAILED */}
                    {step === 'failed' && (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/50">
                                <AlertTriangle className="w-10 h-10 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Resonance Failed</h3>
                                <p className="text-gray-400 text-sm">The knowledge was not correctly integrated.</p>
                            </div>
                            <button onClick={retry} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
                                Review & Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { level, collectedCards, purifiedCards, unlockCard, awardXp, cardMastery, updateCardMastery } = useCompany();
  const { addToast } = useToast();
  
  // Dynamic Cards based on Language
  const ESG_CARDS = useMemo(() => getEsgCards(language), [language]);
  
  const [activeTab, setActiveTab] = useState<Tab>('album');
  const [filterCategory, setFilterCategory] = useState<ESGCategory | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('RARITY');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [cardToPurify, setCardToPurify] = useState<EsgCard | null>(null);

  // --- Knowledge King State ---
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const quizQuestions = [
      { q: "What does scope 3 cover?", a: ["Indirect Value Chain", "Direct Fuel", "Electricity"], correct: 0 },
      { q: "EU CBAM targets which sector initially?", a: ["Textiles", "Steel & Cement", "Software"], correct: 1 },
      { q: "GRI stands for?", a: ["Global Reporting Initiative", "Green Return Index", "Growth Rate Indicator"], correct: 0 }
  ];

  // --- Helper Functions ---
  const getRarityWeight = (r: string) => {
      switch(r) {
          case 'Legendary': return 4;
          case 'Epic': return 3;
          case 'Rare': return 2;
          case 'Common': return 1;
          default: return 0;
      }
  };

  const handleQuizAnswer = (idx: number) => {
      if (idx === quizQuestions[currentQuestion].correct) {
          addToast('success', 'Correct! Knowledge Verified.', 'Knowledge King');
          awardXp(100);
          
          if (currentQuestion + 1 < quizQuestions.length) {
              setCurrentQuestion(prev => prev + 1);
          } else {
              // Win a card
              const randomCard = ESG_CARDS[Math.floor(Math.random() * ESG_CARDS.length)];
              unlockCard(randomCard.id);
              addToast('reward', `Quiz Complete! Unlocked: ${randomCard.title}`, 'Reward');
              setQuizActive(false);
              setCurrentQuestion(0);
          }
      } else {
          addToast('error', 'Incorrect. Try again.', 'Quiz');
      }
  };

  // Filter & Sort Logic
  const filteredCards = ESG_CARDS.filter(card => 
      filterCategory === 'ALL' ? true : card.category === filterCategory
  );

  const sortedCards = [...filteredCards].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
          case 'RARITY': comparison = getRarityWeight(a.rarity) - getRarityWeight(b.rarity); break;
          case 'NAME': comparison = a.title.localeCompare(b.title); break;
          case 'DEFENSE': comparison = a.stats.defense - b.stats.defense; break;
          case 'OFFENSE': comparison = a.stats.offense - b.stats.offense; break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
  });

  const categories = [
      { id: 'ALL', label: 'All', icon: LayoutGrid },
      { id: 'Green_Ops', label: 'E-1 Green Ops', icon: Leaf, color: 'text-[#00FF9D]' },
      { id: 'Eco_System', label: 'E-2 Ecosystem', icon: Trees, color: 'text-[#00FF9D]' },
      { id: 'Human_Capital', label: 'S-1 Human Cap', icon: Users, color: 'text-[#00F0FF]' },
      { id: 'Social_Impact', label: 'S-2 Impact', icon: Users, color: 'text-[#00F0FF]' },
      { id: 'Foundation', label: 'G-1 Governance', icon: Scale, color: 'text-[#FFD700]' },
      { id: 'Partnership', label: 'G-2 Partner', icon: Scale, color: 'text-[#FFD700]' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24">
       {/* Purification Modal Overlay */}
       {cardToPurify && (
           <PurificationModal 
               card={cardToPurify} 
               isPurified={purifiedCards.includes(cardToPurify.id)}
               onClose={() => setCardToPurify(null)} 
           />
       )}

       {/* Header with Stats */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 text-white">
                    <Trophy className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{isZh ? '善向永續 卡牌專區' : 'ESG Sunshine Card Zone'}</h2>
                    <p className="text-gray-400">{isZh ? '全域系統化：將無形的影響力，鑄造為有形的數位資產' : 'Global Systemization: Forging intangible impact into digital assets'}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Title</div>
                    <div className="text-xl font-bold text-white font-mono flex items-center gap-2 justify-end">
                        <Crown className="w-4 h-4 text-celestial-gold" /> Level {level}
                    </div>
                </div>
                <div className="text-right border-l border-white/10 pl-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Album</div>
                    <div className="text-xl font-bold text-celestial-gold font-mono">{collectedCards.length}/{ESG_CARDS.length}</div>
                </div>
            </div>
        </div>

        {/* Module Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-1">
            <button onClick={() => setActiveTab('album')} className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === 'album' ? 'text-white border-b-2 border-celestial-purple' : 'text-gray-500 hover:text-white'}`}>{isZh ? '善向卡冊' : 'Card Album'}</button>
            <button onClick={() => setActiveTab('knowledge')} className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === 'knowledge' ? 'text-white border-b-2 border-celestial-gold' : 'text-gray-500 hover:text-white'}`}>{isZh ? '善向知識王' : 'Knowledge King'}</button>
            <button onClick={() => setActiveTab('badges')} className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === 'badges' ? 'text-white border-b-2 border-emerald-500' : 'text-gray-500 hover:text-white'}`}>{isZh ? '善向徽章' : 'Badges & Titles'}</button>
            <button onClick={() => setActiveTab('ark')} className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === 'ark' ? 'text-white border-b-2 border-red-500' : 'text-gray-500 hover:text-white'}`}>{isZh ? '善向聖櫃' : 'Holy Ark'}</button>
        </div>

        {/* --- VIEW: CARD ALBUM --- */}
        {activeTab === 'album' && (
            <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
                    <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar w-full sm:w-auto">
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setFilterCategory(cat.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${filterCategory === cat.id ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}>
                                <cat.icon className={`w-3 h-3 ${cat.color || 'text-white'}`} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/10 backdrop-blur-sm shrink-0">
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="bg-transparent text-xs text-gray-300 font-medium outline-none px-2 py-1.5 cursor-pointer hover:text-white [&>option]:bg-slate-900">
                            <option value="RARITY">{isZh ? '稀有度' : 'Rarity'}</option>
                            <option value="NAME">{isZh ? '名稱' : 'Name'}</option>
                            <option value="DEFENSE">{isZh ? '防禦值' : 'Defense'}</option>
                            <option value="OFFENSE">{isZh ? '創價值' : 'Offense'}</option>
                        </select>
                        <button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                            {sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                    {sortedCards.map((card) => {
                        const isUnlocked = collectedCards.includes(card.id);
                        const isPurified = purifiedCards.includes(card.id);
                        const isSealed = isUnlocked && !isPurified;
                        const mastery = cardMastery[card.id] || 'Novice';
                        
                        const handleInteraction = () => {
                            if (isSealed) {
                                // Trigger Purification Flow via Modal
                                setCardToPurify(card);
                            } else if (isPurified) {
                                // Standard Mastery Interaction
                                if (mastery === 'Novice') {
                                    updateCardMastery(card.id, 'Apprentice');
                                    addToast('reward', 'Mastery Upgraded: Apprentice', 'Card Evolved');
                                }
                                else if (mastery === 'Apprentice') {
                                    updateCardMastery(card.id, 'Master');
                                    addToast('reward', 'Mastery Upgraded: Master', 'Card Evolved');
                                }
                            }
                        };

                        return (
                            <div key={card.id} className="animate-fade-in">
                                <UniversalCard 
                                    card={card} 
                                    isLocked={!isUnlocked}
                                    isSealed={isSealed} 
                                    masteryLevel={mastery}
                                    onKnowledgeInteraction={handleInteraction}
                                    onPurifyRequest={() => setCardToPurify(card)} // Trigger modal
                                    onClick={() => !isUnlocked ? addToast('error', 'Locked. Complete quests to unlock.', 'System') : null}
                                />
                            </div>
                        );
                    })}
                </div>
            </>
        )}

        {/* --- VIEW: KNOWLEDGE KING --- */}
        {activeTab === 'knowledge' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] glass-panel p-8 rounded-3xl border-celestial-gold/20">
                <div className="w-20 h-20 bg-celestial-gold/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <BookOpen className="w-10 h-10 text-celestial-gold" />
                </div>
                {!quizActive ? (
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold text-white">{isZh ? '挑戰知識王' : 'Challenge Knowledge King'}</h3>
                        <p className="text-gray-400 max-w-md">{isZh ? '連續回答 3 題 ESG 相關問題，全對即可獲得隨機卡牌一張！' : 'Answer 3 ESG questions correctly to win a random card!'}</p>
                        <button onClick={() => setQuizActive(true)} className="px-8 py-3 bg-celestial-gold text-black font-bold rounded-xl hover:scale-105 transition-transform">
                            {isZh ? '開始挑戰' : 'Start Challenge'}
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-md space-y-6">
                        <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider">
                            <span>Question {currentQuestion + 1}/{quizQuestions.length}</span>
                            <span>Reward: Random Card</span>
                        </div>
                        <h4 className="text-xl font-bold text-white text-center">{quizQuestions[currentQuestion].q}</h4>
                        <div className="space-y-3">
                            {quizQuestions[currentQuestion].a.map((ans, idx) => (
                                <button key={idx} onClick={() => handleQuizAnswer(idx)} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-celestial-gold/20 hover:border-celestial-gold transition-all text-left text-gray-200">
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* --- VIEW: HOLY ARK --- */}
        {activeTab === 'ark' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:border-red-500/50 transition-all">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Gift className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <div className="font-bold text-white">Carbon Nullifier</div>
                            <div className="text-xs text-gray-500">Legendary Artifact</div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- VIEW: BADGES & TITLES --- */}
        {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400"/> {isZh ? '已裝備徽章' : 'Equipped Badges'}</h3>
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center"><Leaf className="w-8 h-8 text-emerald-500"/></div>
                        <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center opacity-50"><Shield className="w-8 h-8 text-gray-500"/></div>
                        <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center opacity-50"><Sword className="w-8 h-8 text-gray-500"/></div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-celestial-gold"/> {isZh ? '當前稱號' : 'Current Title'}</h3>
                    <div className="text-2xl font-bold text-celestial-gold font-serif">Sustainability Pioneer</div>
                    <p className="text-xs text-gray-400 mt-2">Buff: +5% XP Gain</p>
                </div>
            </div>
        )}
    </div>
  );
};
