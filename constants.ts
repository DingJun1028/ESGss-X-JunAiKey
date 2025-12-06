
import { Metric, Course, SystemHealth, Language, ReportSection, EsgCard } from './types';

/**
 * Translation dictionary for the application.
 * Structured by language code -> module -> key.
 */
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
      settings: 'Settings'
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
      settings: '設定 (Settings)'
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

/**
 * Sustainability Report Structure Definition based on the Full Technical Whitepaper.
 */
export const REPORT_STRUCTURE: ReportSection[] = [
  {
    id: '1',
    title: '1 關於本報告書 (About Report)',
    subSections: [
      {
        id: '1.01',
        title: '1.01 經營者的話 (Message from Management)',
        template: '【請依公司實際情形填寫】',
        example: '當今全球面臨著多重挑戰，包括新冠疫情對全球經濟和社會造成的衝擊...我們需要全球共同努力應對，加強環境、社會、治理（ESG）行動...',
        griStandards: 'GRI 2-22'
      },
      {
        id: '1.02',
        title: '1.02 關於本公司 (About Company)',
        template: '1.公司簡介：【公司名稱】成立於【XXXX】年... 2.價值鏈簡介：【請說明價值鏈上下游供應商...】',
        example: 'ABC公司成立於1995年，專注於電子產品研發與製造...價值鏈涵蓋上下游供應商、客戶及合作夥伴...',
        griStandards: 'GRI 2-1, GRI 2-6'
      },
      {
        id: '1.03',
        title: '1.03 報告書資訊 (Report Info)',
        template: '本報吿書依 GRI 準則及相關規範撰寫。報導期間與合併財務報表一致...',
        griStandards: 'GRI 2-2, 2-3, 2-4, 2-5'
      }
    ]
  },
  {
    id: '2',
    title: '2 永續經營 (Sustainable Management)',
    subSections: [
      {
        id: '2.01',
        title: '2.01 永續發展策略 (Strategy)',
        template: '本公司永續發展主要策略為：環境保護... 技術創新... 企業治理... 社會責任...',
        example: '本公司的使命是「透過創新科技，驅動綠色能源轉型」...我們制定了明確的短、中期策略藍圖...',
        griStandards: 'GRI 2-22'
      },
      {
        id: '2.02',
        title: '2.02 推動永續發展機制 (Governance)',
        template: '為實踐ESG願景與使命，【公司名稱】成立【永續發展委員會名稱】...',
        griStandards: 'GRI 2-9, 2-13, 2-16'
      },
      {
        id: '2.03',
        title: '2.03 董事會及功能性委員會 (Board)',
        template: '董事會負責指導長期經營策略與具有監督責任...本公司董事會由【XX】位董事組成...',
        griStandards: 'GRI 2-9, 2-10, 2-11, 2-12, 2-14~2-21'
      }
    ]
  },
  {
    id: '3',
    title: '3 利害關係人與重大議題 (Stakeholders)',
    subSections: [
      {
        id: '3.01',
        title: '3.01 利害關係人議合 (Engagement)',
        template: '本公司參考AA1000 SES標準鑑別利害關係人...提供多元溝通管道...',
        griStandards: 'GRI 2-29'
      },
      {
        id: '3.02',
        title: '3.02 決定重大主題的流程 (Materiality Process)',
        template: '依循GRI 3：重大主題2021，執行步驟如下：一、了解組織脈絡...二、鑑別衝擊...三、排定順序...',
        griStandards: 'GRI 3-1'
      },
      {
        id: '3.03',
        title: '3.03 重大主題列表 (Topics List)',
        template: '歸納出本公司共【X】項重大主題，包括【列示所鑑別之重大主題】...',
        griStandards: 'GRI 3-2'
      },
      {
        id: '3.04',
        title: '3.04 重大議題之管理 (Management Approach)',
        template: '本公司依照各項重大議題的衝擊性質，制定對應的政策與管理行動...',
        griStandards: 'GRI 3-3'
      }
    ]
  },
  {
    id: '4',
    title: '4 治理面 (Governance)',
    subSections: [
      { id: '4.01', title: '4.01 經濟績效 (Economic)', template: '【營收表現、直接經濟價值分配...】', example: '2024年總營收為50億元，較2023年成長5.2%...', griStandards: 'GRI 201' },
      { id: '4.02', title: '4.02 稅務 (Tax)', template: '1.稅務政策 2.稅務治理 3.利害關係人溝通...', example: '本公司承諾不利用租稅天堂...制定《稅務治理政策》...', griStandards: 'GRI 207' },
      { id: '4.03', title: '4.03 誠信經營 (Integrity)', template: '本公司訂定誠信經營守則...反貪腐風險評估...', griStandards: 'GRI 205, 206' },
      { id: '4.04', title: '4.04 溝通管道及申訴機制 (Grievance)', template: '為即時降低負面衝擊...設置申訴機制...', griStandards: 'GRI 2-25, 2-26' },
      { id: '4.05', title: '4.05 風險管理 (Risk Mgmt)', template: '採取預防性政策進行風險管理...風險辨識流程...', griStandards: 'GRI 2-27' },
      { id: '4.06', title: '4.06 資訊安全 (InfoSec)', template: '本公司訂立資安事件通報標準流程...ISO 27001認證...', griStandards: 'GRI 418' },
      { id: '4.07', title: '4.07 參與各類社團組織 (Membership)', template: '本公司持續參與業務相關之公協會組織...', griStandards: 'GRI 2-28' },
      { id: '4.08', title: '4.08 產品管理 (Product)', template: '針對產品進行健康和安全影響評估...行銷標示合規...', griStandards: 'GRI 416, 417' },
      { id: '4.09', title: '4.09 供應商管理 (Supply Chain)', template: '本公司共有【XX】家合格供應商，在地採購比為【XX】%...', griStandards: 'GRI 204, 308, 414' }
    ]
  },
  {
    id: '5',
    title: '5 社會面 (Social)',
    subSections: [
      { id: '5.01', title: '5.01 人力發展 (Human Capital)', template: '1.人權承諾 2.人力組成 3.多元包容 4.薪酬福利...', example: '本公司參考聯合國世界人權宣言...截至年底全體員工共計XX人...', griStandards: 'GRI 401, 404, 405' },
      { id: '5.02', title: '5.02 職業安全及衛生 (OHS)', template: '依職業安全衛生法規定，建立ISO 45001管理系統...', example: '本公司在勞動契約與安全衛生工作守則中明確規範...', griStandards: 'GRI 403' },
      { id: '5.03', title: '5.03 社區參與 (Community)', template: '本公司秉持取之社會用之社會精神，投入【XX】專案...', example: '長期投入於偏遠地區學校，發起「黃金拱橋計畫」...', griStandards: 'GRI 413' }
    ]
  },
  {
    id: '6',
    title: '6 環境面 (Environmental)',
    subSections: [
      { 
        id: '6.01', 
        title: '6.01 氣候變遷 (Climate Change)', 
        template: '1.氣候監督及治理架構... 2.氣候策略(TCFD框架)... 3.風險鑑別...', 
        example: '設立永續發展暨氣候變遷因應委員會...參考IPCC AR6五項氣候情境...',
        griStandards: 'GRI 201-2' 
      },
      { 
        id: '6.02', 
        title: '6.02 溫室氣體排放 (GHG Emissions)', 
        template: '本公司依循 ISO 14064-1 盤查，範疇一排放【X】tCO2e，範疇二【X】tCO2e...', 
        example: '2024年範疇一排放量為4,313.06公噸CO2e...經第三方查證...',
        griStandards: 'GRI 305' 
      },
      { 
        id: '6.03', 
        title: '6.03 能源管理 (Energy)', 
        template: '導入能源管理系統...【報告年度】消耗能源總量為【X】GJ...', 
        example: '持續致力於提升能源使用效率...導入ISO 50001...',
        griStandards: 'GRI 302' 
      },
      { id: '6.04', title: '6.04 水資源管理 (Water)', template: '使用WRI工具分析水風險...總取水量為【X】...', griStandards: 'GRI 303' },
      { id: '6.05', title: '6.05 廢棄物管理 (Waste)', template: '依循ISO14001...廢棄物總量為【X】公噸...', griStandards: 'GRI 306' }
    ]
  },
  {
    id: '7',
    title: '7 附錄 (Appendices)',
    subSections: [
      { id: '7.01', title: '7.01 GRI 內容索引表', template: '【GRI Content Index Table Template】', griStandards: '' },
      { id: '7.02', title: '7.02 氣候相關資訊 (Climate Info)', template: '【Listing of TCFD disclosures】', griStandards: '' },
      { id: '7.03', title: '7.03 產業別永續指標資訊 (Sector Standards)', template: '【Sector Specific Indicators】', griStandards: '' },
      { id: '7.04', title: '7.04 其他準則對照 (SASB/TCFD)', template: '【Cross-reference tables】', griStandards: '' },
      { id: '7.05', title: '7.05 確信機構意見書 (Assurance Statement)', template: '【Third-party assurance statement】', griStandards: '' }
    ]
  }
];

