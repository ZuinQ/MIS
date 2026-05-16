import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import html2pdf from 'html2pdf.js'
import { 
  financialKPIs, topVehicles, bottomVehicles, revenueTrend, revenueByService,
  customerKPIs, weatherImpactData, churnRiskData,
  stationNetFlow, revenueByStation, maintenanceStatus, batteryData,
  appPerformance, featureAdoption,
  liveVehicles, alerts, strategicOKRs
} from '../data/dashboardData'

function MapResizer({ activeTab }) {
  const map = useMap();
  useEffect(() => {
    if (activeTab === 'map') {
      setTimeout(() => { map.invalidateSize(); }, 200);
    }
  }, [activeTab, map]);
  return null;
}

const COLORS = ['#3b82f6', '#1d4ed8', '#1e3a8a', '#f97316', '#ea580c'];

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState('financial')
  const [activeModal, setActiveModal] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const handleDownloadPDF = () => {
    const originalTab = activeTab;
    setActiveTab('all_for_pdf');
    
    setTimeout(() => {
      const element = document.getElementById('dashboard-export-area');
      const opt = {
        margin: [15, 15, 15, 15],
        filename: 'SaigonFlow_Executive_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      
      html2pdf().set(opt).from(element).save().then(() => {
        setActiveTab(originalTab);
      });
    }, 2000); // More time for layout to settle
  }

  const renderKPI = (label, value, sub) => (
    <div className="kpi-card" style={{ breakInside: 'avoid' }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )

  const renderFinancial = () => (
    <div className="perspective-section no-break">
      <h2 className="perspective-header" style={{ marginTop: 0, pageBreakBefore: 'avoid' }}>FINANCIAL PERSPECTIVE</h2>
      <div className="pdf-grid-row">
        <div className="pdf-col-1">
           {renderKPI("Total Revenue", financialKPIs.totalRevenueFormatted, "Sum of Fare_VND")}
           <div className="chart-container" style={{ marginTop: '20px' }}>
             <div className="chart-title">Revenue By Service</div>
             <div style={{ height: '300px' }}>
               <ResponsiveContainer><PieChart><Pie data={revenueByService} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>{revenueByService.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>
             </div>
           </div>
        </div>
        <div className="pdf-col-2">
           <div className="chart-container">
              <div className="chart-title">Top 10 Most Profitable Vehicles</div>
              <div style={{ height: '450px' }}>
                <ResponsiveContainer><BarChart data={topVehicles} layout="vertical"><XAxis type="number" hide/><YAxis dataKey="id" type="category" width={80}/><Tooltip/><Bar dataKey="revenue" fill="#3b82f6" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
              </div>
           </div>
        </div>
        <div className="pdf-col-2">
           <div className="chart-container">
              <div className="chart-title">Bottom 10 Least Profitable Vehicles</div>
              <div style={{ height: '450px' }}>
                <ResponsiveContainer><BarChart data={bottomVehicles} layout="vertical"><XAxis type="number" hide/><YAxis dataKey="id" type="category" width={80}/><Tooltip/><Bar dataKey="revenue" fill="#3b82f6" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
      <div className="chart-container" style={{ marginTop: '24px' }}>
        <div className="chart-title">Revenue Trend</div>
        <div style={{ height: '350px' }}>
           <ResponsiveContainer><AreaChart data={revenueTrend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date"/><YAxis/><Tooltip/><Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1}/></AreaChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderCustomer = () => (
    <div className="perspective-section">
      <h2 className="perspective-header">CUSTOMER PERSPECTIVE</h2>
      <div className="pdf-grid-row">
        {renderKPI("Total Users", customerKPIs.totalUsers.toLocaleString(), "Count of UserID")}
        {renderKPI("Churned Users", customerKPIs.churnedUsers, "Count of Has_Churned")}
        {renderKPI("Churn Rate", customerKPIs.churnRate, "Churn Rate")}
      </div>
      <div className="pdf-grid-row" style={{ marginTop: '24px' }}>
        <div className="pdf-col-2">
           <div className="chart-container">
              <div className="chart-title">Commuter Behavior by Weather Conditions</div>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer><BarChart data={weatherImpactData}><XAxis dataKey="condition"/><YAxis/><Tooltip/><Legend/><Bar dataKey="E-Bike" stackId="a" fill="#3b82f6"/><Bar dataKey="Metro/Bus" stackId="a" fill="#ea580c"/><Bar dataKey="Shuttle" stackId="a" fill="#1e3a8a"/></BarChart></ResponsiveContainer>
              </div>
           </div>
        </div>
        <div className="pdf-col-1">
           <div className="chart-container">
              <div className="chart-title">Churn Risk Ratio</div>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer><PieChart><Pie data={churnRiskData} dataKey="value" outerRadius={100}>{churnRiskData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>
              </div>
           </div>
        </div>
        <div className="pdf-col-1">
           <div className="chart-container" style={{ height: '100%' }}>
              <div className="chart-title">Confusion Matrix</div>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead><tr style={{ background: '#f1f5f9' }}><th>Actual</th><th>High Risk</th><th>Loyal</th><th>Total</th></tr></thead>
                <tbody style={{ textAlign: 'center' }}>
                  <tr><td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>Loyal</td><td style={{ border: '1px solid #e2e8f0' }}>30</td><td style={{ border: '1px solid #e2e8f0' }}>420</td><td style={{ border: '1px solid #e2e8f0' }}>450</td></tr>
                  <tr><td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>High Risk</td><td style={{ border: '1px solid #e2e8f0' }}>205</td><td style={{ border: '1px solid #e2e8f0' }}>45</td><td style={{ border: '1px solid #e2e8f0' }}>250</td></tr>
                  <tr style={{ fontWeight: 'bold' }}><td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>Total</td><td style={{ border: '1px solid #e2e8f0' }}>235</td><td style={{ border: '1px solid #e2e8f0' }}>465</td><td style={{ border: '1px solid #e2e8f0' }}>700</td></tr>
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );

  const renderInternal = () => (
    <div className="perspective-section">
      <h2 className="perspective-header">INTERNAL PROCESS PERSPECTIVE</h2>
      <div className="pdf-grid-row">
         <div className="pdf-col-3">
            <div className="chart-container">
               <div className="chart-title">Station_Net_Flow by Station_Name</div>
               <div style={{ height: '350px' }}>
                 <ResponsiveContainer><BarChart data={stationNetFlow}><XAxis dataKey="name" fontSize={10}/><YAxis/><Tooltip/><Bar dataKey="flow">{stationNetFlow.map((e,i)=><Cell key={i} fill={e.flow >= 0 ? '#10b981' : '#ef4444'}/>)}</Bar></BarChart></ResponsiveContainer>
               </div>
            </div>
         </div>
         <div className="pdf-col-1">
            <div className="chart-container" style={{ textAlign: 'center', height: '100%' }}>
               <div className="chart-title">Fleet Utilization</div>
               <div style={{ fontSize: '64px', fontWeight: '800', color: '#3b82f6', marginTop: '100px' }}>2.02K</div>
               <div style={{ color: '#94a3b8' }}>Target: 4.05K</div>
            </div>
         </div>
      </div>
      <div className="pdf-grid-row" style={{ marginTop: '24px' }}>
         <div className="pdf-col-1">
            <div className="chart-container">
               <div className="chart-title">Maintenance Status</div>
               <div style={{ height: '300px' }}>
                  <ResponsiveContainer><PieChart><Pie data={maintenanceStatus} dataKey="value" innerRadius={60} outerRadius={80}>{maintenanceStatus.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>
               </div>
            </div>
         </div>
         <div className="pdf-col-3">
            <div className="chart-container">
               <div className="chart-title">Average Battery Level Station</div>
               <div style={{ height: '300px' }}>
                 <ResponsiveContainer><BarChart data={batteryData}><XAxis dataKey="name" fontSize={10}/><YAxis domain={[0,100]}/><Tooltip/><Bar dataKey="battery" fill="#3b82f6"/></BarChart></ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderGrowth = () => (
    <div className="perspective-section">
      <h2 className="perspective-header">LEARNING & GROWTH PERSPECTIVE</h2>
      <div className="pdf-grid-row">
         <div className="pdf-col-3">
            <div className="chart-container">
               <div className="chart-title">App Integration Performance</div>
               <div style={{ height: '450px' }}>
                  <ResponsiveContainer><ComposedChart data={appPerformance}><XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/><Bar dataKey="latency" fill="#3b82f6"/><Line type="monotone" dataKey="error" stroke="#1e3a8a"/></ComposedChart></ResponsiveContainer>
            </div>
         </div>
         </div>
         <div className="pdf-col-1">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
               <div className="chart-container">
                  <div className="chart-title">Target Achievement</div>
                  <div style={{ fontSize: '64px', fontWeight: '800', textAlign: 'center', color: '#3b82f6' }}>75%</div>
               </div>
               <div className="chart-container" style={{ flex: 1 }}>
                  <div className="chart-title">New Feature Adoption</div>
                  {featureAdoption.map((f,i)=>(
                    <div key={i} style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}><span>{f.name}</span><span>{f.value}</span></div>
                      <div style={{ height: '24px', background: '#3b82f6', width: `${(f.value/1000)*100}%`, borderRadius: '2px' }}/>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Row: Operational Gauges */}
      <div className="pdf-grid-row" style={{ gap: '20px' }}>
         <div className="chart-container" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚲</div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>E-BIKES AVAILABLE</div>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>24/30</div>
              <div style={{ height: '4px', width: '100px', background: '#e2e8f0', marginTop: '4px', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '80%', background: '#10b981', borderRadius: '2px' }} />
              </div>
            </div>
         </div>
         <div className="chart-container" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚐</div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>SHUTTLES IN-SERVICE</div>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>8/10</div>
              <div style={{ height: '4px', width: '100px', background: '#e2e8f0', marginTop: '4px', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '80%', background: '#3b82f6', borderRadius: '2px' }} />
              </div>
            </div>
         </div>
         <div className="chart-container" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>AVG. FLEET POWER</div>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>84.5%</div>
              <div style={{ height: '4px', width: '100px', background: '#e2e8f0', marginTop: '4px', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '84%', background: '#f59e0b', borderRadius: '2px' }} />
              </div>
            </div>
         </div>
      </div>

      {/* Middle Row: Map & Alerts */}
      <div className="pdf-grid-row" style={{ height: '600px', gap: '20px' }}>
        {/* Left Column: Live Map */}
        <div className="pdf-col-3" style={{ height: '100%', background: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15px', left: '60px', zIndex: 1000, background: 'rgba(255,255,255,0.9)', padding: '8px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 'bold' }}>
            🟢 SYSTEM STATUS: OPERATIONAL
          </div>
          <MapContainer center={[10.7769, 106.7009]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapResizer activeTab={activeTab} />
            {liveVehicles.map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]}>
                <Popup><b>{v.id}</b><br/>Type: {v.type}<br/>Battery: {v.power}%<br/>Status: {v.status}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Column: Alerts & Live Feed */}
        <div className="pdf-col-1" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {/* Critical System Alerts */}
          <div className="chart-container" style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
            <div className="chart-title" style={{ fontSize: '12px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span>SYSTEM ALERTS</span>
              <span style={{ color: '#ef4444' }}>● LIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{ padding: '10px', background: alert.level === 'Critical' ? '#fff1f2' : '#fffbeb', borderLeft: `4px solid ${alert.level === 'Critical' ? '#ef4444' : '#f59e0b'}`, borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold' }}>
                    <span style={{ color: alert.level === 'Critical' ? '#be123c' : '#b45309' }}>{alert.type}</span>
                    <span style={{ color: '#64748b' }}>{alert.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>{alert.msg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="chart-container" style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#1e293b', color: 'white' }}>
            <div className="chart-title" style={{ fontSize: '12px', marginBottom: '15px', color: '#94a3b8' }}>LIVE ACTIVITY LOG</div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <div style={{ color: '#10b981' }}>[14:28:01] Trip #T942 Started - User #U102</div>
               <div style={{ color: '#3b82f6' }}>[14:27:45] Vehicle #V0882 Arrived @ Ga Ben Thanh</div>
               <div style={{ color: '#f59e0b' }}>[14:26:12] Battery Warning: Vehicle #V0113 @ 18%</div>
               <div style={{ color: '#94a3b8' }}>[14:25:30] System Scan: 40/40 units pinged.</div>
               <div style={{ color: '#10b981' }}>[14:24:05] FlowPass Top-up: 200,000 VND - User #U452</div>
               <div style={{ color: '#3b82f6' }}>[14:23:11] Shuttle #S01 dispatched to Thao Dien</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Detailed Vehicle Status Table */}
      <div className="chart-container">
        <div className="chart-title" style={{ fontSize: '14px' }}>Real-time Fleet Status Detailed Table</div>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>VEHICLE ID</th>
              <th>TYPE</th>
              <th>BATTERY</th>
              <th>CURRENT LOCATION</th>
              <th>STATUS</th>
              <th>LAST CONNECT</th>
            </tr>
          </thead>
          <tbody>
            {liveVehicles.map((v, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{v.id}</td>
                <td>{v.type}</td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${v.power}%`, background: v.power < 20 ? '#ef4444' : '#10b981', borderRadius: '3px' }} />
                      </div>
                      <span>{v.power}%</span>
                   </div>
                </td>
                <td style={{ color: '#64748b' }}>{v.lat.toFixed(4)}, {v.lng.toFixed(4)}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', background: v.status === 'In-use' ? '#dcfce7' : '#f1f5f9', color: v.status === 'In-use' ? '#166534' : '#64748b' }}>
                    {v.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: '#94a3b8' }}>2s ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Part 1: Strategy Map (Conceptual Flow) */}
      <div className="chart-container">
        <div className="chart-title">SaigonFlow Strategy Map (BSC Framework)</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0', position: 'relative' }}>
          {/* Connecting Lines */}
          <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
          
          {[
            { step: 'GROWTH', color: '#1e3a8a', label: 'AI & Talent' },
            { step: 'PROCESS', color: '#3b82f6', label: 'Fleet Rebalance' },
            { step: 'CUSTOMER', color: '#10b981', label: 'Commuter Intimacy' },
            { step: 'FINANCIAL', color: '#0d9488', label: 'Revenue Growth' }
          ].map((s, i) => (
            <div key={i} style={{ zIndex: 1, textAlign: 'center', width: '180px' }}>
              <div style={{ width: '80px', height: '80px', background: s.color, borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {s.step}
              </div>
              <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: OKR Progress Tracking */}
      <div className="pdf-grid-row">
        <div className="pdf-col-2">
          <div className="chart-container">
            <div className="chart-title">Executive OKR Progress Tracking</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {strategicOKRs.map((okr, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{okr.label}</span>
                    <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{okr.progress}%</span>
                  </div>
                  <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${okr.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #1e3a8a)', borderRadius: '6px' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{okr.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Part 3: Long-term Action Plan Table */}
        <div className="pdf-col-2">
          <div className="chart-container">
            <div className="chart-title">3-Year Strategic Action Plan (2026-2028)</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '10px' }}>Phase</th>
                  <th>Core Focus</th>
                  <th>Prescriptive Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { p: 'Phase 1', f: 'Optimization', a: 'Deploy Dynamic Rebalancing via Dashboard', c: '#dcfce7' },
                  { p: 'Phase 2', f: 'Expansion', a: 'Metro Line 1 API Integration', c: '#dbeafe' },
                  { p: 'Phase 3', f: 'Ecosystem', a: 'Open MaaS Partnership Program', c: '#fef3c7' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px 10px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: row.c, fontWeight: 'bold' }}>{row.p}</span></td>
                    <td style={{ fontWeight: '600' }}>{row.f}</td>
                    <td style={{ color: '#64748b' }}>{row.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <style>{`
        .kpi-card { background: white; padding: 20px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #3b82f6; }
        .kpi-label { font-size: 14px; color: #64748b; font-weight: 600; }
        .kpi-value { font-size: 32px; font-weight: 700; color: #1e293b; margin: 8px 0; }
        .kpi-sub { font-size: 12px; color: #94a3b8; }
        .chart-container { background: white; padding: 20px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); break-inside: avoid; }
        .chart-title { font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 20px; text-transform: uppercase; }
        .perspective-header { font-size: 32px; font-weight: 800; color: #b91c1c; margin-bottom: 30px; border-bottom: 3px solid #b91c1c; padding-bottom: 12px; }
        
        .pdf-grid-row { display: flex; gap: 24px; width: 100%; }
        .pdf-col-1 { flex: 1; }
        .pdf-col-2 { flex: 2; }
        .pdf-col-3 { flex: 3; }
        
        .perspective-section { page-break-before: always; }
        .perspective-section.no-break { page-break-before: avoid; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'white', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0d9488', margin: 0 }}>SaigonFlow | BI Analytics</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['operations', 'financial', 'customer', 'internal', 'growth', 'strategy'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: activeTab === t ? '#3b82f6' : 'transparent', color: activeTab === t ? 'white' : '#64748b', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}>{t.toUpperCase()}</button>
          ))}
          <button onClick={handleDownloadPDF} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'white', fontWeight: '600', cursor: 'pointer' }}>EXPORT REPORT</button>
        </div>
      </div>

      <div id="dashboard-export-area" style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {(activeTab === 'operations' || activeTab === 'all_for_pdf') && renderOperations()}
          {(activeTab === 'financial' || activeTab === 'all_for_pdf') && renderFinancial()}
          {(activeTab === 'customer' || activeTab === 'all_for_pdf') && renderCustomer()}
          {(activeTab === 'internal' || activeTab === 'all_for_pdf') && renderInternal()}
          {(activeTab === 'growth' || activeTab === 'all_for_pdf') && renderGrowth()}
          {activeTab === 'strategy' && renderStrategy()}

        </div>
      </div>
    </div>
  );
}
