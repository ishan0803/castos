import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-400">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-background border border-gray-700 rounded p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;