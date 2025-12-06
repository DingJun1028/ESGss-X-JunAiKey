
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem } from '../../types';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is available via importmap or we use a simple generator

export interface EsgScores {
  environmental: number;
  social: number;
  governance: number;
}

/**
 * Interface for the Company Context state.
 * Contains global data persistent across the session.
 */
interface CompanyContextType {
  companyName: string;
  setCompanyName: (name: string) => void;
  // User Profile
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  
  // Gamification Global State
  xp: number;
  level: number;
  collectedCards: string[]; // List of Card IDs
  awardXp: (amount: number) => void;
  unlockCard: (cardId: string) => void;
  
  // Quests & Tasks (New)
  quests: Quest[];
  todos: ToDoItem[];
  completeQuest: (id: string, xpReward: number) => void;
  updateQuestStatus: (id: string, status: 'active' | 'verifying' | 'completed') => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  /** Current budget available for investments. */
  budget: number;
  setBudget: (amount: number) => void;
  /** Update budget (negative for cost, positive for revenue). */
  updateBudget: (amount: number) => void; 
  /** Available carbon credits in tCO2e. */
  carbonCredits: number;
  setCarbonCredits: (amount: number) => void;
  updateCarbonCredits: (amount: number) => void;
  
  /** Goodwill Coin Balance */
  goodwillBalance: number;
  updateGoodwillBalance: (amount: number) => void;

  esgScores: EsgScores;
  /** Update a specific ESG score category (clamped 0-100). */
  updateEsgScore: (category: keyof EsgScores, value: number) => void;
  /** Calculated average score. */
  totalScore: number;
  /** Resets all data to defaults and clears local storage. */
  resetData: () => void;
  
  // Custom Dashboard State
  customWidgets: DashboardWidget[];
  addCustomWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  removeCustomWidget: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string) => void;
}

const DEFAULT_SCORES: EsgScores = {
  environmental: 82.5,
  social: 86.0,
  governance: 88.5,
};

const DEFAULT_BUDGET = 5000000; // $5M
const DEFAULT_CREDITS = 1200; // tCO2e
const DEFAULT_GOODWILL = 2450; // GWC
const DEFAULT_COMPANY_NAME = 'EcoForward Inc.';
const DEFAULT_USER_NAME = 'DingJun Hong';
const DEFAULT_USER_ROLE = 'Chief Sustainability Officer';
const DEFAULT_XP = 1250;
const DEFAULT_CARDS = ['card-001']; // Starter card

// Default widgets for a new user's custom dashboard
const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'def-1', type: 'kpi_card', title: 'Carbon Reduction', config: { metricId: '1' }, gridSize: 'small' },
  { id: 'def-2', type: 'chart_area', title: 'Emissions Trend', gridSize: 'medium' }
];

// Default Quests
const DEFAULT_QUESTS: Quest[] = [
  { 
    id: 'q1', 
    title: '每日簽到：閱讀 ESG 新聞', 
    desc: '保持對市場動態的敏銳度。', 
    type: 'Daily', rarity: 'Common', xp: 50, status: 'active', requirement: 'manual' 
  },
  { 
    id: 'q2', 
    title: '減碳行動：素食午餐挑戰', 
    desc: '上傳您的午餐照片，AI 將辨識是否為低碳飲食。', 
    type: 'Daily', rarity: 'Rare', xp: 150, status: 'active', requirement: 'image_upload' 
  },
  { 
    id: 'q3', 
    title: '每週任務：完成 1 個學院課程', 
    desc: '持續學習是永續的基石。', 
    type: 'Weekly', rarity: 'Epic', xp: 500, status: 'active', requirement: 'manual' 
  },
  { 
    id: 'q4', 
    title: '傳說挑戰：發現供應鏈重大風險', 
    desc: '在策略中樞使用 AI 進行一次深度風險掃描。', 
    type: 'Challenge', rarity: 'Legendary', xp: 2000, status: 'active', requirement: 'manual' 
  },
];

