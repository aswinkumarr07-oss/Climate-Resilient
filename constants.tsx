
import { CityData, Alert, AlertType, AlertSeverity } from './types';

export const INDIAN_CITIES: CityData[] = [
  { id: '1', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, temp: 42, rainfall: 12, humidity: 20, floodRisk: 15, heatRisk: 85, status: 'Warning' },
  { id: '2', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, temp: 31, rainfall: 250, humidity: 85, floodRisk: 90, heatRisk: 20, status: 'Critical' },
  { id: '3', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, temp: 28, rainfall: 45, humidity: 60, floodRisk: 30, heatRisk: 10, status: 'Safe' },
  { id: '4', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, temp: 35, rainfall: 110, humidity: 75, floodRisk: 65, heatRisk: 50, status: 'Warning' },
  { id: '5', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, temp: 33, rainfall: 180, humidity: 80, floodRisk: 75, heatRisk: 30, status: 'Warning' },
  { id: '6', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, temp: 39, rainfall: 25, humidity: 35, floodRisk: 20, heatRisk: 70, status: 'Warning' },
  { id: '7', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, temp: 44, rainfall: 5, humidity: 15, floodRisk: 5, heatRisk: 95, status: 'Critical' },
];

/**
 * AI-Generated Visual Asset Library
 * Simulates high-precision neural scans from orbital and drone platforms.
 */
export const AI_ASSET_LIBRARY = {
  [AlertType.FLOOD]: [
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=1200', // Urban flood drone
    'https://images.unsplash.com/photo-1508802035342-430f52cf563b?auto=format&fit=crop&q=80&w=1200', // Aerial water coverage
    'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=1200', // Rural inundation scan
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200'  // Satellite water edge detection
  ],
  [AlertType.HEATWAVE]: [
    'https://images.unsplash.com/photo-1545464526-f3684a8964e7?auto=format&fit=crop&q=80&w=1200', // Thermal city shimmer
    'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&q=80&w=1200', // Scorched earth satellite
    'https://images.unsplash.com/photo-1516393433555-66774e797a26?auto=format&fit=crop&q=80&w=1200', // Hazy sun urban scan
    'https://images.unsplash.com/photo-1524168272322-bf73616d99af?auto=format&fit=crop&q=80&w=1200'  // Infrared heat map style
  ],
  [AlertType.CYCLONE]: [
    'https://images.unsplash.com/photo-1590055531615-f16d36fed8f4?auto=format&fit=crop&q=80&w=1200', // Massive orbital storm eye
    'https://images.unsplash.com/photo-1516912481808-340ff1b52f8d?auto=format&fit=crop&q=80&w=1200', // Coastal gale surge
    'https://images.unsplash.com/photo-1527482797697-87c5f03023da?auto=format&fit=crop&q=80&w=1200', // Heavy cloud rotation scan
    'https://images.unsplash.com/photo-1534088568595-a066f77ec282?auto=format&fit=crop&q=80&w=1200'  // Radar turbulence visualization
  ],
  [AlertType.RAIN]: [
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1200', // Dense monsoon urban scan
    'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?auto=format&fit=crop&q=80&w=1200', // Heavy pluvial precipitation
    'https://images.unsplash.com/photo-1501999635878-71cb73f1e74c?auto=format&fit=crop&q=80&w=1200', // Lightning neural detection
    'https://images.unsplash.com/photo-1438449805896-28a666819a20?auto=format&fit=crop&q=80&w=1200'  // Atmospheric moisture saturation
  ],
  [AlertType.AIR_QUALITY]: [
    'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80&w=1200', // Smog density scan
    'https://images.unsplash.com/photo-1445217143695-46712403d776?auto=format&fit=crop&q=80&w=1200', // Haze over urban centers
    'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=1200', // Particulate matter visualization
    'https://images.unsplash.com/photo-1506606401543-2e73d0ad78c3?auto=format&fit=crop&q=80&w=1200'  // Pollution plume tracking
  ]
};

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'a1',
    city: 'Mumbai',
    type: AlertType.FLOOD,
    severity: AlertSeverity.SEVERE,
    message: 'Extreme high tide combined with heavy precipitation. Low-lying areas evacuation initiated.',
    instructions: [
      'Immediate Evacuation: Move to designated relief centers on higher ground.',
      'Utility Shutdown: Switch off main power and gas lines to prevent fires/leaks.',
      'Surface Hazard: Do not drive or walk through floodwaters; 6 inches of water can stall a vehicle.'
    ],
    timestamp: new Date(),
    active: true,
    aiImageUrl: AI_ASSET_LIBRARY[AlertType.FLOOD][0]
  },
  {
    id: 'a2',
    city: 'Delhi',
    type: AlertType.HEATWAVE,
    severity: AlertSeverity.HIGH,
    message: 'Temperature expected to touch 45°C. Residents advised to stay indoors between 11 AM - 4 PM.',
    instructions: [
      'Hydration Protocol: Drink 4 liters of water daily, plus ORS or Nimbu Paani.',
      'Thermal Protection: Wear light, loose cotton clothing and use umbrellas outdoors.',
      'Symptom Check: Monitor for dizziness or rapid pulse; seek immediate medical aid for heatstroke.'
    ],
    timestamp: new Date(Date.now() - 3600000),
    active: true,
    aiImageUrl: AI_ASSET_LIBRARY[AlertType.HEATWAVE][0]
  }
];

