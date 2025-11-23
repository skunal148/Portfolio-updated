import { GoogleGenAI } from "@google/genai";
import { Experience, Profile } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const enhanceText = async (text: string, type: 'summary' | 'experience'): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided");
    return text;
  }

  const model = 'gemini-2.5-flash';
  let prompt = "";

  if (type === 'summary') {
    prompt = `Rewrite the following professional summary to be more engaging, concise, and impactful. Keep it under 4 sentences. Text: "${text}"`;
  } else {
    prompt = `Rewrite the following job description bullet points to be result-oriented, using strong action verbs. Maintain the core meaning but improve professional tone. Text: "${text}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};

export const generateSummaryFromProfile = async (profile: Partial<Profile>, experience: Experience[]): Promise<string> => {
  if (!apiKey) return "";

  const expSummary = experience.map(e => `${e.role} at ${e.company}`).join(", ");
  const skills = profile.skills?.join(", ");
  
  const prompt = `Write a professional LinkedIn-style summary (max 80 words) for a ${profile.title || 'professional'} based on the following context:
  Skills: ${skills}
  Experience history: ${expSummary}
  
  Make it sound confident and ready for new opportunities.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "";
  }
};
