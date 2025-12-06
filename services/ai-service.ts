
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';
import { universalIntelligence } from './evolutionEngine'; // Link to the Universal Brain

// Initialize the API client
// The API key must be obtained exclusively from process.env.API_KEY
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Enhanced System Prompts for specific JunAiKey Roles.
 */
const getSystemPrompt = (language: Language, mode: 'chat' | 'analyst' | 'writer' | 'forecaster' | 'auditor' | 'strategist' = 'chat') => {
    const baseIdentity = language === 'zh-TW' 
        ? `身份設定：您是 "ESGss X JunAiKey 善向永續系統" 的核心 AI 引擎【JunAiKey】。`
        : `Identity: You are [JunAiKey], the core AI engine for "ESGss X JunAiKey Sustainability System".`;

    const commonRules = language === 'zh-TW'
        ? `請主要使用繁體中文回應。使用 Markdown 格式。語氣專業、前瞻、具備同理心。`
        : `Response in English. Use Markdown formatting. Tone: Professional, Forward-looking, Empathetic.`;

    switch (mode) {
        case 'writer':
            return `${baseIdentity} Role: Expert ESG Report Writer (GRI Certified). Task: Write Sustainability Report sections.
            Strictly follow GRI Standards. Tone: Corporate, Transparent, Impactful.
            ${commonRules}`;
        case 'auditor':
            return `${baseIdentity} Role: Senior ESG Compliance Auditor. Task: Critique content against GRI/SASB standards.
            Identify gaps, vague statements, and greenwashing risks. Be strict but constructive.
            ${commonRules}`;
        case 'strategist':
            return `${baseIdentity} Role: Chief Sustainability Strategy Officer. Task: Provide actionable mitigation plans for risks.
            Use Game Theory concepts where applicable. Focus on ROI and long-term resilience.
            ${commonRules}`;
        case 'analyst':
            return `${baseIdentity} Role: Data Scientist. Task: Anomaly Detection & Root Cause Analysis. ${commonRules}`;
        case 'forecaster':
            return `${baseIdentity} Role: Predictive Model. Task: Financial & Carbon Forecasting. ${commonRules}`;
        case 'chat':
        default:
            return language === 'zh-TW'
              ? `${baseIdentity} 核心能力：深度推理 (Thinking Mode), 多模態分析。任務：協助企業價值創造。${commonRules}`
              : `${baseIdentity} Core Caps: Deep Reasoning (Thinking Mode), Multimodal. Mission: Value Creation. ${commonRules}`;
    }
};

export const streamChat = async function* (
  message: string, 
  language: Language = 'en-US',
  imageData?: { inlineData: { data: string; mimeType: string } }
) {
  if (!ai) throw new Error("MISSING_API_KEY");

  try {
    const systemPrompt = getSystemPrompt(language, 'chat');
    const parts: any[] = [{ text: message }];
    if (imageData) parts.unshift(imageData);

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Deep Strategic Analysis for Risk Mitigation (Strategy Hub).
 * Uses high thinking budget for complex reasoning.
 */
export const generateRiskMitigationPlan = async (
    riskName: string,
    contextData: any,
    language: Language = 'en-US'
): Promise<string> => {
    if (!ai) return "Simulated Plan: Increase renewable energy adoption by 20%.";

    try {
        const systemPrompt = getSystemPrompt(language, 'strategist');
        const prompt = `
            Analyze Risk: "${riskName}".
            Context: ${JSON.stringify(contextData)}.
            
            Provide a structured mitigation plan including:
            1. Immediate Actions (0-6 months)
            2. Strategic Investments (1-3 years)
            3. KPI for tracking success
            4. Estimated ROI or Cost Avoidance
            
            Output in Markdown with clear headers.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: systemPrompt,
                thinkingConfig: { thinkingBudget: 2048 } // Higher budget for strategy
            }
        });

        // [Universal Intelligence Sync]
        // The Agent updates the Risk Node's memory with the new plan.
        universalIntelligence.agentUpdate(riskName, {
            traits: ['optimization', 'learning', 'evolution'], // Evolve traits
            confidence: 'high'
        });

        return response.text || "Analysis failed.";
    } catch (error) {
        console.error("Strategy Gen Error:", error);
        throw error;
    }
};

/**
 * Compliance Audit for Report Sections (Report Gen).
 */
export const auditReportContent = async (
    sectionTitle: string,
    content: string,
    standard: string,
    language: Language = 'en-US'
): Promise<string> => {
    if (!ai) return "Simulated Audit: Content appears compliant.";

    try {
        const systemPrompt = getSystemPrompt(language, 'auditor');
        const prompt = `
            Audit Section: "${sectionTitle}".
            Standard: ${standard}.
            Content to Audit:
            """${content}"""
            
            Evaluate:
            1. Completeness against standard.
            2. Clarity and Transparency.
            3. Potential Greenwashing risks.
            4. Suggest 1 specific improvement.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: systemPrompt,
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });
        return response.text || "Audit failed.";
    } catch (error) {
        console.error("Audit Error:", error);
        throw error;
    }
};