// Refined Standard Operating Procedures (SOPs) for actionable instructions
export const SAFETY_PROTOCOLS: Record<AlertType, string[]> = {
  [AlertType.HEATWAVE]: [
    'Aggressive Hydration: Drink water even if not thirsty. Supplement with electrolytes (ORS), Lassi, or salted buttermilk to combat mineral loss.',
    'Peak Solar Avoidance: Reschedule all strenuous outdoor labor and travel to before 10:00 AM or after 5:00 PM.',
    'Passive Cooling: Use traditional khus-mats, damp curtains, or high-efficiency fans. Keep living areas dark and ventilated during peak hours.',
    'Symptom Vigilance: Watch for Nausea, Confusion, or Dry Skin (stopping of sweating). These indicate Level-3 Heatstroke; call 108 immediately.',
    'High-Risk Care: Ensure children and the elderly remain in the coolest part of the house with constant access to fluids.',
    'Dietary Adjustments: Avoid high-protein, spicy, or heavy foods that increase metabolic heat. Prioritize water-rich fruits like watermelon.'
  ],
  [AlertType.FLOOD]: [
    'Strategic Evacuation: If water enters your street, move to the top floor or terrace with your emergency kit. Do not wait for water to enter the house.',
    'Electrical Isolation: Unplug all appliances. Water contact with energized sockets creates lethal "electric drowning" zones.',
    'Sanitation Barrier: Treat all floodwater as hazardous waste. If skin contact occurs, wash with antiseptic soap immediately.',
    'Communication Link: Keep mobile phones in "Ultra Power Saving" mode. Text messages are more likely to go through than voice calls during network congestion.',
    'Snake/Pest Vigilance: Be aware that floods displace snakes and scorpions; check corners and elevated spots with a stick.',
    'Safe Consumption: Use only bottled or boiled water for drinking and brushing teeth to avoid water-borne epidemic outbreaks.'
  ],
  [AlertType.CYCLONE]: [
    'Storm Surge Evacuation: If located within 5km of the coastline, evacuate immediately to designated high-ground shelters if surge predictions exceed 1.5 meters.',
    'Wind-Velocity Fortification: Secure all loose external fixtures (satellite dishes, signboards) and reinforce doors/windows against predicted gusts exceeding 90 km/h.',
    'Safe Room Lockdown: Retreat to the strongest, windowless interior room (like a bathroom or reinforced stairwell) as sustained winds intensify.',
    'Inundation Preparedness: Expect extreme precipitation (200mm+ in 24h) accompanying cyclonic bands; isolate ground-floor assets against flash flooding.',
    'Eye Mirage Warning: If winds suddenly cease, the "Eye" is overhead. Stay sheltered; the second half of the storm with reversed wind direction is imminent.',
    'Post-Surge Sanitation: Treat all coastal inundation as contaminated; avoid contact with receding surge water which may contain heavy pollutants and debris.'
  ],
  [AlertType.RAIN]: [
    'Lightning Safety: Seek immediate permanent shelter. Avoid metal structures, trees, and being the highest point in an open field.',
    'Drainage Hazard: Avoid walking near open manholes or stormwater drains; visibility is often zero during heavy down pours.',
    'Traffic Management: Pull over and park in a safe spot if wipers cannot clear the windshield fast enough. Turn on hazard lights.',
    'Structural Watch: Be alert for signs of structural distress in old buildings, such as fresh cracks or plaster falls, especially in dense urban clusters.',
    'Landslide Protocol: In hilly regions, watch for flowing mud or tilting trees. Evacuate immediately if rumbling sounds are heard.',
    'Pothole Awareness: Flooded roads hide deep potholes; stay on known routes and follow the path of leading heavy vehicles.'
  ],
  [AlertType.AIR_QUALITY]: [
    'Respiratory Defense: Wear N95/FFP2 masks for any unavoidable outdoor transit. Surgical masks do not provide protection against PM2.5.',
    'Indoor Isolation: Use high-CADR HEPA air purifiers. Avoid burning incense, candles, or mosquito coils which add to indoor particulate load.',
    'Exertion Limit: Suspend outdoor morning walks and sports. High ventilation rates during exercise significantly increase lung deposition of toxins.',
    'Nasal Hygiene: Use saline nasal rinses twice daily to clear trapped pollutants from the upper respiratory tract.',
    'Vegetation Buffer: Keep indoor air-purifying plants (Snake plant, Areca palm) but rely primarily on mechanical filtration during severe smog.',
    'Community Action: Report illegal open-waste burning or construction dust violations to the local municipal grievance cell.'
  ]
};
