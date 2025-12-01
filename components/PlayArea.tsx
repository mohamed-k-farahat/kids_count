import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayAreaProps {
  count: number;
  emoji: string;
  isCorrect: boolean | null;
}

export const PlayArea: React.FC<PlayAreaProps> = ({ count, emoji, isCorrect }) => {
  // Generate a stable array for rendering based on count
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <div className="flex-1 flex items-center justify-center p-4 w-full max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-wrap justify-center content-center gap-4 sm:gap-8 max-w-3xl">
        <AnimatePresence mode='wait'>
          {items.map((i) => (
            <motion.div
              key={`${count}-${i}`}
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1,
                y: isCorrect ? [0, -20, 0] : 0 
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15, 
                delay: i * 0.05, // Stagger effect
                y: { duration: 0.5, repeat: isCorrect ? Infinity : 0, repeatDelay: 0.5 }
              }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl select-none cursor-pointer hover:scale-110 transition-transform"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
