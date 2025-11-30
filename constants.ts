import { Metric, Course, SystemHealth, Language } from './types';

/**
 * Translation dictionary for the application.
 * Structured by language code -> module -> key.
 */
export const TRANSLATIONS = {
  'en-US': {
    nav: {
      dashboard: 'Dashboard',
      strategy: 'Strategy Hub',
      talent: 'Talent Passport',
      carbon: 'Carbon Asset',
      report: 'Report Gen',
      integration: 'Integration Hub',
      culture: 'Culture Bot',
      finance: 'ROI Simulator',
      audit: 'Audit Trail',
      goodwill: 'Goodwill Coin',
      gamification: 'Gamification',
      researchHub: 'Research Hub',
      academy: 'Academy',
      diagnostics: 'Diagnostics',
      settings: 'Settings'
    },
    modules: {
      strategy: { title: 'Strategy Hub', desc: 'Risk heatmaps and stakeholder engagement analysis.' },
      talent: { title: 'Talent Passport', desc: 'Blockchain-verified certificates and skill tracking.' },
      carbon: { title: 'Carbon Asset Mgmt', desc: 'SBTi paths and internal carbon pricing simulation.' },
      report: { title: 'Report Generator', desc: 'AI-driven GRI/SASB report drafting.' },
      integration: { title: 'Integration Hub', desc: 'IoT/ERP connections and data ETL flows.' },
      culture: { title: 'Culture Bot', desc: 'Micro-learning and ESG culture promotion.' },
      finance: { title: 'Financial Simulator', desc: 'ROI analysis for decarbonization investments.' },
      audit: { title: 'Audit Trail', desc: 'SHA-256 data verification and confidence scoring.' },
      goodwill: { title: 'Goodwill Coin', desc: 'Tokenized rewards and redemption center.' },
      gamification: { title: 'Gamification', desc: 'Leaderboards, badges, and impact visualization.' },
    },
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time sustainability performance overview.',
      periods: { daily: 'Daily', monthly: 'Monthly', yearly: 'Yearly' },
      chartTitle: 'Emissions vs Baseline',
      feedTitle: 'Intelligence Feed',
      marketingTitle: 'Marketing Impact',
      vsLastMonth: 'vs last month'
    },
    research: {
      title: 'Research Hub',
      subtitle: 'Deep dive into data and regulatory frameworks.',
      searchPlaceholder: 'Search regulations, data points, or documents...',
      dataExplorer: 'Data Explorer',
      knowledgeBase: 'Knowledge Base',
      filters: 'Filters',
      viewAll: 'View All Documents',
      table: {
        metric: 'Metric',
        scope: 'Scope',
        value: 'Value',
        confidence: 'Confidence',
        source: 'Source'
      }
    },
    academy: {
      title: 'Sustainability Academy',
      subtitle: 'Upskill your team with curated ESG learning paths.',
      levelInfo: 'Level 12 • 4 Badges',
      progress: 'Progress',
      start: 'Start',
      resume: 'Resume'
    },
    diagnostics: {
      title: 'System Diagnostics',
      subtitle: 'Platform health and intelligence verification status.',
      moduleHealth: 'Module Health',
      security: 'Security & Compliance',
      uptime: 'Uptime',
      audit: 'SOC2 Audit',
      alerts: 'Critical Alerts',
      version: 'Version',
      maintenance: 'Maintenance Scheduled'
    }
  },
  'zh-TW': {
    nav: {
      dashboard: '儀表板 (Dashboard)',
      strategy: '策略中樞 (Strategy Hub)',
      talent: '人材護照 (Talent Passport)',
      carbon: '碳資產 (Carbon Asset)',
      report: '報告生成 (Report Gen)',
      integration: '集成中樞 (Integration Hub)',
      culture: '文化推廣 (Culture Bot)',
      finance: 'ROI 模擬 (ROI Simulator)',
      audit: '稽核軌跡 (Audit Trail)',
      goodwill: '善向幣 (Goodwill Coin)',
      gamification: '遊戲化 (Gamification)',
      researchHub: '研究中心 (Research Hub)',
      academy: '永續學院 (Academy)',
      diagnostics: '系統診斷 (Diagnostics)',
      settings: '設定 (Settings)'
    },
    modules: {
      strategy: { title: '策略中樞 (Strategy Hub)', desc: '風險熱點圖與利害關係人議合分析 (Risk heatmaps & stakeholder engagement)。' },
      talent: { title: '人材護照 (Talent Passport)', desc: '區塊鏈驗證證書與技能追蹤 (Blockchain-verified certificates)。' },
      carbon: { title: '碳資產管理 (Carbon Asset Mgmt)', desc: 'SBTi 路徑與內部碳定價模擬 (SBTi paths & Carbon Pricing)。' },
      report: { title: '報告生成 (Report Generator)', desc: 'AI 驅動之 GRI/SASB 報告草稿生成 (AI-driven reporting)。' },
      integration: { title: '集成中樞 (Integration Hub)', desc: 'IoT/ERP 連接與數據 ETL 流程 (IoT/ERP connections)。' },
      culture: { title: '文化推廣 (Culture Bot)', desc: '每日微學習與 ESG 文化推廣 (Micro-learning)。' },
      finance: { title: '財務模擬 (Financial Simulator)', desc: '減碳投資 ROI 分析與碳稅衝擊 (ROI analysis)。' },
      audit: { title: '稽核軌跡 (Audit Trail)', desc: 'SHA-256 數據驗證與信心分級 (Data verification)。' },
      goodwill: { title: '善向幣 (Goodwill Coin)', desc: '代幣化獎勵與兌換中心 (Tokenized rewards)。' },
      gamification: { title: '遊戲化成長 (Gamification)', desc: '排行榜、徽章與影響力可視化 (Leaderboards & Impact)。' },
    },
    dashboard: {
      title: '企業決策儀表板 (Executive Dashboard)',
      subtitle: '即時永續績效概覽 (Real-time sustainability performance overview)',
      periods: { daily: '日 (Daily)', monthly: '月 (Monthly)', yearly: '年 (Yearly)' },
      chartTitle: '排放量 vs 基準線 (Emissions vs Baseline)',
      feedTitle: '智慧情報流 (Intelligence Feed)',
      marketingTitle: '行銷影響力 (Marketing Impact)',
      vsLastMonth: '與上月相比 (vs last month)'
    },
    research: {
      title: '研究中心 (Research Hub)',
      subtitle: '深入挖掘數據與法規框架 (Deep dive into data and regulatory frameworks)',
      searchPlaceholder: '搜尋法規、數據點或文件 (Search regulations, data points...)',
      dataExplorer: '數據探索器 (Data Explorer)',
      knowledgeBase: '知識庫 (Knowledge Base)',
      filters: '篩選 (Filters)',
      viewAll: '查看所有文件 (View All)',
      table: {
        metric: '指標 (Metric)',
        scope: '範疇 (Scope)',
        value: '數值 (Value)',
        confidence: '信心度 (Confidence)',
        source: '來源 (Source)'
      }
    },
    academy: {
      title: '永續學院 (Sustainability Academy)',
      subtitle: '提升團隊 ESG 技能 (Upskill your team with curated ESG learning paths)',
      levelInfo: '等級 12 • 4 徽章',
      progress: '進度 (Progress)',
      start: '開始 (Start)',
      resume: '繼續 (Resume)'
    },
    diagnostics: {
      title: '系統診斷 (System Diagnostics)',
      subtitle: '平台健康與智慧驗證狀態 (Platform health and intelligence verification status)',
      moduleHealth: '模組健康度 (Module Health)',
      security: '安全與合規 (Security & Compliance)',
      uptime: '運行時間 (Uptime)',
      audit: 'SOC2 稽核 (Audit)',
      alerts: '關鍵警報 (Critical Alerts)',
      version: '版本 (Version)',
      maintenance: '排程維護 (Maintenance Scheduled)'
    }
  }
};

