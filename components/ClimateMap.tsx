
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
// Import ShieldCheck icon from lucide-react
import { ShieldCheck } from 'lucide-react';
import { CityData } from '../types';
import { WeatherData } from '../services/weatherService';

interface MapProps {
  cities: CityData[];
  selectedCity: CityData | null;
  onCitySelect: (city: CityData) => void;
  simulationMode: boolean;
  rainFactor: number;
  tempFactor: number;
  cityWeatherMap: Record<string, WeatherData>;
  fullScreenGis?: boolean;
}

// Custom pulsing icon generator
const createPulsingIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute; 
          width: 100%; 
          height: 100%; 
          background: ${color}; 
          border-radius: 50%; 
          opacity: 0.6; 
          animation: pulse-ring 2s infinite ease-in-out;
        "></div>
        <div style="
          position: absolute; 
          top: 6px; 
          left: 6px; 
          width: 12px; 
          height: 12px; 
          background: ${color}; 
          border-radius: 50%; 
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        "></div>
      </div>
      <style>
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const RecenterMap: React.FC<{ city: CityData | null, zoom: number }> = ({ city, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (city) {
      map.setView([city.lat, city.lng], zoom);
    }
  }, [city, map, zoom]);
  return null;
};

const ClimateMap: React.FC<MapProps> = ({ 
  cities, 
  selectedCity, 
  onCitySelect, 
  simulationMode, 
  rainFactor, 
  tempFactor,
  cityWeatherMap,
  fullScreenGis = false
}) => {
  
  const getMarkerColor = (city: CityData) => {
    const weather = cityWeatherMap[city.id];
    const currentTemp = (weather?.temp || city.temp) + (simulationMode ? tempFactor : 0);
    const liveRain = weather?.rain ?? city.rainfall;
    const floodBase = city.floodRisk + (simulationMode ? rainFactor * 0.5 : 0) + (liveRain > 100 ? 30 : 0);
    const heatRisk = Math.min(100, Math.max(city.heatRisk, (currentTemp / 45) * 100));
    const maxRisk = Math.max(floodBase, heatRisk);
    
    if (maxRisk > 80) return '#ef4444'; // Critical - Red
    if (maxRisk > 50) return '#f59e0b'; // Warning - Orange
    return '#10b981'; // Safe - Green
  };

  return (
    <div className={`h-full w-full relative ${fullScreenGis ? '' : 'rounded-2xl overflow-hidden shadow-2xl border border-white/10'}`}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          zIndex={1000}
        />

        {fullScreenGis && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            opacity={0.4}
            zIndex={900}
          />
        )}

        <RecenterMap city={selectedCity} zoom={fullScreenGis ? 12 : 9} />
        
        {cities.map((city) => {
          const weather = cityWeatherMap[city.id];
          const riskColor = getMarkerColor(city);
          const liveRain = weather?.rain ?? city.rainfall;
          const currentRain = liveRain + (simulationMode ? rainFactor : 0);
          const currentTemp = (weather?.temp || city.temp) + (simulationMode ? tempFactor : 0);

          return (
            <React.Fragment key={city.id}>
              <Circle
                center={[city.lat, city.lng]}
                pathOptions={{ 
                  color: riskColor, 
                  fillColor: riskColor, 
                  fillOpacity: 0.15,
                  weight: 1,
                  dashArray: '5, 5'
                }}
                radius={currentRain * (fullScreenGis ? 40 : 80)}
              />
              <Marker 
                position={[city.lat, city.lng]}
                icon={createPulsingIcon(riskColor)}
                eventHandlers={{ click: () => onCitySelect(city) }}
              >
                <Popup>
                  <div className="p-4 min-w-[220px] bg-slate-900 text-white rounded-2xl border border-white/20 shadow-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-black text-xl tracking-tight leading-none">{city.name}</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{city.state}</p>
                      </div>
                      {weather && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="icon" className="w-12 h-12" />}
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-3">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500 uppercase">Surface Temp:</span>
                        <span className="text-white font-mono">{currentTemp.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500 uppercase">Live Rain Index:</span>
                        <span className="text-white font-mono">{currentRain.toFixed(1)}mm</span>
                      </div>
                      <div className="pt-2">
                         <div className={`text-[10px] font-black uppercase text-center py-2 rounded-xl tracking-widest shadow-lg`} style={{ backgroundColor: riskColor }}>
                            {riskColor === '#ef4444' ? 'Critical Watch' : (riskColor === '#f59e0b' ? 'High Risk' : 'System Secure')}
                         </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
      
      <div className="absolute top-6 left-6 z-[1000] bg-slate-950/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
             <ShieldCheck size={18} />
           </div>
           <div>
             <h4 className="text-[11px] font-black uppercase tracking-widest">Satellite GIS Node</h4>
             <p className="text-[8px] text-slate-500 font-bold uppercase">Status: 24/7 Orbital Stream</p>
           </div>
        </div>
        <div className="space-y-3">
          <LegendItem color="#ef4444" label="Level 3: Critical Area" />
          <LegendItem color="#f59e0b" label="Level 2: Warning Area" />
          <LegendItem color="#10b981" label="Level 1: Nominal Zone" />
        </div>
      </div>
    </div>
  );
};

const LegendItem: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tight">{label}</span>
  </div>
);

export default ClimateMap;
