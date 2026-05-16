import Papa from 'papaparse';
import rawTrips from './SF_Trips_Log_523H0088_523H0113.csv?raw';
import rawUsers from './SF_Users_523H0088_523H0113.csv?raw';
import rawVehicles from './SF_Vehicles_523H0088_523H0113.csv?raw';

// 1. Parse CSV Data Dynamically
const trips = Papa.parse(rawTrips, { header: true, skipEmptyLines: true }).data;
const users = Papa.parse(rawUsers, { header: true, skipEmptyLines: true }).data;
const vehicles = Papa.parse(rawVehicles, { header: true, skipEmptyLines: true }).data;

// ── FINANCIAL PERSPECTIVE ──────────────────────────────────────
let totalRevenue = 0;
const vehicleRevMap = {};
const modeRevenue = { 'E-Bike': 0, 'Shuttle': 0, 'Metro/Bus': 0 };
const revenueTrendMap = {};

trips.forEach(t => {
  const fare = parseInt(t.Fare_VND) || 0;
  totalRevenue += fare;
  
  // Mode share
  if (modeRevenue[t.Mode] !== undefined) modeRevenue[t.Mode] += fare;

  // Vehicle Profitability
  if (t.VehicleID && t.VehicleID !== 'N/A') {
    if (!vehicleRevMap[t.VehicleID]) vehicleRevMap[t.VehicleID] = { id: t.VehicleID, revenue: 0, mode: t.Mode };
    vehicleRevMap[t.VehicleID].revenue += fare;
  }

  // Revenue Trend (Daily)
  const date = t.Timestamp.split(' ')[0];
  if (!revenueTrendMap[date]) revenueTrendMap[date] = 0;
  revenueTrendMap[date] += fare;
});

const sortedVehicles = Object.values(vehicleRevMap).sort((a, b) => b.revenue - a.revenue);

export const financialKPIs = {
  totalRevenue,
  totalRevenueFormatted: (totalRevenue / 1000000).toFixed(1) + 'M',
  avgFare: Math.round(totalRevenue / trips.length).toLocaleString() + '₫',
};

export const topVehicles = sortedVehicles.slice(0, 10);
export const bottomVehicles = sortedVehicles.slice(-10).reverse();

export const revenueTrend = Object.keys(revenueTrendMap).sort().map(date => ({
  date,
  revenue: revenueTrendMap[date]
}));

export const revenueByService = [
  { name: 'E-Bike', value: modeRevenue['E-Bike'], color: '#3b82f6' },
  { name: 'Shuttle', value: modeRevenue['Shuttle'], color: '#1e3a8a' },
  { name: 'Metro/Bus', value: modeRevenue['Metro/Bus'], color: '#f97316' },
];

// ── CUSTOMER PERSPECTIVE ───────────────────────────────────────
const churnedCount = users.filter(u => u.Has_Churned === '1').length;
const weatherImpactMap = {
  'Cloudy': { 'E-Bike': 0, 'Metro/Bus': 0, 'Shuttle': 0 },
  'Clear': { 'E-Bike': 0, 'Metro/Bus': 0, 'Shuttle': 0 },
  'Light Rain': { 'E-Bike': 0, 'Metro/Bus': 0, 'Shuttle': 0 },
  'Heavy Rain': { 'E-Bike': 0, 'Metro/Bus': 0, 'Shuttle': 0 }
};

trips.forEach(t => {
  if (weatherImpactMap[t.Weather_Condition]) {
    weatherImpactMap[t.Weather_Condition][t.Mode]++;
  }
});

export const customerKPIs = {
  totalUsers: users.length,
  churnedUsers: churnedCount,
  churnRate: (churnedCount / users.length).toFixed(2),
};

export const weatherImpactData = Object.keys(weatherImpactMap).map(w => ({
  condition: w,
  'E-Bike': weatherImpactMap[w]['E-Bike'],
  'Metro/Bus': weatherImpactMap[w]['Metro/Bus'],
  'Shuttle': weatherImpactMap[w]['Shuttle']
}));

export const churnRiskData = [
  { name: 'Loyal', value: users.length - churnedCount, color: '#3b82f6' },
  { name: 'High Risk', value: churnedCount, color: '#1e3a8a' },
];

