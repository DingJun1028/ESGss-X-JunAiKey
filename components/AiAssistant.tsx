import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Paperclip, Workflow, Database, Infinity } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { streamEsgInsight } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';
import { marked } from 'marked';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

interface AiAssistantProps {
  language: Language;
}

/**
 * The "Intelligence Orchestrator" chat component.
 * 
 * Features:
 * - Floating trigger button.
 * - Real-time streaming response from Gemini AI.
 * - Simulated "Agentic RAG" process visualization (Planning, Tool Use, etc.).
 * - Markdown rendering for rich text responses.
 * - Message virtualization for performance and smooth scrolling.
 */
export const AiAssistant: React.FC<AiAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  // Status text for the agentic process visualization (e.g., "Planning...")
  const [agentStatus, setAgentStatus] = useState<string>('');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { addToast } = useToast();
  
  // Initialize greeting when language changes or first mount
  useEffect(() => {
    const greeting = language === 'zh-TW' 
      ? "您好。我是您的 Intelligence Orchestrator (智慧協作中樞)。今天能協助您進行哪些 ESG 轉型任務？"
      : "Greetings. I am your Intelligence Orchestrator. How can I assist with your ESG transformation today?";
      
    // Only reset if empty or just switching language for the welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: greeting,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  /**
   * Simulates the "Agentic RAG" process visually before the AI response starts.
   * This creates a delay and shows steps like "Planning", "Analyzing", etc.
   */
  const runAgenticSteps = async () => {
    const stepsZh = [
      "正在規劃任務分解 (Planning)...",
      "調用 esgAnalyzer 分析數據...",
      "查詢 Regulatory Expert 知識庫...",
      "進行 Graph RAG 多跳躍推理...",
      "自我反思與驗證 (Reflecting)..."
    ];
    const stepsEn = [
      "Decomposing task (Planning)...",
      "Invoking esgAnalyzer...",
      "Querying Regulatory Expert...",
      "Performing Graph RAG multi-hop reasoning...",
      "Self-reflecting & Validating..."
    ];
    
    const steps = language === 'zh-TW' ? stepsZh : stepsEn;

    for (const step of steps) {
      setAgentStatus(step);
      // Random delay between 400ms and 800ms to simulate "work"
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
    }
    setAgentStatus('');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Run visualization of Agentic RAG
      await runAgenticSteps();

      // 2. Create placeholder for model response
      const modelMsgId = (Date.now() + 1).toString();
      const initialModelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, initialModelMsg]);

      // 3. Start streaming response
      const stream = streamEsgInsight(userMsg.text, language);
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
        setAgentStatus('');
        let errorMsg = language === 'zh-TW' 
          ? "無法連接至 Celestial Nexus。" 
          : "Unable to connect to Celestial Nexus.";
        let errorTitle = language === 'zh-TW' ? "系統錯誤" : "System Error";
        let toastType: 'error' | 'warning' = 'error';

        if (e.message === "MISSING_API_KEY") {
          errorTitle = language === 'zh-TW' ? "缺少 API 金鑰" : "Missing API Key";
          errorMsg = language === 'zh-TW' 
            ? "請設定 API_KEY 以使用 AI 功能。(模擬回應模式)" 
            : "Please configure API_KEY to unlock AI features. (Simulated Mode)";
          toastType = 'warning';
          
          // Fallback simulated response with Markdown
          const simulatedResponse = language === 'zh-TW' 
            ? "*(模擬回應 - Agentic RAG Mode)*\n\n**根據 TCFD 框架與內部碳數據**，建議企業採取以下步驟：\n\n1. 進行 **氣候風險情境分析** (Scenario Analysis)\n2. 盤查 **範疇一 (Scope 1)** 與 **範疇二 (Scope 2)** 碳排放數據\n3. 制定淨零轉型路徑"
            : "*(Simulated Response - Agentic RAG Mode)*\n\n**According to the TCFD framework and internal carbon data**, it is recommended that companies:\n\n1. Conduct **Climate Risk Scenario Analysis**\n2. Inventory **Scope 1** and **Scope 2** carbon emissions\n3. Develop a Net-Zero transition pathway";
            
           setMessages(prev => prev.map(msg => {
             // If we have an empty placeholder (id matches), update it.
             if (msg.role === 'model' && msg.text === '' && msg.timestamp > userMsg.timestamp) {
                 return { ...msg, text: simulatedResponse };
             }
             return msg;
           }));
        } else {
             // Real error
             setMessages(prev => prev.filter(msg => !(msg.role === 'model' && msg.text === '')));
             setMessages(prev => [...prev, {
                id: (Date.now() + 2).toString(),
                role: 'system',
                text: language === 'zh-TW' ? "⚠️ 錯誤：無法生成回應。" : "⚠️ Error: Could not generate response.",
                timestamp: new Date()
             }]);
        }

        addToast(toastType, errorMsg, errorTitle);
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
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-celestial-emerald to-celestial-purple rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 animate-float group"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          <Infinity className="w-8 h-8 text-white animate-pulse" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] h-[600px] max-h-[80vh] flex flex-col rounded-2xl glass-panel overflow-hidden animate-fade-in border-celestial-glassBorder shadow-2xl">
          
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-celestial-emerald animate-ping" />
              <h3 className="font-semibold text-white tracking-wide flex items-center gap-2">
                  <Bot className="w-4 h-4 text-celestial-purple"/>
                  Intelligence Orchestrator
              </h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Messages with Virtualization */}
          <div className="flex-1 overflow-hidden p-0">
             <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100%' }}
                data={messages}
                followOutput="auto"
                initialTopMostItemIndex={messages.length - 1}
                itemContent={(index, msg) => (
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-4 py-2`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-celestial-purple/80 text-white rounded-br-none'
                          : msg.role === 'system'
                          ? 'bg-red-900/40 text-red-200 border border-red-500/30'
                          : 'bg-slate-800/80 text-gray-200 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {msg.role === 'model' && <Sparkles className="w-3 h-3 text-celestial-gold mb-1 inline-block mr-1" />}
                      {renderMessageContent(msg.text)}
                      <div className="text-[10px] opacity-50 mt-1 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
                components={{
                  Footer: () => (
                    (isTyping || agentStatus) ? (
                      <div className="flex justify-start px-4 py-2">
                        <div className="bg-slate-800/50 p-3 rounded-2xl rounded-bl-none border border-white/5 flex flex-col gap-2 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <Workflow className="w-4 h-4 text-celestial-emerald animate-spin-slow" />
                            <span className="text-xs font-semibold text-celestial-emerald">Agentic Process</span>
                          </div>
                          {agentStatus ? (
                             <div className="text-xs text-gray-300 animate-pulse pl-6 border-l border-white/10">
                                {agentStatus}
                             </div>
                          ) : (
                            <div className="flex items-center gap-2 pl-6">
                                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                <span className="text-xs text-gray-400">Generative Output...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null
                  )
                }}
             />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'zh-TW' ? "輸入指令以啟動 Agent..." : "Enter command to trigger Agent..."}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 placeholder-gray-500 transition-all"
              />
              <button className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors">
                 <Paperclip className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || !!agentStatus} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-celestial-emerald/20 hover:bg-celestial-emerald/40 text-celestial-emerald rounded-lg transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
                 <div className="flex gap-2">
                     <span className="text-[10px] text-gray-500 flex items-center gap-1"><Database className="w-3 h-3"/> Graph RAG</span>
                     <span className="text-[10px] text-gray-500 flex items-center gap-1"><Workflow className="w-3 h-3"/> Planning</span>
                 </div>
                 <span className="text-[10px] text-gray-600">v12.0.4</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};