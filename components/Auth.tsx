
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, User, Briefcase, Sun, Moon, CloudRain, Thermometer, Wind, Zap, BrainCircuit, Globe, CloudLightning } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (name: string, email: string, role: UserRole) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Curated high-fidelity AI/Futuristic Smart City & Climate Visuals
const AI_VISUALS = [
  'https://images.unsplash.com/photo-1590055531615-f16d36fed8f4?auto=format&fit=crop&q=80&w=1920', // Massive Orbital Storm
  'https://images.unsplash.com/photo-1545464526-f3684a8964e7?auto=format&fit=crop&q=80&w=1920', // Thermal City Heatwave
  'https://images.unsplash.com/photo-1516912481808-340ff1b52f8d?auto=format&fit=crop&q=80&w=1920', // Coastal Cyclone Surge
  'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?auto=format&fit=crop&q=80&w=1920', // Heavy Monsoon Pluvial
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920'  // Global Data Shell
];

const Auth: React.FC<AuthProps> = ({ onLogin, isDarkMode, toggleDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [loading, setLoading] = useState(false);
  const [visualIndex, setVisualIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisualIndex((prev) => (prev + 1) % AI_VISUALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(name || 'Commander User', email || 'hq@indiaresilient.gov.in', role);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-inter text-white overflow-hidden">
      {/* LEFT SIDE: AI CLIMATE VISUALIZATION (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        {AI_VISUALS.map((img, idx) => (
          <div 
            key={img}
            className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out transform ${
              visualIndex === idx ? 'opacity-100 scale-105 rotate-0' : 'opacity-0 scale-125 -rotate-1'
            }`}
            style={{ 
              backgroundImage: `url(${img})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
            }}
          >
            {/* Neural Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
          </div>
        ))}

        {/* Dynamic Weather Data Overlay */}
        <div className="absolute top-12 left-12 z-20 space-y-4">
           <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl animate-in slide-in-from-top-10 duration-1000">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    <CloudLightning size={20} className="text-white" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Atmospheric Alert</p>
                    <p className="text-sm font-bold tracking-tight">Level 4 Cyclone detected</p>
                 </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-red-500 w-[84%] animate-[shimmer_2s_infinite]"></div>
              </div>
           </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-20 z-10">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]">
              <BrainCircuit size={14} className="animate-pulse" /> Live Climate Scan Node: 07
            </div>
            <h2 className="text-7xl font-black tracking-tighter italic leading-none max-w-lg drop-shadow-2xl">
              PREDICT <span className="text-emerald-400">DEFEND</span> <span className="text-blue-400">RESIST</span>
            </h2>
            <p className="text-slate-300 font-bold text-lg max-w-md leading-relaxed drop-shadow-md">
              Harnessing Neural Networks and Orbital GIS to fortify Indian Smart Cities against extreme climate events.
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weather Sensors</p>
                <p className="text-3xl font-black font-mono tracking-tighter">84,912</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Uptime</p>
                <p className="text-3xl font-black font-mono tracking-tighter text-emerald-400">99.9%</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GIS Precision</p>
                <p className="text-3xl font-black font-mono tracking-tighter">0.5m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-[scan_6s_infinite_linear] z-20" />
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
        {/* Mobile Background */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm"
            style={{ backgroundImage: `url(${AI_VISUALS[visualIndex]})` }}
          />
          <div className="absolute inset-0 bg-slate-950/95" />
        </div>

        <div className="w-full max-w-lg relative z-10">
          <header className="mb-12 flex justify-between items-start">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 transform -rotate-3 hover:rotate-0 transition-all duration-500">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tighter italic leading-none">INDIA<span className="text-emerald-400">RESILIENT</span></h1>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">AI Climate Command Center</p>
                </div>
             </div>
             <button onClick={toggleDarkMode} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-slate-400 hover:text-white">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </header>

          <div className="bg-slate-900/40 backdrop-blur-3xl p-10 lg:p-14 rounded-[3.5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group/form">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover/form:bg-emerald-500/20 transition-all duration-1000"></div>
            
            <div className="flex gap-4 mb-10 bg-black/40 p-2 rounded-2xl border border-white/5 relative z-10">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
              >
                Operational Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
              >
                Access Request
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Commanding Officer Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input 
                      type="text" required 
                      className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-700"
                      placeholder="Commander Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Agency Authorization ID</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input 
                    type="email" required 
                    className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-700"
                    placeholder="hq@agency.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Bio-Hash</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input 
                    type="password" required 
                    className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-700"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tactical Role</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <select 
                      className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-all font-black uppercase tracking-widest cursor-pointer"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      <option value={UserRole.CITIZEN}>Civic Participant</option>
                      <option value={UserRole.ADMIN}>Smart City Architect</option>
                      <option value={UserRole.OFFICER}>Disaster Management</option>
                    </select>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-[0.4em] text-[10px] py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Neural Verification...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Establish Command Link' : 'Register Operational Asset'}
                    <Zap size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600 relative z-10">
               <span className="flex items-center gap-2"><Globe size={10} /> Sector: India Central</span>
               <span className="text-emerald-500/60">Orbital Scan: Syncing</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Auth;
