export default function HomeScreen({ nav }) {
  const vehicles = [
    { type: '⚡', name: 'E-bike #E945', dist: '50m', bat: 92, color: '#10b981' },
    { type: '⚡', name: 'E-bike #E723', dist: '120m', bat: 85, color: '#10b981' },
    { type: '🚌', name: 'Shuttle #S012', dist: '300m', seats: 8, color: '#3b82f6' },
    { type: '🚇', name: 'Metro Line 1', dist: '3 min', next: '5 min', color: '#8b5cf6' },
  ]

  return (
    <div style={{ background: '#f8fafc' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(160deg, #065f46 0%, #0d9488 60%, #0284c7 100%)',
        padding: '20px 20px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* BG decorations */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '4px' }}>Chào buổi sáng 👋</div>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: '800' }}>Minh Nguyễn</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '2px' }}>📍 Quận 1, TP.HCM</div>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', cursor: 'pointer'
          }}>👤</div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { val: '42', label: 'Trips', icon: '🚲' },
            { val: '425k₫', label: 'Balance', icon: '💳' },
            { val: '18kg', label: 'CO₂ Cut', icon: '🌿' }
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* AI Search Box */}
        <div
          onClick={() => nav('ai')}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '14px 16px',
            marginBottom: '16px',
            border: '2px solid #d1fae5',
            boxShadow: '0 4px 16px rgba(16,185,129,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}>✨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>AI Travel Assistant</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Bạn muốn đi đâu hôm nay?</div>
          </div>
          <div style={{ color: '#10b981', fontSize: '18px' }}>→</div>
        </div>

        {/* Live Map Preview */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Map */}
          <div style={{
            height: '180px',
            background: 'linear-gradient(135deg, #e0f2fe, #d1fae5, #e0e7ff)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Roads */}
            <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: '8px', background: 'rgba(253,224,71,0.5)', borderTop: '1px solid rgba(202,138,4,0.4)', borderBottom: '1px solid rgba(202,138,4,0.4)' }} />
            <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: '5px', background: 'rgba(253,224,71,0.35)' }} />
            <div style={{ position: 'absolute', left: '35%', top: 0, bottom: 0, width: '6px', background: 'rgba(253,224,71,0.45)' }} />
            <div style={{ position: 'absolute', left: '70%', top: 0, bottom: 0, width: '4px', background: 'rgba(253,224,71,0.35)' }} />

            {/* River */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: '50%', height: '50px', background: 'rgba(96,165,250,0.25)', borderTopRightRadius: '60px' }} />

            {/* User dot */}
            <div style={{ position: 'absolute', top: '38%', left: '38%', zIndex: 20 }}>
              <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }} />
              <div style={{ position: 'absolute', inset: '-4px', background: 'rgba(59,130,246,0.2)', borderRadius: '50%' }} className="animate-ping" />
            </div>

            {/* E-bikes */}
            {[['30%','50%'],['48%','60%'],['25%','60%'],['55%','35%']].map(([t,l], i) => (
              <div key={i} style={{ position: 'absolute', top: t, left: l }}>
                <div style={{ width: '24px', height: '24px', background: '#10b981', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', boxShadow: '0 2px 8px rgba(16,185,129,0.4)' }}>⚡</div>
              </div>
            ))}

            {/* Shuttle */}
            <div style={{ position: 'absolute', top: '50%', left: '65%' }}>
              <div style={{ width: '28px', height: '22px', background: '#3b82f6', borderRadius: '6px', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }}>🚌</div>
            </div>

            {/* Metro */}
            <div style={{ position: 'absolute', top: '30%', left: '28%' }}>
              <div style={{ width: '28px', height: '28px', background: '#8b5cf6', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 2px 8px rgba(139,92,246,0.4)' }}>🚇</div>
            </div>

            {/* Location badge */}
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
              borderRadius: '20px', padding: '4px 12px',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: '600', color: '#1e293b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }} className="animate-pulse" />
              Quận 1, TP.HCM
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '12px' }}>
            {[
              { icon: '⚡', val: '8', label: 'E-bikes', color: '#10b981' },
              { icon: '🚌', val: '2', label: 'Shuttles', color: '#3b82f6' },
              { icon: '🚇', val: '3min', label: 'to Metro', color: '#8b5cf6' }
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', marginBottom: '2px' }}>{s.icon}</div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { icon: '⚡', label: 'E-Bike', color: '#10b981', bg: '#d1fae5', screen: 'trip' },
            { icon: '🚌', label: 'Shuttle', color: '#3b82f6', bg: '#dbeafe', screen: 'trip' },
            { icon: '🚇', label: 'Metro', color: '#8b5cf6', bg: '#ede9fe', screen: 'wallet' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => nav(a.screen)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px 8px',
                border: `1px solid ${a.bg}`,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: a.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', margin: '0 auto 8px'
              }}>{a.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{a.label}</div>
            </button>
          ))}
        </div>

        {/* Nearby Vehicles */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b' }}>Nearby Vehicles</div>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>See All →</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {vehicles.map((v, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px',
                  background: `${v.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>{v.type}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{v.name}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    📍 {v.dist} away
                    {v.bat && ` • 🔋 ${v.bat}%`}
                    {v.seats && ` • 💺 ${v.seats} seats`}
                    {v.next && ` • Next: ${v.next}`}
                  </div>
                </div>
                <button
                  onClick={() => nav('trip')}
                  style={{
                    background: v.color,
                    color: 'white', border: 'none',
                    padding: '5px 12px', borderRadius: '8px',
                    fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    flexShrink: 0
                  }}>Book</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
