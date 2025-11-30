
import React, { useState } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter } from '../services/ai-service';
import { Language } from '../types';
import { FileText, Sparkles, Download, Loader2, RefreshCw } from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';

interface ReportGenProps {
  language: Language;
}

const DocumentSkeleton = () => (
    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 p-8 flex flex-col animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
            <Loader2 className="w-5 h-5 text-celestial-purple animate-spin" />
            <span className="text-sm text-celestial-purple font-mono animate-pulse">AI Agent Drafting Content...</span>
        </div>
        <div className="space-y-4 max-w-2xl w-full mx-auto opacity-50">
            <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="space-y-2 pt-4">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse delay-75" />
                <div className="h-4 w-full bg-white/10 rounded animate-pulse delay-100" />
                <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse delay-150" />
            </div>
            <div className="space-y-2 pt-4">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse delay-200" />
                <div className="h-4 w-4/5 bg-white/10 rounded animate-pulse delay-300" />
            </div>
            <div className="h-32 w-full bg-white/5 rounded border border-white/5 mt-6 animate-pulse" />
        </div>
    </div>
);

export const ReportGen: React.FC<ReportGenProps> = ({ language }) => {
  const { companyName, esgScores, totalScore, carbonCredits, budget } = useCompany();
  const { addToast } = useToast();
  const [reportContent, setReportContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const isZh = language === 'zh-TW';

  const handleGenerate = async () => {
    setIsGenerating(true);
    addToast('info', isZh ? '正在生成執行摘要草稿...' : 'Generating Executive Summary draft...', 'AI Reporter');

    try {
      const contextData = {
        company: companyName,
        scores: esgScores,
        overall_esg_score: totalScore,
        carbon_credits_inventory: carbonCredits,
        financial_budget_remaining: budget,
        reporting_year: new Date().getFullYear(),
        frameworks: ['GRI', 'SASB', 'TCFD']
      };

      const sectionTitle = isZh ? '執行摘要' : 'Executive Summary';
      const content = await generateReportChapter(sectionTitle, contextData, language);
      setReportContent(content);
      addToast('success', isZh ? '草稿生成完成' : 'Draft generated successfully', 'AI Reporter');
    } catch (error) {
      addToast('error', isZh ? '生成失敗' : 'Generation failed', 'Error');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMarkdown = (text: string) => {
    try {
        const html = marked.parse(text);
        if (typeof html === 'string') {
            return { __html: html };
        }
        return { __html: text }; 
    } catch (e) {
        return { __html: text };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
            <div className="p-3 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                 <FileText className="w-8 h-8 text-celestial-purple" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{isZh ? '報告生成器' : 'Report Generator'}</h2>
                <p className="text-gray-400">{isZh ? 'AI 驅動的永續報告草稿生成工具' : 'AI-driven sustainability report drafting tool'}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Control Panel */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">{isZh ? '報告參數' : 'Report Parameters'}</h3>
                    
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{isZh ? '目標框架' : 'Target Frameworks'}</div>
                        <div className="flex flex-wrap gap-2">
                            {['GRI Standards', 'SASB', 'TCFD'].map(tag => (
                                <span key={tag} className="px-2 py-1 rounded bg-celestial-emerald/10 text-celestial-emerald text-xs border border-celestial-emerald/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                         <div className="text-xs text-gray-500 uppercase tracking-wider">{isZh ? '數據來源' : 'Data Source'}</div>
                         <div className="flex items-center gap-2 text-sm text-gray-300">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             {companyName} Global Data Context
                         </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-celestial-purple to-celestial-blue text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    )}
                    {isZh ? '生成執行摘要' : 'Generate Executive Summary'}
                </button>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl min-h-[500px] border border-white/10 bg-slate-900/40 relative overflow-hidden">
                {reportContent ? (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                            <span className="text-xs font-mono text-gray-500">DRAFT_V1.0.md</span>
                            <div className="flex gap-2">
                                <button onClick={handleGenerate} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Regenerate">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Download">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div 
                            className="markdown-content text-gray-300 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={renderMarkdown(reportContent)} 
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 opacity-50">
                        <FileText className="w-16 h-16 mb-4" />
                        <p>{isZh ? '尚未生成報告內容' : 'No report content generated yet.'}</p>
                        <p className="text-sm">{isZh ? '點擊左側按鈕開始生成。' : 'Click the button to start generation.'}</p>
                    </div>
                )}
                
                {isGenerating && <DocumentSkeleton />}
            </div>
        </div>
    </div>
  );
};
