export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Theme {
  id: string;
  name: LocalizedText;
  emoji: string;
  bgColor: string; // Tailwind class, e.g., 'bg-blue-50'
  primaryColor: string; // Tailwind class for text/buttons, e.g., 'text-blue-600'
  buttonColor: string; // Tailwind class for button background, e.g., 'bg-blue-500'
  successMessage: LocalizedText;
}

export interface GameState {
  currentNumber: number;
  options: number[];
  score: number;
  isCorrect: boolean | null; // null = waiting, true = correct, false = wrong
  wrongGuess: number | null; // Track the specific wrong guess to shake it
}

export interface GeminiThemeResponse {
  themeNameEn: string;
  themeNameAr: string;
  emojiChar: string;
  backgroundColorClass: string;
  primaryColorClass: string;
  buttonColorClass: string;
  cheerMessageEn: string;
  cheerMessageAr: string;
}