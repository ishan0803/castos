import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

export default function NewProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    plot: '',
    budget: 10000000,
    industry: 'Hollywood'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/projects/run', form);
      navigate(`/project/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to run optimization.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-white relative">
      <div className="fixed inset-0 bg-noise opacity-20 z-0" />
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 border-t-2 border-r-2 border-[#E0AA3E] rounded-full animate-spin mb-8 mx-auto" />
        <h2 className="text-3xl font-serif font-bold animate-pulse text-[#E0AA3E]">INITIALIZING AGENTS</h2>
        <div className="mt-4 font-mono text-sm text-gray-400 space-y-1">
             <p>_loading semantic_analysis_module...</p>
             <p>_connecting to talent_database...</p>
             <p>_calibrating rl_model_v4...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-20">
      <div className="fixed inset-0 bg-grid pointer-events-none z-[-1]" />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-white">New Production</h1>
        <p className="text-gray-400 mb-10 font-mono text-sm border-l-2 border-[#E0AA3E] pl-4">
            INITIATE NEW CASTING SESSION // ENTER SCRIPT PARAMETERS
        </p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Script Input */}
          <div className="lg:col-span-2 space-y-8">
            <div className="group">
              <label className="block text-[#E0AA3E] font-mono text-xs uppercase tracking-wider mb-3">Project Title</label>
              <input 
                required
                className="w-full bg-[#0A0A0C] border border-white/10 rounded-none border-l-4 border-l-gray-700 p-4 text-2xl font-serif text-white focus:border-[#E0AA3E] focus:border-l-[#E0AA3E] outline-none transition-all placeholder:text-gray-700"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="UNTITLED PROJECT"
              />
            </div>
            
            <div className="group">
              <label className="block text-[#E0AA3E] font-mono text-xs uppercase tracking-wider mb-3">Script Synopsis</label>
              <textarea 
                required
                rows={12}
                className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl p-6 text-lg text-gray-300 focus:border-[#E0AA3E] outline-none transition-all placeholder:text-gray-800 leading-relaxed resize-none font-sans"
                value={form.plot}
                onChange={e => setForm({...form, plot: e.target.value})}
                placeholder="EXT. WASTELAND - DAY&#10;&#10;A lone wanderer discovers a hidden artifact..."
              />
            </div>
          </div>

          {/* Right Column: Parameters */}
          <div className="space-y-6">
             <div className="bg-[#111]/80 backdrop-blur-md p-6 rounded-xl border border-white/10 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E0AA3E] rounded-full" />
                    Constraints
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-500 text-xs font-mono uppercase mb-2">Total Budget Cap</label>
                        <input 
                        type="number"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded p-3 text-white font-mono focus:border-[#E0AA3E] outline-none"
                        value={form.budget}
                        onChange={e => setForm({...form, budget: Number(e.target.value)})}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 text-xs font-mono uppercase mb-2">Target Market</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Hollywood', 'Bollywood'].map((m) => (
                                <button 
                                    key={m}
                                    type="button"
                                    onClick={() => setForm({...form, industry: m})}
                                    className={`py-3 px-4 rounded border transition-all text-sm font-medium ${
                                        form.industry === m 
                                        ? 'border-[#E0AA3E] bg-[#E0AA3E]/10 text-[#E0AA3E]' 
                                        : 'border-white/10 bg-black/30 text-gray-500 hover:bg-white/5'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[#E0AA3E] text-black font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(224,170,62,0.2)] hover:shadow-[0_0_30px_rgba(224,170,62,0.4)] transition-all uppercase tracking-wide"
                        >
                            Launch Optimization
                        </motion.button>
                        <p className="text-center text-gray-600 text-xs mt-3 font-mono">
                            Est. Runtime: 3-5 Minutes
                        </p>
                    </div>
                </div>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}