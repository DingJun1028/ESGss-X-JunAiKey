import React, { useState } from 'react';
import { 
  Sparkles, Lock, BarChart3, TrendingUp, TrendingDown, Minus, LucideIcon, 
  Activity, Wifi, Bot, Link2, Puzzle, BrainCircuit, Rocket, 
  Infinity, Tag, Edit3, Check, Loader2, ScanLine, Search
} from 'lucide-react';
import { OmniEsgTrait, OmniEsgDataLink, OmniEsgMode, OmniEsgConfidence, OmniEsgColor } from '../types';

/**
 * Props for the OmniEsgCell component.
 * Configures the mode, data content, visual style, and interactive features.
 */
interface OmniEsgCellProps {
  /** 
   * The visualization mode of the cell. Determines the layout and visual weight.
   * - 'card': A standalone KPI card with rich visuals, suitable for dashboards.
   * - 'list': A horizontal row layout, suitable for feeds, tables, or rankings.
   * - 'cell': A compact container for simple data points within a larger grid.
   * - 'badge': A small, pill-shaped indicator.
   */
  mode: OmniEsgMode;

  /** Primary label or title of the metric (e.g., "Carbon Emissions"). */
  label?: string;

  /** Primary value to display (e.g., "1,240 tCO2e"). */
  value?: string | number;

  /** Secondary value or context (e.g., "vs last month" or specific unit details). */
  subValue?: string;
  
  // Data Linkage Properties
  /** 
   * Visual confidence level indication. 
   * 'high' (Green), 'medium' (Amber), 'low' (Red).
   */
  confidence?: OmniEsgConfidence;

  /** Whether the data source is verified (e.g., via Blockchain hash). Adds a lock icon. */
  verified?: boolean;

  /** If true, displays a skeleton loading state instead of content. */
  loading?: boolean;

  /** 
   * Type of external data connection.
   * - 'live': Real-time IoT/API stream.
   * - 'ai': Generated or estimated by Agentic AI.
   * - 'blockchain': Verified on-chain data.
   */
  dataLink?: OmniEsgDataLink;
  
  // Evolutionary Traits (The 8 Features)
  /** 
   * Active evolutionary traits that alter visual appearance and animation to represent data state.
   * 
   * 1. 'optimization': Breathing Glow (Visual) - Indicates active AI optimization.
   * 2. 'gap-filling': Dashed Border + Puzzle (Data source) - Indicates estimated data.
   * 3. 'tagging': Tags display (Categorization).
   * 4. 'performance': Rocket Trend (Growth) - Indicates significant positive trend.
   * 5. 'learning': Brain Pulse (AI Training) - Indicates model is learning from this data.
   * 6. 'evolution': Infinity BG (Continuous Imp) - Indicates continuous improvement loop.
   * 7. 'bridging': Flow Lines (Connectivity) - Indicates connection to other metrics.
   * 8. 'seamless': Borderless (Integration) - For seamless UI integration.
   */
  traits?: OmniEsgTrait[];

  /** Array of tags to display in Card or List mode. Requires 'tagging' trait to be active in some contexts. */
  tags?: string[];
  
  // Visual Properties
  /** Optional Lucide icon to override the default BarChart icon. */
  icon?: LucideIcon;

  /** Color theme for the cell (borders, glows, text). */
  color?: OmniEsgColor;

  /** Custom CSS classes to merge with the wrapper. */
  className?: string;
  
  // Metric specific
  /** Trend data for metrics. Displays direction arrow and percentage. */
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  
  // AI & Interaction
  /** Callback triggered when the AI Trigger (Sparkles icon) is clicked. */
  onAiAnalyze?: () => void;

  /** Callback triggered when the cell itself is clicked (e.g., for navigation or selection). */
  onClick?: () => void;
}

// === 1. Atomic Indicators ===

/**
 * Visual indicator for data source types (Live, AI, Blockchain).
 * Renders a small badge with an icon and specific color coding.
 */
