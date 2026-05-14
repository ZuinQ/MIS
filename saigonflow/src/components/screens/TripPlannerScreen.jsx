import { useState } from 'react'

export default function TripPlannerScreen({ nav }) {
  const [isBooking, setIsBooking] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isFinding, setIsFinding] = useState(false)
  const [showRoutes, setShowRoutes] = useState(true)

  const [startLoc, setStartLoc] = useState('Ga Bến Thành')
  const [endLoc, setEndLoc] = useState('Thảo Điền, Quận 2')
  const [showLocationSelect, setShowLocationSelect] = useState(false)
  const [selectType, setSelectType] = useState('start') // 'start' or 'end'

  const locations = [
    'Ga Bến Thành, Quận 1',
    'Thảo Điền, Quận 2',
    'Khu Công Nghệ Cao, Quận 9',
    'Làng Đại Học Quốc Gia TP.HCM',
    'Sân bay Tân Sơn Nhất',
    'Khu Đô Thị Phú Mỹ Hưng, Quận 7'
  ]

  const handleSelectLocation = (loc) => {
    if (selectType === 'start') setStartLoc(loc)
    else setEndLoc(loc)
    setShowLocationSelect(false)
  }

  const openSelect = (type) => {
    setSelectType(type)
    setShowLocationSelect(true)
  }

  const handleFindRoutes = () => {
    setIsFinding(true)
    setShowRoutes(false)
    setTimeout(() => {
      setIsFinding(false)
      setShowRoutes(true)
    }, 1500)
  }

  const handleBook = () => {
    setIsBooking(true)
    setTimeout(() => {
      setIsBooking(false)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        nav('wallet')
      }, 1500)
    }, 800)
  }

  const routes = [
    {
      badge: '⚡ Nhanh nhất', badgeColor: '#10b981',
      time: '37 phút', price: '35,000₫',
      eco: true,
      legs: [
        { icon: '🚇', mode: 'Metro Line 1', detail: `${startLoc.split(',')[0]} → ${endLoc.split(',')[0]}`, duration: '25 phút', price: '20,000₫', color: '#8b5cf6' },
        { walk: '🚶 Đi bộ 5 phút đến trạm E-bike' },
        { icon: '⚡', mode: 'E-bike #E945', detail: 'Đến điểm cuối (3.2 km)', duration: '12 phút', price: '15,000₫', color: '#10b981', bat: '92%' },
      ],
      highlight: true
    },
    {
      badge: '🚌 Thoải mái', badgeColor: '#3b82f6',
      time: '55 phút', price: '45,000₫',
      eco: false,
      legs: [
        { icon: '🚌', mode: 'Saigon Shuttle #S012', detail: 'Trực tiếp — WiFi & A/C', duration: '55 phút', price: '45,000₫', color: '#3b82f6', seats: '8 chỗ trống' },
      ],
      highlight: false
    },
    {
      badge: '💰 Tiết kiệm', badgeColor: '#f59e0b',
      time: '50 phút', price: '25,000₫',
      eco: true,
      legs: [
        { icon: '⚡', mode: 'E-bike trực tiếp', detail: `${startLoc.split(',')[0]} → ${endLoc.split(',')[0]}`, duration: '50 phút', price: '25,000₫', color: '#10b981', bat: '85%' },
      ],
      highlight: false
    },
  ]

  return (
    <div style={{ background: '#f8fafc', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'absolute', top: '20px', left: '20px', right: '20px',
          background: '#10b981', color: 'white', padding: '16px',
          borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 25px rgba(16,185,129,0.3)', zIndex: 100,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ width: '24px', height: '24px', background: 'white', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>✓</div>
          <div style={{ fontWeight: '700', fontSize: '14px' }}>Đặt vé thành công! Đang chuyển sang ví...</div>
        </div>
      )}

      {/* Location Selector Modal */}
      {showLocationSelect && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
          <div style={{
            background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', animation: 'slideUp 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: '800', fontSize: '16px', color: '#1e293b' }}>
                Chọn điểm {selectType === 'start' ? 'Bắt đầu' : 'Đến'}
              </div>
              <button onClick={() => setShowLocationSelect(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            
            <input 
              autoFocus
              type="text" 
              placeholder="Tìm kiếm địa điểm..." 
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1',
                marginBottom: '16px', fontSize: '14px', outline: 'none'
              }}
            />

            <div>
              {locations.map((loc, i) => (
                <div key={i} onClick={() => handleSelectLocation(loc)} style={{
                  padding: '12px 0', borderBottom: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
                }}>
                  <span style={{ fontSize: '18px' }}>📍</span>
                  <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{loc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        padding: '16px 20px 20px',
        color: 'white',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => nav('home')} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: 'white', fontSize: '16px', cursor: 'pointer'
          }}>←</button>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px' }}>Plan Your Journey</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>AI-powered multi-modal routing</div>
          </div>
        </div>

        {/* Route Input */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '14px 16px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%' }} />
              <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '1px' }} />
              <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div 
                onClick={() => openSelect('start')}
                style={{
                  background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
                  padding: '8px 12px', marginBottom: '8px',
                  fontSize: '13px', color: 'white', fontWeight: '600',
                  cursor: 'text', border: '1px solid transparent'
                }}
              >
                {startLoc}
              </div>
              <div 
                onClick={() => openSelect('end')}
                style={{
                  background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '13px', color: 'white', fontWeight: '600',
                  cursor: 'text', border: '1px solid transparent'
                }}
              >
                {endLoc}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
              padding: '8px 12px', fontSize: '12px', color: '#cbd5e1', textAlign: 'center'
            }}>🕐 Now</div>
            <button onClick={handleFindRoutes} disabled={isFinding} style={{
              background: 'linear-gradient(135deg, #10b981, #0d9488)',
              border: 'none', color: 'white', borderRadius: '10px',
              padding: '8px 12px', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
              opacity: isFinding ? 0.7 : 1
            }}>
              {isFinding ? 'Đang tìm...' : '✨ Find Routes'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto', flex: 1, paddingBottom: '100px' }}>
        {isFinding && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }} className="animate-pulse">✨</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>AI đang phân tích giao thông...</div>
          </div>
        )}

        {showRoutes && (
          <>
            {/* AI Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(13,148,136,0.06))',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>✨</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#065f46' }}>AI Recommendation</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Tránh kẹt xe Q7 • Thời tiết tốt hôm nay ☀️</div>
              </div>
            </div>

            {/* Routes */}
            {routes.map((route, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '12px',
                border: route.highlight ? '2px solid #10b981' : '1px solid #e2e8f0',
                boxShadow: route.highlight ? '0 8px 24px rgba(16,185,129,0.15)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                {/* Route Header */}
                <div style={{
                  padding: '12px 16px',
                  background: route.highlight ? 'linear-gradient(135deg, #f0fdf4, #d1fae5)' : '#f8fafc',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: route.badgeColor,
                      color: 'white', padding: '3px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '700'
                    }}>{route.badge}</span>
                    {route.eco && <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>🌿 Eco</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: route.highlight ? '#10b981' : '#1e293b' }}>{route.price}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>⏱ {route.time}</div>
                  </div>
                </div>

                {/* Legs */}
                <div style={{ padding: '12px 16px' }}>
                  {route.legs.map((leg, j) => (
                    <div key={j}>
                      {leg.walk ? (
                        <div style={{
                          padding: '6px 0 6px 36px',
                          fontSize: '11px', color: '#94a3b8',
                          borderLeft: '2px dashed #e2e8f0', marginLeft: '18px', marginBottom: '4px'
                        }}>{leg.walk}</div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '12px',
                            background: `${leg.color}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', flexShrink: 0
                          }}>{leg.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{leg.mode}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{leg.detail}</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>⏱ {leg.duration}</span>
                              {leg.bat && <span style={{ fontSize: '10px', color: '#10b981' }}>🔋 {leg.bat}</span>}
                              {leg.seats && <span style={{ fontSize: '10px', color: '#3b82f6' }}>💺 {leg.seats}</span>}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', flexShrink: 0 }}>{leg.price}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleBook}
                    disabled={isBooking}
                    style={{
                      width: '100%',
                      background: route.highlight ? 'linear-gradient(135deg, #10b981, #0d9488)' : 'white',
                      color: route.highlight ? 'white' : '#1e293b',
                      border: route.highlight ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '11px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      marginTop: '8px',
                      boxShadow: route.highlight ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                      transition: 'all 0.2s',
                      opacity: isBooking ? 0.7 : 1
                    }}
                  >
                    {isBooking ? 'Đang xử lý...' : (route.highlight ? '✓ Chọn lộ trình này' : 'Chọn')}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
