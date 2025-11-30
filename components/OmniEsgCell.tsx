
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Minus, LucideIcon, 
  Activity, BrainCircuit, Rocket, 
  Infinity, Tag, Loader2, ScanLine, Lock
} from 'lucide-react';
import { OmniEsgTrait, OmniEsgDataLink, OmniEsgMode, OmniEsgConfidence, OmniEsgColor, UniversalLabel } from '../types';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { analyzeDataAnomaly } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';

// Import Minimal Atomic Components
import { DataLinkIndicator } from './minimal/DataLinkIndicator';
import { ConfidenceIndicator } from './minimal/ConfidenceIndicator';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { QuantumValueEditor } from './minimal/QuantumValueEditor';

/**
 * Theme Definition
 */
const getTheme = (color: OmniEsgColor) => ({
  emerald: { 
    border: 'group-hover:border-emerald-500/40', 
    glow: 'bg-emerald-500', 
    text: 'text-emerald-400', 
    iconBg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20' 
  },
  gold: { 
    border: 'group-hover:border-amber-500/40', 
    glow: 'bg-amber-500', 
    text: 'text-amber-400', 
    iconBg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20' 
  },
  purple: { 
    border: 'group-hover:border-purple-500/40', 
    glow: 'bg-purple-500', 
    text: 'text-purple-400', 
    iconBg: 'bg-purple-500/10',
    gradient: 'from-purple-500/20' 
  },
  blue: { 
    border: 'group-hover:border-blue-500/40', 
    glow: 'bg-blue-500', 
    text: 'text-blue-400', 
    iconBg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20' 
  },
  slate: { 
    border: 'group-hover:border-slate-400/40', 
    glow: 'bg-slate-400', 
    text: 'text-slate-400', 
    iconBg: 'bg-slate-500/10',
    gradient: 'from-slate-500/20' 
  },
}[color]);

interface OmniEsgCellBaseProps {
  id?: string; // Universal ID for self-growth tracking
  mode: OmniEsgMode;
  label?: string | UniversalLabel; // Support for Universal Label
  value?: string | number;
  subValue?: string;
  confidence?: OmniEsgConfidence;
  verified?: boolean;
  loading?: boolean;
  dataLink?: OmniEsgDataLink;
  traits?: OmniEsgTrait[];
  tags?: string[];
  icon?: LucideIcon;
  color?: OmniEsgColor;
  className?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  onAiAnalyze?: () => void;
  onClick?: () => void;
}

// Combine with Injected Props from HOC
type OmniEsgCellProps = OmniEsgCellBaseProps & InjectedProxyProps;

/**
 * OmniEsgCell Component (The Quantum Brick).
 * 
 * Features:
 * - Minimal Atomization: Uses sub-components for key elements.
 * - Universal Proxy: Telemetry, Circuit Breaking, Adaptation.
 * - 8 Evolutionary Traits: Visualizes data state (Learning, Gap-filling, etc.).
 * - Bi-directional: Supports in-place editing and AI triggering.
 */
