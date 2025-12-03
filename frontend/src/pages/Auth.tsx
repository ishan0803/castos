import { SignIn, SignUp } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, TrendingUp, Shield } from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  // Check URL for mode=signup, default to signin
  const isSignUp = searchParams.get("mode") === "signup";

  // Common styling for Clerk components to match "Cinematic Noir" theme
  const clerkAppearance = {
    variables: {
      colorPrimary: '#E0AA3E', // Gold
      colorBackground: '#111111', // Dark Gray
      colorText: '#ffffff',
      colorInputBackground: '#0A0A0C', // Black
      colorInputText: '#ffffff',
      colorTextSecondary: '#9ca3af',
      fontFamily: '"Inter", sans-serif',
      borderRadius: '12px',
    },
    elements: {
      card: "shadow-none border border-white/10 bg-[#111]/50 backdrop-blur-xl w-full max-w-md",
      headerTitle: "font-serif text-3xl font-bold text-white",
      headerSubtitle: "text-gray-400 font-mono text-xs uppercase tracking-wider",
      socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all",
      dividerLine: "bg-white/10",
      dividerText: "text-gray-500 font-mono text-xs",
      formFieldLabel: "text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",
      formFieldInput: "bg-black/50 border border-white/10 focus:border-[#E0AA3E] transition-all text-white",
      formButtonPrimary: "bg-[#E0AA3E] hover:bg-[#c29232] text-black font-bold normal-case text-sm shadow-[0_0_20px_rgba(224,170,62,0.2)] hover:shadow-[0_0_30px_rgba(224,170,62,0.4)] transition-all",
      footerActionLink: "text-[#E0AA3E] hover:text-white font-bold",
      identityPreviewText: "text-white",
      identityPreviewEditButton: "text-[#E0AA3E]",
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#050505] overflow-hidden">
      {/* LEFT: Cinematic Visuals */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 border-r border-white/10">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="absolute inset-0 bg-noise pointer-events-none opacity-20" />
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#E0AA3E] rounded-full blur-[200px] opacity-5" />

        <div className="relative z-10 max-w-lg text-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="w-24 h-24 bg-[#E0AA3E]/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-[#E0AA3E]/30 shadow-[0_0_40px_rgba(224,170,62,0.15)]"
            >
               <Film size={40} className="text-[#E0AA3E]" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-serif font-bold text-white mb-6"
            >
              Cast<span className="text-[#E0AA3E]">OS</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 leading-relaxed mb-12"
            >
              The operating system for modern production. Intelligence, budgeting, and casting—unified.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="grid grid-cols-2 gap-4"
            >
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2 text-[#E0AA3E]">
                     <TrendingUp size={16} />
                     <span className="font-mono text-xs font-bold uppercase">Optimization</span>
                  </div>
                  <div className="text-left text-sm text-gray-400">Maximize budget efficiency with RL models.</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2 text-[#E0AA3E]">
                     <Shield size={16} />
                     <span className="font-mono text-xs font-bold uppercase">Enterprise</span>
                  </div>
                  <div className="text-left text-sm text-gray-400">Bank-grade security for your scripts.</div>
               </div>
            </motion.div>
        </div>
      </div>

      {/* RIGHT: Auth Form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12">
         {/* Mobile Background Elements */}
         <div className="absolute inset-0 bg-grid lg:hidden pointer-events-none opacity-20" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E0AA3E] rounded-full blur-[150px] opacity-5 pointer-events-none" />

         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
         >
            {isSignUp ? (
                <SignUp 
                    redirectUrl="/dashboard" 
                    signInUrl="/login"
                    appearance={clerkAppearance}
                />
            ) : (
                <SignIn 
                    redirectUrl="/dashboard" 
                    signUpUrl="/login?mode=signup"
                    appearance={clerkAppearance}
                />
            )}
         </motion.div>
         
         <div className="absolute bottom-8 text-center w-full text-xs text-gray-600 font-mono uppercase tracking-widest">
            Protected by CastOS Identity
         </div>
      </div>
    </div>
  );
}