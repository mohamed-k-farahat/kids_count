import React from 'react';
import { motion } from 'framer-motion';

interface NumberButtonProps {
  number: number;
  label: string | number;
  onClick: (n: number) => void;
  colorClass: string;
  disabled: boolean;
  isWrong: boolean;
  isSuccess: boolean;
}

export const NumberButton: React.FC<NumberButtonProps> = ({ 
  number, 
  label,
  onClick, 
  colorClass, 
  disabled, 
  isWrong,
  isSuccess
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={
        isWrong 
          ? { x: [-6, 6, -6, 6, 0], rotate: [0, -3, 3, 0] } 
          : isSuccess 
            ? { 
                scale: [1, 1.2, 1.1], 
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5, ease: "easeOut" }
              }
            : {}
      }
      transition={isWrong ? { duration: 0.4 } : {}}
      onClick={() => onClick(number)}
      disabled={disabled}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 
        rounded-full shadow-lg border-b-8 border-black/10
        flex items-center justify-center
        text-4xl sm:text-5xl md:text-6xl font-bold text-white
        transition-all duration-300
        ${isSuccess ? 'bg-green-500 !opacity-100 ring-4 ring-green-200' : colorClass}
        ${(disabled && !isSuccess) ? 'opacity-40 cursor-not-allowed scale-95 grayscale-[0.5]' : 'cursor-pointer hover:brightness-110'}
      `}
    >
      {label}
    </motion.button>
  );
};