import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardData } from '../data/dashboardData.js'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../lib/supabaseClient'

const { stats, chartData, alerts, fleetStatus: initialFleet } = dashboardData;

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState('map') // map, status, analytics, alerts
  const [currentTime, setCurrentTime] = useState(new Date())
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  
  // Real functionality states
  const [filters, setFilters] = useState({ ebike: true, shuttle: true })
  const [tempFilters, setTempFilters] = useState({ ebike: true, shuttle: true })
  const [liveStats, setLiveStats] = useState(stats)
  const [fleetStatus, setFleetStatus] = useState(initialFleet)

  useEffect(() => {
    async function fetchFleet() {
      const { data, error } = await supabase
        .from('fleet')
        .select('*')
      
      if (data && !error) {
        setFleetStatus(data)
      }
    }
    fetchFleet()
  }, [])

  const filteredFleet = fleetStatus.filter(v => {
    if (v.type === 'E-Bike' && !filters.ebike) return false;
    if (v.type === 'Shuttle Bus' && !filters.shuttle) return false;
    return true;
  });

  const randomizeStats = () => {
    setLiveStats(prev => ({
      ...prev,
      totalRevenue: (parseInt(prev.totalRevenue.replace(/\D/g,'')) + Math.floor(Math.random() * 1000)).toLocaleString() + '₫',
      activeCommuters: (parseInt(prev.activeCommuters.replace(/\D/g,'')) + Math.floor(Math.random() * 5)).toLocaleString(),
      fleetEfficiency: (parseFloat(prev.fleetEfficiency) + (Math.random() * 0.4 - 0.2)).toFixed(1) + '%'
    }));
  }

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(randomizeStats, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Type', 'Status', 'Power', 'Location', 'Lat', 'Lng'];
    const rows = filteredFleet.map(v => [v.id, v.type, v.status, v.power, `"${v.location}"`, v.lat, v.lng].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "saigonflow_fleet_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setActiveModal(null);
    setToastMsg('CSV downloaded successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  const handleDownloadPDF = () => {
    setActiveModal(null);
    
    const prevTab = activeTab;
    setActiveTab('all');
    
    // Wait for React to render all tabs
    setTimeout(() => {
      window.print();
      // Code here executes AFTER the user closes the print dialog
      setActiveTab(prevTab);
      setToastMsg('Report generated successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleAction = (action, payload = null) => {
    if (action === '🔄 Refresh Data') {
      setActiveModal('sync')
      setTimeout(() => {
        setActiveModal(null)
        setCurrentTime(new Date())
        setToastMsg('Data refreshed from server!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }, 1500)
    } else if (action === '⚗️ Filters') {
      setActiveModal('filters')
    } else if (action === '📥 Export Report') {
      setActiveModal('export')
    } else if (action === '⚙️ Settings') {
      setActiveModal('settings')
    } else if (action === 'Review Alert') {
      setSelectedAlert(payload)
      setActiveModal('review')
    } else if (action === 'Zoom In' || action === 'Zoom Out') {
      setToastMsg(`Map ${action} applied`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <style>{`
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .tab-section { margin-bottom: 32px !important; page-break-inside: avoid; }
          .print-stack { display: block !important; }
          .print-stack > div { width: 100% !important; margin-bottom: 24px !important; }
          .scorecard-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .map-container { height: 400px !important; page-break-inside: avoid; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 15mm; size: A4 portrait; }
        }
      `}</style>
      {showToast && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1e293b', color: 'white', padding: '12px 24px',
          borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999,
          animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{ width: '20px', height: '20px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px' }}>✓</div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{toastMsg}</div>
        </div>
      )}
      {/* Topbar */}
      <div className="no-print" style={{ background: '#0d9488', padding: '16px 32px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>SaigonFlow Fleet Control</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Unified Operations Dashboard</div>
          </div>
          <div style={{ marginLeft: '32px', display: 'flex', gap: '8px' }}>
            {['🔄 Refresh Data', '⚗️ Filters', '📥 Export Report', '⚙️ Settings'].map(btn => (
              <button key={btn} onClick={() => handleAction(btn)} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
              }}>{btn}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', background: '#34d399', borderRadius: '50%' }} className="animate-pulse" />
            Live • Updated 3s ago
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Logged in as</div>
              <div style={{ fontSize: '13px', fontWeight: '700' }}>Fleet Manager</div>
            </div>
            <div onClick={() => setActiveModal('profile')} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', transition: '0.2s' }}>FM</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'all' && (
          <div className="print-only" style={{ marginBottom: '32px', borderBottom: '2px solid #0d9488', paddingBottom: '16px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, color: '#0d9488', letterSpacing: '-1px' }}>SAIGONFLOW</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Operations & Fleet Status Report • {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        )}
        {/* Scorecard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0d9488' }}>◎</span> Balanced Scorecard Overview
          </h2>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            📅 {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Scorecards */}
        <div className="scorecard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { 
              title: 'Financial', icon: '$', val: liveStats.totalRevenue, color: '#10b981', trend: '↗',
              sub: 'Total Revenue Generated', progress: 85, target: 'Forecast Exceeded',
              stats: [{ label: 'Revenue/Trip:', val: '18,400₫', color: '#10b981' }, { label: 'Operating Margin:', val: '22.5%', color: '#10b981' }]
            },
            { 
              title: 'Customer', icon: '👥', val: liveStats.activeCommuters, color: '#3b82f6', badge: '+Active',
              sub: 'Active Commuters', progress: 92, target: 'Growing Base',
              stats: [{ label: 'Customer Rating:', val: liveStats.customerRating, color: '#3b82f6' }, { label: 'Churn Rate:', val: '3.2% ↓', color: '#10b981' }]
            },
            { 
              title: 'Operations', icon: '⏱', val: liveStats.fleetEfficiency, color: '#8b5cf6', badge: '✓',
              sub: 'Fleet Efficiency', progress: 98, target: '95% (On Track)',
              stats: [{ label: 'Avg. Trip Time:', val: '18 min', color: '#8b5cf6' }, { label: 'Maintenance Rate:', val: '1.4%', color: '#8b5cf6' }]
            },
            { 
              title: 'Growth', icon: '📈', val: filters.ebike && filters.shuttle ? '+24%' : '+12%', color: '#f97316', trend: '↗',
              sub: 'Filtered Trip Growth', progress: 80, target: '10,000 trips total',
              stats: [{ label: 'Units Filtered:', val: filteredFleet.length, color: '#f97316' }, { label: 'Peak Utilization:', val: '84%', color: '#f97316' }]
            }
          ].map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: card.color }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: '#64748b' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{card.icon}</span> {card.title}
                </div>
                <div style={{ fontSize: '18px', color: card.color }}>{card.icon}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: card.color }}>{card.val}</div>
                {card.trend && <div style={{ color: card.color, fontWeight: '700' }}>{card.trend}</div>}
                {card.badge && <div style={{ background: `${card.color}15`, color: card.color, padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>{card.badge}</div>}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{card.sub}</div>

              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '4px' }}>
                <div style={{ width: `${card.progress}%`, height: '100%', background: '#1e293b', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>{card.progress}% of target ({card.target})</div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {card.stats.map((s, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>{s.label}</span>
                    <span style={{ fontWeight: '700', color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sub-navigation */}
        <div className="no-print" style={{ display: 'inline-flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
          {[
            { id: 'map', icon: '🗺️', label: 'Live Map' },
            { id: 'status', icon: '🚙', label: 'Fleet Status' },
            { id: 'analytics', icon: '📊', label: 'Analytics' },
            { id: 'alerts', icon: '⚠️', label: 'Alerts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#1e293b' : '#64748b',
                border: 'none', padding: '10px 24px', borderRadius: '8px',
                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          
          {(activeTab === 'map' || activeTab === 'all') && (
            <div className="tab-section print-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: activeTab === 'all' ? '40px' : '0' }}>
              <div className="map-container" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>◎</span> Real-Time Fleet Map
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>📈 847 Active Trips</div>
                </div>
                <div style={{ flex: 1, position: 'relative', background: '#f8fafc' }}>
                  <MapContainer center={[10.7769, 106.7009]} zoom={14} style={{ width: '100%', height: '100%', zIndex: 1 }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    
                    {/* Map markers derived exactly from filteredFleet */}
                    {filteredFleet.map((v, i) => {
                      const lat = v.lat;
                      const lng = v.lng;
                      const color = parseInt(v.power) < 20 ? '#ef4444' : v.type === 'E-Bike' ? '#10b981' : '#3b82f6';
                      
                      return (
                        <Marker 
                          key={v.id} 
                          position={[lat, lng]}
                          icon={L.divIcon({ html: `<div style="width: 24px; height: 24px; background: ${color}; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); color: white">${v.type === 'E-Bike' ? '⚡' : '🚌'}</div>`, className: '', iconSize: [24,24] })}
                        >
                          <Popup>
                            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{v.type} #{v.id}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Status: <span style={{color: v.status === 'In Use' ? '#10b981' : '#d97706', fontWeight: '700'}}>{v.status}</span></div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Battery: <span style={{color, fontWeight: '700'}}>{v.power}</span></div>
                            <button onClick={() => { setSelectedAlert({ msg: `Manage vehicle ${v.id}`, type: 'Info' }); setActiveModal('review'); }} style={{ background: '#f1f5f9', border: 'none', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', marginTop: '8px', cursor: 'pointer', width: '100%' }}>Manage</button>
                          </Popup>
                        </Marker>
                      )
                    })}
                  </MapContainer>

                  {/* UI Overlay */}
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000 }}>
                    <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} className="animate-pulse" /> Live • 3s ago
                  </div>

                  {/* Legend */}
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px' }}>Fleet Status Legend</div>
                    {[
                      { c: '#10b981', l: 'E-bikes Active:', v: '425' },
                      { c: '#34d399', l: 'E-bikes Available:', v: '512' },
                      { c: '#3b82f6', l: 'Shuttles Active:', v: '82' },
                      { c: '#a855f7', l: 'Metro Stations:', v: '12' },
                      { c: '#ef4444', l: 'Critical / Low Batt:', v: '13' }
                    ].map(l => (
                      <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.c }} />
                        <span style={{ color: '#64748b' }}>{l.l}</span>
                        <span style={{ fontWeight: '700', color: l.c }}>{l.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#3b82f6' }}>☁️</span> Current Conditions
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px' }}>🌤️</div>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>32°C</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Partly Cloudy</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#64748b' }}>Rain Probability:</span> <span style={{ fontWeight: '700' }}>15%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#64748b' }}>Wind Speed:</span> <span style={{ fontWeight: '700' }}>12 km/h NE</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#64748b' }}>Visibility:</span> <span style={{ fontWeight: '700' }}>10 km</span></div>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #fecaca', boxShadow: '0 4px 12px rgba(239,68,68,0.1)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ef4444' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ef4444' }}>⚠️</span> Critical Alerts
                    </div>
                    <div style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>{alerts.length}</div>
                  </div>
                  
                  {alerts.slice(0, 2).map((alert, i) => (
                    <div key={i} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: alert.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{alert.type === 'Critical' ? '❗' : '⚠️'}</span> {alert.type}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{alert.time}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', paddingLeft: '22px' }}>{alert.msg}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'status' || activeTab === 'all') && (
            <div className="tab-section print-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: activeTab === 'all' ? '40px' : '0' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Vehicle Fleet Log</h3>
                  <div style={{ fontSize: '12px', background: '#f1f5f9', padding: '4px 12px', borderRadius: '12px', fontWeight: '600' }}>
                    Total Units: {fleetStatus.length}
                  </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>ID</th>
                      <th style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>Type</th>
                      <th style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>Status</th>
                      <th style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>Power</th>
                      <th style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>Location</th>
                      <th style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFleet.map((v, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{v.id}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {v.type === 'E-Bike' ? '⚡' : '🚌'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: v.status === 'In Use' ? '#d1fae5' : v.status === 'Charging' ? '#fef3c7' : '#e2e8f0',
                            color: v.status === 'In Use' ? '#059669' : v.status === 'Charging' ? '#d97706' : '#475569',
                            padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700'
                          }}>{v.status}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: parseInt(v.power) < 20 ? '#ef4444' : '#10b981' }}>
                          {v.power}
                        </td>
                        <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>{v.location}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => {
                            setSelectedAlert({ msg: `Manage vehicle ${v.id}`, type: 'Info' });
                            setActiveModal('review');
                          }} style={{ background: '#f1f5f9', border: 'none', color: '#3b82f6', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>🔋</span> Battery Health Distribution
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Good (50-79%)</span>
                    <span style={{ fontWeight: '700', color: '#d97706' }}>186 bikes (20%)</span>
                  </div>
                  <div style={{ height: '12px', background: '#fef3c7', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', background: '#1e293b' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Critical (&lt; 50%)</span>
                    <span style={{ fontWeight: '700', color: '#ef4444' }}>22 bikes (2%)</span>
                  </div>
                  <div style={{ height: '12px', background: '#fee2e2', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '2%', height: '100%', background: '#1e293b' }} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '16px' }}>Predicted Battery Failures (Next 7 Days)</div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>⚠️</div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', lineHeight: '1' }}>12 units</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Require preventive maintenance</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>AI Prediction Confidence: 87%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'analytics' || activeTab === 'all') && (
            <div className="tab-section print-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: activeTab === 'all' ? '40px' : '0' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Revenue & Utilization Trend</h3>
                <div style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Today's Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Total Trips:</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                      {chartData.reduce((acc, curr) => acc + curr.trips, 0).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ borderBottom: '1px solid #f1f5f9' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Avg Trip Duration:</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>18 min</span>
                  </div>
                  <div style={{ borderBottom: '1px solid #f1f5f9' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Peak Hour Util:</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>70%</span>
                  </div>
                  <div style={{ borderBottom: '1px solid #f1f5f9' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>CO₂ Saved:</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>1.2 tons</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'alerts' || activeTab === 'all') && (
            <div className="tab-section" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: activeTab === 'all' ? '40px' : '0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>System Alerts Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {alerts.map((alert, i) => (
                  <div key={i} style={{ padding: '16px', background: alert.type === 'Critical' ? '#fef2f2' : alert.type === 'Warning' ? '#fffbeb' : '#eff6ff', border: `1px solid ${alert.type === 'Critical' ? '#fecaca' : alert.type === 'Warning' ? '#fde68a' : '#bfdbfe'}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        {alert.type === 'Critical' ? '❗' : alert.type === 'Warning' ? '⚠️' : 'ℹ️'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: alert.color, fontSize: '14px' }}>{alert.type} Alert</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{alert.msg}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '600', color: '#94a3b8', fontSize: '12px' }}>{alert.time}</div>
                      <button onClick={() => handleAction('Review Alert', alert)} style={{ background: alert.color, border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', width: '400px', maxWidth: '90%',
            overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                {activeModal === 'filters' && '⚗️ Data Filters'}
                {activeModal === 'export' && '📥 Export Report'}
                {activeModal === 'settings' && '⚙️ Dashboard Settings'}
                {activeModal === 'review' && `${selectedAlert?.type === 'Critical' ? '❗' : 'ℹ️'} Review Action`}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              {activeModal === 'sync' && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div className="animate-spin" style={{ width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTopColor: '#10b981', borderRadius: '50%', margin: '0 auto 24px' }} />
                  <div style={{ fontWeight: '800', fontSize: '18px', color: '#1e293b' }}>Syncing with Cloud...</div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>Fetching latest fleet telemetry & active trips</div>
                </div>
              )}
              {activeModal === 'profile' && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800', margin: '0 auto 16px', border: '4px solid #f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>FM</div>
                  <div style={{ fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>Fleet Manager</div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>admin@saigonflow.com</div>
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveModal(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#1e293b', fontWeight: '700', cursor: 'pointer' }}>Đóng</button>
                    <button onClick={() => { setActiveModal(null); setToastMsg('Logging out...'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Đăng xuất</button>
                  </div>
                </div>
              )}
              {activeModal === 'filters' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>Time Range</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                      <option>Today (Live)</option>
                      <option>Last 7 Days</option>
                      <option>This Month</option>
                      <option>Custom Range...</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>Vehicle Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div onClick={() => setTempFilters({...tempFilters, ebike: !tempFilters.ebike})} style={{ background: tempFilters.ebike ? '#ecfdf5' : '#f8fafc', border: `1px solid ${tempFilters.ebike ? '#10b981' : '#e2e8f0'}`, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: tempFilters.ebike ? '#10b981' : 'white', border: tempFilters.ebike ? 'none' : '1px solid #cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{tempFilters.ebike ? '✓' : ''}</div>
                         <span style={{ fontWeight: '700', fontSize: '13px', color: tempFilters.ebike ? '#065f46' : '#64748b' }}>E-bikes</span>
                      </div>
                      <div onClick={() => setTempFilters({...tempFilters, shuttle: !tempFilters.shuttle})} style={{ background: tempFilters.shuttle ? '#eff6ff' : '#f8fafc', border: `1px solid ${tempFilters.shuttle ? '#3b82f6' : '#e2e8f0'}`, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: tempFilters.shuttle ? '#3b82f6' : 'white', border: tempFilters.shuttle ? 'none' : '1px solid #cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{tempFilters.shuttle ? '✓' : ''}</div>
                         <span style={{ fontWeight: '700', fontSize: '13px', color: tempFilters.shuttle ? '#1e3a8a' : '#64748b' }}>Shuttles</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setFilters(tempFilters); setActiveModal(null); setToastMsg('Filters applied!'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} style={{ background: '#0d9488', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', marginTop: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13,148,136,0.3)' }}>Apply Filters</button>
                </div>
              )}
              {activeModal === 'export' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0', lineHeight: '1.5' }}>Select a format to download the current dashboard data. The report will include all active tabs.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button onClick={handleDownloadPDF} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '20px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(239,68,68,0.1)' }}>
                      <span style={{ fontSize: '32px' }}>📄</span> PDF Report
                    </button>
                    <button onClick={handleDownloadCSV} style={{ background: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.1)' }}>
                      <span style={{ fontSize: '32px' }}>📊</span> CSV Data
                    </button>
                  </div>
                </div>
              )}
              {activeModal === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '700' }}>Auto-refresh Map</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Update vehicle positions every 5s</div>
                    </div>
                    <div onClick={() => setAutoRefresh(!autoRefresh)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: autoRefresh ? '#10b981' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: autoRefresh ? '22px' : '2px', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '700' }}>Dark Mode Theme</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Enable dark color palette</div>
                    </div>
                    <div onClick={() => setIsDarkMode(!isDarkMode)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: isDarkMode ? '#1e293b' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: isDarkMode ? '22px' : '2px', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px', fontWeight: '700', marginTop: '8px', cursor: 'pointer' }}>Close Settings</button>
                </div>
              )}
              {activeModal === 'review' && selectedAlert && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: selectedAlert.type === 'Critical' ? '#fef2f2' : '#eff6ff', borderRadius: '12px', border: `1px solid ${selectedAlert.type === 'Critical' ? '#fecaca' : '#bfdbfe'}` }}>
                    <div style={{ fontWeight: '700', color: selectedAlert.color, marginBottom: '8px' }}>{selectedAlert.msg}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Received: {selectedAlert.time}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => { setActiveModal(null); setToastMsg('Dispatching maintenance team...'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Dispatch Maintenance</button>
                    <button onClick={() => { setActiveModal(null); setToastMsg('Alert acknowledged.'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Acknowledge</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
