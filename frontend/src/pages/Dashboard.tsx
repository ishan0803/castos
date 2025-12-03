import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Project } from '../api/types';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
// FIXED: Removed AlertCircle from imports, added AlertTriangle just in case you want to use it later, or simply keep it clean.
// For now, I am using AlertTriangle for failed states to ensure it is used.
import { Plus, LayoutDashboard, Film, TrendingUp, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = () => {
    api.get('/api/projects/')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); 
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)]">
        {/* Global Background Textures */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-[-1]" />
        <div className="fixed inset-0 bg-noise pointer-events-none opacity-20 z-[-1]" />
        
        {loading && projects.length === 0 ? (
            <div className="mt-20"><Loader text="Initializing Studio Environment..." /></div>
        ) : (
            <div className="space-y-10">
                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Studio Dashboard</h1>
                        <p className="text-gray-400 mt-2 font-mono text-sm">active_optimizations: {projects.length}</p>
                    </div>
                    {projects.length > 0 && (
                        <Link to="/new">
                            <Button className="rounded-full"><Plus size={20} /> New Project</Button>
                        </Link>
                    )}
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E0AA3E] to-transparent opacity-50" />
                        
                        <div className="w-24 h-24 bg-[#E0AA3E]/10 rounded-full flex items-center justify-center mb-6 text-[#E0AA3E] ring-1 ring-[#E0AA3E]/30 shadow-[0_0_30px_rgba(224,170,62,0.1)]">
                            <LayoutDashboard size={48} />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-2">Studio Offline</h3>
                        <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
                            No active productions found. Initialize the AI agent to begin casting simulation.
                        </p>
                        <Link to="/new">
                            <Button variant="primary" className="text-lg px-8 py-4 rounded-full shadow-[0_0_20px_rgba(224,170,62,0.2)] hover:shadow-[0_0_40px_rgba(224,170,62,0.4)] transition-all">
                                <Plus size={24} /> Initialize Project
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p, i) => (
                            <Link key={p.id} to={p.status === 'completed' ? `/project/${p.id}` : '#'}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="h-full"
                                >
                                    <div className={`h-full flex flex-col relative group rounded-xl border border-white/10 bg-[#0A0A0C] hover:border-[#E0AA3E]/50 transition-all duration-300 p-6 overflow-hidden ${p.status === 'pending' ? 'opacity-90' : ''}`}>
                                        
                                        {/* Hover Glow */}
                                        <div className="absolute -inset-px bg-gradient-to-r from-[#E0AA3E] to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-500" />
                                        
                                        <button 
                                            onClick={(e) => handleDelete(e, p.id)}
                                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-danger text-gray-500 hover:text-white rounded-full transition opacity-0 group-hover:opacity-100 z-20"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                {/* Status Icon Logic */}
                                                <div className={`p-2 rounded-lg ${
                                                    p.status === 'completed' ? 'bg-[#E0AA3E]/10 text-[#E0AA3E]' : 
                                                    p.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                    {p.status === 'completed' ? <Film size={20} /> : 
                                                     p.status === 'failed' ? <AlertTriangle size={20} /> :
                                                     <Clock size={20} className="animate-spin-slow" />}
                                                </div>
                                                <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
                                                    {new Date(p.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-[#E0AA3E] transition-colors line-clamp-1 font-serif">
                                                {p.title}
                                            </h3>
                                            
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                                                {p.status === 'pending' ? 'Neural networks analyzing script and scouting actors...' : p.plot}
                                            </p>

                                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500 font-mono">
                                                <div className="flex items-center gap-1">
                                                    {p.industry === 'Bollywood' ? 'BOL' : 'HOL'} / {p.budget_cap > 1000000 ? `${(p.budget_cap/1000000).toFixed(0)}M` : p.budget_cap}
                                                </div>
                                                {p.status === 'completed' ? (
                                                    <div className="flex items-center gap-1 text-[#2CB67D]">
                                                        <TrendingUp size={12} /> READY
                                                    </div>
                                                ) : p.status === 'failed' ? (
                                                    <span className="uppercase tracking-wider text-red-500">FAILED</span>
                                                ) : (
                                                    <span className="uppercase tracking-wider text-blue-400">PROCESSING</span>
                                                )}
                                            </div>
                                        </div>

                                        {p.status === 'pending' && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800">
                                                <div className="h-full bg-blue-500 animate-progress w-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
}