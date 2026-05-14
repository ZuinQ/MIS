import { useState } from 'react'

export default function ProfileScreen({ nav }) {
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const handleAction = (msg) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', position: 'relative' }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'absolute', top: '20px', left: '20px', right: '20px',
          background: '#1e293b', color: 'white', padding: '16px',
          borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 100,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ width: '24px', height: '24px', background: '#3b82f6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>ℹ</div>
          <div style={{ fontWeight: '600', fontSize: '13px' }}>{toastMsg}</div>
        </div>
      )}

      {/* Header Profile */}
      <div style={{
        background: 'white',
        padding: '32px 20px 24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            padding: '4px'
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px'
            }}>👦🏻</div>
          </div>
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            background: '#10b981', width: '24px', height: '24px',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '12px', border: '2px solid white'
          }}>✓</div>
        </div>
        
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Minh Nguyễn</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Thành viên Hạng Vàng 🌟</p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleAction('Đang mở trang Chỉnh sửa hồ sơ...')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '8px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Edit Profile</button>
          <button onClick={() => handleAction('Đang mở Cài đặt ứng dụng...')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '8px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Settings</button>
        </div>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto', paddingBottom: '40px' }}>
        {/* Environmental Impact (CRM / Brand Loyalty feature) */}
        <div style={{
          background: 'linear-gradient(135deg, #065f46, #10b981)',
          borderRadius: '24px',
          padding: '20px',
          color: 'white',
          marginBottom: '24px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(16,185,129,0.2)'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '100px', opacity: 0.1 }}>🌿</div>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>My Sustainability Impact</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>18<span style={{ fontSize: '14px', fontWeight: '600' }}> kg</span></div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>CO₂ Saved (vs Car)</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>42</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Green Trips</div>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', marginTop: '8px', textAlign: 'right' }}>3 trips until next reward 🎁</div>
        </div>

        {/* Menu Options */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {[
            { icon: '⭐', label: 'Flow Rewards', sub: '2,450 points', msg: 'Bạn có 2,450 điểm thưởng!' },
            { icon: '📍', label: 'Saved Places', sub: 'Home, Work, etc.', msg: 'Đang mở danh sách địa điểm...' },
            { icon: '💳', label: 'Payment Methods', sub: 'Momo, Visa', msg: 'Đang quản lý phương thức thanh toán...' },
            { icon: '🔔', label: 'Notifications', sub: 'Alerts & Promos', msg: 'Bạn có 3 thông báo mới.' },
            { icon: '❓', label: 'Help & Support', sub: 'Contact us', msg: 'Đang kết nối tổng đài CSKH...' }
          ].map((item, i, arr) => (
            <div onClick={() => handleAction(item.msg)} key={i} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px',
              borderBottom: i !== arr.length - 1 ? '1px solid #f1f5f9' : 'none',
              cursor: 'pointer'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.sub}</div>
              </div>
              <div style={{ color: '#cbd5e1' }}>›</div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => handleAction('Đã đăng xuất khỏi tài khoản')} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Log Out</button>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px' }}>SaigonFlow v1.0.0 (Tier 4 Build)</div>
        </div>
      </div>
    </div>
  )
}
