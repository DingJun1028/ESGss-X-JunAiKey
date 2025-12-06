
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem, Badge, CarbonData } from '../../types';
import { v4 as uuidv4 } from 'uuid'; 

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
  badges: Badge[];
  awardXp: (amount: number) => void;
  unlockCard: (cardId: string) => void;
  checkBadges: () => Badge[]; // Triggers badge check and returns newly unlocked
  
  // Quests & Tasks
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
  
  // Carbon Calculator State
  carbonData: CarbonData;
  updateCarbonData: (data: Partial<CarbonData>) => void;
  
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
  
  // System Simulation
  latestEvent: string | null; // For the ticker
}

const DEFAULT_SCORES: EsgScores = {
  environmental: 82.5,
  social: 86.0,
  governance: 88.5,
};

const DEFAULT_CARBON_DATA: CarbonData = {
    fuelConsumption: 0,
    electricityConsumption: 0,
    scope1: 1240, // Base mock value
    scope2: 850,  // Base mock value
    scope3: 4500,
    lastUpdated: Date.now()
};

const DEFAULT_BADGES: Badge[] = [
    { id: 'b1', name: 'Net Zero Starter', description: 'Begin your carbon reduction journey.', icon: 'Leaf', condition: 'Login', isUnlocked: true, unlockedAt: Date.now() },
    { id: 'b2', name: 'Data Wizard', description: 'Connect a live data source.', icon: 'Database', condition: 'Integrate', isUnlocked: false },
    { id: 'b3', name: 'ESG Elite', description: 'Achieve an ESG Score > 90.', icon: 'Award', condition: 'Score>90', isUnlocked: false },
    { id: 'b4', name: 'Carbon Fighter', description: 'Reduce Scope 1 emissions below 1000t.', icon: 'ShieldCheck', condition: 'Scope1<1000', isUnlocked: false },
    { id: 'b5', name: 'Millionaire', description: 'Accumulate 5,000 Goodwill Coins.', icon: 'Coins', condition: 'GWC>5000', isUnlocked: false },
];

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
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [todos, setTodos] = useState<ToDoItem[]>(DEFAULT_TODOS);

  const [carbonData, setCarbonData] = useState<CarbonData>(DEFAULT_CARBON_DATA);
  const [esgScores, setEsgScores] = useState<EsgScores>(DEFAULT_SCORES);
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [latestEvent, setLatestEvent] = useState<string | null>(null);

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
          if (parsed.badges) setBadges(parsed.badges);
          if (parsed.carbonData) setCarbonData(parsed.carbonData);
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
        xp, collectedCards, esgScores, customWidgets, auditLogs, quests, todos, badges, carbonData
      };
      localStorage.setItem('esgss_storage_v1', JSON.stringify(state));
    }
  }, [companyName, userName, userRole, budget, carbonCredits, goodwillBalance, xp, collectedCards, esgScores, customWidgets, auditLogs, quests, todos, badges, carbonData, isInitialized]);

  // --- SYSTEM HEARTBEAT SIMULATION ---
  useEffect(() => {
      if (!isInitialized) return;

      const interval = setInterval(() => {
          // 1. Carbon Data Fluctuation (IoT Simulation)
          // Randomly fluctuate Scope 1 by -2 to +3 units (simulating sensor noise or real-time usage)
          const fluctuation = Math.floor(Math.random() * 6) - 2; 
          if (fluctuation !== 0) {
              setCarbonData(prev => ({
                  ...prev,
                  scope1: Math.max(0, prev.scope1 + fluctuation)
              }));
          }

          // 2. Random Events (10% chance every 10 seconds)
          if (Math.random() < 0.1) {
              const events = [
                  { text: 'IoT Sensor: Anomaly detected in Plant B (+2% energy)', impact: 'env', val: -0.5 },
                  { text: 'Market: Carbon Price surged to €92/t', impact: 'budget', val: 0 },
                  { text: 'News: Competitor announced Net Zero 2030', impact: 'soc', val: 0 },
                  { text: 'System: Automated Efficiency Optimization (+0.1 Score)', impact: 'env', val: 0.1 },
                  { text: 'Supply Chain: Vendor Data Validated', impact: 'gov', val: 0.2 }
              ];
              const event = events[Math.floor(Math.random() * events.length)];
              
              setLatestEvent(event.text);
              addAuditLog('System Event', event.text);

              if (event.impact === 'env') updateEsgScore('environmental', esgScores.environmental + event.val);
              if (event.impact === 'gov') updateEsgScore('governance', esgScores.governance + event.val);
          }

      }, 10000); // Heartbeat every 10s

      return () => clearInterval(interval);
  }, [isInitialized, esgScores]);


  // Derived Level (1 Level per 1000 XP)
  const level = Math.floor(xp / 1000) + 1;
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  // Actions
  const awardXp = (amount: number) => {
      setXp(prev => prev + amount);
  };

  const unlockCard = (cardId: string) => {
      if (!collectedCards.includes(cardId)) {
          setCollectedCards(prev => [...prev, cardId]);
      }
  };

  const updateCarbonData = (data: Partial<CarbonData>) => {
      setCarbonData(prev => ({ ...prev, ...data, lastUpdated: Date.now() }));
  };

  const checkBadges = (): Badge[] => {
      const newlyUnlocked: Badge[] = [];
      const updatedBadges = badges.map(badge => {
          if (badge.isUnlocked) return badge;

          let unlocked = false;
          // Badge Logic Engine
          if (badge.condition === 'Score>90' && totalScore > 90) unlocked = true;
          if (badge.condition === 'Scope1<1000' && carbonData.scope1 < 1000) unlocked = true;
          if (badge.condition === 'GWC>5000' && goodwillBalance > 5000) unlocked = true;

          if (unlocked) {
              const newBadge = { ...badge, isUnlocked: true, unlockedAt: Date.now() };
              newlyUnlocked.push(newBadge);
              awardXp(500); // 500 XP for Badge
              addAuditLog('Achievement Unlocked', `Unlocked Badge: ${badge.name}`);
              return newBadge;
          }
          return badge;
      });

      if (newlyUnlocked.length > 0) {
          setBadges(updatedBadges);
      }
      return newlyUnlocked;
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
      [category]: parseFloat(Math.min(100, Math.max(0, value)).toFixed(1)) // Clamp and round
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

  return (
    <CompanyContext.Provider value={{
      companyName, setCompanyName, userName, setUserName, userRole, setUserRole,
      budget, setBudget, updateBudget, carbonCredits, setCarbonCredits, updateCarbonCredits,
      goodwillBalance, updateGoodwillBalance,
      xp, level, collectedCards, awardXp, unlockCard, badges, checkBadges,
      quests, todos, completeQuest, updateQuestStatus, addTodo, toggleTodo, deleteTodo,
      esgScores, updateEsgScore, totalScore,
      carbonData, updateCarbonData,
      resetData, customWidgets, addCustomWidget, removeCustomWidget, auditLogs, addAuditLog,
      latestEvent
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
