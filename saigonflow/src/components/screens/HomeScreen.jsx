import { dashboardData } from '../../data/dashboardData.js'
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function HomeScreen({ nav }) {
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [selectedPin, setSelectedPin] = useState(null)

  const vehicles = dashboardData.fleetStatus.slice(0, 4).map((v, i) => ({
    type: v.type === 'E-Bike' ? '⚡' : '🚌',
    typeText: v.type,
    name: `${v.type} #${v.id}`,
    dist: `${(i + 1) * 50}m`, // simulated distance based on index
    bat: parseInt(v.power),
    color: v.type === 'E-Bike' ? '#10b981' : '#3b82f6',
    lat: v.lat,
    lng: v.lng
  }))

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
          <div onClick={() => nav('profile')} style={{
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
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <MapContainer center={[10.7769, 106.7009]} zoom={14} zoomControl={false} dragging={false} scrollWheelZoom={false} style={{ width: '100%', height: '100%', zIndex: 1 }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker position={[10.7769, 106.7009]} icon={L.divIcon({ html: `<div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(59,130,246,0.4)"></div>`, className: '', iconSize: [16,16] })} />
              {/* Markers from data */}
              {vehicles.map((v, i) => (
                <Marker key={i} position={[v.lat, v.lng]} icon={L.divIcon({ html: `<div style="width: 20px; height: 20px; background: ${v.color}; border-radius: 50%; border: 2px solid white; display:flex; align-items:center; justify-content:center; font-size: 10px; box-shadow: 0 2px 8px rgba(16,185,129,0.4)">${v.type}</div>`, className: '', iconSize: [20,20] })} />
              ))}
            </MapContainer>

            {/* Invisible overlay to capture click */}
            <div onClick={() => setIsMapExpanded(true)} style={{ position: 'absolute', inset: 0, zIndex: 1000, cursor: 'pointer' }} />
            
            {/* Expand Overlay */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#1e293b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 1001, display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none' }}>
              🔍 Phóng to
            </div>

            {/* Location badge */}
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
              borderRadius: '20px', padding: '4px 12px',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: '600', color: '#1e293b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 1001, pointerEvents: 'none'
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
            <div onClick={() => nav('trip')} style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', cursor: 'pointer' }}>See All →</div>
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

      {/* Expanded Map Modal */}
      {isMapExpanded && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ padding: '20px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '800', fontSize: '18px', color: '#1e293b' }}>🗺️ Bản đồ trực tiếp</div>
            <button onClick={() => { setIsMapExpanded(false); setSelectedPin(null); }} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ flex: 1, position: 'relative', background: '#f8fafc' }}>
             <MapContainer center={[10.7769, 106.7009]} zoom={15} style={{ width: '100%', height: '100%', zIndex: 1 }} zoomControl={false}>
               <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
               
               {/* User Location */}
               <Marker position={[10.7769, 106.7009]} icon={L.divIcon({ html: `<div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(59,130,246,0.4)"></div>`, className: '', iconSize: [20,20] })}>
                  <Popup><div style={{fontWeight:'700', fontSize:'13px'}}>Vị trí của bạn</div></Popup>
               </Marker>

               {/* Vehicles & Transit near user */}
               {vehicles.map((v, i) => (
                 <Marker 
                   key={i} 
                   position={[v.lat, v.lng]}
                   eventHandlers={{ click: () => setSelectedPin({ name: v.name, bat: v.bat, seats: v.seats, type: `${v.type} ${v.typeText}`, time: v.time || '1 min walk' }) }}
                   icon={L.divIcon({ html: `<div style="width: 32px; height: 32px; background: ${v.color}; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); color: white">${v.type}</div>`, className: '', iconSize: [32,32] })}
                 />
               ))}
               
               <Marker 
                 position={[10.7745, 106.7055]}
                 eventHandlers={{ click: () => setSelectedPin({ name: 'Metro Line 1', type: '🚇 Metro Station', time: 'Next train in 5 mins' }) }}
                 icon={L.divIcon({ html: `<div style="width: 32px; height: 32px; background: #8b5cf6; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); color: white">🚇</div>`, className: '', iconSize: [32,32] })}
               />
             </MapContainer>

             {selectedPin && (
               <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.3s ease-out' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                   <div>
                     <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', marginBottom: '4px' }}>{selectedPin.type}</div>
                     <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>{selectedPin.name}</div>
                   </div>
                   <div style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                     📍 50m
                   </div>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '13px', color: '#475569' }}>
                   {selectedPin.bat && <div>🔋 Pin: <span style={{ fontWeight: '700', color: '#10b981' }}>{selectedPin.bat}%</span></div>}
                   {selectedPin.seats && <div>💺 Chỗ trống: <span style={{ fontWeight: '700', color: '#3b82f6' }}>{selectedPin.seats}</span></div>}
                   <div>⏱ {selectedPin.time}</div>
                 </div>

                 <button onClick={() => { setIsMapExpanded(false); nav('trip'); }} style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #0d9488)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                   Đặt chuyến ngay
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}
