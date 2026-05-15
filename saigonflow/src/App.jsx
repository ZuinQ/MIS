import { useState } from 'react'
import CommuterSuperApp from './components/CommuterSuperApp.jsx'
import FleetManagerDashboard from './components/FleetManagerDashboard.jsx'
import './index.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('mobile')
  const [user] = useState({
    full_name: 'Minh Nguyễn',
    email: 'minh.nguyen@email.com',
    phone: '0987 654 321',
    balance: 500000,
    badge: 'Thành viên Hạng Vàng 🌟'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #f1f5f9 50%, #eff6ff 100%)' }}>
      {/* Top Nav */}
      <nav className="no-print" style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'linear-gradient(135deg, #10b981, #0d9488)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}>🚀</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>SaigonFlow</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '-2px' }}>Unified Mobility Platform</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          {[
            { id: 'mobile', label: '📱 Commuter App', sub: 'Mobile + AI' },
            { id: 'desktop', label: '🖥️ Fleet Dashboard', sub: 'Real-time Ops' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #10b981, #0d9488)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'
              }}
            >
              {tab.label}
              <span style={{ display: 'block', fontSize: '10px', opacity: 0.8, fontWeight: '400' }}>{tab.sub}</span>
            </button>
          ))}
        </div>

        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700'
          }}>MIS FINAL PROJECT</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>HK2 2025-2026 • Part 2</div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ padding: activeTab === 'mobile' ? '40px 20px' : '24px 24px', transition: 'all 0.3s' }}>
        {activeTab === 'mobile' ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="no-print" style={{
                background: 'white',
                border: '2px solid #d1fae5',
                borderRadius: '16px',
                padding: '16px 24px',
                marginBottom: '24px',
                maxWidth: '400px',
                boxShadow: '0 4px 16px rgba(16,185,129,0.1)'
              }}>
                <div style={{ fontWeight: '800', color: '#059669', fontSize: '14px', marginBottom: '4px' }}>
                  📱 Commuter Super-App — Part 2A
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                  5 connected screens với AI Assistant tích hợp. Click các tab dưới màn hình để điều hướng.
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['✨ AI Assistant', '💳 FlowPass', '🗺️ Live Map', '🤖 Generative AI'].map(tag => (
                    <span key={tag} style={{
                      background: '#d1fae5', color: '#065f46',
                      padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '600'
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
              <CommuterSuperApp user={user} />
            </div>
          </div>
        ) : (
          <FleetManagerDashboard />
        )}
      </main>
    </div>
  )
}
