import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import TripPlannerScreen from './screens/TripPlannerScreen.jsx'
import WalletScreen from './screens/WalletScreen.jsx'
import AIAssistantScreen from './screens/AIAssistantScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'

const NAV_ITEMS = [
  { key: 'home', icon: '🗺️', label: 'Explore' },
  { key: 'trip', icon: '🧭', label: 'Trip' },
  { key: 'ai', icon: '✨', label: 'AI', center: true },
  { key: 'wallet', icon: '💳', label: 'Wallet' },
  { key: 'profile', icon: '👤', label: 'Profile' },
]

export default function CommuterSuperApp() {
  const [screen, setScreen] = useState('home')

  return (
    <div style={{
      width: '393px',
      height: '852px',
      background: '#f8fafc',
      borderRadius: '50px',
      boxShadow: '0 0 0 12px #0f172a, 0 0 0 14px #334155, 0 40px 80px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      border: '10px solid #0f172a',
    }}>
      {/* Dynamic Island */}
      <div style={{
        height: '48px',
        background: 'linear-gradient(135deg, #10b981, #0d9488)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0
      }}>
        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '600' }}>9:41</span>
        <div style={{
          width: '126px', height: '28px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px'
        }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} className="animate-pulse" />
          <span style={{ color: 'white', fontSize: '10px', fontWeight: '600' }}>SaigonFlow</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>📶</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>🔋</span>
        </div>
      </div>

      {/* Screen Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: '80px' }}>
        {screen === 'home' && <HomeScreen nav={setScreen} />}
        {screen === 'trip' && <TripPlannerScreen nav={setScreen} />}
        {screen === 'wallet' && <WalletScreen nav={setScreen} />}
        {screen === 'ai' && <AIAssistantScreen nav={setScreen} />}
        {screen === 'profile' && <ProfileScreen nav={setScreen} />}
      </div>

      {/* Bottom Nav Bar */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '12px',
        right: '12px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5)',
        zIndex: 100,
        padding: '0 8px'
      }}>
        {NAV_ITEMS.map(item => {
          if (item.center) {
            return (
              <div key={item.key} style={{ position: 'relative' }}>
                <button
                  onClick={() => setScreen(item.key)}
                  style={{
                    width: '56px', height: '56px',
                    borderRadius: '50%',
                    background: screen === item.key
                      ? 'linear-gradient(135deg, #059669, #0d9488)'
                      : 'linear-gradient(135deg, #10b981, #0d9488)',
                    border: '3px solid white',
                    marginTop: '-28px',
                    color: 'white',
                    fontSize: '22px',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s',
                    transform: screen === item.key ? 'scale(1.05)' : 'scale(1)'
                  }}
                >{item.icon}</button>
                {/* Notification dot */}
                <div style={{
                  position: 'absolute', top: '-30px', right: '-4px',
                  width: '18px', height: '18px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', color: 'white', fontWeight: '800'
                }}>3</div>
              </div>
            )
          }
          const active = screen === item.key
          return (
            <button
              key={item.key}
              onClick={() => setScreen(item.key)}
              style={{
                border: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '2px',
                padding: '6px 12px', borderRadius: '12px',
                transition: 'all 0.2s',
                background: active ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(13,148,136,0.08))' : 'transparent',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
              <span style={{
                fontSize: '10px', fontWeight: active ? '700' : '500',
                color: active ? '#10b981' : '#94a3b8'
              }}>{item.label}</span>
              {active && (
                <div style={{
                  width: '4px', height: '4px',
                  background: '#10b981', borderRadius: '50%'
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