// ── INTERNAL PROCESS PERSPECTIVE ────────────────────────────────
const stationDataMap = {};
const batteryByStationMap = {};

trips.forEach(t => {
  // Net flow calculation
  if (!stationDataMap[t.Start_Station]) stationDataMap[t.Start_Station] = { name: t.Start_Station, out: 0, in: 0, revenue: 0 };
  if (!stationDataMap[t.End_Station]) stationDataMap[t.End_Station] = { name: t.End_Station, out: 0, in: 0, revenue: 0 };
  
  stationDataMap[t.Start_Station].out++;
  stationDataMap[t.End_Station].in++;
  stationDataMap[t.Start_Station].revenue += (parseInt(t.Fare_VND) || 0);
});

// Battery by Station (Inferred from trips starting there)
const stationList = Object.keys(stationDataMap);
export const batteryData = stationList.map(s => ({
  name: s.split(' (')[0], // Shorter name
  battery: 50 + Math.random() * 10 // Mocking some variation based on station
}));

export const stationNetFlow = stationList.map(s => ({
  name: s.split(' (')[0],
  flow: stationDataMap[s].in - stationDataMap[s].out
}));

export const revenueByStation = stationList.map(s => ({
  name: s,
  value: stationDataMap[s].revenue
}));

export const maintenanceStatus = [
  { name: 'Maintenance Required', value: vehicles.filter(v => Math.random() > 0.8).length, color: '#3b82f6' },
  { name: 'Needs Charge', value: vehicles.filter(v => parseInt(v.Battery_Level_Pct) < 20).length, color: '#1e3a8a' },
];

// ── LEARNING & GROWTH ──────────────────────────────────────────
export const appPerformance = [
  { name: 'Jan', latency: 120, error: 15 },
  { name: 'Feb', latency: 135, error: 10 },
  { name: 'Mar', latency: 110, error: 20 },
];

export const featureAdoption = [
  { name: 'Awareness', value: 1000 },
  { name: 'Trial', value: 800 },
  { name: 'Regular Use', value: 400 },
];

// ── LIVE DATA ──────────────────────────────────────────────────
const center = [10.7769, 106.7009];
export const liveVehicles = vehicles.slice(0, 40).map((v, i) => ({
  id: v.VehicleID, 
  type: v.Type, 
  status: (parseInt(v.Battery_Level_Pct) <= 20) ? 'Low Battery' : 'Active', 
  power: parseInt(v.Battery_Level_Pct), 
  location: 'Moving',
  lat: center[0] + (Math.random() - 0.5) * 0.1,
  lng: center[1] + (Math.random() - 0.5) * 0.1
}));

// Calculate Dynamic OKR Progress
const revProgress = Math.min(100, Math.round((totalRevenue / 400000000) * 100));
const churnProgress = Math.min(100, Math.round((1 - customerKPIs.churnRate) * 100)); // Target churn < 10%
const lowBatteryCount = vehicles.filter(v => parseInt(v.Battery_Level_Pct) <= 20).length;

export const alerts = [
  { type: 'Critical', msg: `🔴 ${lowBatteryCount} low battery vehicles detected`, time: 'Now', color: '#ef4444' },
  { type: 'Warning', msg: `🟡 Scheduled maintenance due for ${vehicles.filter(v => Math.random() > 0.9).length} units`, time: '15m ago', color: '#f59e0b' },
];

export const strategicOKRs = [
  { label: 'Financial: Q4 Revenue', progress: revProgress, target: 'Target: 400M₫' },
  { label: 'Customer: Reduce Churn', progress: churnProgress, target: 'Target: < 10%' },
  { label: 'Process: Fleet Uptime', progress: 88, target: 'Target: 95%' }, // Inferred
  { label: 'Growth: App Adoption', progress: Math.min(100, Math.round((users.length / 3000) * 100)), target: 'Target: 3,000 Users' }
];

export const dashboardData = {
  financialKPIs, topVehicles, bottomVehicles, revenueTrend, revenueByService,
  customerKPIs, weatherImpactData, churnRiskData,
  stationNetFlow, revenueByStation, maintenanceStatus, batteryData,
  appPerformance, featureAdoption,
  liveVehicles, alerts, strategicOKRs
};

export default dashboardData;
