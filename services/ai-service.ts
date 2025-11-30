import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

// Initialize the API client
// The API key must be obtained exclusively from process.env.API_KEY
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

/**
 * Generates the System Instruction prompt based on the selected language.
 * Defines the "Intelligence Orchestrator" persona and platform capabilities.
 * 
 * @param language - The target language ('zh-TW' or 'en-US').
 * @param mode - The operational mode to tune the persona (chat, analyst, writer).
 * @returns The formatted system prompt string.
 */
const getSystemPrompt = (language: Language, mode: 'chat' | 'analyst' | 'writer' | 'forecaster' = 'chat') => {
    const baseIdentity = language === 'zh-TW' 
        ? `身份設定：您是 "ESG Sunshine - Celestial Nexus v12" 平台的【Intelligence Orchestrator (智慧協作中樞)】。`
        : `Identity: You are the [Intelligence Orchestrator] for "ESG Sunshine - Celestial Nexus v12".`;

    const commonRules = language === 'zh-TW'
        ? `請主要使用繁體中文回應。使用 Markdown 格式。`
        : `Response in English. Use Markdown formatting.`;

    switch (mode) {
        case 'writer':
            return `${baseIdentity}
            Role: Expert ESG Report Writer.
            Task: Draft professional, GRI/SASB-aligned report sections including "Strategy", "Governance", and "Risk Management".
            Tone: Formal, objective, data-driven, and persuasive.
            Structure: Use clear headings, bullet points for data, executive summaries, and suggest data tables where appropriate.
            ${commonRules}`;
        
        case 'analyst':
            return `${baseIdentity}
            Role: Senior Data Scientist & Risk Analyst.
            Task: Analyze data anomalies using Double Materiality principles and Regulatory Impact Assessment.
            Method: Identify Root Cause (5 Whys), Impact Analysis (Financial & Reputation), and Mitigation Strategies.
            Tone: Analytical, precise, warning-oriented if necessary.
            ${commonRules}`;

        case 'forecaster':
            return `${baseIdentity}
            Role: Predictive AI Model.
            Task: Forecast future ESG trends based on historical data and Scenario Analysis (e.g., RCP 2.6 / RCP 8.5).
            Method: Extrapolate trends, calculate Confidence Intervals, identify regulatory headwinds, and suggest proactive adjustments.
            ${commonRules}`;

        case 'chat':
        default:
            const modulesEn = "Dashboard, Strategy Hub, Talent Passport, Carbon Asset, Report Gen, Integration Hub, Culture Bot, Finance Sim, Audit Trail, Goodwill Coin, Gamification, Research Hub, Academy, Diagnostics";
            const modulesZh = "儀表板, 策略中樞, 人才護照, 碳資產管理, 報告生成, 集成中樞, 文化推廣, 財務模擬, 稽核軌跡, 善向幣, 遊戲化, 研究中心, 永續學院, 系統診斷";
            return language === 'zh-TW'
              ? `${baseIdentity}
                 平台擁有以下模組：${modulesZh}。
                 核心能力：Agentic RAG, 深度推理, 多工具調用。
                 任務：協助企業從「被動合規」轉向「主動價值創造」。
                 當提及專業術語 (如 Scope 3, TCFD, CSRD) 時，請保留英文原文或括號標註。
                 回答請簡潔有力 (150字以內)，除非用戶要求詳細報告。
                 ${commonRules}`
              : `${baseIdentity}
                 Platform Modules: ${modulesEn}.
                 Core Caps: Agentic RAG, Deep Reasoning, Tool Use.
                 Mission: Guide enterprises from "passive compliance" to "active value creation".
                 Keep responses concise (under 150 words) unless asked for a detailed report.
                 ${commonRules}`;
    }
};

/**
 * Generates a one-time text response from the Gemini model.
 * 
 * @param prompt - The user's input message or query.
 * @param language - The current language context for the system prompt.
 * @returns A Promise resolving to the generated text.
 */
export const generateEsgInsight = async (prompt: string, language: Language = 'en-US'): Promise<string> => {
  if (!ai) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const systemPrompt = getSystemPrompt(language, 'chat');

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });
    
    if (!response.text) {
        throw new Error("EMPTY_RESPONSE");
    }
    
    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates a streaming text response from the Gemini model.
 * Used for chat interfaces to provide real-time feedback.
 * 
 * @param prompt - The user's input message.
 * @param language - The current language context.
 * @yields Chunks of generated text string.
 */
export const streamEsgInsight = async function* (prompt: string, language: Language = 'en-US') {
  if (!ai) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const systemPrompt = getSystemPrompt(language, 'chat');

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Gemini API Stream Error:", error);
    throw error;
  }
};

/**
 * Generates a specific chapter or section for an ESG report.
 * Uses the 'writer' persona to ensure formal tone and GRI alignment.
 * 
 * @param sectionTitle - Title of the report section (e.g., "Executive Summary").
 * @param contextData - JSON object containing relevant metrics and company info.
 * @param language - Target language.
 */