const OmniEsgCellBase: React.FC<OmniEsgCellProps> = (props) => {
  const { 
    mode, label, value, subValue, confidence = 'high', verified = false, 
    loading = false, dataLink, traits = [], tags = [], icon: Icon, color = 'emerald', className = '', trend, onClick, onAiAnalyze,
    adaptiveTraits = [], trackInteraction, isHighFrequency
  } = props;
  
  const { addToast } = useToast();

  // Resolve Label (Universal Label support)
  const labelText = typeof label === 'object' ? label?.text : label;
  
  // Merge static traits with adaptive traits (Self-Growth)
  const activeTraits = Array.from(new Set([...traits, ...adaptiveTraits]));

  // Internal AI Trigger Logic (Deep Integration)
  const handleInternalAiTrigger = async () => {
    trackInteraction?.('ai-trigger');
    addToast('info', `AI Agent analyzing ${labelText}...`, 'Intelligence Orchestrator');
    try {
      // Simulate Service Call with Context
      await analyzeDataAnomaly(
        labelText || 'Unknown Metric',
        value || 'N/A',
        "Historical Avg",
        "User initiated deep analysis via Quantum Trigger.",
        'en-US'
      );
      addToast('success', 'Analysis complete. Insights updated.', 'AI Agent');
    } catch (e) {
      addToast('error', 'Analysis failed.', 'System Error');
    }
  };

  // Interaction Handlers
  const handleEditStart = () => {
    trackInteraction?.('edit');
  };

  const handleEditUpdate = (newValue: string | number) => {
    trackInteraction?.('edit');
    addToast('success', `Value updated to ${newValue}`, 'Universal Data Link');
    // In a real app, this would dispatch an update to the backend or context
  };

  if (loading) {
    const shimmer = "animate-pulse bg-white/5";
    const bgBase = "bg-slate-900/40 border border-white/5";
    if (mode === 'card') {
      return (
        <div className={`p-6 rounded-xl ${bgBase} h-full flex flex-col justify-between ${className}`} aria-busy="true" aria-label="Loading metric">
           <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                 <div className={`h-3 w-24 rounded ${shimmer}`} />
                 <div className={`h-2 w-16 rounded ${shimmer}`} />
              </div>
              <div className={`w-10 h-10 rounded-xl ${shimmer}`} />
           </div>
           <div className={`h-8 w-32 rounded mb-2 ${shimmer}`} />
           <div className="flex justify-between items-end mt-2">
              <div className={`h-3 w-20 rounded ${shimmer}`} />
              <div className={`h-2 w-2 rounded-full ${shimmer}`} />
           </div>
        </div>
      );
    }
    if (mode === 'list') {
       return (
          <div className={`p-3 rounded-xl ${bgBase} flex items-center justify-between ${className}`} aria-busy="true">
             <div className="flex items-center gap-4 w-full">
                <div className={`w-10 h-10 rounded-lg shrink-0 ${shimmer}`} />
                <div className="space-y-2 w-full max-w-[200px]">
                   <div className={`h-3 w-3/4 rounded ${shimmer}`} />
                   <div className={`h-2 w-1/2 rounded ${shimmer}`} />
                </div>
             </div>
             <div className="flex flex-col items-end gap-2 shrink-0">
                 <div className={`h-4 w-12 rounded ${shimmer}`} />
                 <div className={`h-2 w-8 rounded ${shimmer}`} />
             </div>
          </div>
       );
    }
    if (mode === 'cell') {
        return (
            <div className={`p-4 rounded-xl ${bgBase} flex flex-col justify-between h-full ${className}`} aria-busy="true">
                <div className={`h-3 w-20 rounded mb-4 ${shimmer}`} />
                <div className={`h-6 w-16 rounded ${shimmer}`} />
            </div>
        )
    }
    return <div className={`h-6 w-24 rounded-full ${shimmer} ${className}`} aria-busy="true" />;
  }

  const theme = getTheme(color);
  const isOptimization = activeTraits.includes('optimization');
  const isGapFilling = activeTraits.includes('gap-filling');
  const isTagging = activeTraits.includes('tagging');
  const isPerformance = activeTraits.includes('performance');
  const isLearning = activeTraits.includes('learning');
  const isEvolution = activeTraits.includes('evolution');
  const isBridging = activeTraits.includes('bridging');
  const isSeamless = activeTraits.includes('seamless');

  // Interactive Props
  const interactiveProps = onClick ? {
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
          }
      },
      'aria-label': `${labelText || 'Metric'}, value is ${value}`
  } : {};

  // Wrapper Classes - Apply "Evolutionary Glow" if high frequency
  const wrapperClasses = `
    group relative overflow-hidden transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-celestial-purple/50
    ${isSeamless ? 'bg-transparent border-none' : `backdrop-blur-xl bg-slate-900/40 border ${isGapFilling ? 'border-dashed border-amber-500/30' : 'border-white/5'} hover:bg-white/5`}
    ${!isSeamless && theme.border}
    ${isSeamless ? '' : 'shadow-lg shadow-black/20 hover:shadow-2xl'}
    ${isOptimization ? 'animate-ai-pulse ring-1 ring-celestial-purple/30' : ''}
    ${isHighFrequency ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''} 
    ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
    ${className}
  `;

  // === MODE: CARD ===
  if (mode === 'card') {
    return (
      <div className={wrapperClasses} onClick={onClick} {...interactiveProps}>
        {!isSeamless && (
          <>
            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl pointer-events-none ${theme.glow}`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
          </>
        )}
        
        {/* Trait: Bridging */}
        {isBridging && (
          <div className="pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        )}

        {/* Trait: Gap Filling */}
        {isGapFilling && (
           <>
             <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,transparent_25%,rgba(251,191,36,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px] pointer-events-none" />
             <div className="absolute top-0 left-0 w-full h-[100%] bg-gradient-to-b from-transparent via-amber-500/5 to-transparent animate-[float_6s_linear_infinite] pointer-events-none translate-y-[-100%]" />
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.05),transparent)] animate-pulse pointer-events-none opacity-50" style={{ animationDuration: '4s' }} />
           </>
        )}

        {/* Trait: Learning */}
        {isLearning && (
           <div className="absolute top-3 right-3 animate-pulse opacity-60 z-20" title="AI is actively learning from this data">
              <BrainCircuit className="w-4 h-4 text-celestial-purple" />
           </div>
        )}

        <div className="relative z-10 p-6 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
               <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-medium tracking-wide">{labelText}</span>
                  <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} label={labelText} />
               </div>
               
               <div className="flex flex-wrap gap-2">
                 {dataLink && <DataLinkIndicator type={dataLink} />}
                 {isGapFilling && (
                   <div className="flex items-center gap-1.5 text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-dashed border-amber-500/30 cursor-help" title="Data estimated by AI">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="font-semibold tracking-wider">AI ESTIMATING</span>
                   </div>
                 )}
                 {/* Trait: Tagging */}
                 {isTagging && tags.map(tag => (
                   <span key={tag} className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                   </span>
                 ))}
               </div>
            </div>

            <div className={`p-2.5 rounded-xl border border-white/5 ${theme.iconBg} ${theme.text} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
               {Icon ? <Icon className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-4 mb-1">
             <QuantumValueEditor 
                value={value || 0} 
                theme={theme} 
                onEditStart={handleEditStart} 
                onUpdate={handleEditUpdate}
             />
             {isGapFilling && (
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden flex" title="Estimation Confidence">
                    <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] w-[85%] animate-pulse relative">
                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50" />
                    </div>
                </div>
             )}
          </div>
          
          <div className="flex items-end justify-between">
             <div>
                {subValue && <p className="text-xs text-gray-500 font-medium mb-1">{subValue}</p>}
                <div className="flex items-center gap-2">
                   {trend ? (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${trend.direction === 'up' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                         {/* Trait: Performance */}
                         {isPerformance && trend.direction === 'up' ? <Rocket className="w-3 h-3 animate-pulse" /> : (trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                         {Math.abs(trend.value)}%
                      </span>
                   ) : <span className="text-xs text-gray-600 flex items-center gap-1"><Minus className="w-3 h-3"/> Stable</span>}
                </div>
             </div>
             <ConfidenceIndicator level={confidence} verified={verified} />
          </div>
        </div>
        
        {/* Trait: Evolution */}
        {isEvolution && (
           <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:rotate-45 z-0">
              <Infinity className="w-32 h-32 text-white" />
           </div>
        )}
      </div>
    );
  }

  // === MODE: LIST ===
  if (mode === 'list') {
    return (
      <div className={`${wrapperClasses} p-3 rounded-xl flex items-center justify-between`} onClick={onClick} {...interactiveProps}>
          <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg border border-white/5 ${theme.iconBg} ${theme.text} relative`}>
                  {isGapFilling ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : (Icon ? <Icon className="w-4 h-4" /> : <Activity className="w-4 h-4" />)}
                  {isLearning && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>}
              </div>
              <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{labelText}</span>
                    <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} label={labelText} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                      {subValue && <span className="text-gray-500">{subValue}</span>}
                      {dataLink && <DataLinkIndicator type={dataLink} />}
                      {isGapFilling && (
                        <div className="flex items-center gap-1.5 text-amber-500/50">
                           <ScanLine className="w-3 h-3 animate-pulse" />
                           <span>AI Reconstructing...</span>
                        </div>
                      )}
                  </div>
              </div>
          </div>
          <div className="text-right">
              <div className={`text-sm font-bold font-mono ${theme.text} ${isGapFilling ? 'animate-pulse' : ''}`}>{value}</div>
              <div className="flex justify-end mt-1">
                  <ConfidenceIndicator level={confidence} verified={verified} compact />
              </div>
          </div>
          {isBridging && (
             <div className="absolute right-0 h-full w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          )}
      </div>
    );
  }

  // === MODE: CELL ===
  if (mode === 'cell') {
      return (
        <div className={`${wrapperClasses} p-4 rounded-xl flex flex-col justify-between h-full`} onClick={onClick} {...interactiveProps}>
            <div className="flex justify-between items-start">
               <span className="text-xs text-gray-400">{labelText}</span>
               <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} label={labelText} />
            </div>
            <div className={`text-xl font-bold text-white mt-2 ${theme.text} ${isGapFilling ? 'opacity-80' : ''}`}>{value}</div>
             {trend && (
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1 text-[10px]">
                   <TrendingUp className="w-3 h-3 text-emerald-400" />
                   <span className="text-emerald-400">+{trend.value}%</span>
                </div>
             )}
             {isGapFilling && (
               <div className="absolute bottom-1 right-2 opacity-60 flex gap-1">
                 <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
               </div>
             )}
        </div>
      );
  }
  
  // === MODE: BADGE ===
  if (mode === 'badge') {
     return (
        <div className="flex items-center gap-2 group/badge" aria-label={`Badge: ${value}`}>
           <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden relative border border-white/5">
               <div className={`h-full absolute left-0 top-0 rounded-full transition-all duration-1000 ${theme.glow} ${confidence === 'high' ? 'w-full' : 'w-1/2'}`} />
           </div>
           {verified && <Lock className="w-3 h-3 text-emerald-400" />}
           <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} />
        </div>
     );
  }

  return null;
};

// Export the Proxied Component as the Default OmniEsgCell
export const OmniEsgCell = withUniversalProxy(OmniEsgCellBase);
