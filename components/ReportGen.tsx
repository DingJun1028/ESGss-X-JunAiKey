
import React, { useState, useRef } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter } from '../services/ai-service';
import { Language, ReportSection } from '../types';
import { REPORT_STRUCTURE } from '../constants';
import { FileText, Sparkles, Download, Loader2, RefreshCw, ChevronRight, BookOpen, AlertCircle, Save } from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ReportGenProps {
  language: Language;
}

export const ReportGen: React.FC<ReportGenProps> = ({ language }) => {
  const { companyName, esgScores, totalScore, carbonCredits, budget } = useCompany();
  const { addToast } = useToast();
  
  const [activeSectionId, setActiveSectionId] = useState<string>('1.01');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const isZh = language === 'zh-TW';

  // Find current active section data
  const getActiveSectionData = (): ReportSection | undefined => {
    for (const chapter of REPORT_STRUCTURE) {
        if (chapter.id === activeSectionId) return chapter;
        if (chapter.subSections) {
            const sub = chapter.subSections.find(s => s.id === activeSectionId);
            if (sub) return sub;
        }
    }
    return undefined;
  };

  const activeSection = getActiveSectionData();

  const handleGenerateSection = async () => {
    if (!activeSection) return;

    setIsGenerating(true);
    addToast('info', isZh ? `正在生成 [${activeSection.title}] 草稿...` : `Drafting [${activeSection.title}]...`, 'AI Reporter');

    try {
      const contextData = {
        company: companyName,
        scores: esgScores,
        overall_esg_score: totalScore,
        carbon_credits_inventory: carbonCredits,
        financial_budget_remaining: budget,
        reporting_year: new Date().getFullYear(),
        frameworks: ['GRI Standards 2021', 'SASB', 'TCFD'],
        employees: 2949, // Mock data based on example
        revenue: "50 Billion NTD" // Mock data
      };

      const content = await generateReportChapter(
          activeSection.title, 
          activeSection.template || "", 
          activeSection.example || "",
          contextData, 
          language
      );
      
      setGeneratedContent(prev => ({
          ...prev,
          [activeSection.id]: content
      }));
      
      addToast('success', isZh ? '草稿生成完成' : 'Draft generated successfully', 'AI Reporter');
    } catch (error) {
      addToast('error', isZh ? '生成失敗' : 'Generation failed', 'Error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
      if (!reportRef.current) return;
      setIsExporting(true);
      addToast('info', isZh ? '正在編譯完整報告 PDF...' : 'Compiling full report PDF...', 'System');

      const element = reportRef.current;
      const opt = {
        margin:       10,
        filename:     `${companyName}_Sustainability_Report_${new Date().getFullYear()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Create a temporary container to render ALL sections for the PDF
      // In a real app, we might want to fetch all missing sections first
      html2pdf().set(opt).from(element).save().then(() => {
          setIsExporting(false);
          addToast('success', 'PDF Downloaded.', 'System');
      });
  };

  const renderMarkdown = (text: string) => {
    try {
        const html = marked.parse(text);
        if (typeof html === 'string') return { __html: html };
        return { __html: text }; 
    } catch (e) {
        return { __html: text };
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in gap-4">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                    <FileText className="w-6 h-6 text-celestial-purple" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{isZh ? '永續報告書編撰平台' : 'Sustainability Report Builder'}</h2>
                    <p className="text-gray-400 text-sm">{isZh ? 'GRI Standards 2021 合規指引' : 'GRI Standards 2021 Compliance'}</p>
                </div>
            </div>
            <div className="flex gap-3">
                 <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all disabled:opacity-50"
                 >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Export PDF</span>
                 </button>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            
            {/* Sidebar Navigation */}
            <div className="col-span-3 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{isZh ? '章節目錄' : 'Table of Contents'}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {REPORT_STRUCTURE.map((chapter) => (
                        <div key={chapter.id} className="mb-2">
                            <button 
                                onClick={() => setActiveSectionId(chapter.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${activeSectionId === chapter.id ? 'bg-celestial-purple/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="truncate">{chapter.title}</span>
                            </button>
                            
                            {/* Subsections */}
                            {chapter.subSections && (
                                <div className="ml-2 mt-1 space-y-1 border-l border-white/10 pl-2">
                                    {chapter.subSections.map(sub => (
                                        <button 
                                            key={sub.id}
                                            onClick={() => setActiveSectionId(sub.id)}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 ${activeSectionId === sub.id ? 'bg-celestial-emerald/10 text-celestial-emerald' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${generatedContent[sub.id] ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                                            <span className="truncate">{sub.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="col-span-9 flex flex-col gap-6 h-full min-h-0">
                
                {/* 1. Template & Guide (Top) */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60 shrink-0 max-h-[35%] overflow-y-auto custom-scrollbar relative group">
                    <div className="absolute top-4 right-4 flex gap-2">
                        {activeSection?.griStandards && (
                            <span className="text-[10px] px-2 py-1 bg-celestial-gold/10 text-celestial-gold border border-celestial-gold/20 rounded-full">
                                {activeSection.griStandards}
                            </span>
                        )}
                        <span className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Guide
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-4">{activeSection?.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <FileText className="w-3 h-3" /> 
                                {isZh ? '揭露模板' : 'Template'}
                            </h4>
                            <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5 h-32 overflow-y-auto custom-scrollbar">
                                {activeSection?.template || "No template available for this section."}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                {isZh ? '參考範例' : 'Reference Example'}
                            </h4>
                            <div className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5 h-32 overflow-y-auto custom-scrollbar italic">
                                {activeSection?.example || "No example available."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Editor / Generator (Bottom) */}
                <div className="flex-1 glass-panel rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col min-h-0 relative">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${generatedContent[activeSectionId] ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                            <span className="text-sm font-medium text-white">{isZh ? '內容編輯器' : 'Content Editor'}</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleGenerateSection}
                                disabled={isGenerating || !activeSection}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-celestial-purple to-celestial-blue hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                            >
                                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {isZh ? 'AI 自動撰寫' : 'Auto-Write with AI'}
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/30" ref={reportRef}>
                        {generatedContent[activeSectionId] ? (
                            <div 
                                className="markdown-content text-gray-300 leading-relaxed space-y-4 max-w-4xl mx-auto"
                                dangerouslySetInnerHTML={renderMarkdown(generatedContent[activeSectionId])} 
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-60">
                                <FileText className="w-16 h-16 mb-4 stroke-1" />
                                <p>{isZh ? '此章節尚未有內容' : 'No content generated for this section yet.'}</p>
                                <p className="text-sm mt-2">{isZh ? '點擊上方按鈕開始撰寫' : 'Click the button above to start writing.'}</p>
                            </div>
                        )}
                        
                        {isGenerating && (
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-celestial-emerald animate-spin mb-4" />
                                <span className="text-celestial-emerald font-mono animate-pulse">
                                    {isZh ? 'AI 正在參考 GRI 準則撰寫中...' : 'AI is drafting based on GRI standards...'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