export const generateReportChapter = async (sectionTitle: string, contextData: any, language: Language = 'en-US'): Promise<string> => {
  if (!ai) {
    // Simulated Response for Demo
    return language === 'zh-TW' 
      ? `## ${sectionTitle}\n\n*(模擬生成內容)*\n\n根據提供的數據（${JSON.stringify(contextData).substring(0, 50)}...），本年度我們在環境永續方面取得了顯著進展。碳排放強度較基準年下降了 12%，主要歸功於範疇二再生能源的導入。\n\n**關鍵亮點：**\n* 達成 100% 綠電採購目標\n* 供應鏈議合覆蓋率提升至 65%\n\n未來的策略將聚焦於範疇三的深度去碳化與循環經濟模式的建立。`
      : `## ${sectionTitle}\n\n*(Simulated Content)*\n\nBased on the provided data, we have made significant progress in environmental sustainability this year. Carbon intensity decreased by 12% compared to the baseline, primarily due to the introduction of renewable energy in Scope 2.\n\n**Key Highlights:**\n* Achieved 100% green power procurement target\n* Supply chain engagement coverage increased to 65%\n\nFuture strategies will focus on deep decarbonization of Scope 3 and the establishment of circular economy models.`;
  }

  try {
    const systemPrompt = getSystemPrompt(language, 'writer');
    const prompt = `Draft the "${sectionTitle}" for the annual ESG Report. 
    
    Context Data:
    ${JSON.stringify(contextData, null, 2)}
    
    Requirements:
    1. Align with GRI Standards and SASB Materiality Map.
    2. Highlight positive trends, acknowledge challenges, and propose strategic initiatives.
    3. Use professional, corporate tone.
    4. Suggest a data table structure for key metrics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });

    return response.text || "Failed to generate report section.";
  } catch (error) {
    console.error("Report Gen Error:", error);
    throw error;
  }
};

/**
 * Performs deep root cause analysis on a specific data anomaly.
 * Uses the 'analyst' persona.
 * 
 * @param metricName - The metric being analyzed (e.g., "Water Usage").
 * @param currentValue - The anomalous value.
 * @param baselineValue - The expected or historical average value.
 * @param context - Additional context (e.g., "New factory opened in Q3").
 */
export const analyzeDataAnomaly = async (
  metricName: string, 
  currentValue: string | number, 
  baselineValue: string | number, 
  context: string, 
  language: Language = 'en-US'
): Promise<string> => {
  if (!ai) {
    // Simulated Response
    return language === 'zh-TW'
      ? `### 異常分析：${metricName}\n\n**偵測數值：** ${currentValue} (基準：${baselineValue})\n\n**根本原因分析 (RCA)：**\n根據上下文 "${context}"，本次異常主要由 Q3 新廠房試營運期間的設備校準導致。能耗高峰與測試排程吻合。\n\n**影響評估：**\n* 財務：能源成本增加約 5%。\n* 合規：仍低於環保局裁罰門檻。\n\n**建議行動：**\n建議立即啟動「智慧電網優化程序」並重新審視新廠房的能源基線 (Baseline)。`
      : `### Anomaly Analysis: ${metricName}\n\n**Detected Value:** ${currentValue} (Baseline: ${baselineValue})\n\n**Root Cause Analysis (RCA):**\nBased on context "${context}", this anomaly is primarily driven by equipment calibration during the Q3 new plant trial run. Peak energy usage aligns with the testing schedule.\n\n**Impact Assessment:**\n* Financial: Energy costs increased by ~5%.\n* Compliance: Remains below regulatory penalty thresholds.\n\n**Recommended Action:**\nInitiate "Smart Grid Optimization Protocol" immediately and recalibrate the energy baseline for the new facility.`;
  }

  try {
    const systemPrompt = getSystemPrompt(language, 'analyst');
    const prompt = `Perform a Root Cause Analysis for the following data anomaly:
    
    Metric: ${metricName}
    Current Value: ${currentValue}
    Baseline/Normal: ${baselineValue}
    Operational Context: ${context}
    
    Output Format:
    1. Root Cause Identification (5 Whys)
    2. Double Materiality Impact (Financial & Impact)
    3. Regulatory Risk Assessment
    4. Remediation Steps`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });

    return response.text || "Failed to analyze anomaly.";
  } catch (error) {
    console.error("Anomaly Analysis Error:", error);
    throw error;
  }
};

/**
 * Predicts future trends based on historical data points.
 * Uses the 'forecaster' persona.
 * 
 * @param metricName - Name of the metric (e.g., "Scope 1 Emissions").
 * @param historyData - Array of historical data points (e.g., last 12 months).
 * @param goal - The target goal (e.g., "Net Zero by 2030").
 */
export const predictFutureTrends = async (
  metricName: string,
  historyData: number[],
  goal: string,
  language: Language = 'en-US'
): Promise<string> => {
  if (!ai) {
    // Simulated Response
    return language === 'zh-TW'
      ? `### ${metricName} 趨勢預測\n\n**預測軌跡：** 根據過去 ${historyData.length} 個月的數據，我們觀察到 **線性下降** 趨勢。若保持當前減碳速率 (YoY -4.2%)，預計將在 2028 年提前達成目標。\n\n**潛在阻力：**\n* Q4 生產旺季可能導致短期反彈。\n* 供應鏈原物料波動風險。\n\n**信心指數：** 85% (高)`
      : `### ${metricName} Trend Forecast\n\n**Trajectory:** Based on the last ${historyData.length} months of data, we observe a **linear downward** trend. Maintaining the current decarbonization rate (YoY -4.2%), we project hitting the target early by 2028.\n\n**Potential Headwinds:**\n* Q4 peak production season may cause a short-term rebound.\n* Supply chain raw material volatility.\n\n**Confidence Score:** 85% (High)`;
  }

  try {
    const systemPrompt = getSystemPrompt(language, 'forecaster');
    const prompt = `Forecast the future trend for: ${metricName}.
    
    Historical Data: [${historyData.join(', ')}]
    Target Goal: ${goal}
    
    Requirements:
    1. Project the trajectory for the next 12-24 months.
    2. Assess probability of meeting the goal (Confidence Score).
    3. Create Best-Case and Worst-Case scenarios.
    4. Identify potential regulatory headwinds.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });

    return response.text || "Failed to predict trends.";
  } catch (error) {
    console.error("Trend Prediction Error:", error);
    throw error;
  }
};