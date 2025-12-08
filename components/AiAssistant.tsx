import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, Paperclip, BrainCircuit, Search, Image as ImageIcon, Trash2, Download, Save, History, Eraser, UserCog, Activity, Mic, Home, MessageSquare, GripHorizontal } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { streamChat, fileToGenerativePart } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { marked } from 'marked';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { universalIntelligence } from '../services/evolutionEngine';

interface AiAssistantProps {
  language: Language;
}

interface AgentStep {
    text: string;
    icon: React.ElementType;
}

type AiPersona = 'orchestrator' | 'analyst' | 'strategist';

// --- Seraphim Animation Constants ---
const SPRING_CONFIG = { stiffness: 0.1, damping: 0.8 };
const SNAP_THRESHOLD = 50;

export const AiAssistant: React.FC<AiAssistantProps> = ({ language }) => {
  // --- Core State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- Physics State ---
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Relative to bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDragClick = useRef(false); // Distinguish click from drag

  // --- AI Logic State ---
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null);
  const [neuralPulse, setNeuralPulse] = useState(false);
  const [persona, setPersona] = useState<AiPersona>('orchestrator');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { addToast } = useToast();
  const { 
      addAuditLog, userName, userRole, companyName,
      esgScores, carbonData, budget, carbonCredits, 
      badges, quests 
  } = useCompany(); 
  
  const STORAGE_KEY = 'esgss_universal_memory_v1';

  // --- Physics Engine: Drag Handling ---
  const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault(); // Prevent scrolling on touch
      setIsDragging(true);
      isDragClick.current = false;
      dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      
      // Capture pointer to track outside window
      (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Simple threshold to detect intent
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
          isDragClick.current = true;
      }
      setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);

      // Snap to edge logic (optional, for now we keep it free-floating but bounded visually)
      // If it was a click (not a drag), toggle menu
      if (!isDragClick.current) {
          toggleMenu();
      }
  };

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  const handleSatelliteClick = (action: 'chat' | 'voice' | 'home') => {
      if (action === 'chat') {
          setIsChatOpen(true);
          setIsMenuOpen(false);
      }
      if (action === 'voice') {
          addToast('info', 'Voice Module Active via Layout', 'JunAiKey System');
          setIsMenuOpen(false);
      }
      if (action === 'home') {
          window.location.reload(); // Simple reset for "Home" in this context
      }
  };

  // --- Universal Memory: Load & Subscribe ---
  useEffect(() => {
    const savedMemory = localStorage.getItem(STORAGE_KEY);
    if (savedMemory) {
      try {
        const parsed = JSON.parse(savedMemory);
        const hydratedMessages = parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
        }));
        setMessages(hydratedMessages);
      } catch (e) { console.error("Failed to load Universal Memory", e); }
    } else {
        const greeting = language === 'zh-TW' 
          ? "您好。我是 JunAiKey。我已連結至您的企業數據庫。"
          : "Greetings. I am JunAiKey. Connected to enterprise database.";
        setMessages([{ id: 'welcome', role: 'model', text: greeting, timestamp: new Date() }]);
    }

    const unsubscribe = universalIntelligence.subscribeGlobal(() => {
        setNeuralPulse(true);
        setTimeout(() => setNeuralPulse(false), 200);
    });
    return () => unsubscribe();
  }, []);

  // --- Universal Memory: Save ---
  useEffect(() => {
      if (messages.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
  }, [messages]);

  // --- AI Logic (Existing) ---
  const runAgenticSteps = async () => {
    const stepsZh: AgentStep[] = [
      { text: "讀取即時企業數據 (Context Loading)...", icon: Activity },
      { text: "JunAiKey 深度思考模式啟動 (Thinking)...", icon: BrainCircuit },
      { text: "多模態與交叉比對 (Analyzing)...", icon: Search },
      { text: "生成策略建議 (Generating)...", icon: Sparkles }
    ];
    const stepsEn: AgentStep[] = [
      { text: "Loading Live Enterprise Context...", icon: Activity },
      { text: "JunAiKey Thinking Mode Activated...", icon: BrainCircuit },
      { text: "Multimodal Analysis...", icon: Search },
      { text: "Generating Strategic Insight...", icon: Sparkles }
    ];
    const steps = language === 'zh-TW' ? stepsZh : stepsEn;
    for (const step of steps) {
      setCurrentStep(step);
      await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
    }
    setCurrentStep(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input + (selectedImage ? ` [Image: ${selectedImage.name}]` : ''),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    let imageData;
    if (selectedImage) {
        try { imageData = await fileToGenerativePart(selectedImage); } 
        catch (e) { addToast('error', 'Failed to process image', 'Error'); }
        clearImage();
    }

    try {
      await runAgenticSteps();
      
      const activeBadges = badges.filter(b => b.isUnlocked).map(b => b.name).join(', ');
      const activeQuests = quests.filter(q => q.status === 'active').map(q => q.title).join(', ');
      
      const contextBlock = `
        [SYSTEM CONTEXT] User: ${userName} (${userRole}) @ ${companyName}. Date: ${new Date().toLocaleDateString()}. PERSONA: ${persona.toUpperCase()}
        [LIVE DATA] ESG Scores: E=${esgScores.environmental}, S=${esgScores.social}, G=${esgScores.governance}. S1=${carbonData.scope1}, S2=${carbonData.scope2}. Budget=$${budget}.
        [GAMIFICATION] Badges=[${activeBadges}]. Quests=[${activeQuests}].
      `;
      
      const promptWithContext = `${contextBlock}\n\nUser Query: ${userMsg.text}`;
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);

      const stream = streamChat(promptWithContext, language, imageData);
      let fullText = '';
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (isFirstChunk) { setIsTyping(false); isFirstChunk = false; }
        fullText += chunk;
        setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
      }
    } catch (e: any) {
        setIsTyping(false);
        setCurrentStep(null);
        addToast('error', 'JunAiKey Connection Failed.', 'Error');
    }
  };

  return (
    <>
      {/* 🌌 Seraphim SVG Filter for Gooey Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 🚀 Floating Key 428 (The Trigger) */}
      {!isChatOpen && (
        <div 
            className="fixed bottom-6 right-6 z-50 touch-none"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'pointer'
            }}
        >
            {/* Satellite Orbit System */}
            <div className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Top: Chat */}
                <button 
                    onClick={() => handleSatelliteClick('chat')}
                    className={`absolute -top-20 left-1/2 -translate-x-1/2 w-12 h-12 bg-celestial-purple rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${isMenuOpen ? 'translate-y-0' : 'translate-y-10'}`}
                >
                    <MessageSquare className="w-5 h-5 text-white" />
                </button>
                {/* Left: Home */}
                <button 
                    onClick={() => handleSatelliteClick('home')}
                    className={`absolute top-1/2 -left-20 -translate-y-1/2 w-12 h-12 bg-celestial-emerald rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-10'}`}
                >
                    <Home className="w-5 h-5 text-white" />
                </button>
                {/* Right: Voice */}
                <button 
                    onClick={() => handleSatelliteClick('voice')}
                    className={`absolute top-1/2 -right-20 -translate-y-1/2 w-12 h-12 bg-celestial-gold rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-10'}`}
                >
                    <Mic className="w-5 h-5 text-black" />
                </button>
            </div>

            {/* Main Core (Floating Key) */}
            <div 
                ref={buttonRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300
                    ${isMenuOpen ? 'bg-white scale-90' : 'bg-gradient-to-tr from-celestial-emerald to-celestial-purple'}
                    ${isDragging ? 'scale-95 shadow-none' : 'hover:scale-105'}
                `}
                style={{ filter: isMenuOpen ? 'url(#goo)' : 'none' }}
            >
                {/* Neural Pulse Ring */}
                <div className={`absolute inset-0 rounded-full border-2 border-white/50 animate-ping ${neuralPulse ? 'opacity-100' : 'opacity-0'}`} />
                
                {isMenuOpen ? (
                    <X className="w-6 h-6 text-slate-900" />
                ) : (
                    <Bot className="w-8 h-8 text-white" />
                )}
                
                {/* Grip Hint */}
                <div className="absolute -bottom-4 opacity-0 group-hover:opacity-50 transition-opacity">
                    <GripHorizontal className="w-4 h-4 text-white/50" />
                </div>
            </div>
        </div>
      )}

      {/* 🤖 AI Chat Modal (Unchanged Logic, enhanced styling) */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[500px] h-[650px] max-h-[85vh] flex flex-col rounded-3xl glass-panel overflow-hidden animate-fade-in border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/80">
          
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex flex-col gap-3 shrink-0">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${neuralPulse ? 'bg-white shadow-[0_0_10px_white]' : 'bg-celestial-emerald'} transition-all duration-300`} />
                    <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
                        JunAiKey <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-celestial-purple">v2.0</span>
                    </h3>
                </div>
                
                <div className="flex items-center gap-1">
                    <button onClick={() => { setMessages([]); localStorage.removeItem(STORAGE_KEY); }} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors" title="Clear Memory"><Eraser className="w-4 h-4" /></button>
                    <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Persona Pills */}
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                {(['orchestrator', 'analyst', 'strategist'] as AiPersona[]).map(p => (
                    <button key={p} onClick={() => setPersona(p)} className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${persona === p ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                        {p === 'orchestrator' && <Bot className="w-3 h-3" />}
                        {p === 'analyst' && <Search className="w-3 h-3" />}
                        {p === 'strategist' && <UserCog className="w-3 h-3" />}
                        {p}
                    </button>
                ))}
            </div>
          </div>

          {/* Neural Activity Bar */}
          <div className="h-0.5 w-full bg-slate-800 flex overflow-hidden">
              {neuralPulse && <div className="w-full h-full bg-gradient-to-r from-transparent via-celestial-emerald to-transparent animate-[shimmer_1s_infinite]" />}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden p-0 relative bg-slate-950/30">
             <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100%' }}
                data={messages}
                followOutput="auto"
                itemContent={(index, msg) => (
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-4 py-4 group relative animate-fade-in`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md ${msg.role === 'user' ? 'bg-celestial-purple/90 text-white rounded-br-sm' : 'bg-slate-800/90 text-gray-200 border border-white/10 rounded-bl-sm'}`}>
                      {msg.role === 'model' && (
                          <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] font-bold uppercase tracking-wider text-celestial-gold border-b border-white/10 pb-1">
                              <Sparkles className="w-3 h-3" /> JunAiKey Core
                          </div>
                      )}
                      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} />
                    </div>
                  </div>
                )}
                components={{
                  Footer: () => (
                    (isTyping || currentStep) ? (
                      <div className="px-4 py-2">
                        <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3 w-fit animate-pulse">
                          <BrainCircuit className="w-4 h-4 text-celestial-purple" />
                          <span className="text-xs text-celestial-purple font-medium">{currentStep?.text || "Processing..."}</span>
                        </div>
                      </div>
                    ) : <div className="h-4" />
                  )
                }}
             />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 shrink-0 backdrop-blur-xl">
            {imagePreview && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-black/40 rounded-lg w-fit border border-white/10">
                    <img src={imagePreview} alt="Preview" className="h-8 w-8 rounded object-cover" />
                    <button onClick={clearImage} className="text-red-400 hover:text-white"><X className="w-3 h-3" /></button>
                </div>
            )}
            <div className="relative flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Enter command to JunAiKey..."
                rows={1}
                className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-celestial-purple/50 resize-none custom-scrollbar"
                style={{ minHeight: '46px', maxHeight: '120px' }}
              />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
              <button onClick={handleSend} disabled={(!input.trim() && !selectedImage) || isTyping} className="p-3 bg-celestial-emerald hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-emerald-500/20"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};