export const verifyQuestImage = async (
    questTitle: string, 
    questDesc: string,
    imageFile: File, 
    language: Language = 'en-US'
): Promise<{ success: boolean; reason: string }> => {
  if (!ai) return { success: true, reason: "Simulated: AI Key missing, assuming success." };
  
  try {
     const imageData = await fileToGenerativePart(imageFile);
     const prompt = language === 'zh-TW' 
        ? `任務目標：${questTitle}。描述：${questDesc}。這張圖是否證明任務完成？嚴格檢查。回傳純 JSON: {"success": boolean, "reason": "理由"}`
        : `Quest: ${questTitle}. Desc: ${questDesc}. Does image prove completion? Strict check. Return JSON: {"success": boolean, "reason": "Reason"}`;

     const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imageData, { text: prompt }] },
        config: { responseMimeType: 'application/json' }
     });
     const json = JSON.parse(result.text || '{}');
     return { success: json.success === true, reason: json.reason || "Processed" };
  } catch(e) {
      return { success: false, reason: "AI Vision Error" };
  }
}

export const performWebSearch = async (query: string, language: Language = 'en-US'): Promise<{ text: string, sources?: any[] }> => {
    if (!ai) throw new Error("MISSING_API_KEY");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: language === 'zh-TW' ? "請使用 Google 搜尋回答。" : "Use Google Search to answer."
            }
        });
        return { text: response.text || "No results.", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks };
    } catch (error) { throw error; }
};

export const performMapQuery = async (query: string, language: Language = 'en-US'): Promise<{ text: string, maps?: any[] }> => {
    if (!ai) throw new Error("MISSING_API_KEY");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleMaps: {} }],
                systemInstruction: language === 'zh-TW' ? "請使用 Google Maps 回答。" : "Use Google Maps to answer."
            }
        });
        return { text: response.text || "No location found." };
    } catch (error) { throw error; }
};

export const generateReportChapter = async (
    sectionTitle: string, template: string, example: string, contextData: any, language: Language = 'en-US'
): Promise<string> => {
  if (!ai) return "Simulated Content...";
  try {
    const systemPrompt = getSystemPrompt(language, 'writer');
    const prompt = `Write "${sectionTitle}". Template: "${template}". Example style: "${example}". Context: ${JSON.stringify(contextData)}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });
    return response.text || "Failed to generate.";
  } catch (error) { throw error; }
};

export const analyzeDataAnomaly = async (metric: string, val: any, base: any, ctx: string, lang: Language = 'en-US'): Promise<string> => {
  if (!ai) return "Simulated Analysis...";
  try {
    const systemPrompt = getSystemPrompt(lang, 'analyst');
    const prompt = `Analyze Anomaly: ${metric}. Value: ${val}. Baseline: ${base}. Context: ${ctx}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });

    const result = response.text || "Failed to analyze.";

    // [Universal Intelligence Sync]
    // The "Soul" (Agent) updates the "Body" (Component Node) with new insights
    universalIntelligence.agentUpdate(metric, {
        traits: ['optimization', 'learning', 'performance'], // Evolve visually
        confidence: 'high'
        // In a real app, we would append `result` to the node's memory.history
    });

    return result;
  } catch (error) { throw error; }
};

export const predictFutureTrends = async (metric: string, history: number[], goal: string, lang: Language = 'en-US'): Promise<string> => {
  if (!ai) return "Simulated Forecast...";
  try {
    const systemPrompt = getSystemPrompt(lang, 'forecaster');
    const prompt = `Forecast ${metric}. History: ${history}. Goal: ${goal}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });
    return response.text || "Failed to forecast.";
  } catch (error) { throw error; }
};
