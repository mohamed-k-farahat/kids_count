import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Settings, RefreshCcw, Star, Play, Home, Languages, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayArea } from './components/PlayArea';
import { NumberButton } from './components/NumberButton';
import { ThemeGenerator } from './components/ThemeGenerator';
import { Theme, GameState } from './types';
import { DEFAULT_THEME, PRESET_THEMES } from './services/gemini';
import { playSound } from './services/audio';

// Game Configuration
const QUESTIONS_PER_LEVEL = 3;

// Language Translations
const TEXTS = {
  en: {
    start: "START PLAYING",
    level: "Level",
    howMany: "How many",
    skip: "Skip",
    settings: "Settings",
    title: "Little Counters",
    magic: "Magic"
  },
  ar: {
    start: "ابدأ اللعب",
    level: "المستوى",
    howMany: "كم عدد الـ",
    skip: "تخطي",
    settings: "الإعدادات",
    title: "العداد الصغير",
    magic: "السحري"
  }
};

// Helper to convert number to Arabic numerals
const toArabicDigits = (n: number): string => {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

// Helper to get random number between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0); // Correct answers in current level
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    currentNumber: 1,
    options: [],
    score: 0,
    isCorrect: null,
    wrongGuess: null,
  });

  const getDifficultyRange = (currentLevel: number) => {
    if (currentLevel === 1) return { min: 1, max: 3 };
    if (currentLevel === 2) return { min: 1, max: 5 };
    return { min: 1, max: 9 };
  };

  const generateNewRound = useCallback(() => {
    const { min, max } = getDifficultyRange(level);
    const newNumber = randomInt(min, max);
    
    // Generate 2 wrong answers
    const wrongOptions = new Set<number>();
    const rangeSize = max - min;
    const needed = Math.min(2, rangeSize); 
    
    while (wrongOptions.size < needed) {
      const r = randomInt(min, max);
      if (r !== newNumber) wrongOptions.add(r);
    }
    
    const options = shuffle([newNumber, ...Array.from(wrongOptions)]);
    
    setGameState(prev => ({
      ...prev,
      currentNumber: newNumber,
      options,
      isCorrect: null,
      wrongGuess: null,
    }));

  }, [level, theme, lang, soundEnabled]);

  // Init game round when entering game screen or changing level
  useEffect(() => {
    if (screen === 'game') {
      generateNewRound();
    }
  }, [screen, generateNewRound]);

  // Update theme based on level (if not manually overridden)
  useEffect(() => {
    const themeIndex = (level - 1) % PRESET_THEMES.length;
    setTheme(PRESET_THEMES[themeIndex]);
  }, [level]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
    if (soundEnabled) playSound('pop');
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const startGame = () => {
    if (soundEnabled) playSound('pop');
    setLevel(1);
    setLevelProgress(0);
    setGameState(prev => ({ ...prev, score: 0 }));
    setScreen('game');
  };

  const goHome = () => {
    if (soundEnabled) playSound('pop');
    setScreen('menu');
  };

  const handleGuess = (number: number) => {
    if (gameState.isCorrect) return;

    if (number === gameState.currentNumber) {
      // Correct!
      if (soundEnabled) {
        playSound('correct');
      }

      const newScore = gameState.score + 1;
      const newProgress = levelProgress + 1;
      
      setGameState(prev => ({ ...prev, isCorrect: true, score: newScore }));
      setLevelProgress(newProgress);
      
      // Confetti Effect
      const count = 200;
      const defaults = { origin: { y: 0.7 }, zIndex: 100 };
      
      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      // Level Up Check
      setTimeout(() => {
        if (newProgress >= QUESTIONS_PER_LEVEL) {
          // Level Up!
          if (soundEnabled) playSound('levelUp');
          setLevel(l => l + 1);
          setLevelProgress(0);
        } else {
          generateNewRound();
        }
      }, 2000); 
    } else {
      // Incorrect
      if (soundEnabled) playSound('wrong');
      setGameState(prev => ({ ...prev, wrongGuess: number }));
      setTimeout(() => {
        setGameState(prev => ({ ...prev, wrongGuess: null }));
      }, 500);
    }
  };

  const handleThemeGenerated = (newTheme: Theme) => {
    setTheme(newTheme);
    generateNewRound();
  };

  const t = TEXTS[lang];
  const isRtl = lang === 'ar';

  // --- MENU SCREEN ---
  if (screen === 'menu') {
    return (
      <div 
        dir={isRtl ? 'rtl' : 'ltr'} 
        className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4 overflow-hidden relative"
      >
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce delay-100 opacity-50">🍎</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-bounce delay-700 opacity-50">🍌</div>
        <div className="absolute top-40 right-20 text-5xl animate-bounce delay-300 opacity-50">🍇</div>
        <div className="absolute bottom-40 left-20 text-6xl animate-bounce delay-500 opacity-50">🍊</div>
        
        {/* Settings Corner */}
        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} flex gap-3 z-20`}>
          <button 
            onClick={toggleLanguage}
            className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg text-sky-600 hover:scale-110 transition-transform font-bold"
          >
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
          <button 
            onClick={toggleSound}
            className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg text-sky-600 hover:scale-110 transition-transform"
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border-4 border-sky-200 z-10"
        >
          <div className="mb-6 inline-block p-4 rounded-full bg-sky-200 text-sky-600">
            <Star size={48} className="fill-current" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-600 mb-2 tracking-tight">
            {t.title}
          </h1>
          <h2 className="text-2xl font-semibold text-sky-400 mb-10">{t.magic}</h2>

          <button
            onClick={startGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <Play size={32} className={`fill-current ${isRtl ? 'rotate-180' : ''}`} />
            {t.start}
          </button>
        </motion.div>
      </div>
    );
  }

  // --- GAME SCREEN ---
  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen ${theme.bgColor} transition-colors duration-1000 flex flex-col selection:bg-transparent`}
    >
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <button 
              onClick={goHome}
              className={`p-2 rounded-full bg-white/50 hover:bg-white shadow-sm ${theme.primaryColor} transition-all`}
            >
               <Home size={24} />
            </button>
          <div className={`px-4 py-2 rounded-full bg-white shadow-sm ${theme.primaryColor} font-bold text-lg flex items-center gap-2`}>
             <span>{t.level} {isRtl ? toArabicDigits(level) : level}</span>
             <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${theme.buttonColor} transition-all duration-500`} 
                  style={{ width: `${(levelProgress / QUESTIONS_PER_LEVEL) * 100}%`, transformOrigin: isRtl ? 'right' : 'left' }}
                />
             </div>
          </div>
        </div>

        <div className="flex gap-2">
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mr-2 ${theme.primaryColor}`}>
              <Star className="fill-current" size={20} />
              <span className="font-bold">{isRtl ? toArabicDigits(gameState.score) : gameState.score}</span>
            </div>

            <button 
              onClick={generateNewRound}
              className="p-3 bg-white rounded-full shadow-sm text-gray-400 hover:text-blue-500 transition-colors"
              title={t.skip}
            >
              <RefreshCcw size={24} className={isRtl ? '-scale-x-100' : ''} />
            </button>
            <button 
              onClick={() => setIsThemeModalOpen(true)}
              className="p-3 bg-white rounded-full shadow-sm text-gray-400 hover:text-purple-500 transition-colors"
              title={t.settings}
            >
              <Settings size={24} />
            </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-between pb-8">
        
        {/* Title / Instruction */}
        <div className="text-center mt-4 sm:mt-8 px-4">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={`${theme.name.en}-${lang}`} // Re-render when lang changes
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme.primaryColor} transition-colors`}
            >
              {gameState.isCorrect 
                ? (lang === 'en' ? theme.successMessage.en : theme.successMessage.ar)
                : `${t.howMany} ${lang === 'en' ? theme.name.en : theme.name.ar}${lang === 'en' ? '?' : '؟'}`
              }
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Object Display */}
        <PlayArea 
          count={gameState.currentNumber} 
          emoji={theme.emoji} 
          isCorrect={gameState.isCorrect}
        />

        {/* Controls */}
        <div className="w-full px-4 mb-4 sm:mb-12">
           <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 flex-row-reverse sm:flex-row"> 
             {gameState.options.map((num) => (
               <NumberButton 
                 key={num}
                 number={num}
                 label={isRtl ? toArabicDigits(num) : num}
                 onClick={handleGuess}
                 colorClass={theme.buttonColor}
                 disabled={gameState.isCorrect === true}
                 isWrong={gameState.wrongGuess === num}
                 isSuccess={gameState.isCorrect === true && num === gameState.currentNumber}
               />
             ))}
           </div>
        </div>

      </main>

      {/* Modals */}
      <ThemeGenerator 
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onThemeGenerated={handleThemeGenerated}
        currentPrimaryColor={theme.primaryColor}
        lang={lang}
      />
      
    </div>
  );
}