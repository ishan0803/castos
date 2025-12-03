import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Project, Character, Actor } from '../api/types';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { Download, ArrowLeft, Users, ChevronDown, ChevronUp } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#E0AA3E', '#2CB67D', '#EF476F', '#118AB2', '#073B4C', '#FFD166'];

export default function ProjectResult() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
        try {
            const res = await api.get(`/api/projects/${id}`);
            if (isMounted) {
                setProject(res.data);
                if (res.data.status === 'completed' || res.data.status === 'failed') {
                    setLoading(false);
                } else {
                    setTimeout(fetch, 3000); 
                }
            }
        } catch (e) { setLoading(false); }
    };
    fetch();
    return () => { isMounted = false; };
  }, [id]);

  const renderTraits = (traits: any) => {
    if (!traits) return 'N/A';
    const traitStr = Array.isArray(traits) ? traits.join(', ') : String(traits);
    return traitStr.length > 30 ? `${traitStr.substring(0, 30)}...` : traitStr;
  };

  if (loading || (project && project.status === 'pending')) return (
    <div className="h-[60vh] flex flex-col items-center justify-center relative">
        <div className="fixed inset-0 bg-noise opacity-20 z-[-1]" />
        <Loader text="AI Optimizing Cast..." />
        <p className="text-gray-500 mt-4 text-sm animate-pulse font-mono">_running rl_model.py</p>
    </div>
  );
  
  if (!project || project.status === 'failed') return <div className="text-danger text-center mt-20 font-mono">Optimization Failed. Please try creating a new project.</div>;

  const totalCost = project.optimization_result.reduce((acc, curr) => acc + curr.salary, 0);
  const remaining = project.budget_cap - totalCost;
  const currency = project.industry === 'Bollywood' ? '₹' : '$';
  
  const costData = project.optimization_result.map(r => ({ name: r.role, value: r.salary }));
  const ratingData = project.optimization_result.map(r => ({ name: r.actor_name, rating: r.rating }));

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="fixed inset-0 bg-grid pointer-events-none z-[-1]" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-20 z-[-1]" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <Link to="/dashboard" className="text-gray-400 hover:text-[#E0AA3E] flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-serif font-bold text-white">{project.title}</h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-400 font-mono">
             <span>{project.industry}</span>
             <span>|</span>
             <span>BUDGET: {currency}{project.budget_cap.toLocaleString()}</span>
          </div>
        </div>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download size={18} /> Export Report
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111]/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Budget Distribution</h3>
              <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie 
                            data={costData} 
                            cx="50%" cy="50%" 
                            innerRadius={60} 
                            outerRadius={100} 
                            paddingAngle={5} 
                            dataKey="value"
                            stroke="none"
                          >
                              {costData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0C', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                            itemStyle={{ color: '#E0AA3E' }}
                            formatter={(value: number) => `${currency}${value.toLocaleString()}`}
                          />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-[#111]/50 backdrop-blur border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Actor Ratings & Synergy</h3>
              <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                          <XAxis type="number" domain={[0, 10]} hide />
                          <YAxis dataKey="name" type="category" width={120} tick={{fill: '#666', fontSize: 11, fontFamily: 'monospace'}} />
                          <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#0A0A0C', borderColor: '#333', borderRadius: '8px' }}
                          />
                          <Bar dataKey="rating" fill="#E0AA3E" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* List */}
      <div className="rounded-xl border border-white/10 bg-[#111]/50 backdrop-blur overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Cast Manifest</h2>
          <div className={`text-sm font-mono font-bold px-3 py-1 rounded border ${remaining >= 0 ? 'border-green-900 bg-green-900/20 text-[#2CB67D]' : 'border-red-900 bg-red-900/20 text-[#EF476F]'}`}>
             {remaining >= 0 ? 'UNDER BUDGET' : 'OVER BUDGET'}: {currency}{Math.abs(remaining).toLocaleString()}
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {project.optimization_result.map((row, idx) => {
            const charDetails = project.raw_characters?.characters?.find((c: Character) => c.name === row.role);
            const isExpanded = expandedRole === row.role;

            return (
              <div key={idx} className="hover:bg-white/5 transition">
                <div 
                    className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center cursor-pointer"
                    onClick={() => setExpandedRole(isExpanded ? null : row.role)}
                >
                    <div className="md:col-span-3">
                        <div className="font-bold text-white text-lg font-serif">{row.role}</div>
                        <div className="text-xs text-gray-500 mt-1 flex gap-2 font-mono">
                             <span className="text-[#E0AA3E]">{charDetails?.gender || 'N/A'}</span>
                             <span className="text-gray-600">|</span>
                             <span>{renderTraits(charDetails?.traits)}</span>
                        </div>
                    </div>
                    
                    <div className="md:col-span-3 text-white text-xl flex items-center gap-2">
                         {row.actor_name}
                    </div>

                    <div className="md:col-span-2 text-right font-mono text-gray-400 text-sm">
                        {currency}{row.salary.toLocaleString()}
                    </div>

                    <div className="md:col-span-2 text-center">
                        <span className="inline-block px-2 py-0.5 border border-[#E0AA3E]/30 text-[#E0AA3E] rounded text-xs font-bold bg-[#E0AA3E]/10">
                            {row.rating.toFixed(1)} ★
                        </span>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        {isExpanded ? <ChevronUp className="text-gray-600" size={18} /> : <ChevronDown className="text-gray-600" size={18} />}
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && charDetails && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/40 border-t border-white/5 overflow-hidden"
                        >
                            <div className="p-6">
                                <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2 font-mono">
                                    <Users size={14} /> Alternative Candidates
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {charDetails.actors.map((candidate: Actor, cIdx: number) => (
                                        <div 
                                            key={cIdx} 
                                            className={`p-3 rounded border flex justify-between items-center transition-all ${candidate.name === row.actor_name ? 'border-[#E0AA3E] bg-[#E0AA3E]/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                        >
                                            <div>
                                                <div className={`font-bold ${candidate.name === row.actor_name ? 'text-[#E0AA3E]' : 'text-gray-300'}`}>
                                                    {candidate.name}
                                                </div>
                                                <div className="text-xs text-gray-600 font-mono mt-1">
                                                    BO: {currency}{candidate.box_office.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-mono text-gray-400">{currency}{candidate.salary.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}