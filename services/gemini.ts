import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Theme, GeminiThemeResponse } from '../types';

// Fallback theme in case of errors or while loading
export const DEFAULT_THEME: Theme = {
  id: 'default-apples',
  name: { en: 'Apples', ar: 'تفاح' },
  emoji: '🍎',
  bgColor: 'bg-red-50',
  primaryColor: 'text-red-600',
  buttonColor: 'bg-red-500',
  successMessage: { en: 'Yummy!', ar: 'لذيذ!' }
};

export const PRESET_THEMES: Theme[] = [
  DEFAULT_THEME, // Level 1
  {
    id: 'bananas',
    name: { en: 'Bananas', ar: 'موز' },
    emoji: '🍌',
    bgColor: 'bg-yellow-50',
    primaryColor: 'text-yellow-600',
    buttonColor: 'bg-yellow-500',
    successMessage: { en: 'Super!', ar: 'رائع!' }
  },
  {
    id: 'grapes',
    name: { en: 'Grapes', ar: 'عنب' },
    emoji: '🍇',
    bgColor: 'bg-purple-50',
    primaryColor: 'text-purple-600',
    buttonColor: 'bg-purple-500',
    successMessage: { en: 'Great job!', ar: 'أحسنت!' }
  },
   {
    id: 'oranges',
    name: { en: 'Oranges', ar: 'برتقال' },
    emoji: '🍊',
    bgColor: 'bg-orange-50',
    primaryColor: 'text-orange-600',
    buttonColor: 'bg-orange-500',
    successMessage: { en: 'Wow!', ar: 'واو!' }
  },
   {
    id: 'strawberries',
    name: { en: 'Strawberries', ar: 'فراولة' },
    emoji: '🍓',
    bgColor: 'bg-rose-50',
    primaryColor: 'text-rose-600',
    buttonColor: 'bg-rose-500',
    successMessage: { en: 'Sweet!', ar: 'حلو!' }
  },
  {
    id: 'watermelons',
    name: { en: 'Watermelons', ar: 'بطيخ' },
    emoji: '🍉',
    bgColor: 'bg-green-50',
    primaryColor: 'text-green-600',
    buttonColor: 'bg-green-500',
    successMessage: { en: 'Tasty!', ar: 'شهي!' }
  }
];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const themeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    themeNameEn: { type: Type.STRING, description: "Theme name in English (e.g., 'Space')." },
    themeNameAr: { type: Type.STRING, description: "Theme name in Arabic (e.g., 'فضاء')." },
    emojiChar: { type: Type.STRING, description: "A single emoji character." },
    backgroundColorClass: { type: Type.STRING, description: "Tailwind background color (light, 100-200)." },
    primaryColorClass: { type: Type.STRING, description: "Tailwind text color (dark/vibrant)." },
    buttonColorClass: { type: Type.STRING, description: "Tailwind button background color (vibrant, 500-600)." },
    cheerMessageEn: { type: Type.STRING, description: "Encouraging phrase in English." },
    cheerMessageAr: { type: Type.STRING, description: "Encouraging phrase in Arabic." },
  },
  required: ["themeNameEn", "themeNameAr", "emojiChar", "backgroundColorClass", "primaryColorClass", "buttonColorClass", "cheerMessageEn", "cheerMessageAr"],
};

export const generateTheme = async (userPrompt: string): Promise<Theme> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a kids' counting app theme for: "${userPrompt}". 
      Provide both English and Arabic translations.
      Ensure the colors are valid Tailwind CSS classes. Backgrounds light, buttons vibrant.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: themeSchema,
        temperature: 0.7,
      },
    });

    const data = JSON.parse(response.text) as GeminiThemeResponse;

    return {
      id: Date.now().toString(),
      name: { en: data.themeNameEn, ar: data.themeNameAr },
      emoji: data.emojiChar,
      bgColor: data.backgroundColorClass,
      primaryColor: data.primaryColorClass,
      buttonColor: data.buttonColorClass,
      successMessage: { en: data.cheerMessageEn, ar: data.cheerMessageAr },
    };
  } catch (error) {
    console.error("Failed to generate theme:", error);
    return DEFAULT_THEME;
  }
};