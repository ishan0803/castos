import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, Database, DollarSign, Award, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Landing() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-20 z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E0AA3E] rounded-full blur-[180px] opacity-10" />
      
      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-mono text-[#E0AA3E] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#E0AA3E] animate-pulse" />
          V1.0 NOW LIVE
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.1]"
        >
          Casting, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#E0AA3E] to-[#8a6a26]">
            Solved by Silicon.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
        >
          Stop guessing. Start optimizing. CastOS combines <span className="text-white">Agentic AI</span> and <span className="text-white">Reinforcement Learning</span> to predict box office synergy and optimize production budgets in milliseconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/login">
            <Button className="px-8 py-4 text-lg bg-[#E0AA3E] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 rounded-full font-bold">
              Start Casting <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* --- UI SHOWCASE (Parallax) --- */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 mb-32">
        <motion.div 
          style={{ y: y1 }}
          className="relative rounded-xl border border-white/10 bg-[#0A0A0C]/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] group"
        >
          {/* Mockup UI Header */}
          <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-black/50">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
            <div className="ml-4 h-4 w-64 bg-white/5 rounded-full" />
          </div>
          {/* Mockup UI Content */}
          <div className="p-8 grid grid-cols-12 gap-6 h-full">
             <div className="col-span-3 border-r border-white/5 pr-6 space-y-4">
                <div className="h-8 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
             </div>
             <div className="col-span-9 space-y-6">
                <div className="flex gap-4">
                   <div className="h-32 w-1/3 bg-[#E0AA3E]/10 border border-[#E0AA3E]/30 rounded flex flex-col items-center justify-center">
                      <TrendingUp className="text-[#E0AA3E] mb-2" />
                      <span className="text-xs text-[#E0AA3E] font-mono">BOX OFFICE +24%</span>
                   </div>
                   <div className="h-32 w-1/3 bg-white/5 rounded" />
                   <div className="h-32 w-1/3 bg-white/5 rounded" />
                </div>
                <div className="h-full bg-gradient-to-b from-white/5 to-transparent rounded border border-white/5" />
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Intelligence, Built In.</h2>
          <p className="text-gray-400 max-w-xl text-lg">
            We replaced the "gut feeling" with millions of data points. CastOS treats movie production like a portfolio optimization problem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          <motion.div 
            style={{ y: y2 }}
            className="md:col-span-2 row-span-2 rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden group hover:border-[#E0AA3E]/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all" />
            <Brain className="w-10 h-10 text-[#E0AA3E] mb-4" />
            <h3 className="text-2xl font-bold mb-2">Agentic Scouting</h3>
            <p className="text-gray-400">
              Our autonomous AI agents scour the web, IMDb, and social signals to find actors that fit your script's exact traits—not just who you know.
            </p>
            <div className="mt-8 border-t border-white/10 pt-4 font-mono text-xs text-gray-500">
              &gt; Searching Database... <br />
              &gt; 45,000+ Profiles Analyzed <br />
              &gt; Synergy Match: 98.4%
            </div>
          </motion.div>

          <div className="rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden hover:bg-white/5 transition-colors">
            <DollarSign className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Budget Allocation</h3>
            <p className="text-gray-400 text-sm">
              Dynamically split your {`₹`}100Cr budget based on role impact. Never overpay for a supporting role again.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden hover:bg-white/5 transition-colors">
            <Database className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Historical Data</h3>
            <p className="text-gray-400 text-sm">
              Models trained on 50 years of Box Office data to predict financial risk and audience reception.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 mt-20 bg-[#0A0A0C] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-serif font-bold text-white mb-4 md:mb-0">
              Cast<span className="text-[#E0AA3E]">OS</span>
            </div>
            <div className="text-gray-500 text-sm flex gap-8">
                <span>© 2025 CastOS Inc.</span>
                <span className="flex items-center gap-2">
                    <Award size={14} className="text-[#E0AA3E]" /> 
                    Enterprise Security
                </span>
            </div>
        </div>
      </footer>
    </div>
  );
}