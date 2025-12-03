import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({ children, className = "", hoverEffect = false }: CardProps) {
  return (
    <motion.div 
      whileHover={hoverEffect ? { scale: 1.01, y: -4, boxShadow: "0 10px 30px -10px rgba(224,170,62,0.15)" } : {}}
      className={`bg-surface border border-gray-800 rounded-lg p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}