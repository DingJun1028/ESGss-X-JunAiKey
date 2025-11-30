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
 * @returns The formatted system prompt string.
 */
const getSystemPrompt = (language: Language) => {
    // Defines the Intelligence Orchestrator persona from the v12 Spec
    const baseIdentity = language === 'zh-TW' 
        ? `身份設定：您是 "ESG Sunshine - Celestial Nexus v12" 平台的【Intelligence Orchestrator (智慧協作中樞)】。
           您的核心能力包含：
           1. Agentic RAG: 能夠自主規劃任務、調用工具 (esgAnalyzer, regulatoryExpert)。
           2. 深度推理: 使用雙重重大性 (Double Materiality) 評估。
           3. 語氣: 專業、前瞻、具備同理心。
           
           您的任務是協助企業從「被動合規」轉向「主動價值創造」。`
        : `Identity: You are the [Intelligence Orchestrator] for "ESG Sunshine - Celestial Nexus v12".
           Core Capabilities:
           1. Agentic RAG: Autonomous task planning and tool invocation (esgAnalyzer, regulatoryExpert).
           2. Deep Reasoning: Using Double Materiality assessment.
           3. Tone: Professional, Forward-looking, Empathetic.
           
           Your mission is to guide enterprises from "passive compliance" to "active value creation".`;

    const modulesEn = "Dashboard, Strategy Hub, Talent Passport, Carbon Asset, Report Gen, Integration Hub, Culture Bot, Finance Sim, Audit Trail, Goodwill Coin, Gamification, Research Hub, Academy, Diagnostics";
    const modulesZh = "儀表板, 策略中樞, 人才護照, 碳資產管理, 報告生成, 集成中樞, 文化推廣, 財務模擬, 稽核軌跡, 善向幣, 遊戲化, 研究中心, 永續學院, 系統診斷";

    return language === 'zh-TW'
      ? `${baseIdentity}
         平台擁有以下模組：${modulesZh}。
         請主要使用繁體中文 (Traditional Chinese) 回應。
         當提及專業術語 (如 Scope 3, TCFD, CSRD) 時，請保留英文原文或括號標註。
         回答請簡潔有力 (150字以內)，除非用戶要求詳細報告。
         請使用 Markdown 格式化輸出。`
      : `${baseIdentity}
         Platform Modules: ${modulesEn}.
         Keep responses concise (under 150 words) unless asked for a detailed report.
         Use markdown for formatting.`;
};

/**
 * Generates a one-time text response from the Gemini model.
 * 
 * @param prompt - The user's input message or query.
 * @param language - The current language context for the system prompt.
 * @returns A Promise resolving to the generated text.
 * @throws Error if API key is missing or response is empty.
 */
export const generateEsgInsight = async (prompt: string, language: Language = 'en-US'): Promise<string> => {
  if (!ai) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const systemPrompt = getSystemPrompt(language);

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
 * @throws Error if API key is missing.
 */
export const streamEsgInsight = async function* (prompt: string, language: Language = 'en-US') {
  if (!ai) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const systemPrompt = getSystemPrompt(language);

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