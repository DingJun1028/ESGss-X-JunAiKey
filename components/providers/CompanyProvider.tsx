import React, { createContext, useContext, useState, useEffect } from 'react';

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
  /** Current budget available for investments. */
  budget: number;
  /** Update budget (negative for cost, positive for revenue). */
  updateBudget: (amount: number) => void; 
  /** Available carbon credits in tCO2e. */
  carbonCredits: number;
  updateCarbonCredits: (amount: number) => void;
  esgScores: EsgScores;
  /** Update a specific ESG score category (clamped 0-100). */
  updateEsgScore: (category: keyof EsgScores, value: number) => void;
  /** Calculated average score. */
  totalScore: number;
  /** Resets all data to defaults and clears local storage. */
  resetData: () => void;
}

const DEFAULT_SCORES: EsgScores = {
  environmental: 82.5,
  social: 86.0,
  governance: 88.5,
};

const DEFAULT_BUDGET = 5000000; // $5M
const DEFAULT_CREDITS = 1200; // tCO2e
const DEFAULT_NAME = 'EcoForward Inc.';

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

/**
 * Provides global state management for the virtual company.
 * 
 * Features:
 * - Persists data to localStorage to maintain state across reloads.
 * - Manages Budget, Carbon Credits, and ESG Scores.
 * - Provides helper methods to update state safely.
 */
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [companyName, setCompanyName] = useState(DEFAULT_NAME);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [carbonCredits, setCarbonCredits] = useState(DEFAULT_CREDITS);
  const [esgScores, setEsgScores] = useState<EsgScores>(DEFAULT_SCORES);

  // Load from LocalStorage on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('esgss_storage_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.budget !== undefined) setBudget(parsed.budget);
          if (parsed.carbonCredits !== undefined) setCarbonCredits(parsed.carbonCredits);
          if (parsed.esgScores) setEsgScores(parsed.esgScores);
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
        companyName,
        budget,
        carbonCredits,
        esgScores
      };
      localStorage.setItem('esgss_storage_v1', JSON.stringify(state));
    }
  }, [companyName, budget, carbonCredits, esgScores, isInitialized]);

  // Actions
  const updateBudget = (amount: number) => {
    setBudget(prev => prev + amount);
  };

  const updateCarbonCredits = (amount: number) => {
    setCarbonCredits(prev => prev + amount);
  };

  const updateEsgScore = (category: keyof EsgScores, value: number) => {
    setEsgScores(prev => ({
      ...prev,
      [category]: Math.min(100, Math.max(0, value)) // Clamp between 0-100
    }));
  };

  const resetData = () => {
    setCompanyName(DEFAULT_NAME);
    setBudget(DEFAULT_BUDGET);
    setCarbonCredits(DEFAULT_CREDITS);
    setEsgScores(DEFAULT_SCORES);
    localStorage.removeItem('esgss_storage_v1');
    window.location.reload();
  };

  // Derived State
  const totalScore = parseFloat(((esgScores.environmental + esgScores.social + esgScores.governance) / 3).toFixed(1));

  return (
    <CompanyContext.Provider value={{
      companyName,
      setCompanyName,
      budget,
      updateBudget,
      carbonCredits,
      updateCarbonCredits,
      esgScores,
      updateEsgScore,
      totalScore,
      resetData
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