const DataLinkIndicator: React.FC<{ type: OmniEsgDataLink }> = ({ type }) => {
  const styles = {
    live: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    ai: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
    blockchain: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
  };
  const labels = { live: 'LIVE', ai: 'AGENT', blockchain: 'CHAIN' };
  const Icons = { live: Wifi, ai: Bot, blockchain: Link2 };
  const Icon = Icons[type];

  return (
    <div className={`flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all hover:scale-105 ${styles[type]}`}>
      {type === 'live' ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {labels[type]}
    </div>
  );
};

/**
 * Visual indicator for data confidence level.
 * Renders a colored dot (traffic light system) and optional lock icon for verified data.
 */
const ConfidenceIndicator: React.FC<{ level: OmniEsgConfidence; verified?: boolean; compact?: boolean }> = ({ level, verified, compact }) => {
  const getColor = () => {
    switch (level) {
      case 'high': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'medium': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'low': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    }
  };

  return (
    <div className="flex items-center gap-1.5" title={`Confidence: ${level.toUpperCase()}`}>
      {verified && <Lock className={`text-emerald-400 ${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />}
      <div className={`rounded-full ${getColor()} ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} animate-pulse`} />
    </div>
  );
};

// === 2. Quantum Interaction Components ===

/**
 * A micro-button to trigger AI analysis for a specific metric.
 * It is visually subtle until hovered, reinforcing the "Embedded Intelligence" concept.
 */
const QuantumAiTrigger: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 rounded-lg bg-celestial-purple/20 hover:bg-celestial-purple/40 text-celestial-purple border border-celestial-purple/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transform hover:scale-110 z-20"
    title="AI Insight Analysis"
  >
    <Sparkles className="w-3 h-3" />
  </button>
);

/**
 * A component allowing in-place editing of values (Simulates bi-directional editing).
 * Used to demonstrate the "Quantum Value" concept where any data point is editable.
 */
const QuantumValueEditor: React.FC<{ value: string | number; theme: any }> = ({ value, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 animate-fade-in z-20 relative">
        <input 
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="w-24 bg-black/40 border border-white/20 rounded px-2 py-0.5 text-lg font-bold text-white outline-none focus:border-celestial-emerald"
          onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
        />
        <button onClick={() => setIsEditing(false)} className="p-1 hover:text-emerald-400"><Check className="w-4 h-4"/></button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2 group/value cursor-pointer z-10" onClick={() => setIsEditing(true)}>
      <span className={`text-2xl lg:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover/value:to-white transition-all`}>
        {tempValue}
      </span>
      <Edit3 className="w-3 h-3 text-gray-600 opacity-0 group-hover/value:opacity-100 transition-opacity" />
    </div>
  );
};

// === 3. Theme & Wrapper ===

/**
 * Helper to retrieve Tailwind classes based on the selected color theme.
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

/**
 * OmniEsgCell (The Quantum Brick).
 * 
 * A universal "Quantum Brick" component used to display ESG data in various formats.
 * It serves as the fundamental building block for the dashboard and other modules.
 * 
 * It supports 4 primary modes:
 * - Card: For primary KPIs
 * - List: For tables and feeds
 * - Cell: For compact data points
 * - Badge: For simple status indicators
 * 
 * It visually implements the 8 Evolutionary Traits of the AI DNA system (Optimization, Gap Filling, etc.).
 */
export const OmniEsgCell: React.FC<OmniEsgCellProps> = (props) => {
  const { 
    mode, label, value, subValue, confidence = 'high', verified = false, 
    loading = false, dataLink, traits = [], tags = [], icon: Icon, color = 'emerald', className = '', trend, onClick, onAiAnalyze
  } = props;
  
  // === Skeleton / Loading States ===
  if (loading) {
    const shimmer = "animate-pulse bg-white/5";
    const bgBase = "bg-slate-900/40 border border-white/5";
    
    if (mode === 'card') {
      return (
        <div className={`p-6 rounded-xl ${bgBase} h-full flex flex-col justify-between ${className}`}>
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
          <div className={`p-3 rounded-xl ${bgBase} flex items-center justify-between ${className}`}>
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
            <div className={`p-4 rounded-xl ${bgBase} flex flex-col justify-between h-full ${className}`}>
                <div className={`h-3 w-20 rounded mb-4 ${shimmer}`} />
                <div className={`h-6 w-16 rounded ${shimmer}`} />
            </div>
        )
    }

    // Default/Badge
    return (
       <div className={`h-6 w-24 rounded-full ${shimmer} ${className}`} />
    );
  }

  const theme = getTheme(color);

  // === 8 Evolutionary Traits Logic ===
  // 1. Universal Optimization: Breathing visual pulse
  const isOptimization = traits.includes('optimization');
  // 2. Gap Filling: Dashed border + construct visual
  const isGapFilling = traits.includes('gap-filling');
  // 3. Universal Tagging: Display tags
  const isTagging = traits.includes('tagging');
  // 4. Performance Upgrade: Rocket icon in trends
  const isPerformance = traits.includes('performance');
  // 5. Self-Learning Growth: Brain pulse animation
  const isLearning = traits.includes('learning');
  // 6. Infinite Evolution: Infinity background
  const isEvolution = traits.includes('evolution');
  // 7. Bridging: Connecting lines
  const isBridging = traits.includes('bridging');
  // 8. Seamless Integration: Borderless mode
  const isSeamless = traits.includes('seamless');

  // Wrapper Styles
  const wrapperClasses = `
    group relative overflow-hidden transition-all duration-500 ease-out
    ${isSeamless ? 'bg-transparent border-none' : `backdrop-blur-xl bg-slate-900/40 border ${isGapFilling ? 'border-dashed border-amber-500/30' : 'border-white/5'} hover:bg-white/5`}
    ${!isSeamless && theme.border}
    ${isSeamless ? '' : 'shadow-lg shadow-black/20 hover:shadow-2xl'}
    ${isOptimization ? 'animate-ai-pulse ring-1 ring-celestial-purple/30' : ''}
    ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
    ${className}
  `;

  // === MODE: CARD (The primary Quantum Brick) ===
  if (mode === 'card') {
    return (
      <div className={wrapperClasses} onClick={onClick}>
        {/* Background Effects */}
        {!isSeamless && (
          <>
            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl pointer-events-none ${theme.glow}`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
          </>
        )}
        
        {/* Trait: Bridging (Connecting Lines) */}
        {isBridging && (
          <div className="pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        )}

        {/* Trait: Gap Filling (Construction Pattern + Scan) */}
        {isGapFilling && (
           <>
             <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,transparent_25%,rgba(251,191,36,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px] pointer-events-none" />
             {/* Animated Scanning Bar for Gap Filling - Vertical Sweep */}
             <div className="absolute top-0 left-0 w-full h-[100%] bg-gradient-to-b from-transparent via-amber-500/5 to-transparent animate-[float_6s_linear_infinite] pointer-events-none translate-y-[-100%]" />
             {/* Subtle Horizontal Scan */}
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.05),transparent)] animate-pulse pointer-events-none opacity-50" style={{ animationDuration: '4s' }} />
           </>
        )}

        {/* Trait: Self-Learning (Brain Pulse) */}
        {isLearning && (
           <div className="absolute top-3 right-3 animate-pulse opacity-60 z-20" title="Self-Learning Active">
              <BrainCircuit className="w-4 h-4 text-celestial-purple" />
           </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
               <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-medium tracking-wide">{label}</span>
                  {/* AI Trigger attached to Label */}
                  <QuantumAiTrigger onClick={onAiAnalyze} />
               </div>
               
               <div className="flex flex-wrap gap-2">
                 {dataLink && <DataLinkIndicator type={dataLink} />}
                 {isGapFilling && (
                   <div 
                      className="flex items-center gap-1.5 text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-dashed border-amber-500/30 cursor-help" 
                      title="Data estimated by AI due to missing source (Gap Filling active)"
                   >
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="font-semibold tracking-wider">AI ESTIMATING</span>
                   </div>
                 )}
                 {/* Trait: Universal Tagging */}
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
             <QuantumValueEditor value={value || 0} theme={theme} />
             {/* Progress Bar for Gap Filling Confidence/Progress */}
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
                         {/* Trait: Performance Upgrade (Rocket) */}
                         {isPerformance && trend.direction === 'up' ? <Rocket className="w-3 h-3 animate-pulse" /> : (trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                         {Math.abs(trend.value)}%
                      </span>
                   ) : <span className="text-xs text-gray-600 flex items-center gap-1"><Minus className="w-3 h-3"/> Stable</span>}
                </div>
             </div>
             <ConfidenceIndicator level={confidence} verified={verified} />
          </div>
        </div>
        
        {/* Trait: Infinite Evolution (BG Icon) */}
        {isEvolution && (
           <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:rotate-45 z-0">
              <Infinity className="w-32 h-32 text-white" />
           </div>
        )}
      </div>
    );
  }

  // === MODE: LIST (Strategic Rows) ===
  if (mode === 'list') {
    return (
      <div className={`${wrapperClasses} p-3 rounded-xl flex items-center justify-between`} onClick={onClick}>
          <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg border border-white/5 ${theme.iconBg} ${theme.text} relative`}>
                  {/* Swap icon for Loader if actively filling */}
                  {isGapFilling ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : (Icon ? <Icon className="w-4 h-4" /> : <Activity className="w-4 h-4" />)}
                  {isLearning && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>}
              </div>
              <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{label}</span>
                    <QuantumAiTrigger onClick={onAiAnalyze} />
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

  // === MODE: CELL (Simple Data Point) ===
  if (mode === 'cell') {
      return (
        <div className={`${wrapperClasses} p-4 rounded-xl flex flex-col justify-between h-full`} onClick={onClick}>
            <div className="flex justify-between items-start">
               <span className="text-xs text-gray-400">{label}</span>
               <QuantumAiTrigger onClick={onAiAnalyze} />
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
        <div className="flex items-center gap-2 group/badge">
           <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden relative border border-white/5">
               <div className={`h-full absolute left-0 top-0 rounded-full transition-all duration-1000 ${theme.glow} ${confidence === 'high' ? 'w-full' : 'w-1/2'}`} />
           </div>
           {verified && <Lock className="w-3 h-3 text-emerald-400" />}
           <QuantumAiTrigger onClick={onAiAnalyze} />
        </div>
     );
  }

  return null;
};