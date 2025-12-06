
import React, { useState, useRef } from 'react';
import { 
  CheckSquare, Calendar, Newspaper, Star, BookOpen, FileText, Target, 
  Zap, Crown, Users, Bell, BrainCircuit, ArrowRight, Sparkles, BookMarked,
  Layers, Lightbulb, Coffee, ExternalLink, ListTodo, Plus, Clock, 
  ShieldCheck, Upload, Loader2, Image as ImageIcon, Trash2
} from 'lucide-react';
import { Language, Quest, QuestRarity } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { verifyQuestImage } from '../services/ai-service';

interface MyEsgProps {
  language: Language;
}

export const MyEsg: React.FC<MyEsgProps> = ({ language }) => {
  const { 
    userName, collectedCards, 
    quests, updateQuestStatus, completeQuest,
    todos, addTodo, toggleTodo, deleteTodo
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTodo, setNewTodo] = useState('');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);

  // --- Handlers: To-Do ---
  const handleAddTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim()) return;
      addTodo(newTodo);
      setNewTodo('');
  };

  // --- Handlers: Quests ---
  const getRarityStyles = (rarity: QuestRarity) => {
      switch(rarity) {
          case 'Common': return 'border-white/10 bg-white/5';
          case 'Rare': return 'border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
          case 'Epic': return 'border-purple-500/30 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
          case 'Legendary': return 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      }
  };

  const handleQuestClick = (quest: Quest) => {
      if (quest.status === 'completed' || quest.status === 'verifying') return;
      
      if (quest.requirement === 'image_upload') {
          setActiveQuestId(quest.id);
          fileInputRef.current?.click();
      } else {
          // Manual completion immediately
          completeQuest(quest.id, quest.xp);
          addToast('reward', isZh ? `完成任務！+${quest.xp} XP` : `Quest Complete! +${quest.xp} XP`, 'System');
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && activeQuestId) {
          const questId = activeQuestId;
          const quest = quests.find(q => q.id === questId);
          if (!quest) return;

          const file = e.target.files[0];
          
          // 1. Set status to verifying
          updateQuestStatus(questId, 'verifying');
          addToast('info', isZh ? 'JunAiKey 視覺引擎正在分析...' : 'JunAiKey Vision analyzing...', 'Verification');

          // 2. Real AI Processing
          const verification = await verifyQuestImage(quest.title, quest.desc, file, language);

          if (verification.success) {
               completeQuest(questId, quest.xp);
               addToast('success', verification.reason, 'AI Verified');
               addToast('reward', `+${quest.xp} XP`, 'Quest Complete');
          } else {
               updateQuestStatus(questId, 'active'); // Reset on failure
               addToast('error', verification.reason, 'Verification Failed');
          }
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveQuestId(null);
  };

  // --- Other Mock Data ---
  const news = [
    { id: 1, title: 'EU CBAM Regulation Updates', date: '2h ago', tag: 'Policy' },
    { id: 2, title: 'Global Renewables Report 2024', date: '5h ago', tag: 'Market' },
  ];
  const calendarItems = [
    { id: 1, title: 'Net Zero Summit', time: '09:00 AM', type: 'Event', date: 25 },
    { id: 2, title: 'ESG Committee Mtg', time: '02:00 PM', type: 'Meeting', date: 25 },
  ];
  const weekDays = [
      { day: 'Mon', date: 23 },
      { day: 'Tue', date: 24 },
      { day: 'Wed', date: 25, active: true },
      { day: 'Thu', date: 26 },
      { day: 'Fri', date: 27 },
  ];

  const DrYangReportCard = () => (
      <div className="col-span-1 md:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden group border-celestial-gold/30">
          <div className="absolute inset-0 bg-gradient-to-r from-celestial-gold/10 via-transparent to-transparent opacity-50" />
          <div className="absolute right-0 top-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-12 h-12 text-celestial-gold/20 animate-spin-slow" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                  <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-celestial-gold text-black text-xs font-bold rounded flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Exclusive
                      </span>
                      <span className="text-xs text-celestial-gold">{isZh ? '每週更新' : 'Weekly Update'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {isZh ? '來自楊博的永續觀察報告' : 'Sustainability Insights from Dr. Yang'}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                      {isZh 
                        ? '本週深度解析：CBAM 正式上路後的供應鏈衝擊與應對策略。為何企業需要立即啟動雙重重大性評估？' 
                        : 'Deep Dive this week: Supply chain impacts of CBAM implementation and strategies. Why double materiality assessment is urgent.'}
                  </p>
              </div>
              <button className="flex items-center gap-2 text-sm text-celestial-gold font-bold hover:underline">
                  {isZh ? '閱讀完整報告' : 'Read Full Report'} <ArrowRight className="w-4 h-4" />
              </button>
          </div>
      </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-4 border-b border-white/5">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                  {isZh ? `早安，${userName}` : `Good morning, ${userName}`}
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                  {isZh ? '準備好開始今天的永續旅程了嗎？' : 'Ready to start your sustainability journey today?'}
                  <span className="px-2 py-0.5 bg-celestial-emerald/10 text-celestial-emerald text-xs rounded-full border border-celestial-emerald/20">
                      ESG Score: 88.4
                  </span>
              </p>
          </div>
          <div className="flex gap-3">
              <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Current Title</div>
                  <div className="text-sm font-bold text-celestial-purple flex items-center justify-end gap-1">
                      <Crown className="w-3 h-3" />
                      {isZh ? '永續先鋒 (Sustainability Pioneer)' : 'Sustainability Pioneer'}
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* --- Row 1: Production & Gamification --- */}
          
          {/* 1. My Quests (System Gamification) (2 cols) */}
          <div className="md:col-span-2 glass-panel p-0 rounded-2xl border-white/10 flex flex-col overflow-hidden relative">
              {/* Header with gradient */}
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center relative z-10">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-celestial-gold" />
                      {isZh ? '我的任務 (My Quests)' : 'My Quests'}
                  </h3>
                  <div className="flex gap-2">
                     <span className="text-[10px] px-2 py-1 bg-white/10 rounded text-gray-300 border border-white/5 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {isZh ? '系統指派' : 'System Assigned'}
                     </span>
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[300px] bg-slate-900/40">
                  {quests.map(quest => (
                      <div 
                        key={quest.id} 
                        onClick={() => handleQuestClick(quest)}
                        className={`
                            relative p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-4 overflow-hidden
                            ${getRarityStyles(quest.rarity)}
                            ${quest.status === 'completed' ? 'opacity-50 grayscale' : 'hover:scale-[1.01] hover:shadow-lg'}
                        `}
                      >
                          {/* Rarity Glow Effect */}
                          {quest.rarity === 'Legendary' && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent animate-pulse pointer-events-none" />}
                          
                          {/* Status Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                              quest.status === 'completed' ? 'bg-emerald-500 border-emerald-400' :
                              quest.status === 'verifying' ? 'bg-blue-500 border-blue-400 animate-pulse' :
                              'bg-black/30 border-white/20'
                          }`}>
                              {quest.status === 'completed' ? <CheckSquare className="w-5 h-5 text-white" /> :
                               quest.status === 'verifying' ? <Loader2 className="w-5 h-5 text-white animate-spin" /> :
                               quest.requirement === 'image_upload' ? <ImageIcon className="w-5 h-5 text-gray-300" /> :
                               <Target className="w-5 h-5 text-gray-300" />
                              }
                          </div>

                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-xs font-bold uppercase tracking-wider px-1.5 rounded-sm border 
                                    ${quest.rarity === 'Legendary' ? 'text-amber-400 border-amber-500/30' : 
                                      quest.rarity === 'Epic' ? 'text-purple-400 border-purple-500/30' : 
                                      quest.rarity === 'Rare' ? 'text-blue-400 border-blue-500/30' : 'text-gray-400 border-gray-600'}
                                  `}>
                                      {quest.type}
                                  </span>
                                  <h4 className={`text-sm font-bold truncate ${quest.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                      {quest.title}
                                  </h4>
                              </div>
                              <p className="text-xs text-gray-400 truncate">{quest.desc}</p>
                          </div>

                          <div className="text-right shrink-0">
                              <div className="text-sm font-mono font-bold text-celestial-gold">+{quest.xp} XP</div>
                              {quest.requirement === 'image_upload' && quest.status === 'active' && (
                                  <div className="text-[10px] text-blue-400 flex items-center justify-end gap-1 mt-1">
                                      <Upload className="w-3 h-3" /> {isZh ? '需上傳' : 'Upload'}
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
              
              {/* Hidden File Input for Image Quests */}
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
              />
          </div>

          {/* 2. My To-Do (Personal Utility) (1 col) */}
          <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ListTodo className="w-5 h-5 text-emerald-400" />
                      {isZh ? '我的待辦 (To-Do)' : 'My To-Do'}
                  </h3>
                  <div className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                      {todos.filter(t => t.done).length}/{todos.length}
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 max-h-[200px]">
                  {todos.map(task => (
                      <div 
                        key={task.id} 
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group transition-colors"
                      >
                          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => toggleTodo(task.id)}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 hover:border-emerald-400'}`}>
                                  {task.done && <CheckSquare className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm truncate ${task.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                                  {task.text}
                              </span>
                          </div>
                          <button onClick={() => deleteTodo(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all">
                              <Trash2 className="w-3 h-3" />
                          </button>
                      </div>
                  ))}
              </div>

              {/* Add Task Input */}
              <form onSubmit={handleAddTodo} className="mt-4 pt-3 border-t border-white/10 relative">
                  <input 
                    type="text" 
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder={isZh ? "新增個人記事..." : "Add note..."}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-celestial-emerald/50"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                      <Plus className="w-3 h-3" />
                  </button>
              </form>
          </div>

          {/* 3. Latest News (1 col) */}
          <div className="glass-panel p-6 rounded-2xl border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-slate-300" />
                  {isZh ? '最新消息' : 'Latest News'}
              </h3>
              <div className="space-y-4">
                  {news.map(item => (
                      <div key={item.id} className="border-l-2 border-white/20 pl-3 group hover:border-celestial-emerald transition-colors">
                          <h4 className="text-sm font-medium text-white group-hover:text-celestial-emerald cursor-pointer transition-colors line-clamp-2">{item.title}</h4>
                          <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                              <span>{item.date}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{item.tag}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* --- Row 2: Featured Content --- */}

          {/* 4. Dr. Yang's Report (Featured, 2 cols) */}
          <DrYangReportCard />

          {/* 5. My Calendar (Replaced Events) (1 col) */}
          <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-400" />
                  {isZh ? '我的日曆 (Calendar)' : 'My Calendar'}
              </h3>
              
              {/* Weekly Date Strip */}
              <div className="flex justify-between mb-4 pb-2 border-b border-white/5">
                  {weekDays.map((d, i) => (
                      <div key={i} className={`flex flex-col items-center p-1.5 rounded-lg ${d.active ? 'bg-red-500/20 text-white border border-red-500/40' : 'text-gray-500 hover:bg-white/5'}`}>
                          <span className="text-[9px] uppercase tracking-wide">{d.day}</span>
                          <span className={`text-xs font-bold ${d.active ? 'text-red-400' : ''}`}>{d.date}</span>
                      </div>
                  ))}
              </div>

              {/* Schedule List */}
              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar max-h-[150px]">
                  {calendarItems.map(ev => (
                      <div key={ev.id} className="flex gap-3 items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                          <div className={`w-1 h-full min-h-[2rem] rounded-full ${ev.date === 25 ? 'bg-red-400' : 'bg-gray-600'}`} />
                          <div className="flex-1">
                              <div className="text-sm font-medium text-white group-hover:text-red-300 transition-colors">{ev.title}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{ev.time}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px]">{ev.type}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 6. My Collection (1 col) */}
          <div className="glass-panel p-6 rounded-2xl border-white/10 bg-gradient-to-b from-slate-800/50 to-transparent">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-celestial-gold" />
                  {isZh ? '我的收藏' : 'My Collection'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                  {collectedCards.slice(0, 4).map((cardId, i) => (
                      <div key={i} className="aspect-[3/4] bg-slate-700/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                          <div className={`w-8 h-8 rounded-full ${i===0 ? 'bg-celestial-gold' : 'bg-gray-600'} shadow-lg`} />
                      </div>
                  ))}
                  {collectedCards.length === 0 && <span className="text-xs text-gray-500 col-span-2">No cards yet.</span>}
              </div>
              <button className="w-full mt-4 text-xs text-center text-gray-400 hover:text-white transition-colors">{isZh ? '查看全部' : 'View All'}</button>
          </div>

      </div>
    </div>
  );
};