/**
 * Generates mock metric data for the dashboard.
 * @param lang - The current selected language.
 * @returns An array of Metric objects.
 */
export const getMockMetrics = (lang: Language): Metric[] => {
  const isZh = lang === 'zh-TW';
  return [
    { 
        id: '1', 
        label: isZh ? '碳排減少 (Carbon Reduction)' : 'Carbon Reduction', 
        value: '1,240 tCO2e', 
        change: 12.5, 
        trend: 'up', 
        color: 'emerald',
        // Traits: Universal Optimization (Glow), Performance Upgrade (Rocket), Bridging (Flow)
        traits: ['optimization', 'performance', 'bridging'], 
        tags: ['SBTi', 'NetZero']
    },
    { 
        id: '2', 
        label: isZh ? 'ESG 評分 (ESG Score)' : 'ESG Score', 
        value: '88.4', 
        change: 4.2, 
        trend: 'up', 
        color: 'gold',
        // Traits: Self-Learning (Brain Pulse), Gap Filling (AI Estimation)
        traits: ['learning', 'gap-filling'], 
        tags: ['MSCI', 'DJSI'],
        dataLink: 'ai'
    },
    { 
        id: '3', 
        label: isZh ? '治理指數 (Governance Idx)' : 'Governance Idx', 
        value: '92.1', 
        change: 1.1, 
        trend: 'neutral', 
        color: 'purple',
        // Traits: Infinite Evolution (Infinity BG), Universal Tagging
        traits: ['evolution', 'tagging'], 
        tags: ['Policy', 'Audit']
    },
    { 
        id: '4', 
        label: isZh ? '社會影響力 (Social Impact)' : 'Social Impact', 
        value: 'High', 
        change: -0.5, 
        trend: 'down', 
        color: 'blue',
        // Traits: Seamless Integration (Borderless)
        traits: ['seamless'], 
        dataLink: 'live'
    },
  ];
};

