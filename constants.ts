
import { Metric, Course, SystemHealth, Language, ReportSection, EsgCard } from './types';

// ... (Existing translations remain unchanged, kept for brevity) ...
export const TRANSLATIONS = {
  'en-US': {
    nav: {
      myEsg: 'My ESG',
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
      settings: 'Settings',
      yangBo: 'Yang Bo Zone',
      businessIntel: 'Business Intel',
      healthCheck: 'Health Check',
      universalTools: 'Universal Tools'
    },
    modules: {
      myEsg: { title: 'My ESG Cockpit', desc: 'Your personalized sustainability command center.' },
      strategy: { title: 'Strategy Hub', desc: 'Risk heatmaps and stakeholder engagement analysis.' },
      talent: { title: 'Talent Passport', desc: 'Blockchain-verified certificates and skill tracking.' },
      carbon: { title: 'Carbon Asset Mgmt', desc: 'SBTi paths and internal carbon pricing simulation.' },
      report: { title: 'Report Generator', desc: 'AI-driven GRI/SASB report drafting (ESGss X JunAiKey).' },
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
      feedTitle: 'JunAiKey Intelligence Feed',
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
      myEsg: '我的 ESG',
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
      settings: '設定 (Settings)',
      yangBo: '楊博專區 (Yang Bo)',
      businessIntel: '商情中心 (Biz Intel)',
      healthCheck: '全方位健檢 (Health Check)',
      universalTools: '萬能工具 (Universal Tools)'
    },
    modules: {
      myEsg: { title: '我的 ESG (My ESG)', desc: '您的個人化永續戰情室與成長中心。' },
      strategy: { title: '策略中樞 (Strategy Hub)', desc: '風險熱點圖與利害關係人議合分析 (Risk heatmaps & stakeholder engagement)。' },
      talent: { title: '人材護照 (Talent Passport)', desc: '區塊鏈驗證證書與技能追蹤 (Blockchain-verified certificates)。' },
      carbon: { title: '碳資產管理 (Carbon Asset Mgmt)', desc: 'SBTi 路徑與內部碳定價模擬 (SBTi paths & Carbon Pricing)。' },
      report: { title: '報告生成 (Report Generator)', desc: 'JunAiKey 驅動之 GRI/SASB 報告草稿生成。' },
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
      feedTitle: 'JunAiKey 智慧情報流',
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
      subtitle: '平台健康與 JunAiKey 狀態 (Platform health and intelligence verification status)',
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

export const DAILY_BRIEFING_TEMPLATES = {
    'en-US': {
        greeting: "Good Morning",
        intro: "While you were offline, I monitored 4.2TB of supply chain data and regulatory updates.",
        insights: [
            { type: 'risk', text: "EU CBAM carbon price projection increased by 2.4% overnight." },
            { type: 'opportunity', text: "Plant B solar efficiency reached a record high of 98%." },
            { type: 'alert', text: "Supplier 'TechFab Inc.' reported a water usage anomaly." }
        ],
        action: "Review Supplier Audit",
        button: "Accept Briefing"
    },
    'zh-TW': {
        greeting: "早安",
        intro: "在您休息時，我監控了 4.2TB 的供應鏈數據與法規更新。以下是今日關鍵匯報：",
        insights: [
            { type: 'risk', text: "歐盟 CBAM 碳價預測值隔夜上漲 2.4%，建議檢視 Q3 預算。" },
            { type: 'opportunity', text: "B 廠區太陽能發電效率達到 98% 的歷史新高。" },
            { type: 'alert', text: "供應商「TechFab Inc.」通報水資源使用異常，需關注。" }
        ],
        action: "審閱供應商稽核",
        button: "接受匯報"
    }
};

export const REPORT_STRUCTURE: ReportSection[] = [
  // ... (Report Structure kept same) ...
  {
    id: '1',
    title: '1 關於本報告書 (About Report)',
    subSections: [
      { id: '1.01', title: '1.01 經營者的話', template: '...', example: '...', griStandards: 'GRI 2-22' },
    ]
  }
];

/**
 * Universal Optical Cards - The Knowledge Prism
 * Theme: "Refracting Resources into Impact"
 */
export const ESG_CARDS: EsgCard[] = [
  // 1. The Legendary Source Code Card
  {
    id: 'card-legend-001',
    title: 'ESGss 善向永續',
    description: 'A Golden Triangle framework connecting Capital (TSMC), Policy (Taipei), and Knowledge. Transforms compliance into impact.',
    attribute: 'Governance',
    category: 'Partnership',
    rarity: 'Legendary',
    term: 'ESG Sunshine Protocol',
    definition: 'An architecture refracting resources into verifiable social impact through data & education.',
    stats: { defense: 100, offense: 100 },
    collectionSet: 'Genesis',
    isPurified: true
  },
  // 2. Environmental (E-1 Green Ops)
  {
    id: 'card-e1-001',
    title: 'Scope 1 Tracker',
    description: 'Precision measurement of direct emissions from owned sources.',
    attribute: 'Environmental',
    category: 'Green_Ops',
    rarity: 'Common',
    term: 'Direct Emissions',
    definition: 'GHG emissions from sources that are owned or controlled by the reporting entity.',
    stats: { defense: 80, offense: 20 },
    collectionSet: 'Starter',
    isPurified: true
  },
  // 3. Social (S-1 Human Capital)
  {
    id: 'card-s1-001',
    title: 'Berkeley Strategist',
    description: 'Certified strategic thinking for sustainable development.',
    attribute: 'Social',
    category: 'Human_Capital',
    rarity: 'Epic',
    term: 'Human Capital Dev',
    definition: 'The collective skills, knowledge, or other intangible assets of individuals that can be used to create economic value.',
    stats: { defense: 50, offense: 150 },
    collectionSet: 'Academy',
    isPurified: false
  },
  // 4. Governance (G-1 Foundation)
  {
    id: 'card-g1-001',
    title: 'Transparency Shield',
    description: 'Verified disclosure protecting against greenwashing risks.',
    attribute: 'Governance',
    category: 'Foundation',
    rarity: 'Rare',
    term: 'Greenwashing',
    definition: 'The practice of making misleading or unsubstantiated claims about the environmental benefits of a product or service.',
    stats: { defense: 120, offense: 10 },
    collectionSet: 'Compliance',
    isPurified: true
  },
  // 5. Environmental (E-2 Eco-System)
  {
    id: 'card-e2-001',
    title: 'Supply Chain Symbiosis',
    description: 'Extending green standards to Tier 2 & 3 suppliers.',
    attribute: 'Environmental',
    category: 'Eco_System',
    rarity: 'Epic',
    term: 'Scope 3 Upstream',
    definition: 'Indirect emissions related to purchased goods and services.',
    stats: { defense: 60, offense: 90 },
    collectionSet: 'Supply Chain',
    isPurified: false
  },
  // 6. Social (S-2 Social Impact)
  {
    id: 'card-s2-001',
    title: 'Digital Inclusion',
    description: 'Bridging the digital divide in rural communities.',
    attribute: 'Social',
    category: 'Social_Impact',
    rarity: 'Rare',
    term: 'SROI',
    definition: 'Social Return on Investment: A method for measuring values that are not traditionally reflected in financial statements.',
    stats: { defense: 30, offense: 110 },
    collectionSet: 'Impact',
    isPurified: false
  },
  // 7. Governance (G-2 Partnership)
  {
    id: 'card-g2-001',
    title: 'Public-Private Pact',
    description: 'Strategic alliance with city government for Net Zero goals.',
    attribute: 'Governance',
    category: 'Partnership',
    rarity: 'Legendary',
    term: 'PPP Model',
    definition: 'Public-Private Partnership: A cooperative arrangement between two or more public and private sectors.',
    stats: { defense: 90, offense: 200 },
    collectionSet: 'City',
    isPurified: false
  }
];

export const getMockMetrics = (lang: Language): Metric[] => {
  const isZh = lang === 'zh-TW';
  return [
    { 
        id: '1', 
        label: isZh ? '範疇一排放 (Scope 1)' : 'Scope 1 Emissions', 
        value: '1,240', 
        change: -5.2, 
        trend: 'up', 
        color: 'emerald', 
        traits: ['performance'], 
        tags: ['Direct'] 
    },
    { 
        id: '2', 
        label: isZh ? '範疇二排放 (Scope 2)' : 'Scope 2 Emissions', 
        value: '850', 
        change: -2.1, 
        trend: 'down', 
        color: 'blue', 
        traits: ['optimization'], 
        tags: ['Indirect'] 
    },
    { 
        id: '3', 
        label: isZh ? 'ESG 綜合評分' : 'ESG Score', 
        value: '88.4', 
        change: 1.5, 
        trend: 'up', 
        color: 'purple', 
        traits: ['evolution'], 
        tags: ['Rating'] 
    },
    { 
        id: '4', 
        label: isZh ? '供應鏈數據覆蓋率' : 'Supply Chain Coverage', 
        value: '72%', 
        change: 8.4, 
        trend: 'up', 
        color: 'gold', 
        traits: ['gap-filling'], 
        tags: ['Scope 3'], 
        dataLink: 'ai' 
    },
  ];
};

export const getMockCourses = (lang: Language): Course[] => [
    { id: '1', title: 'GHG Protocol Fundamentals', category: 'Environment', level: 'Beginner', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&q=80' },
    { id: '2', title: 'Supply Chain Decarbonization', category: 'Strategy', level: 'Advanced', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80' },
    { id: '3', title: 'Social Impact Measurement', category: 'Social', level: 'Intermediate', progress: 10, thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80' },
];

export const getMockHealth = (lang: Language): SystemHealth[] => [
    { module: 'Data Collector', status: 'Healthy', latency: 45 },
    { module: 'AI Reasoning', status: 'Healthy', latency: 120 },
    { module: 'Blockchain Node', status: 'Warning', latency: 450 },
    { module: 'Reporting Engine', status: 'Healthy', latency: 85 },
];

export const CHART_DATA = [
  { name: 'Jan', value: 400, baseline: 450 },
  { name: 'Feb', value: 380, baseline: 440 },
  { name: 'Mar', value: 420, baseline: 460 },
  { name: 'Apr', value: 350, baseline: 430 },
  { name: 'May', value: 340, baseline: 420 },
  { name: 'Jun', value: 310, baseline: 410 },
  { name: 'Jul', value: 300, baseline: 400 },
];
