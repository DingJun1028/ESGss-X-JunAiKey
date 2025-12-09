
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardWidget, AuditLogEntry, EsgCard, Quest, ToDoItem, Badge, CarbonData, NoteItem, BookmarkItem, UserTier, MasteryLevel } from '../../types';

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
  
  // Subscription
  tier: UserTier;
  upgradeTier: (tier: UserTier) => void;

  // Gamification Global State
  xp: number;
  level: number;
  collectedCards: string[]; // List of Card IDs (Ownership)
  purifiedCards: string[];  // List of Card IDs that have passed the Knowledge Quiz
  cardMastery: Record<string, MasteryLevel>; // Mastery level for each card
  
  updateCardMastery: (cardId: string, level: MasteryLevel) => void;
  unlockCard: (cardId: string) => void;
  purifyCard: (cardId: string) => void; // New Action
  
  badges: Badge[];
  awardXp: (amount: number) => void;
  checkBadges: () => Badge[]; // Triggers badge check and returns newly unlocked
  
  // Quests & Tasks
  quests: Quest[];
  todos: ToDoItem[];
  completeQuest: (id: string, xpReward: number) => void;
  updateQuestStatus: (id: string, status: 'active' | 'verifying' | 'completed') => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  // Universal Tools Data (CRUD)
  universalNotes: NoteItem[];
  addNote: (content: string, tags?: string[], source?: 'manual'|'voice'|'ai') => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;

  // Bookmarks
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: Omit<BookmarkItem, 'addedAt'>) => void;

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
  
  // AI Assistant State
  lastBriefingDate: string | null;
  markBriefingRead: () => void;
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
const DEFAULT_CARDS = ['card-001']; // Starter card (Owned)
const DEFAULT_PURIFIED_CARDS = ['card-001']; // Starter card (Already Purified)

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
  const [tier, setTier] = useState<UserTier>('Free'); // Default to Free
  
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [carbonCredits, setCarbonCredits] = useState(DEFAULT_CREDITS);
  const [goodwillBalance, setGoodwillBalance] = useState(DEFAULT_GOODWILL);
  
  // Gamification State
  const [xp, setXp] = useState(DEFAULT_XP);
  const [collectedCards, setCollectedCards] = useState<string[]>(DEFAULT_CARDS);
  const [purifiedCards, setPurifiedCards] = useState<string[]>(DEFAULT_PURIFIED_CARDS);
  const [cardMastery, setCardMastery] = useState<Record<string, MasteryLevel>>({});
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [todos, setTodos] = useState<ToDoItem[]>(DEFAULT_TODOS);

  // Tools & Bookmarks
  const [universalNotes, setUniversalNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const [carbonData, setCarbonData] = useState<CarbonData>(DEFAULT_CARBON_DATA);
  const [esgScores, setEsgScores] = useState<EsgScores>(DEFAULT_SCORES);
  const [customWidgets, setCustomWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [latestEvent, setLatestEvent] = useState<string | null>(null);
  const [lastBriefingDate, setLastBriefingDate] = useState<string | null>(null);

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
          if (parsed.tier) setTier(parsed.tier);
          if (parsed.budget !== undefined) setBudget(parsed.budget);
          if (parsed.carbonCredits !== undefined) setCarbonCredits(parsed.carbonCredits);
          if (parsed.goodwillBalance !== undefined) setGoodwillBalance(parsed.goodwillBalance);
          if (parsed.xp !== undefined) setXp(parsed.xp);
          if (parsed.collectedCards) setCollectedCards(parsed.collectedCards);
          if (parsed.purifiedCards) setPurifiedCards(parsed.purifiedCards);
          if (parsed.cardMastery) setCardMastery(parsed.cardMastery);
          if (parsed.esgScores) setEsgScores(parsed.esgScores);
          if (parsed.customWidgets) setCustomWidgets(parsed.customWidgets);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
          if (parsed.quests) setQuests(parsed.quests);
          if (parsed.todos) setTodos(parsed.todos);
          if (parsed.badges) setBadges(parsed.badges);
          if (parsed.carbonData) setCarbonData(parsed.carbonData);
          if (parsed.lastBriefingDate) setLastBriefingDate(parsed.lastBriefingDate);
          if (parsed.universalNotes) setUniversalNotes(parsed.universalNotes);
          if (parsed.bookmarks) setBookmarks(parsed.bookmarks);
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
        companyName, userName, userRole, tier, budget, carbonCredits, goodwillBalance,
        xp, collectedCards, purifiedCards, cardMastery, esgScores, customWidgets, auditLogs, quests, todos, badges, carbonData, lastBriefingDate,
        universalNotes, bookmarks
      };
      localStorage.setItem('esgss_storage_v1', JSON.stringify(state));
    }
  }, [companyName, userName, userRole, tier, budget, carbonCredits, goodwillBalance, xp, collectedCards, purifiedCards, cardMastery, esgScores, customWidgets, auditLogs, quests, todos, badges, carbonData, lastBriefingDate, universalNotes, bookmarks, isInitialized]);

  // Derived Level (1 Level per 1000 XP)
  const level = Math.floor(xp / 1000) + 1;
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  // Memoized Actions
  const awardXp = useCallback((amount: number) => {
      setXp(prev => prev + amount);
  }, []);

  const upgradeTier = useCallback((newTier: UserTier) => {
      setTier(newTier);
      addAuditLog('Subscription Upgrade', `User upgraded to ${newTier} Tier.`);
  }, []);

  const unlockCard = useCallback((cardId: string) => {
      // Unlocking just adds to collection, doesn't purify it automatically unless specified elsewhere
      setCollectedCards(prev => !prev.includes(cardId) ? [...prev, cardId] : prev);
  }, []);

  const purifyCard = useCallback((cardId: string) => {
      setPurifiedCards(prev => !prev.includes(cardId) ? [...prev, cardId] : prev);
      // Purifying also grants Novice mastery if not set
      setCardMastery(prev => prev[cardId] ? prev : { ...prev, [cardId]: 'Novice' });
  }, []);

  const updateCardMastery = useCallback((cardId: string, level: MasteryLevel) => {
      setCardMastery(prev => ({ ...prev, [cardId]: level }));
  }, []);

  const updateCarbonData = useCallback((data: Partial<CarbonData>) => {
      setCarbonData(prev => ({ ...prev, ...data, lastUpdated: Date.now() }));
  }, []);

  const addAuditLog = useCallback((action: string, details: string) => {
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
  }, [userName]);

  const checkBadges = useCallback((): Badge[] => {
      let newBadgesFound: Badge[] = [];
      setBadges(prevBadges => {
          const updated = prevBadges.map(badge => {
              if (badge.isUnlocked) return badge;
              let unlocked = false;
              if (badge.condition === 'Score>90' && totalScore > 90) unlocked = true;
              if (badge.condition === 'Scope1<1000' && carbonData.scope1 < 1000) unlocked = true;
              if (badge.condition === 'GWC>5000' && goodwillBalance > 5000) unlocked = true;

              if (unlocked) {
                  const newBadge = { ...badge, isUnlocked: true, unlockedAt: Date.now() };
                  newBadgesFound.push(newBadge);
                  return newBadge;
              }
              return badge;
          });
          return updated;
      });
      if(newBadgesFound.length > 0) {
          awardXp(newBadgesFound.length * 500);
          newBadgesFound.forEach(b => addAuditLog('Achievement Unlocked', `Unlocked Badge: ${b.name}`));
      }
      return newBadgesFound;
  }, [totalScore, carbonData.scope1, goodwillBalance, awardXp, addAuditLog]);

  const updateQuestStatus = useCallback((id: string, status: 'active' | 'verifying' | 'completed') => {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  }, []);

  const completeQuest = useCallback((id: string, xpReward: number) => {
      setQuests(prev => {
          const quest = prev.find(q => q.id === id);
          if (quest && quest.status !== 'completed') {
              setTimeout(() => {
                  awardXp(xpReward);
                  addAuditLog('Quest Completed', `Completed: ${quest.title} (+${xpReward} XP)`);
              }, 0);
              return prev.map(q => q.id === id ? { ...q, status: 'completed' } : q);
          }
          return prev;
      });
  }, [awardXp, addAuditLog]);

  const addTodo = useCallback((text: string) => {
      setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  }, []);

  const toggleTodo = useCallback((id: number) => {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const deleteTodo = useCallback((id: number) => {
      setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  // --- CRUD for Notes ---
  const addNote = useCallback((content: string, tags: string[] = [], source: 'manual'|'voice'|'ai' = 'manual') => {
      setUniversalNotes(prev => [{
          id: `note-${Date.now()}`,
          content,
          tags,
          createdAt: Date.now(),
          source
      }, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, content: string) => {
      setUniversalNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
      setUniversalNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // --- Bookmarks ---
  const toggleBookmark = useCallback((item: Omit<BookmarkItem, 'addedAt'>) => {
      setBookmarks(prev => {
          const exists = prev.some(b => b.id === item.id);
          if (exists) {
              return prev.filter(b => b.id !== item.id);
          } else {
              return [{ ...item, addedAt: Date.now() }, ...prev];
          }
      });
  }, []);

  const updateBudget = useCallback((amount: number) => {
    setBudget(prev => prev + amount);
  }, []);

  const updateCarbonCredits = useCallback((amount: number) => {
    setCarbonCredits(prev => prev + amount);
  }, []);

  const updateGoodwillBalance = useCallback((amount: number) => {
      setGoodwillBalance(prev => prev + amount);
  }, []);

  const updateEsgScore = useCallback((category: keyof EsgScores, value: number) => {
    setEsgScores(prev => ({
      ...prev,
      [category]: parseFloat(Math.min(100, Math.max(0, value)).toFixed(1))
    }));
  }, []);

  const addCustomWidget = useCallback((widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget = { ...widget, id: `w-${Date.now()}` };
    setCustomWidgets(prev => [...prev, newWidget]);
  }, []);

  const removeCustomWidget = useCallback((id: string) => {
    setCustomWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem('esgss_storage_v1');
    window.location.reload();
  }, []);

  const markBriefingRead = useCallback(() => {
      setLastBriefingDate(new Date().toDateString());
  }, []);

  // Construct the context value object and Memoize it
  const value = useMemo(() => ({
      companyName, setCompanyName, userName, setUserName, userRole, setUserRole, tier, upgradeTier,
      budget, setBudget, updateBudget, carbonCredits, setCarbonCredits, updateCarbonCredits,
      goodwillBalance, updateGoodwillBalance,
      xp, level, collectedCards, purifiedCards, cardMastery, updateCardMastery, awardXp, unlockCard, purifyCard, badges, checkBadges,
      quests, todos, completeQuest, updateQuestStatus, addTodo, toggleTodo, deleteTodo,
      esgScores, updateEsgScore, totalScore,
      carbonData, updateCarbonData,
      universalNotes, addNote, updateNote, deleteNote,
      bookmarks, toggleBookmark,
      resetData, customWidgets, addCustomWidget, removeCustomWidget, auditLogs, addAuditLog,
      latestEvent,
      lastBriefingDate, markBriefingRead
  }), [
      companyName, userName, userRole, tier, budget, carbonCredits, goodwillBalance,
      xp, level, collectedCards, purifiedCards, cardMastery, badges, quests, todos, 
      esgScores, totalScore, carbonData, customWidgets, auditLogs, latestEvent, lastBriefingDate,
      universalNotes, bookmarks,
      awardXp, unlockCard, purifyCard, updateCardMastery, checkBadges, completeQuest, updateQuestStatus, addTodo, toggleTodo, deleteTodo,
      updateBudget, updateCarbonCredits, updateGoodwillBalance, updateEsgScore, updateCarbonData,
      addNote, updateNote, deleteNote, toggleBookmark,
      resetData, addCustomWidget, removeCustomWidget, addAuditLog, markBriefingRead, upgradeTier
  ]);

  return (
    <CompanyContext.Provider value={value}>
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
