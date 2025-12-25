
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { 
  AlertTriangle, 
  Wind, 
  Droplets, 
  Thermometer, 
  Map as MapIcon, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Settings,
  User,
  LogOut,
  RefreshCcw,
  Zap,
  CheckCircle2,
  Sun,
  Moon,
  BrainCircuit,
  Maximize2,
  ListFilter,
  Eye,
  Camera,
  Volume2,
  TrendingDown,
  Building2,
  Users,
  Ambulance,
  Factory
} from 'lucide-react';
import { CityData, Alert, User as UserType, UserRole, AlertType, AlertSeverity, ViewType } from '../types';
import { INDIAN_CITIES, INITIAL_ALERTS, SAFETY_PROTOCOLS, AI_ASSET_LIBRARY } from '../constants';
import ClimateMap from './ClimateMap';
import { predictResilience } from '../services/geminiService';
import { fetchAllCitiesWeather, WeatherData } from '../services/weatherService';
import { speakAlert } from '../services/voiceService';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const THRESHOLDS = {
  HEATWAVE_TEMP: 42,
  HEATWAVE_AI_RISK: 85,
  FLOOD_AI_PROB: 80,
  FLOOD_RAIN_SIM: 200,
  CYCLONE_WIND_SPEED: 15
};

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, isDarkMode, toggleDarkMode }) => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [selectedCity, setSelectedCity] = useState<CityData>(INDIAN_CITIES[0]);
  const [alerts, setAlerts] = useState<Alert[]>(() => INITIAL_ALERTS);
  const [simulationMode, setSimulationMode] = useState(false);
  const [rainFactor, setRainFactor] = useState(0);
  const [tempFactor, setTempFactor] = useState(0);
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [cityWeatherMap, setCityWeatherMap] = useState<Record<string, WeatherData>>({});
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const spokenAlertIds = useRef<Set<string>>(new Set());
  const currentWeather = cityWeatherMap[selectedCity.id];

  const handleVoiceBriefing = async (alert: Alert) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    await speakAlert(`${alert.severity} ${alert.type} in ${alert.city}. ${alert.message}`);
    setIsSpeaking(false);
  };

  useEffect(() => {
    const syncAllCities = async () => {
      setIsSyncingAll(true);
      const weatherData = await fetchAllCitiesWeather(INDIAN_CITIES);
      setCityWeatherMap(weatherData);
      setIsSyncingAll(false);
    };
    syncAllCities();
    const interval = setInterval(syncAllCities, 600000); // 10 minute refresh
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePredict = async () => {
      setLoadingAi(true);
      const res = await predictResilience(selectedCity, { rainfall: rainFactor, tempRise: tempFactor }, currentWeather);
      setPrediction(res);
      setLoadingAi(false);
    };
    if (simulationMode || currentWeather) handlePredict();
  }, [selectedCity, simulationMode, rainFactor, tempFactor, currentWeather]);

  useEffect(() => {
    if (!currentWeather && !prediction) return;
    const newAlerts: Alert[] = [];
    const currentTemp = (currentWeather?.temp || selectedCity.temp) + tempFactor;
    const liveRain = currentWeather?.rain ?? selectedCity.rainfall;
    const totalRain = liveRain + rainFactor;
    
    const isHeatwave = currentTemp >= THRESHOLDS.HEATWAVE_TEMP || (prediction?.heatwaveRisk >= THRESHOLDS.HEATWAVE_AI_RISK);
    const isFlood = totalRain >= THRESHOLDS.FLOOD_RAIN_SIM || (prediction?.floodProbability >= THRESHOLDS.FLOOD_AI_PROB);

    if (isHeatwave) {
      const library = AI_ASSET_LIBRARY[AlertType.HEATWAVE];
      const randomImg = library[Math.floor(Math.random() * library.length)];
      const id = `dynamic-heat-${selectedCity.id}`;
      const severity = currentTemp > 45 ? AlertSeverity.SEVERE : AlertSeverity.HIGH;
      
      const alert: Alert = {
        id,
        city: selectedCity.name,
        type: AlertType.HEATWAVE,
        severity,
        message: `Hazardous Heat Index: ${currentTemp.toFixed(1)}°C. High probability of thermal stress detected via neural scan.`,
        instructions: SAFETY_PROTOCOLS[AlertType.HEATWAVE],
        timestamp: new Date(),
        active: true,
        aiImageUrl: randomImg
      };
      newAlerts.push(alert);

      if (severity === AlertSeverity.SEVERE && !spokenAlertIds.current.has(id)) {
        spokenAlertIds.current.add(id);
        handleVoiceBriefing(alert);
      }
    }

    if (isFlood) {
      const library = AI_ASSET_LIBRARY[AlertType.FLOOD];
      const randomImg = library[Math.floor(Math.random() * library.length)];
      const id = `dynamic-flood-${selectedCity.id}`;
      
      const alert: Alert = {
        id,
        city: selectedCity.name,
        type: AlertType.FLOOD,
        severity: AlertSeverity.HIGH,
        message: `Inundation detected (${totalRain.toFixed(0)}mm total impact). High precision satellite scans confirm significant water accumulation in ${selectedCity.name}.`,
        instructions: SAFETY_PROTOCOLS[AlertType.FLOOD],
        timestamp: new Date(),
        active: true,
        aiImageUrl: randomImg
      };
      newAlerts.push(alert);

      if (!spokenAlertIds.current.has(id)) {
        spokenAlertIds.current.add(id);
        handleVoiceBriefing(alert);
      }
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const filtered = prev.filter(a => !a.id.startsWith('dynamic-') || a.city !== selectedCity.name);
        return [...newAlerts, ...filtered];
      });
    }
  }, [currentWeather, prediction, selectedCity, rainFactor, tempFactor]);

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const impactData = useMemo(() => {
    if (!prediction) return [];
    const base = prediction.floodProbability + prediction.heatwaveRisk;
    return [
      { name: 'Infrastructure', score: Math.round(base * 0.4), color: '#3b82f6' },
      { name: 'Public Health', score: Math.round(prediction.heatwaveRisk * 0.8), color: '#ef4444' },
      { name: 'Agriculture', score: Math.round((prediction.floodProbability + prediction.heatwaveRisk) * 0.35), color: '#10b981' },
      { name: 'Transport', score: Math.round(prediction.floodProbability * 0.9), color: '#f59e0b' },
      { name: 'Energy Grid', score: Math.round(prediction.heatwaveRisk * 0.7), color: '#8b5cf6' },
    ];
  }, [prediction]);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-inter selection:bg-emerald-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-24 lg:w-72 bg-slate-900 border-r border-white/5 flex flex-col z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 transform rotate-3 hover:rotate-0 transition-all duration-500">
            <ShieldCheck size={28} />
          </div>
          <div className="hidden lg:block">
            <h2 className="font-black text-xl tracking-tighter">HQ NODE</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Operative</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-4">
          <NavItem icon={<Activity size={20} />} label="Tactical Dashboard" active={currentView === ViewType.DASHBOARD} onClick={() => setCurrentView(ViewType.DASHBOARD)} />
          <NavItem icon={<MapIcon size={20} />} label="GIS Satellite Map" active={currentView === ViewType.GIS} onClick={() => setCurrentView(ViewType.GIS)} />
          <NavItem icon={<TrendingDown size={20} />} label="Impact Analysis" active={currentView === ViewType.IMPACT} onClick={() => setCurrentView(ViewType.IMPACT)} />
          <NavItem icon={<Bell size={20} />} label="AI Alerts Center" active={currentView === ViewType.ALERTS} onClick={() => setCurrentView(ViewType.ALERTS)} count={activeAlertsCount} />
          <div className="pt-8 opacity-20"><div className="h-px bg-white mx-4"></div></div>
          {user.role !== UserRole.CITIZEN && (
            <NavItem icon={<Settings size={20} />} label="System Config" onClick={() => {}} />
          )}
        </nav>

        <div className="p-6 bg-slate-800/50 m-4 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-emerald-400">
               <User size={20} />
             </div>
             <div className="hidden lg:block overflow-hidden">
               <p className="text-sm font-bold truncate uppercase">{user.name}</p>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter truncate">{user.email}</p>
             </div>
          </div>
          <button onClick={onLogout} className="mt-6 w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 relative">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">{currentView}</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Terminal Connected: {selectedCity.name}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right mr-4">
               <div className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">
                 {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
               </div>
               <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Local Terminal Time</div>
            </div>
            
            <button onClick={toggleDarkMode} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl">
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             <div className="h-10 w-px bg-white/10" />
             
             {isSyncingAll && (
               <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl animate-pulse">
                 <RefreshCcw size={14} className="animate-spin" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Neural Sync</span>
               </div>
             )}
          </div>
        </header>

        <div className="p-10">
          {currentView === ViewType.DASHBOARD && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Live Temperature" value={currentWeather ? `${Math.round(currentWeather.temp + tempFactor)}°C` : '...'} icon={<Thermometer className="text-orange-500" />} sub={currentWeather?.description || "Syncing..."} alert={((currentWeather?.temp || 0) + tempFactor) >= THRESHOLDS.HEATWAVE_TEMP} trend="Sensor Net" />
                <StatCard label="GIS Humidity" value={currentWeather ? `${currentWeather.humidity}%` : '...'} icon={<Droplets className="text-blue-500" />} sub="Moisture Index" alert={currentWeather?.humidity && currentWeather.humidity > 80} trend="Live Atmos" />
                <StatCard label="Wind Velocity" value={currentWeather ? `${currentWeather.windSpeed} m/s` : '...'} icon={<Wind className="text-cyan-500" />} sub="Kinetic Status" alert={currentWeather?.windSpeed && currentWeather.windSpeed > THRESHOLDS.CYCLONE_WIND_SPEED} trend="Orbital" />
                <StatCard label="Resilience Node" value={prediction ? `${prediction.resilienceScore}%` : "64%"} icon={<Zap className="text-yellow-500" />} sub="Readiness Score" alert={false} trend="AI Dynamic" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                  <div className="h-[550px] relative group">
                    <ClimateMap cities={INDIAN_CITIES} selectedCity={selectedCity} onCitySelect={setSelectedCity} simulationMode={simulationMode} rainFactor={rainFactor} tempFactor={tempFactor} cityWeatherMap={cityWeatherMap} />
                    <button onClick={() => setCurrentView(ViewType.GIS)} className="absolute bottom-6 left-6 bg-slate-950/90 backdrop-blur-xl p-5 rounded-[2rem] text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-[1001] flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl">
                      <Maximize2 size={18} /> Deep Satellite Scan
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Regional Focus</h3>
                    <select 
                      className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                      value={selectedCity.id}
                      onChange={(e) => setSelectedCity(INDIAN_CITIES.find(c => c.id === e.target.value)!)}
                    >
                      {INDIAN_CITIES.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-950">{c.name} // Sector {c.state.substring(0,2).toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(16,185,129,0.03)] backdrop-blur-md">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-3">
                         <BrainCircuit className="text-emerald-400" /> Neural Predictor
                      </h3>
                      <button onClick={() => setSimulationMode(!simulationMode)} className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${simulationMode ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800 text-slate-400'}`}>
                         {simulationMode ? 'ACTIVE SIM' : 'OFFLINE'}
                       </button>
                    </div>

                    <div className="space-y-10">
                       <SimulationControl label="Thermal Perturbation" value={tempFactor} unit="°C" min={0} max={15} step={0.5} onChange={setTempFactor} active={simulationMode} color="orange" />
                       <SimulationControl label="Pluvial Impact" value={rainFactor} unit="mm" min={0} max={500} step={10} onChange={setRainFactor} active={simulationMode} color="blue" />
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/10">
                       {loadingAi ? (
                         <div className="flex flex-col items-center py-8 gap-5">
                           <div className="w-12 h-12 border-[5px] border-emerald-500 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Computing Risk Vectors</p>
                         </div>
                       ) : prediction && (
                         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                           <div className="grid grid-cols-2 gap-5">
                             <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Flood Risk</p>
                               <p className="text-3xl font-black text-blue-400 font-mono tracking-tighter">{prediction.floodProbability}%</p>
                             </div>
                             <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Heat Stress</p>
                               <p className="text-3xl font-black text-orange-400 font-mono tracking-tighter">{prediction.heatwaveRisk}%</p>
                             </div>
                           </div>
                           <div className="bg-slate-900/80 p-6 rounded-[2rem] border-l-[6px] border-emerald-500 italic text-[13px] leading-relaxed text-slate-300 shadow-2xl">
                             "{prediction.narrative}"
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === ViewType.IMPACT && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 <StatCard 
                  label="Est. Population Impact" 
                  value={prediction ? `${Math.round(prediction.floodProbability * 1250)}+` : "---"} 
                  icon={<Users className="text-cyan-400" />} 
                  sub="Displacement Exposure" 
                  alert={prediction?.floodProbability > 60} 
                  trend="Demographic"
                />
                 <StatCard 
                  label="Economic Exposure" 
                  value={prediction ? `₹${(prediction.resilienceScore * 1.5).toFixed(1)} Cr` : "---"} 
                  icon={<Factory className="text-amber-400" />} 
                  sub="Infrastructure Asset Risk" 
                  alert={prediction?.resilienceScore < 40} 
                  trend="Financial"
                />
                 <StatCard 
                  label="Healthcare Load" 
                  value={prediction ? `${prediction.heatwaveRisk}%` : "---"} 
                  icon={<Ambulance className="text-red-400" />} 
                  sub="System Saturation" 
                  alert={prediction?.heatwaveRisk > 70} 
                  trend="Public Health"
                />
                 <StatCard 
                  label="Structural Damage" 
                  value={prediction ? `${Math.round(prediction.floodProbability * 0.4)}%` : "---"} 
                  icon={<Building2 className="text-purple-400" />} 
                  sub="Built Environment" 
                  alert={prediction?.floodProbability > 80} 
                  trend="Civil Engineering"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                   <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                     <Activity className="text-emerald-400" /> Sectorial Impact Probability
                   </h3>
                   <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={impactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                            <RechartsTooltip 
                              cursor={{ fill: '#ffffff05' }}
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                            />
                            <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={50}>
                               {impactData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col">
                   <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                     <ShieldCheck className="text-blue-400" /> Mitigation Readiness Plan
                   </h3>
                   <div className="flex-1 space-y-6">
                      {prediction ? prediction.actionPlan.map((action: string, idx: number) => (
                        <div key={idx} className="bg-black/30 p-6 rounded-2xl border-l-[4px] border-emerald-500 group hover:bg-black/50 transition-all">
                           <div className="flex items-center gap-4 mb-2">
                             <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Countermeasure</span>
                           </div>
                           <p className="text-sm font-bold text-slate-200 leading-relaxed">{action}</p>
                        </div>
                      )) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 italic">
                           <Activity size={48} className="mb-4" />
                           <p>Awaiting AI Predictive Output...</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}

          {currentView === ViewType.GIS && (
            <div className="h-[calc(100vh-180px)] w-full rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.6)] animate-in zoom-in duration-1000">
               <ClimateMap cities={INDIAN_CITIES} selectedCity={selectedCity} onCitySelect={setSelectedCity} simulationMode={simulationMode} rainFactor={rainFactor} tempFactor={tempFactor} cityWeatherMap={cityWeatherMap} fullScreenGis={true} />
            </div>
          )}

          {currentView === ViewType.ALERTS && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="flex justify-between items-end mb-12">
                <div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter italic">Live Incident Repository</h2>
                   <p className="text-slate-500 font-black uppercase tracking-[0.3em] mt-2 text-xs">Awaiting Countermeasures // Orbital Neural Scanning Active</p>
                </div>
                <button className="flex items-center gap-4 px-8 py-4 bg-slate-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl group">
                   <ListFilter size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Tactical Filtering
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12">
                 {alerts.map(alert => (
                   <div key={alert.id} className="bg-slate-900 rounded-[3rem] border border-white/5 overflow-hidden group hover:border-emerald-500/40 transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                      <div className="h-72 relative overflow-hidden">
                        <img src={alert.aiImageUrl} alt="AI Scan" className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
                        <div className="absolute top-6 left-6 bg-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] animate-pulse">
                           <Camera size={14} /> LIVE NEURAL SCAN
                        </div>
                        <div className="absolute bottom-6 left-8">
                           <h3 className="text-2xl font-black tracking-tighter uppercase italic">{alert.city} Target</h3>
                           <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">{alert.type}</p>
                        </div>
                        <button 
                          onClick={() => handleVoiceBriefing(alert)}
                          disabled={isSpeaking}
                          className={`absolute bottom-6 right-8 p-4 rounded-2xl border transition-all shadow-2xl ${isSpeaking ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-950/80 backdrop-blur-xl text-emerald-400 border-white/20 hover:bg-emerald-500 hover:text-white'}`}
                        >
                          <Volume2 size={24} className={isSpeaking ? 'animate-pulse' : ''} />
                        </button>
                      </div>

                      <div className="p-10 space-y-8">
                        <div className="flex justify-between items-center">
                           <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                             alert.severity === AlertSeverity.SEVERE ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'bg-orange-500/20 text-orange-500 border-orange-500/30'
                           }`}>
                             Alert Priority: {alert.severity}
                           </div>
                           <span className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-widest">{alert.timestamp.toLocaleTimeString()} Terminal Time</span>
                        </div>

                        <p className="text-base font-bold leading-relaxed text-slate-200 italic">"{alert.message}"</p>

                        <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 flex items-center gap-3">
                             <ShieldCheck size={16} /> Operational SOPs
                           </h4>
                           <ul className="space-y-4">
                             {alert.instructions?.map((inst, idx) => (
                               <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-4 font-medium">
                                  <span className="text-emerald-500 font-black mt-0.5">▶</span> {inst}
                               </li>
                             ))}
                           </ul>
                        </div>

                        <button className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95">
                           <Eye size={20} /> Execute Tactical Response
                        </button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, count?: number }> = ({ icon, label, active, onClick, count }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all group relative ${active ? 'bg-emerald-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.25)]' : 'hover:bg-slate-800 text-slate-500'}`}>
    <span className={`${active ? 'text-white' : 'group-hover:text-emerald-400 transition-colors'}`}>{icon}</span>
    <span className="hidden lg:block font-black text-[10px] uppercase tracking-[0.2em] flex-1 text-left">{label}</span>
    {count && count > 0 && <span className="absolute top-2 right-2 lg:static bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-xl shadow-lg border-2 border-slate-900">{count}</span>}
    {active && <div className="hidden lg:block w-2 h-2 rounded-full bg-white animate-pulse shadow-glow"></div>}
  </button>
);

const SimulationControl: React.FC<{ label: string, value: number, unit: string, min: number, max: number, step: number, onChange: (v: number) => void, active: boolean, color: 'blue' | 'orange' }> = ({ label, value, unit, min, max, step, onChange, active, color }) => (
  <div className="group">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] mb-4 text-slate-500 group-hover:text-slate-300 transition-colors">
      <span>{label}</span>
      <span className={color === 'blue' ? 'text-blue-400' : 'text-orange-400'}>{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} 
      className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-800 transition-opacity ${!active ? 'opacity-20 pointer-events-none' : 'opacity-100 hover:accent-emerald-400'}`}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
);

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode, sub: string, trend: string, alert: boolean }> = ({ label, value, icon, sub, trend, alert }) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 group relative overflow-hidden ${alert ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'bg-slate-900 border-white/5 hover:border-white/10 hover:shadow-2xl'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-black/40 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">{icon}</div>
      <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${alert ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
        {trend}
      </div>
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-4xl font-black tracking-tighter mb-2 italic font-mono">{value}</h4>
    <p className="text-[10px] font-bold text-slate-400 truncate tracking-tight uppercase tracking-widest opacity-60">{sub}</p>
    {alert && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-red-500 animate-pulse"></div>}
  </div>
);

export default Dashboard;
