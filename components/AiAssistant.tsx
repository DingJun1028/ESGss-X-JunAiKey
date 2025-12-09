
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, BrainCircuit, Search, Mic, MessageSquare, Book, StickyNote, Tag, CheckSquare, Server, Star, CreditCard, Layers } from 'lucide-react';
import { ChatMessage, Language, View } from '../types';
import { streamChat } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { marked } from 'marked';
import { universalIntelligence } from '../services/evolutionEngine';

interface AiAssistantProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

interface AgentStep {
    text: string;
    icon: React.ElementType;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Physics State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDragClick = useRef(false);
  
  // Interaction Logic State
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const clickCount = useRef(0);
  const singleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI Logic State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null);
  const [neuralPulse, setNeuralPulse] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const { addToast } = useToast();
  const { userName, addNote } = useCompany(); 
  
  const STORAGE_KEY = 'esgss_universal_memory_v1';
  const isZh = language === 'zh-TW';

  // --- Voice Control Logic ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = isZh ? 'zh-TW' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            processVoiceInput(transcriptText);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech Error", event.error);
            setIsListening(false);
        };
    }
  }, [language]);

  const processVoiceInput = (text: string) => {
      const lowerCmd = text.toLowerCase();
      let isCommand = false;

      if (onNavigate) {
          if (lowerCmd.includes('dashboard') || lowerCmd.includes('儀表板')) {
              onNavigate(View.DASHBOARD);
              isCommand = true;
          } else if (lowerCmd.includes('report') || lowerCmd.includes('報告')) {
              onNavigate(View.REPORT);
              isCommand = true;
          } else if (lowerCmd.includes('carbon') || lowerCmd.includes('碳')) {
              onNavigate(View.CARBON);
              isCommand = true;
          }
      }

      if (isCommand) {
          addToast('success', isZh ? `執行指令: ${text}` : `Executing: ${text}`, 'JunAiKey Voice');
      } else {
          addNote(text, ['Voice Memo'], 'voice');
          addToast('success', isZh ? '已存入萬能筆記' : 'Saved to Universal Notes', 'Memory');
      }
  };

  const startVoice = () => {
      try {
          recognitionRef.current?.start();
          setIsListening(true);
          addToast('info', isZh ? '正在聆聽...' : 'Listening...', 'JunAiKey');
      } catch (e) {
          console.warn("Speech API Error", e);
          setIsListening(true);
          setTimeout(() => setIsListening(false), 2000); // Mock
      }
  };

  // --- Interaction Handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      isDragClick.current = false;
      isLongPress.current = false;
      dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      (e.target as Element).setPointerCapture(e.pointerId);

      // Start Long Press Timer
      longPressTimer.current = setTimeout(() => {
          isLongPress.current = true;
          startVoice();
      }, 800); // 800ms long press
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // If moved significantly, cancel click/longpress logic
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
          isDragClick.current = true; // It's a drag
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }
      setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
      
      if (longPressTimer.current) clearTimeout(longPressTimer.current);

      if (!isDragClick.current && !isLongPress.current) {
          // This is a valid click
          clickCount.current += 1;

          if (clickCount.current === 1) {
              singleClickTimer.current = setTimeout(() => {
                  // Single Click Action
                  clickCount.current = 0;
                  if (!isMenuOpen) {
                      setIsChatOpen(prev => !prev);
                  } else {
                      setIsMenuOpen(false);
                  }
              }, 250); // Delay to wait for double click
          } else if (clickCount.current === 2) {
              // Double Click Action
              if (singleClickTimer.current) clearTimeout(singleClickTimer.current);
              clickCount.current = 0;
              setIsChatOpen(false);
              setIsMenuOpen(prev => !prev);
          }
      }
  };

  const handleToolClick = (toolName: string, targetView?: View) => {
      addToast('info', isZh ? `正在開啟 ${toolName}...` : `Accessing ${toolName}...`, 'JunAiKey Toolset');
      setIsMenuOpen(false);
      
      if (targetView && onNavigate) {
          onNavigate(targetView);
      } else if (toolName === 'Chat') {
          setIsChatOpen(true);
      }
  };

  // --- AI Chat Logic ---
  useEffect(() => {
    const savedMemory = localStorage.getItem(STORAGE_KEY);
    if (savedMemory) {
      try {
        const parsed = JSON.parse(savedMemory);
        const hydratedMessages = parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(hydratedMessages);
      } catch (e) { console.error("Failed to load Memory", e); }
    } else {
        const greeting = language === 'zh-TW' ? "您好。我是 JunAiKey。" : "Greetings. I am JunAiKey.";
        setMessages([{ id: 'welcome', role: 'model', text: greeting, timestamp: new Date() }]);
    }
    const unsubscribe = universalIntelligence.subscribeGlobal(() => { setNeuralPulse(true); setTimeout(() => setNeuralPulse(false), 200); });
    return () => unsubscribe();
  }, []);

  useEffect(() => { if (messages.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    try {
        setCurrentStep({ text: "Reasoning...", icon: BrainCircuit });
        const stream = streamChat(`User: ${userName}. ${input}`, language);
        const modelMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);
        
        let fullText = '';
        let isFirst = true;
        for await (const chunk of stream) {
            if (isFirst) { setIsTyping(false); setCurrentStep(null); isFirst = false; }
            fullText += chunk;
            setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
        }
    } catch(e) { setIsTyping(false); setCurrentStep(null); addToast('error', 'Connection Failed', 'Error'); }
  };

  // Satellite Buttons Config - Universal Tool Keys
  const satellites = [
      { id: 'album', icon: Layers, label: isZh ? '萬能卡冊' : 'Universal Card Album', angle: 270, action: () => handleToolClick('Universal Card Album', View.CARD_GAME) },
      { id: 'notes', icon: StickyNote, label: isZh ? '萬能筆記' : 'Universal Notes', angle: 315, action: () => handleToolClick('Universal Notes', View.UNIVERSAL_TOOLS) },
      { id: 'intel', icon: BrainCircuit, label: isZh ? '萬能智庫' : 'Universal Intelligence', angle: 0, action: () => handleToolClick('Universal Intelligence', View.RESEARCH_HUB) },
      { id: 'tagging', icon: Tag, label: isZh ? '萬能標籤' : 'Universal Tagging', angle: 45, action: () => handleToolClick('Universal Tagging', View.UNIVERSAL_TOOLS) },
      { id: 'todo', icon: CheckSquare, label: isZh ? '萬能待辦' : 'Universal To-Do', angle: 90, action: () => handleToolClick('Universal To-Do', View.MY_ESG) },
      { id: 'backend', icon: Server, label: isZh ? '萬能後台' : 'Universal Backend', angle: 135, action: () => handleToolClick('Universal Backend', View.API_ZONE) },
      { id: 'fav', icon: Star, label: isZh ? '萬能收藏' : 'Universal Favorites', angle: 180, action: () => handleToolClick('Universal Favorites', View.MY_ESG) },
      { id: 'chat', icon: MessageSquare, label: isZh ? 'AI 對話' : 'Chat', angle: 225, action: () => handleToolClick('Chat') },
  ];

  return (
    <>
      {!isChatOpen && (
        <div 
            className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-50 touch-none"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'pointer'
            }}
        >
            {/* Satellite Menu System */}
            <div className={`absolute inset-0 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
                {satellites.map((sat) => {
                    const radius = 80;
                    const rad = (sat.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;
                    
                    return (
                        <button 
                            key={sat.id}
                            onClick={sat.action}
                            className="absolute w-10 h-10 rounded-full bg-slate-900/90 border border-white/20 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:border-celestial-emerald hover:text-celestial-emerald transition-all backdrop-blur-md group"
                            style={{ 
                                top: '50%', left: '50%', 
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` 
                            }}
                            title={sat.label}
                        >
                            <sat.icon className="w-4 h-4" />
                        </button>
                    );
                })}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-white/5 animate-spin-slow pointer-events-none" />
            </div>

            {/* Main Optical Orb (The Core) */}
            <div 
                ref={buttonRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${isMenuOpen ? 'scale-90' : 'hover:scale-105'}
                    ${isListening ? 'scale-110 ring-4 ring-celestial-gold/30' : ''}
                `}
                title="Single: Chat | Double: Universal Tools | Hold: Voice"
            >
                <div className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 mix-blend-overlay" />
                <div className={`absolute inset-0 rounded-full bg-radial-gradient from-celestial-emerald/40 to-transparent blur-xl transition-opacity duration-1000 ${neuralPulse || isMenuOpen || isListening ? 'opacity-100 scale-125' : 'opacity-40 scale-100 animate-pulse'}`} />

                <div className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {isMenuOpen ? <X className="w-8 h-8" /> : (isListening ? <Mic className="w-8 h-8 animate-bounce text-celestial-gold" /> : <Bot className="w-8 h-8 md:w-10 md:h-10" />)}
                </div>
            </div>
        </div>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col rounded-3xl glass-panel overflow-hidden animate-fade-in border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/90">
             <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-celestial-gold"/> JunAiKey</h3>
                <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {messages.map(m => (
                     <div key={m.id} className={`p-3 rounded-xl text-sm ${m.role==='user'?'bg-celestial-purple/20 ml-auto max-w-[85%]':'bg-white/5 mr-auto max-w-[90%]'}`}>
                         <div dangerouslySetInnerHTML={{__html: marked.parse(m.text) as string}} className="markdown-content text-gray-200" />
                     </div>
                 ))}
                 {currentStep && (
                     <div className="flex items-center gap-2 text-xs text-celestial-emerald animate-pulse bg-celestial-emerald/10 p-2 rounded-lg self-start">
                         {React.createElement(currentStep.icon, { className: "w-3 h-3" })}
                         <span>{currentStep.text}</span>
                     </div>
                 )}
             </div>
             <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                 <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask JunAiKey..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-celestial-emerald"
                 />
                 <button onClick={handleSend} className="p-2 bg-celestial-emerald rounded-xl text-white"><Send className="w-5 h-5"/></button>
             </div>
        </div>
      )}
    </>
  );
};
