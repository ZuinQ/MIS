import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState('financial')
  const [fleetStatus, setFleetStatus] = useState([])
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const financialData = [
    { name: 'E-Bike V0712', revenue: 12500000 },
    { name: 'E-Bike V1103', revenue: 10800000 },
    { name: 'Bus V2080', revenue: 45200000 },
    { name: 'E-Bike V0556', revenue: 9200000 },
    { name: 'E-Bike V0992', revenue: 8700000 },
  ]

  const weatherData = [
    { condition: 'Clear', trips: 1240, color: '#fbbf24' },
    { condition: 'Cloudy', trips: 850, color: '#94a3b8' },
    { condition: 'Rain', trips: 420, color: '#3b82f6' },
  ]

  const maintenanceData = [
    { name: 'High Risk', value: 3, color: '#ef4444' },
    { name: 'Medium Risk', value: 8, color: '#f59e0b' },
    { name: 'Safe', value: 45, color: '#10b981' },
  ]

  const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const { data: fleet } = await supabase.from('fleet').select('*')
      if (fleet) setFleetStatus(fleet)
      
      const { data: alertData } = await supabase.from('alerts').select('*').order('created_at', { ascending: false })
      if (alertData) setAlerts(alertData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .stat-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>

      {/* Top Header */}
      <div style={{ background: '#0d9488', padding: '16px 32px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📊</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>SaigonFlow Executive Dashboard</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Balanced Scorecard Framework • Tier 4 Build</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>LIVE OPS STATUS</div>
          <div style={{ fontSize: '13px', fontWeight: '700' }}>523H0088 & 523H0113</div>
        </div>
      </div>

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
                  <button onClick={handleDownloadPDF} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '20px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer' }}>PDF Report</button>
                  <button onClick={handleDownloadCSV} style={{ background: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer' }}>CSV Data</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
