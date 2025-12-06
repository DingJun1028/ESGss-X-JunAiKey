
/**
 * Defines the available views/modules within the application.
 * Maps directly to the sidebar navigation items.
 */
export enum View {
  DASHBOARD = 'DASHBOARD',
  RESEARCH_HUB = 'RESEARCH_HUB', // Maps to Data/Knowledge aspects
  ACADEMY = 'ACADEMY', // Maps to Talent/Learning aspects
  DIAGNOSTICS = 'DIAGNOSTICS', // Maps to System Health
  SETTINGS = 'SETTINGS',
  // New Modules from Whitepaper
  STRATEGY = 'STRATEGY',
  TALENT = 'TALENT',
  CARBON = 'CARBON',
  REPORT = 'REPORT',
  INTEGRATION = 'INTEGRATION',
  CULTURE = 'CULTURE',
  FINANCE = 'FINANCE',
  AUDIT = 'AUDIT',
  GOODWILL = 'GOODWILL',
  GAMIFICATION = 'GAMIFICATION'
}

/**
 * Supported languages for the application localization.
 */
export type Language = 'zh-TW' | 'en-US';

/**
 * Defines the available types of toast notifications.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Represents a single toast notification object.
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Visual style/intent of the toast */
  type: ToastType;
  /** Optional title displayed above the message */
  title?: string;
  /** Main content of the notification */
  message: string;
  /** Duration in milliseconds before auto-dismissal. Default is usually 5000ms. */
  duration?: number;
}

/**
 * The 8 Evolutionary Traits (AI DNA) visualized in the OmniEsgCell.
 * These represent different states or capabilities of a data point.
 */
export type OmniEsgTrait = 
  | 'optimization' // Breathing Glow (Visual) - Indicates active AI optimization
  | 'gap-filling'  // Dashed Border + Puzzle (Data source) - Indicates estimated data
  | 'tagging'      // Tags display (Categorization)
  | 'performance'  // Rocket Trend (Growth) - Indicates significant positive trend
  | 'learning'     // Brain Pulse (AI Training) - Indicates model is learning from this data
  | 'evolution'    // Infinity BG (Continuous Imp) - Indicates continuous improvement loop
  | 'bridging'     // Flow Lines (Connectivity) - Indicates connection to other metrics
  | 'seamless';    // Borderless (Integration) - For seamless UI integration

/**
 * Represents the source or connection type of a data point.
 */
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain';

/**
 * Display modes for the OmniEsgCell component.
 */
export type OmniEsgMode = 'card' | 'list' | 'cell' | 'badge';

/**
 * Visual confidence level for a metric.
 */
export type OmniEsgConfidence = 'high' | 'medium' | 'low';

/**
 * Supported color themes for the Celestial Nexus design system.
 */
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'slate';

/**
 * Universal Label (萬能標籤) Protocol Definition.
 * Defines the semantic soul of the component.
 */
export interface UniversalLabel {
  /** Unique identifier for tracking and evolution (e.g., "metric-carbon-scope1") */
  id: string;
  /** Semantic type definition (e.g., "Decimal", "Percentage", "Status") */
  dataType?: string;
  /** Business context importance */
  importance?: 'critical' | 'high' | 'medium' | 'low';
  /** Human readable label (fallback) */
  text: string;
  /** Description for AI analysis context */
  description?: string;
}

/**
 * Represents an interaction event for the Evolution Engine.
 */
export interface InteractionEvent {
  componentId: string;
  eventType: 'click' | 'hover' | 'edit' | 'ai-trigger';
  timestamp: number;
}

/**
 * Represents a standard ESG metric used throughout the dashboard and reports.
 */
export interface Metric {
  id: string;
  label: string;
  value: string;
  /** Percentage change */
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: OmniEsgColor;
  /** Array of active evolutionary traits */
  traits?: OmniEsgTrait[];
  tags?: string[];
  dataLink?: OmniEsgDataLink;
}

/**
 * Represents a learning course in the Academy module.
 */
export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Progress percentage (0-100) */
  progress: number;
  thumbnail: string;
}

/**
 * Represents a message in the AI Strategy Hub chat.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

/**
 * Represents the health status of a system module in Diagnostics.
 */
export interface SystemHealth {
  module: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  /** Latency in milliseconds */
  latency: number;
}

/**
 * Structure for Sustainability Report Sections
 */
export interface ReportSection {
  id: string;
  title: string;
  subSections?: ReportSection[];
  template?: string;
  example?: string;
  griStandards?: string;
}
