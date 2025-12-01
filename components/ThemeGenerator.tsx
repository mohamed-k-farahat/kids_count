import React, { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTheme } from '../services/gemini';
import { Theme } from '../types';

interface ThemeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeGenerated: (theme: Theme) => void;
  currentPrimaryColor: string;
  lang: 'en' | 'ar';
}

export const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ 
  isOpen, 
  onClose, 
  onThemeGenerated,
  currentPrimaryColor,
  lang
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const texts = {
    en: {
      title: "Magic Theme Maker",
      subtitle: "What do you want to count today?",
      placeholder: "Type anything here...",
      example: "Try \"Dinosaurs\", \"Cupcakes\", or \"Cars\"",
      button: "Create Theme",
      loading: "Making Magic...",
      powered: "Powered by Google Gemini"
    },
    ar: {
      title: "صانع الثيمات السحري",
      subtitle: "ماذا تريد أن تعد اليوم؟",
      placeholder: "اكتب أي شيء هنا...",
      example: "جرب \"ديناصورات\"، \"كعك\"، أو \"سيارات\"",
      button: "إنشاء ثيم",
      loading: "جاري التحضير...",
      powered: "مدعوم من Google Gemini"
    }
  };

  const t = texts[lang];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const newTheme = await generateTheme(prompt);
    onThemeGenerated(newTheme);
    setLoading(false);
    onClose();
    setPrompt('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative overflow-hidden"
          >
            <button 
              onClick={onClose}
              className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100`}
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-3`}>
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 mx-1">
                  {t.example}
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg
                  flex items-center justify-center gap-2
                  ${loading || !prompt.trim() ? 'bg-gray-300' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'}
                  transition-all transform hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> {t.loading}
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> {t.button}
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">{t.powered}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};