const DEFAULT_TODOS: ToDoItem[] = [
    { id: 1, text: '更新 Q3 範疇一數據', done: true },
    { id: 2, text: '審閱供應商稽核報告', done: false },
];

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Simple hash simulation for "Blockchain" feel
const generateHash = () => {
    return Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * Provides global state management for the virtual company.
 */
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY_NAME);
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [userRole, setUserRole] = useState(DEFAULT_USER_ROLE);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [carbonCredits, setCarbonCredits] = useState(DEFAULT_CREDITS);
  const [goodwillBalance, setGoodwillBalance] = useState(DEFAULT_GOODWILL);
  
  // Gamification State
  const [xp, setXp] = useState(DEFAULT_XP);
  const [collectedCards, setCollectedCards] = useState<string[]>(DEFAULT_CARDS);
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [todos, setTodos] = useState<ToDoItem[]>(DEFAULT_TODOS);

  const [esgScores, setEsgScores] = useState<EsgScores>(DEFAULT_SCORES);
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Load from LocalStorage on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('esgss_storage_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.userName) setUserName(parsed.userName);
          if (parsed.userRole) setUserRole(parsed.userRole);
          if (parsed.budget !== undefined) setBudget(parsed.budget);
          if (parsed.carbonCredits !== undefined) setCarbonCredits(parsed.carbonCredits);
          if (parsed.goodwillBalance !== undefined) setGoodwillBalance(parsed.goodwillBalance);
          if (parsed.xp !== undefined) setXp(parsed.xp);
          if (parsed.collectedCards) setCollectedCards(parsed.collectedCards);
          if (parsed.esgScores) setEsgScores(parsed.esgScores);
          if (parsed.customWidgets) setCustomWidgets(parsed.customWidgets);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
          if (parsed.quests) setQuests(parsed.quests);
          if (parsed.todos) setTodos(parsed.todos);
        } catch (e) {
          console.error("ESGss: Failed to load persistence data.", e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage on Change (only after initialization)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const state = {
        companyName, userName, userRole, budget, carbonCredits, goodwillBalance,
        xp, collectedCards, esgScores, customWidgets, auditLogs, quests, todos
      };
      localStorage.setItem('esgss_storage_v1', JSON.stringify(state));
    }
  }, [companyName, userName, userRole, budget, carbonCredits, goodwillBalance, xp, collectedCards, esgScores, customWidgets, auditLogs, quests, todos, isInitialized]);

  // Derived Level (1 Level per 1000 XP)
  const level = Math.floor(xp / 1000) + 1;

  // Actions
  const awardXp = (amount: number) => {
      setXp(prev => prev + amount);
  };

  const unlockCard = (cardId: string) => {
      if (!collectedCards.includes(cardId)) {
          setCollectedCards(prev => [...prev, cardId]);
      }
  };

  // --- Quest Logic ---
  const updateQuestStatus = (id: string, status: 'active' | 'verifying' | 'completed') => {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const completeQuest = (id: string, xpReward: number) => {
      const quest = quests.find(q => q.id === id);
      if (quest && quest.status !== 'completed') {
          updateQuestStatus(id, 'completed');
          awardXp(xpReward);
          addAuditLog('Quest Completed', `Completed: ${quest.title} (+${xpReward} XP)`);
      }
  };

  // --- To-Do Logic ---
  const addTodo = (text: string) => {
      setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id: number) => {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id: number) => {
      setTodos(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (amount: number) => {
    setBudget(prev => prev + amount);
  };

  const updateCarbonCredits = (amount: number) => {
    setCarbonCredits(prev => prev + amount);
  };

  const updateGoodwillBalance = (amount: number) => {
      setGoodwillBalance(prev => prev + amount);
  };

  const updateEsgScore = (category: keyof EsgScores, value: number) => {
    setEsgScores(prev => ({
      ...prev,
      [category]: Math.min(100, Math.max(0, value)) // Clamp between 0-100
    }));
  };

  const addCustomWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget = { ...widget, id: `w-${Date.now()}` };
    setCustomWidgets(prev => [...prev, newWidget]);
  };

  const removeCustomWidget = (id: string) => {
    setCustomWidgets(prev => prev.filter(w => w.id !== id));
  };

  const addAuditLog = (action: string, details: string) => {
      const newLog: AuditLogEntry = {
          id: `tx-${Date.now()}`,
          timestamp: Date.now(),
          action,
          user: userName || 'System',
          details,
          hash: generateHash(),
          verified: true
      };
      setAuditLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const resetData = () => {
    localStorage.removeItem('esgss_storage_v1');
    window.location.reload();
  };

  // Derived State
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  return (
    <CompanyContext.Provider value={{
      companyName, setCompanyName, userName, setUserName, userRole, setUserRole,
      budget, setBudget, updateBudget, carbonCredits, setCarbonCredits, updateCarbonCredits,
      goodwillBalance, updateGoodwillBalance,
      xp, level, collectedCards, awardXp, unlockCard,
      quests, todos, completeQuest, updateQuestStatus, addTodo, toggleTodo, deleteTodo,
      esgScores, updateEsgScore, totalScore,
      resetData, customWidgets, addCustomWidget, removeCustomWidget, auditLogs, addAuditLog
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
