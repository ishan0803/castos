import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// CHANGE: Extend HTMLMotionProps instead of ButtonHTMLAttributes to fix type conflict
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({ variant = 'primary', isLoading, children, className, ...props }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-black hover:shadow-[0_0_15px_rgba(224,170,62,0.4)]",
    secondary: "bg-surface border border-gray-700 text-white hover:border-gray-500",
    danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
}