/**
 * Global Catalog of Collectible ESG Knowledge Cards
 * Theme: "Lego Bricks of Sustainability"
 * Integrating construction toys with serious ESG concepts.
 */
export const ESG_CARDS: EsgCard[] = [
  {
    id: 'card-001',
    title: 'The Green Baseplate (綠色底板)',
    description: 'Every great sustainable structure starts with a solid foundation.',
    rarity: 'Common',
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=600&auto=format&fit=crop', // Lego bricks flat
    knowledgePoint: 'Just like a LEGO baseplate holds the set together, a strong ESG Policy is the foundation of corporate resilience.',
    collectionSet: 'Starter Bricks'
  },
  {
    id: 'card-002',
    title: 'Factory Builder (範疇一工廠)',
    description: 'Master of direct emissions. Managing what comes out of your own chimney.',
    rarity: 'Common',
    imageUrl: 'https://images.unsplash.com/photo-1560964645-3649646fbc8b?q=80&w=600&auto=format&fit=crop', // Minifigure worker
    knowledgePoint: 'Scope 1 emissions are like the "smoke" bricks coming directly from the factory set you built and own.',
    collectionSet: 'Carbon'
  },
  {
    id: 'card-003',
    title: 'Supply Chain Convoy (範疇三車隊)',
    description: 'The trucks, planes, and ships bringing bricks from everywhere.',
    rarity: 'Legendary',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da9e2059?q=80&w=600&auto=format&fit=crop', // Lego vehicles
    knowledgePoint: 'Scope 3 is the hardest to count! It\'s like tracking the carbon footprint of every single brick delivered to your city by others.',
    collectionSet: 'Carbon'
  },
  {
    id: 'card-004',
    title: 'The Instruction Manual (治理指南)',
    description: 'Following the rules to ensure the structure doesn\'t collapse.',
    rarity: 'Rare',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop', // Paper/Instructions concept
    knowledgePoint: 'Corporate Governance (G) is your Instruction Manual. Skip a step (compliance), and the whole tower might fall.',
    collectionSet: 'Governance'
  },
  {
    id: 'card-005',
    title: 'Golden Brick Vault (綠色金融)',
    description: 'Funding the future with sustainable treasure.',
    rarity: 'Epic',
    imageUrl: 'https://images.unsplash.com/photo-1611605698323-5e347496677c?q=80&w=600&auto=format&fit=crop', // Toy coins
    knowledgePoint: 'Green Bonds are like special "Golden Bricks" that can only be used to build eco-friendly sets, like wind turbines.',
    collectionSet: 'Finance'
  },
  {
    id: 'card-006',
    title: 'Forest Rescue Team (生物多樣性)',
    description: 'Protecting the plastic trees and animal figs.',
    rarity: 'Rare',
    imageUrl: 'https://images.unsplash.com/photo-1518946222227-364f22132616?q=80&w=600&auto=format&fit=crop', // Toy nature
    knowledgePoint: 'TNFD is about protecting nature. In our world, it means ensuring we don\'t destroy the forest set to build a parking lot set.',
    collectionSet: 'Environment'
  },
  {
    id: 'card-007',
    title: 'Community City (社會共融)',
    description: 'Everything is awesome when everyone is included.',
    rarity: 'Epic',
    imageUrl: 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?q=80&w=600&auto=format&fit=crop', // Lego crowd
    knowledgePoint: 'Social (S) is about the Minifigures! Diversity & Inclusion means every type of minifig has a place in the city.',
    collectionSet: 'Social'
  },
  {
    id: 'card-008',
    title: ' The Rebuilder (循環經濟)',
    description: 'Don\'t throw it away! Take it apart and build a spaceship.',
    rarity: 'Legendary',
    imageUrl: 'https://images.unsplash.com/photo-1599696847753-93e8a31994fd?q=80&w=600&auto=format&fit=crop', // Pile of bricks
    knowledgePoint: 'Circular Economy is the ultimate LEGO philosophy: No waste, just reassembling old resources into new value.',
    collectionSet: 'Environment'
  }
];

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
        label: {
            id: 'metric-carbon-red',
            text: isZh ? '碳排減少 (Carbon Reduction)' : 'Carbon Reduction',
            definition: isZh 
                ? '與基準年（2023）相比，企業範疇一與範疇二溫室氣體排放的總減少量。' 
                : 'Total reduction in Scope 1 & 2 GHG emissions compared to the baseline year (2023).',
            formula: '(Baseline - Current Emissions) / Baseline * 100%'
        },
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
        label: {
            id: 'metric-esg-score',
            text: isZh ? 'ESG 評分 (ESG Score)' : 'ESG Score',
            definition: isZh
                ? '由 JunAiKey 根據環境、社會與治理數據綜合計算的動態評分。'
                : 'Dynamic score calculated by JunAiKey based on Environmental, Social, and Governance data points.',
            formula: '(E_Score * 0.4) + (S_Score * 0.3) + (G_Score * 0.3)'
        },
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
        label: {
            id: 'metric-gov-idx',
            text: isZh ? '治理指數 (Governance Idx)' : 'Governance Idx',
            definition: isZh
                ? '衡量企業合規性、董事會多樣性及內部稽核強度的綜合指標。'
                : 'Composite index measuring compliance, board diversity, and internal audit strength.',
        },
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
        label: {
            id: 'metric-social',
            text: isZh ? '社會影響力 (Social Impact)' : 'Social Impact',
            definition: isZh
                ? '基於 SROI (社會投資報酬率) 方法學的社區專案評估結果。'
                : 'Assessment of community projects based on SROI (Social Return on Investment) methodology.',
            formula: 'Net Present Value of Benefits / Net Present Value of Investment'
        },
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
    { module: 'JunAiKey Core', status: 'Healthy', latency: 45 },
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
