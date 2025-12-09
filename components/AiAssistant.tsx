
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, Paperclip, BrainCircuit, Search, Image as ImageIcon, Trash2, Download, Save, History, Eraser, UserCog, Activity, Mic, Home, MessageSquare, GripHorizontal, Book, StickyNote, Tag, CheckSquare, Server, Star, CreditCard } from 'lucide-react';
import { ChatMessage, Language, View } from '../types';
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

export const AiAssistant: React.FC<AiAssistantProps> = ({ language }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Physics State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDragClick = useRef(false);

  // AI Logic State
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
  const { userName, userRole, companyName, esgScores, carbonData, budget, badges, quests } = useCompany(); 
  
  const STORAGE_KEY = 'esgss_universal_memory_v1';

  // --- Physics Engine ---
  const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      isDragClick.current = false;
      dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
          isDragClick.current = true;
      }
      setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
      if (!isDragClick.current) {
          toggleMenu();
      }
  };

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  const handleToolClick = (toolName: string) => {
      addToast('info', `Accessing Universal ${toolName}...`, 'JunAiKey Toolset');
      setIsMenuOpen(false);
      if (toolName === 'Chat') setIsChatOpen(true);
  };

  // --- Universal Memory & Logic (Same as before) ---
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

  const runAgenticSteps = async () => {
    // ... existing steps logic
    const steps: AgentStep[] = [{ text: "Analyzing...", icon: BrainCircuit }];
    setCurrentStep(steps[0]);
    await new Promise(r => setTimeout(r, 1000));
    setCurrentStep(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    // ... AI call logic ...
    try {
        await runAgenticSteps();
        const stream = streamChat(`User: ${userName}. ${input}`, language);
        const modelMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);
        let fullText = '';
        let isFirst = true;
        for await (const chunk of stream) {
            if (isFirst) { setIsTyping(false); isFirst = false; }
            fullText += chunk;
            setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
        }
    } catch(e) { setIsTyping(false); setCurrentStep(null); addToast('error', 'Connection Failed', 'Error'); }
  };

  // Satellite Buttons Config
  const satellites = [
      { id: 'binder', icon: CreditCard, label: 'Binder', angle: 270, action: () => handleToolClick('Binder') }, // Top
      { id: 'notes', icon: StickyNote, label: 'Notes', angle: 315, action: () => handleToolClick('Notes') },
      { id: 'library', icon: Book, label: 'Library', angle: 0, action: () => handleToolClick('Library') }, // Right
      { id: 'tags', icon: Tag, label: 'Tags', angle: 45, action: () => handleToolClick('Tags') },
      { id: 'todo', icon: CheckSquare, label: 'To-Do', angle: 90, action: () => handleToolClick('To-Do') }, // Bottom
      { id: 'backend', icon: Server, label: 'Backend', angle: 135, action: () => handleToolClick('Backend') },
      { id: 'fav', icon: Star, label: 'Saved', angle: 180, action: () => handleToolClick('Favorites') }, // Left
      { id: 'chat', icon: MessageSquare, label: 'Chat', angle: 225, action: () => handleToolClick('Chat') },
  ];

  return (
    <>
      {!isChatOpen && (
        <div 
            className="fixed bottom-10 right-10 z-50 touch-none"
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
                            title={`Universal ${sat.label}`}
                        >
                            <sat.icon className="w-4 h-4" />
                            <span className="absolute top-full mt-1 text-[9px] font-mono text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1 rounded whitespace-nowrap">
                                {sat.label}
                            </span>
                        </button>
                    );
                })}
                
                {/* Connecting Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-white/5 animate-spin-slow pointer-events-none" />
            </div>

            {/* Main Optical Orb (The Core) */}
            <div 
                ref={buttonRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${isMenuOpen ? 'scale-90' : 'hover:scale-105'}
                `}
            >
                {/* 1. Glass Core Background */}
                <div className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                
                {/* 2. Prismatic Refraction Layer */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 mix-blend-overlay" />
                <div className="absolute inset-1 rounded-full border border-white/10" />
                
                {/* 3. Breathing Core Light */}
                <div className={`absolute inset-0 rounded-full bg-radial-gradient from-celestial-emerald/40 to-transparent blur-xl transition-opacity duration-1000 ${neuralPulse || isMenuOpen ? 'opacity-100 scale-125' : 'opacity-40 scale-100 animate-pulse'}`} />

                {/* 4. Icon */}
                <div className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Bot className="w-10 h-10" />}
                </div>
            </div>
        </div>
      )}

      {/* Chat Window (Standard implementation from previous, just re-rendering minimal structure) */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[500px] h-[650px] max-h-[85vh] flex flex-col rounded-3xl glass-panel overflow-hidden animate-fade-in border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/80">
             {/* Header */}
             <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-celestial-gold"/> JunAiKey</h3>
                <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
             </div>
             {/* Simple Message List for brevity */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map(m => (
                     <div key={m.id} className={`p-3 rounded-xl text-sm ${m.role==='user'?'bg-celestial-purple/20 ml-auto max-w-[80%]':'bg-white/5 mr-auto max-w-[90%]'}`}>
                         <div dangerouslySetInnerHTML={{__html: marked.parse(m.text) as string}} className="markdown-content text-gray-200" />
                     </div>
                 ))}
                 {isTyping && <div className="text-xs text-gray-500 animate-pulse">JunAiKey is thinking...</div>}
             </div>
             {/* Input Area */}
             <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                 <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Universal Intelligence..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-celestial-emerald"
                 />
                 <button onClick={handleSend} className="p-2 bg-celestial-emerald rounded-xl text-white"><Send className="w-5 h-5"/></button>
             </div>
        </div>
      )}
    </>
  );
};
