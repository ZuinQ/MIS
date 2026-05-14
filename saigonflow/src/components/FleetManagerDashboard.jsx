import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { time: '06:00', trips: 120, revenue: 1.2 },
  { time: '09:00', trips: 850, revenue: 8.5 },
  { time: '12:00', trips: 420, revenue: 4.2 },
  { time: '15:00', trips: 510, revenue: 5.1 },
  { time: '18:00', trips: 1100, revenue: 11.0 },
  { time: '21:00', trips: 340, revenue: 3.4 }
]

export default function FleetManagerDashboard() {
  const [activeTab, setActiveTab] = useState('map') // map, status, analytics, alerts
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Topbar */}
      <div style={{ background: '#0d9488', padding: '16px 32px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>SaigonFlow Fleet Control</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Unified Operations Dashboard</div>
          </div>
          <div style={{ marginLeft: '32px', display: 'flex', gap: '8px' }}>
            {['🔄 Refresh Data', '⚗️ Filters', '📥 Export Report', '⚙️ Settings'].map(btn => (
              <button key={btn} style={{
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
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>FM</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { 
              title: 'Financial', icon: '$', val: '12.4M₫', color: '#10b981', trend: '↗',
              sub: 'Revenue Today', progress: 62, target: '20M₫',
              stats: [{ label: 'Revenue/Vehicle:', val: '26,400₫', color: '#10b981' }, { label: 'Operating Margin:', val: '18.5%', color: '#10b981' }]
            },
            { 
              title: 'Customer', icon: '👥', val: '4.7★', color: '#3b82f6', badge: '+0.2',
              sub: 'Customer Satisfaction', progress: 100, target: '4.5★ (Exceeded)',
              stats: [{ label: 'Active Users:', val: '1,247', color: '#3b82f6' }, { label: 'Churn Rate:', val: '3.2% ↓', color: '#10b981' }]
            },
            { 
              title: 'Operations', icon: '⏱', val: '98.2%', color: '#8b5cf6', badge: '✓',
              sub: 'Fleet Uptime', progress: 98, target: '98% (On Track)',
              stats: [{ label: 'Avg. Response Time:', val: '4.2 min', color: '#8b5cf6' }, { label: 'Maintenance Rate:', val: '1.4%', color: '#8b5cf6' }]
            },
            { 
              title: 'Growth', icon: '📈', val: '+24%', color: '#f97316', trend: '↗',
              sub: 'MoM Trip Growth', progress: 80, target: '3,521 trips today vs 2,840 avg',
              stats: [{ label: 'New Users (MTD):', val: '+186', color: '#f97316' }, { label: 'AI Adoption:', val: '67%', color: '#f97316' }]
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
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>{card.progress}% of daily target ({card.target})</div>

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
        <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
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
          {activeTab === 'map' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>◎</span> Real-Time Fleet Map
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>📈 847 Active Trips</div>
                </div>
                <div style={{ flex: 1, position: 'relative', background: '#f8fafc' }}>
                  {/* Fake Grid Background */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  {/* Fake Roads */}
                  <div style={{ position: 'absolute', top: '30%', left: 0, width: '100%', height: '24px', background: '#fcd34d', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', top: 0, left: '25%', width: '24px', height: '100%', background: '#fcd34d', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', top: '70%', left: 0, width: '100%', height: '16px', background: '#fcd34d', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', top: 0, left: '70%', width: '16px', height: '100%', background: '#fcd34d', opacity: 0.5 }} />

                  {/* UI Overlay */}
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} className="animate-pulse" /> Live • 3s ago
                  </div>
                  <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <button style={{ padding: '8px 12px', border: 'none', background: 'transparent', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}>+</button>
                    <button style={{ padding: '8px 12px', border: 'none', background: 'transparent', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                  </div>

                  {/* Legend */}
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px' }}>Fleet Status Legend</div>
                    {[
                      { c: '#10b981', l: 'E-bikes Active:', v: '425' },
                      { c: '#34d399', l: 'E-bikes Available:', v: '512' },
                      { c: '#3b82f6', l: 'Shuttles Active:', v: '82' },
                      { c: '#a855f7', l: 'Metro Stations:', v: '12' },
                      { c: '#ef4444', l: 'Maintenance:', v: '13' }
                    ].map(l => (
                      <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.c }} />
                        <span style={{ color: '#64748b' }}>{l.l}</span>
                        <span style={{ fontWeight: '700', color: l.c }}>{l.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fake Dots */}
                  <div style={{ position: 'absolute', top: '30%', left: '25%', background: '#a855f7', width: '32px', height: '32px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transform: 'translate(-50%, -50%)', border: '2px solid white' }}>🚇</div>
                  <div style={{ position: 'absolute', top: '25%', left: '20%', background: '#10b981', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} />
                  <div style={{ position: 'absolute', top: '35%', left: '22%', background: '#10b981', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} />
                  <div style={{ position: 'absolute', top: '32%', left: '28%', background: '#10b981', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} />
                  <div style={{ position: 'absolute', top: '28%', left: '30%', background: '#3b82f6', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white' }} />
                  
                  <div style={{ position: 'absolute', top: '70%', left: '70%', background: '#a855f7', width: '32px', height: '32px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transform: 'translate(-50%, -50%)', border: '2px solid white' }}>🚇</div>
                  <div style={{ position: 'absolute', top: '65%', left: '68%', background: '#10b981', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} />
                  <div style={{ position: 'absolute', top: '75%', left: '72%', background: '#10b981', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} />
                  <div style={{ position: 'absolute', top: '72%', left: '65%', background: '#ef4444', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} />
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
                    <div style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>5</div>
                  </div>
                  
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>❗</span> Low Battery Critical
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>2 min ago</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', paddingLeft: '22px' }}>8 E-bikes &lt; 20% battery</div>
                  </div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>⚠️</span> High Demand Zone
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>5 min ago</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', paddingLeft: '22px' }}>District 1 - Ben Thanh</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Vehicle Fleet Overview</h3>
                
                {/* E-bikes Fleet */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981' }}>⚡</span> E-bikes Fleet
                    </div>
                    <div style={{ fontSize: '12px', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '12px' }}>950 Total</div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Active (In Trip)</span>
                      <span style={{ fontWeight: '700', color: '#10b981' }}>425 (45%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', background: '#1e293b' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Available (Parked)</span>
                      <span style={{ fontWeight: '700', color: '#64748b' }}>512 (54%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '54%', height: '100%', background: '#1e293b' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Maintenance</span>
                      <span style={{ fontWeight: '700', color: '#ef4444' }}>13 (1%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '1%', height: '100%', background: '#ef4444' }} />
                    </div>
                  </div>
                </div>

                <hr style={{ borderTop: '1px dashed #e2e8f0', borderBottom: 'none', margin: '32px 0' }} />

                {/* Shuttle Fleet */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#3b82f6' }}>🚌</span> Shuttle Fleet
                    </div>
                    <div style={{ fontSize: '12px', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '12px' }}>150 Total</div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Active (In Service)</span>
                      <span style={{ fontWeight: '700', color: '#3b82f6' }}>82 (55%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '55%', height: '100%', background: '#1e293b' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>🔋</span> Battery Health Distribution
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Excellent (80-100%)</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>742 bikes (78%)</span>
                  </div>
                  <div style={{ height: '12px', background: '#d1fae5', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: '#1e293b' }} />
                  </div>
                </div>

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

          {activeTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Revenue & Utilization Trend</h3>
                <div style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="trips" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Today's Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Total Trips:</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>3,521</span>
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

          {activeTab === 'alerts' && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>System Alerts Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>❗</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '14px' }}>Low Battery Critical</div>
                      <div style={{ color: '#64748b', fontSize: '13px' }}>8 E-bikes dropping below 20% battery in District 1</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#94a3b8', fontSize: '12px' }}>2 min ago</div>
                    <button style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>Dispatch Team</button>
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚠️</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#d97706', fontSize: '14px' }}>High Demand Zone</div>
                      <div style={{ color: '#64748b', fontSize: '13px' }}>Unusual spike detected in Ben Thanh. AI suggests rebalancing.</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#94a3b8', fontSize: '12px' }}>5 min ago</div>
                    <button style={{ background: '#d97706', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>Auto-Rebalance</button>
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>ℹ️</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#3b82f6', fontSize: '14px' }}>Station Overflow</div>
                      <div style={{ color: '#64748b', fontSize: '13px' }}>Ba Son station has 42 bikes parked (capacity: 40)</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#94a3b8', fontSize: '12px' }}>12 min ago</div>
                    <button style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>Review</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
