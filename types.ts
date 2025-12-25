
export enum UserRole {
  CITIZEN = 'Citizen',
  ADMIN = 'City Administrator',
  OFFICER = 'Disaster Management Officer'
}

export enum AlertSeverity {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  SEVERE = 'Severe'
}

export enum AlertType {
  FLOOD = 'Flood Warning',
  HEATWAVE = 'Heatwave Warning',
  CYCLONE = 'Cyclone Warning',
  RAIN = 'Extreme Rainfall',
  AIR_QUALITY = 'Air Quality Alert'
}

export enum ViewType {
  DASHBOARD = 'Dashboard',
  GIS = 'GIS View',
  ALERTS = 'Alerts Center',
  IMPACT = 'Impact Analysis'
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  temp: number;
  rainfall: number;
  humidity: number;
  floodRisk: number;
  heatRisk: number;
  status: 'Safe' | 'Warning' | 'Critical';
}

export interface Alert {
  id: string;
  city: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  instructions?: string[];
  timestamp: Date;
  active: boolean;
  aiImageUrl?: string; // Simulated AI vision scan
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}
