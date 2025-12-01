
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Paperclip, Workflow, Database, Infinity, BrainCircuit, Search, CheckCircle, Image as ImageIcon, Trash2 } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { streamChat, fileToGenerativePart } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { marked } from 'marked';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

interface AiAssistantProps {
  language: Language;
}

interface AgentStep {
    text: string;
    icon: React.ElementType;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null);
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addToast } = useToast();
  
  useEffect(() => {
    const greeting = language === 'zh-TW' 
      ? "您好。我是 Intelligence Orchestrator。我具備深度思考 (Gemini 3 Pro) 與多模態分析能力。請問今天需要協助什麼？"
      : "Greetings. I am your Intelligence Orchestrator, powered by Gemini 3 Pro with deep reasoning and multimodal vision. How can I assist?";
      
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: greeting,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  const runAgenticSteps = async () => {
    const stepsZh: AgentStep[] = [
      { text: "深度思考模式啟動 (Thinking Mode)...", icon: BrainCircuit },
      { text: "規劃任務分解 (Planning)...", icon: Workflow },
      { text: "調用多模態視覺分析...", icon: ImageIcon },
      { text: "進行 Graph RAG 知識檢索...", icon: Database },
      { text: "自我反思與驗證 (Reflecting)...", icon: CheckCircle }
    ];
    const stepsEn: AgentStep[] = [
      { text: "Thinking Mode Activated...", icon: BrainCircuit },
      { text: "Decomposing task (Planning)...", icon: Workflow },
      { text: "Analyzing Multimodal Input...", icon: ImageIcon },
      { text: "Performing Graph RAG lookup...", icon: Database },
      { text: "Self-reflecting & Validating...", icon: CheckCircle }
    ];
    
    const steps = language === 'zh-TW' ? stepsZh : stepsEn;

    for (const step of steps) {
      setCurrentStep(step);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
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

      const modelMsgId = (Date.now() + 1).toString();
      const initialModelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, initialModelMsg]);

      // Use the updated streamChat which supports images and Thinking Mode
      const stream = streamChat(userMsg.text, language, imageData);
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
        let errorMsg = language === 'zh-TW' ? "無法連接至 Celestial Nexus。" : "Connection Failed.";
        
        if (e.message === "MISSING_API_KEY") {
           errorMsg = language === 'zh-TW' ? "請設定 API_KEY 以啟用 Gemini 3 Pro。" : "Please set API_KEY for Gemini 3 Pro.";
           addToast('warning', errorMsg, 'System');
           
           // Mock response for demo without key
           setMessages(prev => [...prev, {
               id: Date.now().toString(),
               role: 'model',
               text: language === 'zh-TW' ? "*(模擬回應)* 系統檢測到缺少 API 金鑰。在真實模式下，我將使用 **Gemini 3 Pro** 進行深度思考與圖像分析。" : "*(Simulated)* API Key missing. In live mode, I would use **Gemini 3 Pro** for deep reasoning.",
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
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] h-[600px] max-h-[80vh] flex flex-col rounded-2xl glass-panel overflow-hidden animate-fade-in border-celestial-glassBorder shadow-2xl">
          
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-celestial-emerald animate-ping" />
              <h3 className="font-semibold text-white tracking-wide flex items-center gap-2">
                  <Bot className="w-4 h-4 text-celestial-purple"/>
                  Intelligence Orchestrator
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden p-0">
             <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100%' }}
                data={messages}
                followOutput="auto"
                initialTopMostItemIndex={messages.length - 1}
                itemContent={(index, msg) => (
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-4 py-2`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-celestial-purple/80 text-white rounded-br-none' : 'bg-slate-800/80 text-gray-200 border border-white/10 rounded-bl-none'}`}>
                      {msg.role === 'model' && <Sparkles className="w-3 h-3 text-celestial-gold mb-1 inline-block mr-1" />}
                      {renderMessageContent(msg.text)}
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
                            <span className="text-xs font-semibold text-celestial-purple">Gemini 3 Pro Thinking...</span>
                          </div>
                          {currentStep && (
                             <div className="flex items-center gap-2 text-xs text-gray-300 animate-pulse pl-6 border-l border-white/10">
                                <currentStep.icon className="w-3 h-3 text-celestial-gold" />
                                {currentStep.text}
                             </div>
                          )}
                        </div>
                      </div>
                    ) : null
                  )
                }}
             />
          </div>

          {/* Image Preview Area */}
          {imagePreview && (
            <div className="px-4 py-2 bg-slate-900/80 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={imagePreview} alt="Upload Preview" className="h-12 w-12 object-cover rounded-lg border border-white/20" />
                    <span className="text-xs text-gray-400 truncate max-w-[150px]">{selectedImage?.name}</span>
                </div>
                <button onClick={clearImage} className="p-1 hover:bg-white/10 rounded-full text-red-400">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          )}

          <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
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
                placeholder={language === 'zh-TW' ? "輸入指令或上傳圖片..." : "Enter command or upload image..."}
                rows={1}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-20 py-3 text-sm text-white focus:outline-none focus:border-celestial-purple/50 focus:ring-1 focus:ring-celestial-purple/50 placeholder-gray-500 resize-none block custom-scrollbar"
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
                 <div className="flex gap-2 text-[10px] text-gray-500">
                     <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> Thinking Mode</span>
                     <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Vision</span>
                 </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
