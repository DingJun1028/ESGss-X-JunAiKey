
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
 * Helper to get base64 from file
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
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
 * Generates the System Instruction prompt based on the selected language.
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
            return `${baseIdentity} Role: Expert ESG Report Writer. Task: Draft professional GRI/SASB reports. ${commonRules}`;
        case 'analyst':
            return `${baseIdentity} Role: Senior Data Scientist. Task: Analyze anomalies using Double Materiality. ${commonRules}`;
        case 'forecaster':
            return `${baseIdentity} Role: Predictive AI. Task: Forecast trends. ${commonRules}`;
        case 'chat':
        default:
            return language === 'zh-TW'
              ? `${baseIdentity} 
                 核心能力：Agentic RAG, 深度推理 (Thinking Mode enabled), 多模態視覺分析。
                 任務：協助企業從「被動合規」轉向「主動價值創造」。
                 ${commonRules}`
              : `${baseIdentity}
                 Core Caps: Agentic RAG, Deep Reasoning (Thinking Mode enabled), Multimodal Vision.
                 Mission: Guide enterprises to active value creation.
                 ${commonRules}`;
    }
};

/**
 * Streams chat response using gemini-3-pro-preview with Thinking Mode and Multimodal capabilities.
 */
export const streamChat = async function* (
  message: string, 
  language: Language = 'en-US',
  imageData?: { inlineData: { data: string; mimeType: string } }
) {
  if (!ai) throw new Error("MISSING_API_KEY");

  try {
    const systemPrompt = getSystemPrompt(language, 'chat');
    
    // Construct content parts
    const parts: any[] = [{ text: message }];
    if (imageData) {
        parts.unshift(imageData); // Add image first if present
    }

    // Use gemini-3-pro-preview for advanced reasoning and chat
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 32768 }, // Enable Thinking Mode (Max 32k)
        // maxOutputTokens is intentionally omitted as per thinking mode requirements
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Performs a web search using Google Search Grounding.
 * Uses gemini-2.5-flash for speed.
 */
export const performWebSearch = async (query: string, language: Language = 'en-US'): Promise<{ text: string, sources?: any[] }> => {
    if (!ai) throw new Error("MISSING_API_KEY");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }], // Enable Search Grounding
                systemInstruction: language === 'zh-TW' 
                    ? "請使用 Google 搜尋工具來回答使用者的問題。請引用來源。"
                    : "Please use Google Search to answer the user's question. Cite sources."
            }
        });

        const text = response.text || "No results found.";
        // Extract grounding metadata if available (chunks contain URLs)
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        return { text, sources };
    } catch (error) {
        console.error("Search Grounding Error:", error);
        throw error;
    }
};

/**
 * Performs a map query using Google Maps Grounding.
 * Uses gemini-2.5-flash for speed.
 */
export const performMapQuery = async (query: string, language: Language = 'en-US'): Promise<{ text: string, maps?: any[] }> => {
    if (!ai) throw new Error("MISSING_API_KEY");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleMaps: {} }], // Enable Maps Grounding
                systemInstruction: language === 'zh-TW' 
                    ? "請使用 Google Maps 工具來回答關於地點的問題。"
                    : "Please use Google Maps to answer location-based questions."
            }
        });

        const text = response.text || "No location found.";
        return { text };
    } catch (error) {
        console.error("Maps Grounding Error:", error);
        throw error;
    }
};

// ... keep existing specialized functions (generateReportChapter, analyzeDataAnomaly, predictFutureTrends) 
// but ensure they use gemini-2.5-flash for standard tasks or 3-pro if complex logic is needed.
// For now, we keep them on flash for speed unless specified otherwise.

export const generateReportChapter = async (sectionTitle: string, contextData: any, language: Language = 'en-US'): Promise<string> => {
  if (!ai) return "Simulated Report Content...";
  try {
    const systemPrompt = getSystemPrompt(language, 'writer');
    const prompt = `Draft the "${sectionTitle}" for the ESG Report. Data: ${JSON.stringify(contextData)}`;
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
    return response.text || "Failed to analyze.";
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
