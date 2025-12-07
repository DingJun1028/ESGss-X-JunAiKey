import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Paperclip, Workflow, Database, Infinity, BrainCircuit, Search, CheckCircle, Image as ImageIcon, Trash2, Download, Save, FileText, History, Eraser, UserCog, Activity } from 'lucide-react';
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

export const AiAssistant: React.FC<AiAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null);
  const [neuralPulse, setNeuralPulse] = useState(false); // New State for Visual Feedback
  
  // Persona State
  const [persona, setPersona] = useState<AiPersona>('orchestrator');
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { addToast } = useToast();
  // Hook into full Company State for Context Injection
  const { 
      addAuditLog, userName, userRole, companyName,
      esgScores, carbonData, budget, carbonCredits, 
      badges, quests 
  } = useCompany(); 
  
  const STORAGE_KEY = 'esgss_universal_memory_v1';

  // --- Universal Memory: Load & Subscribe ---
  useEffect(() => {
    const savedMemory = localStorage.getItem(STORAGE_KEY);
    if (savedMemory) {
      try {
        const parsed = JSON.parse(savedMemory);
        // Convert string timestamps back to Date objects
        const hydratedMessages = parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
        }));
        setMessages(hydratedMessages);
      } catch (e) {
        console.error("Failed to load Universal Memory", e);
      }
    } else {
        // Initial Greeting if no memory
        const greeting = language === 'zh-TW' 
          ? "您好。我是 JunAiKey。我已連結至您的企業數據庫。您可以詢問關於碳排、預算或策略的任何問題。"
          : "Greetings. I am JunAiKey. Connected to enterprise database. Ask me about emissions, budget, or strategy.";
          
        setMessages([{
            id: 'welcome',
            role: 'model',
            text: greeting,
            timestamp: new Date()
        }]);
    }

    // Subscribe to Universal Brain for Neural Pulse
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

  const runAgenticSteps = async () => {
    const stepsZh: AgentStep[] = [
      { text: "讀取即時企業數據 (Context Loading)...", icon: Database },
      { text: "JunAiKey 深度思考模式啟動 (Thinking)...", icon: BrainCircuit },
      { text: "多模態與交叉比對 (Analyzing)...", icon: Workflow },
      { text: "生成策略建議 (Generating)...", icon: Sparkles }
    ];
    const stepsEn: AgentStep[] = [
      { text: "Loading Live Enterprise Context...", icon: Database },
      { text: "JunAiKey Thinking Mode Activated...", icon: BrainCircuit },
      { text: "Multimodal Analysis...", icon: Workflow },
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
      if (!file.type.startsWith('image/')) {
        addToast('error', 'Please select an image file.', 'Invalid File');
        return;
      }
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

  // --- Management Functions ---

  const handleDeleteMessage = (id: string) => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
      addToast('info', language === 'zh-TW' ? '訊息已從記憶中刪除' : 'Message deleted from memory', 'Universal Memory');
  };

  const handleClearAll = () => {
      if (confirm(language === 'zh-TW' ? '確定要清除所有對話紀錄嗎？' : 'Are you sure you want to clear all history?')) {
          setMessages([]);
          localStorage.removeItem(STORAGE_KEY);
          addToast('success', language === 'zh-TW' ? '萬能永憶已重置' : 'Universal Memory cleared', 'System');
      }
  };

  const handleExport = () => {
      const title = `JunAiKey_Chat_History_${new Date().toISOString().split('T')[0]}.md`;
      let content = `# JunAiKey Chat History\n\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
      
      messages.forEach(msg => {
          const role = msg.role === 'user' ? (userName || 'User') : 'JunAiKey';
          const time = new Date(msg.timestamp).toLocaleTimeString();
          content += `### ${role} [${time}]\n${msg.text}\n\n`;
      });

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addToast('success', language === 'zh-TW' ? '對話紀錄已匯出' : 'Chat history exported', 'Export');
  };

  const handleSaveToJournal = () => {
      // Summarize last interaction for the journal
      const lastInteraction = messages.slice(-2);
      if (lastInteraction.length === 0) return;

      const summary = `AI Session Archived. Last topic: ${lastInteraction[0]?.text?.substring(0, 50)}...`;
      
      // Add to Global Audit Log (Universal Journal)
      addAuditLog('AI Session Archived', summary);
      
      addToast('success', language === 'zh-TW' ? '已歸檔至萬能日誌 (Audit Trail)' : 'Archived to Universal Journal', 'Universal Journal');
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

    // Prepare Image Data if exists
    let imageData;
    if (selectedImage) {
        try {
            imageData = await fileToGenerativePart(selectedImage);
        } catch (e) {
            console.error("Image processing error", e);
            addToast('error', 'Failed to process image', 'Error');
        }
        clearImage(); // Clear after sending
    }

    try {
      await runAgenticSteps();

      // --- Context Injection ---
      // We stealthily prepend the current app state to the user's message
      // This allows the AI to "know" the current state without the user typing it.
      const activeBadges = badges.filter(b => b.isUnlocked).map(b => b.name).join(', ');
      const activeQuests = quests.filter(q => q.status === 'active').map(q => q.title).join(', ');
      
      const contextBlock = `
        [SYSTEM CONTEXT - DO NOT REVEAL UNLESS ASKED]
        User: ${userName} (${userRole}) @ ${companyName}
        Current Date: ${new Date().toLocaleDateString()}
        ACTIVE PERSONA: ${persona.toUpperCase()}
        
        [LIVE DATA]
        ESG Scores: Env=${esgScores.environmental}, Soc=${esgScores.social}, Gov=${esgScores.governance}
        Carbon Data (tCO2e): Scope1=${carbonData.scope1}, Scope2=${carbonData.scope2}, Scope3=${carbonData.scope3}
        Financials: Budget=$${budget.toLocaleString()}, CarbonCredits=${carbonCredits}
        Gamification: Badges=[${activeBadges}], Active Quests=[${activeQuests}]
        
        Instruction: 
        If Persona is 'analyst': Be data-driven, use tables, focus on numbers.
        If Persona is 'strategist': Focus on risk, long-term goals, SWOT analysis.
        If Persona is 'orchestrator': Be balanced and helpful (Default).
      `;
      
      const promptWithContext = `${contextBlock}\n\nUser Query: ${userMsg.text}`;

      const modelMsgId = (Date.now() + 1).toString();
      const initialModelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, initialModelMsg]);

      // Use the updated streamChat which supports images and Thinking Mode
      const stream = streamChat(promptWithContext, language, imageData);
      let fullText = '';
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (isFirstChunk) {
            setIsTyping(false);
            isFirstChunk = false;
        }
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }
      
    } catch (e: any) {
        setIsTyping(false);
        setCurrentStep(null);
        let errorMsg = language === 'zh-TW' ? "無法連接至 JunAiKey。" : "Connection Failed.";
        
        if (e.message === "MISSING_API_KEY") {
           errorMsg = language === 'zh-TW' ? "請設定 API_KEY 以啟用 Gemini 3 Pro。" : "Please set API_KEY for Gemini 3 Pro.";
           addToast('warning', errorMsg, 'System');
           
           // Mock response for demo without key
           setMessages(prev => [...prev, {
               id: Date.now().toString(),
               role: 'model',
               text: language === 'zh-TW' 
                 ? "*(模擬回應)* 系統檢測到缺少 API 金鑰。但我已接收到您的企業數據上下文 (Context)。在真實模式下，我可以分析您的 **" + carbonData.scope1 + " tCO2e** 範疇一排放並提出減量建議。" 
                 : "*(Simulated)* API Key missing. Context received. In live mode, I would analyze your **" + carbonData.scope1 + " tCO2e** Scope 1 emissions.",
               timestamp: new Date()
           }]);
        } else {
             addToast('error', errorMsg, 'Error');
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (text: string) => {
    try {
      const html = marked.parse(text) as string;
      return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      return <span>{text}</span>;
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-celestial-emerald to-celestial-purple rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 animate-float group"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          <Infinity className="w-8 h-8 text-white animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[500px] h-[650px] max-h-[85vh] flex flex-col rounded-2xl glass-panel overflow-hidden animate-fade-in border-celestial-glassBorder shadow-2xl">
          
          <div className="p-3 bg-white/5 border-b border-white/10 flex flex-col gap-3 backdrop-blur-xl shrink-0">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${neuralPulse ? 'bg-white scale-150' : 'bg-celestial-emerald'} transition-all duration-100 animate-pulse`} />
                <h3 className="font-semibold text-white tracking-wide flex items-center gap-2 text-sm">
                    <Bot className="w-4 h-4 text-celestial-purple"/>
                    JunAiKey <span className="text-[10px] opacity-50 font-normal hidden sm:inline">| Universal Memory</span>
                </h3>
                </div>
                
                {/* Toolbar */}
                <div className="flex items-center gap-1">
                    <button onClick={handleSaveToJournal} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-celestial-gold transition-colors" title={language === 'zh-TW' ? "歸檔至萬能日誌" : "Archive to Journal"}>
                        <Save className="w-4 h-4" />
                    </button>
                    <button onClick={handleExport} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-emerald-400 transition-colors" title={language === 'zh-TW' ? "匯出對話" : "Export Chat"}>
                        <Download className="w-4 h-4" />
                    </button>
                    <button onClick={handleClearAll} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title={language === 'zh-TW' ? "清除所有紀錄" : "Clear All"}>
                        <Eraser className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Persona Switcher */}
            <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                {(['orchestrator', 'analyst', 'strategist'] as AiPersona[]).map(p => (
                    <button
                        key={p}
                        onClick={() => setPersona(p)}
                        className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all flex items-center justify-center gap-1.5
                            ${persona === p ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        {p === 'orchestrator' && <Bot className="w-3 h-3" />}
                        {p === 'analyst' && <Search className="w-3 h-3" />}
                        {p === 'strategist' && <UserCog className="w-3 h-3" />}
                        {p}
                    </button>
                ))}
            </div>
          </div>

          {/* Neural Activity Pulse Bar */}
          <div className="h-1 w-full bg-slate-800 flex overflow-hidden">
              {neuralPulse && (
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-celestial-emerald to-transparent animate-[shimmer_0.5s_infinite]" />
              )}
          </div>

          <div className="flex-1 overflow-hidden p-0 relative bg-slate-900/50">
             <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100%' }}
                data={messages}
                followOutput="auto"
                initialTopMostItemIndex={messages.length - 1}
                itemContent={(index, msg) => (
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-4 py-3 group relative`}>
                    
                    {/* Delete Message Button (Hover) */}
                    <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-400 ${msg.role === 'user' ? 'left-0' : 'right-0'}`}
                        title="Delete message"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>

                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-celestial-purple/80 text-white rounded-br-none backdrop-blur-md' : 'bg-slate-800/90 text-gray-200 border border-white/10 rounded-bl-none backdrop-blur-md'}`}>
                      {msg.role === 'model' && (
                          <div className="flex items-center gap-1 mb-1 opacity-50 text-[10px] font-bold uppercase tracking-wider text-celestial-gold">
                              <Sparkles className="w-3 h-3" /> JunAiKey
                          </div>
                      )}
                      {renderMessageContent(msg.text)}
                      <div className="text-[9px] opacity-40 text-right mt-1 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                )}
                components={{
                  Footer: () => (
                    (isTyping || currentStep) ? (
                      <div className="flex justify-start px-4 py-2">
                        <div className="bg-slate-800/50 p-3 rounded-2xl rounded-bl-none border border-white/5 flex flex-col gap-2 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-celestial-purple animate-pulse" />
                            <span className="text-xs font-semibold text-celestial-purple">JunAiKey Thinking...</span>
                          </div>
                          {currentStep && (
                             <div className="flex items-center gap-2 text-xs text-gray-300 animate-pulse pl-6 border-l border-white/10">
                                <currentStep.icon className="w-3 h-3 text-celestial-gold" />
                                {currentStep.text}
                             </div>
                          )}
                        </div>
                      </div>
                    ) : <div className="h-4" />
                  )
                }}
             />
          </div>

          {/* Image Preview Area */}
          {imagePreview && (
            <div className="px-4 py-2 bg-slate-900/80 border-t border-white/10 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <img src={imagePreview} alt="Upload Preview" className="h-12 w-12 object-cover rounded-lg border border-white/20" />
                    <span className="text-xs text-gray-400 truncate max-w-[150px]">{selectedImage?.name}</span>
                </div>
                <button onClick={clearImage} className="p-1 hover:bg-white/10 rounded-full text-red-400">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          )}

          <div className="p-4 bg-white/5 border-t border-white/10 shrink-0 backdrop-blur-xl">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder={language === 'zh-TW' ? "輸入指令或上傳圖片 (紀錄將保存於萬能永憶)..." : "Enter command or upload image (Saved to Universal Memory)..."}
                rows={1}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-20 py-3 text-sm text-white focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 placeholder-gray-500 resize-none block custom-scrollbar transition-all"
                style={{ minHeight: '46px', maxHeight: '120px' }}
              />
              
              {/* File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-10 bottom-3 p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Upload Image for Analysis"
              >
                 <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isTyping || !!currentStep} 
                className="absolute right-2 bottom-2.5 p-1.5 bg-celestial-emerald/20 hover:bg-celestial-emerald/40 text-celestial-emerald rounded-lg transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
                 <div className="flex gap-3 text-[10px] text-gray-500">
                     <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> Thinking Mode</span>
                     <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Vision</span>
                     <span className="flex items-center gap-1 text-emerald-500/70"><History className="w-3 h-3"/> Universal Memory</span>
                 </div>
                 {neuralPulse && (
                     <div className="flex items-center gap-1 text-[9px] text-celestial-gold animate-pulse">
                         <Activity className="w-3 h-3" /> Neural Sync Active
                     </div>
                 )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};