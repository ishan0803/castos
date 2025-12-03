import { useUser, UserProfile } from '@clerk/clerk-react';
import { Shield, CreditCard, Bell, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user } = useUser();

  const sections = [
    { icon: <Shield size={18} />, label: "Security & Login", active: true },
    { icon: <CreditCard size={18} />, label: "Billing & Plans", active: false },
    { icon: <Bell size={18} />, label: "Notifications", active: false },
  ];

  return (
    <div className="relative min-h-[calc(100vh-100px)]">
      {/* Global Backgrounds */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-[-1]" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-20 z-[-1]" />

      <div className="max-w-6xl mx-auto pt-8">
        <div className="mb-10 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Studio Settings</h1>
          <p className="text-gray-400 font-mono text-sm">/ config / profile_management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4 font-mono">
                System Preferences
             </div>
             {sections.map((s, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${s.active ? 'bg-[#E0AA3E]/10 text-[#E0AA3E] border border-[#E0AA3E]/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                   <div className="flex items-center gap-3">
                      {s.icon}
                      {s.label}
                   </div>
                   {s.active && <ChevronRight size={14} />}
                </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
             {/* Profile Header Card */}
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111]/80 backdrop-blur-md rounded-xl border border-white/10 p-8 flex items-center gap-6 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#E0AA3E]/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                   <img 
                      src={user?.imageUrl} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full border-2 border-[#E0AA3E] shadow-[0_0_20px_rgba(224,170,62,0.2)]"
                   />
                </div>
                <div className="relative z-10">
                   <h2 className="text-2xl font-bold text-white font-serif">{user?.fullName}</h2>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400 font-mono">{user?.primaryEmailAddress?.emailAddress}</span>
                      <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                         Active
                      </span>
                   </div>
                </div>
             </motion.div>

             {/* Clerk Component Wrapper */}
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0A0A0C] border border-white/10 rounded-xl overflow-hidden"
             >
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2 text-sm font-bold text-white">
                   <User size={16} className="text-[#E0AA3E]" /> 
                   ACCOUNT DATA
                </div>
                
                <div className="p-8">
                   {/* Clerk's pre-built component. 
                     We wrap it in a custom class to force dark mode styles via CSS if needed, 
                     though we already set variables in the <ClerkProvider> theme.
                   */}
                   <div className="clerk-dark-mode-override">
                      <UserProfile 
                         appearance={{
                            variables: {
                               colorPrimary: '#E0AA3E',
                               colorBackground: '#0A0A0C',
                               colorText: '#ffffff',
                               colorInputBackground: '#16161A',
                               colorInputText: '#ffffff',
                               colorTextSecondary: '#9ca3af',
                            },
                            elements: {
                               card: "shadow-none border-none bg-transparent w-full",
                               navbar: "hidden", // Hide Clerk's sidebar since we built our own
                               headerTitle: "hidden",
                               headerSubtitle: "hidden",
                               view: "p-0",
                               formButtonPrimary: "bg-[#E0AA3E] hover:bg-[#c29232] text-black font-bold normal-case",
                               formButtonReset: "text-gray-400 hover:text-white hover:bg-white/5",
                            }
                         }} 
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}