/**
 * Generates mock course data for the Academy module.
 */
export const getMockCourses = (lang: Language): Course[] => {
  const isZh = lang === 'zh-TW';
  return [
    { id: 'c1', title: isZh ? '範疇三排放精通 (Scope 3 Emissions Mastery)' : 'Scope 3 Emissions Mastery', category: isZh ? '碳管理 (Carbon Mgmt)' : 'Carbon Mgmt', level: 'Advanced', progress: 45, thumbnail: 'https://picsum.photos/400/220?random=1' },
    { id: 'c2', title: isZh ? 'CSRD 合規基礎 (CSRD Compliance Basics)' : 'CSRD Compliance Basics', category: isZh ? '報告 (Reporting)' : 'Reporting', level: 'Beginner', progress: 100, thumbnail: 'https://picsum.photos/400/220?random=2' },
    { id: 'c3', title: isZh ? '綠色金融策略 (Green Finance Strategies)' : 'Green Finance Strategies', category: isZh ? '金融 (Finance)' : 'Finance', level: 'Intermediate', progress: 12, thumbnail: 'https://picsum.photos/400/220?random=3' },
  ];
};

/**
 * Generates mock system health data for the Diagnostics module.
 */
export const getMockHealth = (lang: Language): SystemHealth[] => {
  // Module names usually stay in English or technical terms, but we can localize if needed
  return [
    { module: 'Intelligence Orchestrator', status: 'Healthy', latency: 45 },
    { module: 'Data Verification Engine', status: 'Healthy', latency: 120 },
    { module: 'Regulatory RAG', status: 'Warning', latency: 350 },
    { module: 'Graph Database', status: 'Healthy', latency: 20 },
  ];
};

export const CHART_DATA = [
  { name: 'Jan', value: 400, baseline: 300 },
  { name: 'Feb', value: 300, baseline: 320 },
  { name: 'Mar', value: 550, baseline: 350 },
  { name: 'Apr', value: 480, baseline: 380 },
  { name: 'May', value: 390, baseline: 400 },
  { name: 'Jun', value: 650, baseline: 420 },
];