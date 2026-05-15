import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState('financial')
  const [fleetStatus, setFleetStatus] = useState([])
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeModal, setActiveModal] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [tempFilters, setTempFilters] = useState({ ebike: true, shuttle: true })
  const [filters, setFilters] = useState({ ebike: true, shuttle: true })

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

  const handleDownloadPDF = () => { setActiveModal(null); setToastMsg('Generating PDF Report...'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }
  const handleDownloadCSV = () => { setActiveModal(null); setToastMsg('Downloading CSV Data...'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
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
        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={() => setActiveModal('filters')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>⚗️ Filters</button>
           <button onClick={() => setActiveModal('export')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>📥 Export</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 32px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '32px' }}>
        {['financial', 'customer', 'internal', 'knowledge', 'map'].map(id => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '16px 4px', border: 'none', background: 'none',
              color: activeTab === id ? '#0d9488' : '#64748b',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              borderBottom: activeTab === id ? '3px solid #0d9488' : '3px solid transparent',
              textTransform: 'capitalize'
            }}
          >
            {id === 'financial' && '💰 Financial'}
            {id === 'customer' && '👥 Customer'}
            {id === 'internal' && '⚙️ Process'}
            {id === 'knowledge' && '🧠 AI & Strategy'}
            {id === 'map' && '🗺️ Live Map'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải dữ liệu...</div>
        ) : (
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {activeTab === 'financial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  <div className="stat-card"><div>Total Revenue</div><div style={{ fontSize: '24px', fontWeight: '800' }}>321.8M₫</div></div>
                  <div className="stat-card"><div>Avg Fare</div><div style={{ fontSize: '24px', fontWeight: '800' }}>24.5k₫</div></div>
                  <div className="stat-card"><div>Margin</div><div style={{ fontSize: '24px', fontWeight: '800' }}>34.2%</div></div>
                  <div className="stat-card"><div>ROI</div><div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>145%</div></div>
                  <div className="stat-card" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)', color: 'white' }}>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>☘️ CO2 Savings</div>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>1,240kg</div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>↑ 12% vs Target</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '24px' }}>
                  <div className="stat-card">
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Top Vehicles Revenue</h3>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer><BarChart data={financialData} layout="vertical"><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Bar dataKey="revenue" fill="#0d9488" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer>
                    </div>
                  </div>
                  <div className="stat-card">
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Mode Share</h3>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer><PieChart><Pie data={[{name:'E-Bike',v:65},{name:'Bus',v:35}]} dataKey="v" innerRadius={60} outerRadius={80}><Cell fill="#0d9488"/><Cell fill="#3b82f6"/></Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>
                    </div>
                  </div>
                  <div className="stat-card" style={{ border: '1px solid #fecaca' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444', marginBottom: '16px' }}>📉 Underperforming (Redistribution Needed)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { id: 'V0321', rev: '1.2M', reason: 'Low Demand' },
                        { id: 'V0884', rev: '0.8M', reason: 'Maintenance' },
                        { id: 'V1022', rev: '2.1M', reason: 'Competition' }
                      ].map(v => (
                        <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fff1f2', borderRadius: '8px', fontSize: '12px' }}>
                          <span style={{ fontWeight: '700' }}>{v.id}</span>
                          <span style={{ color: '#ef4444' }}>{v.rev}₫</span>
                        </div>
                      ))}
                    </div>
                    <button style={{ width: '100%', marginTop: '20px', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca', background: 'white', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}>Action Plan →</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customer' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '24px' }}>
                <div className="stat-card">
                  <h3>Weather Impact Analysis</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#fffbeb', borderRadius: '12px', marginBottom: '16px', border: '1px solid #fef3c7' }}>
                    <div style={{ fontSize: '24px' }}>⚠️</div>
                    <div style={{ fontSize: '12px', color: '#92400e' }}><b>Rain Warning:</b> Expect 15% drop in E-bike demand in District 1. Increasing Shuttle Bus frequency recommended.</div>
                  </div>
                  <div style={{ height: '200px' }}><ResponsiveContainer><BarChart data={weatherData}><XAxis dataKey="condition"/><YAxis hide/><Tooltip/><Bar dataKey="trips">{weatherData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar></BarChart></ResponsiveContainer></div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}><h3>Churn Prediction</h3><div style={{ fontSize: '48px', fontWeight: '800', color: '#ef4444', margin: '40px 0' }}>4.2%</div><p style={{ color: '#64748b', fontSize: '12px' }}>AI recommendation: Send 10% voucher to 'Casual' users</p></div>
                <div className="stat-card">
                  <h3>User Segmentation</h3>
                  {[{l:'Power Users',v:45,c:'#0d9488'},{l:'Regulars',v:35,c:'#3b82f6'},{l:'Casuals',v:20,c:'#94a3b8'}].map((s,i)=>(
                    <div key={i} style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>{s.l}</span><span>{s.v}%</span></div>
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}><div style={{ width: `${s.v}%`, height: '100%', background: s.c, borderRadius: '4px' }}/></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'internal' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div className="stat-card">
                  <h3>Fleet Health Index</h3>
                  <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '42px', fontWeight: '800', color: '#10b981' }}>94/100</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Excellent Status</div>
                     </div>
                  </div>
                  <div style={{ height: '100px' }}><ResponsiveContainer><PieChart><Pie data={maintenanceData} dataKey="value" innerRadius={35} outerRadius={45}>{maintenanceData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
                </div>
                <div className="stat-card"><h3>Live Utilization Flow</h3><div style={{ height: '300px' }}><ResponsiveContainer><AreaChart data={[{n:'08:00',u:92},{n:'10:00',u:65},{n:'12:00',u:45},{n:'14:00',u:55},{n:'16:00',u:75},{n:'18:00',u:95}]}><XAxis dataKey="n"/><YAxis/><Tooltip/><Area type="monotone" dataKey="u" fill="#0d9488" stroke="#0d9488" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div style={{ background: '#1e293b', borderRadius: '20px', padding: '32px', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0 }}>✨ AI Demand Prediction (Next 48h)</h3>
                    <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>ACCURACY: 98.2%</div>
                  </div>
                  <div style={{ height: '300px' }}><ResponsiveContainer><LineChart data={[{n:'Mon',a:420,f:420},{n:'Tue',a:450,f:460},{n:'Wed',a:480,f:470},{n:'Thu',f:510},{n:'Fri',f:550}]}><XAxis dataKey="n" stroke="rgba(255,255,255,0.5)"/><YAxis stroke="rgba(255,255,255,0.5)"/><Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155'}}/><Line dataKey="a" name="Actual" stroke="#10b981" strokeWidth={4} dot={{fill:'#10b981'}}/><Line dataKey="f" name="Forecast" stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5"/></LineChart></ResponsiveContainer></div>
                </div>
                <div className="stat-card">
                  <h3>Strategic Objectives (OKRs)</h3>
                  {[
                    {l:'AI-Driven Optimization',v:75, t:'Target: 90%'},
                    {l:'Carbon Neutrality',v:100, t:'Target: 100%'},
                    {l:'Operational ROI',v:85, t:'Target: 95%'}
                  ].map((s,i)=>(
                    <div key={i} style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}><span>{s.l}</span><span style={{ color: '#0d9488' }}>{s.v}%</span></div>
                      <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px' }}><div style={{ width: `${s.v}%`, height: '100%', background: '#0d9488', borderRadius: '5px' }}/></div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{s.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div style={{ height: '600px', background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <MapContainer center={[10.7769, 106.7009]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {fleetStatus.map(v => (
                    <Marker key={v.id} position={[v.lat, v.lng]}>
                      <Popup><b>{v.id}</b><br/>Battery: {v.power}<br/>Status: {v.status}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>{activeModal === 'filters' ? '⚗️ Filters' : '📥 Export'}</h3>
              <button onClick={() => setActiveModal(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            {activeModal === 'filters' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label>E-Bikes</label> <input type="checkbox" checked={tempFilters.ebike} onChange={() => setTempFilters({...tempFilters, ebike: !tempFilters.ebike})} /></div>
                <div><label>Shuttles</label> <input type="checkbox" checked={tempFilters.shuttle} onChange={() => setTempFilters({...tempFilters, shuttle: !tempFilters.shuttle})} /></div>
                <button onClick={() => { setFilters(tempFilters); setActiveModal(null); }} style={{ background: '#0d9488', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Apply</button>
              </div>
            )}
            {activeModal === 'export' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={handleDownloadPDF} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>📄 PDF</button>
                <button onClick={handleDownloadCSV} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>📊 CSV</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: '12px', zIndex: 2000 }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}
