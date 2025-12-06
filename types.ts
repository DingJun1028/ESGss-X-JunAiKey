
/**
 * Defines the available views/modules within the application.
 * Maps directly to the sidebar navigation items.
 */
export enum View {
  MY_ESG = 'MY_ESG', // New Homepage
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
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'reward'; // Added 'reward' type

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
  /** Optional data for rewards */
  rewardData?: {
    xp?: number;
    coins?: number;
    card?: EsgCard;
  };
}

/**
 * Represents a secure, immutable audit log entry.
 */
export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  user: string;
  details: string;
  hash: string; // Simulated blockchain hash
  verified: boolean;
}

/**
 * ESG Knowledge Card Definition
 */
export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface EsgCard {
  id: string;
  title: string;
  description: string;
  rarity: CardRarity;
  imageUrl: string; // Placeholder URL
  knowledgePoint: string; // The educational snippet
  collectionSet: string; // e.g., "Carbon Set", "Governance Set"
}

/**
 * Achievement Badge Definition (New)
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or image url
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

/**
 * Carbon Calculation Data (New)
 */
export interface CarbonData {
  fuelConsumption: number; // Liters
  electricityConsumption: number; // kWh
  scope1: number; // tCO2e
  scope2: number; // tCO2e
  scope3: number; // tCO2e (Manual entry for now)
  lastUpdated: number;
}

/**
 * Quest & Task Definitions for Gamification (NEW)
 */
export type QuestRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type QuestType = 'Daily' | 'Weekly' | 'Challenge';
export type QuestRequirement = 'manual' | 'image_upload';

export interface Quest {
  id: string;
  title: string;
  desc: string;
  type: QuestType;
  rarity: QuestRarity;
  xp: number;
  status: 'active' | 'verifying' | 'completed';
  requirement: QuestRequirement;
}

export interface ToDoItem {
  id: number;
  text: string;
  done: boolean;
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
  /** Tooltip Definition for Beginners */
  definition?: string;
  /** Calculation Formula if applicable */
  formula?: string;
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
  label: string | UniversalLabel; // Updated to allow rich label objects
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

/**
 * Types for Custom Dashboard Widgets
 */
export type WidgetType = 'kpi_card' | 'chart_area' | 'feed_list' | 'mini_map';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config?: any; // To store specific widget configs (e.g., metric ID)
  gridSize?: 'small' | 'medium' | 'large' | 'full';
}
