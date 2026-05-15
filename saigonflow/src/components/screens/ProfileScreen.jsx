import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ProfileScreen({ nav }) {
  const [activeModal, setActiveModal] = useState(null)
  const [user, setUser] = useState({
    name: 'Loading...',
    email: '...',
    phone: '...',
    badge: '...'
  })
  const [settings, setSettings] = useState({
    language: 'Tiếng Việt',
    theme: 'Sáng (Light)',
    location: true
  })
  const [editForm, setEditForm] = useState({...user})

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).single()
      if (data && !error) {
        const mappedUser = {
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          badge: data.badge
        }
        setUser(mappedUser)
        setEditForm(mappedUser)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      })
      .eq('email', user.email)
    
    if (!error) {
      setUser(editForm)
      setActiveModal(null)
    }
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', position: 'relative' }}>
      {/* Modal System */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', animation: 'slideUp 0.3s ease-out',
            maxHeight: '85vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1e293b' }}>
                {activeModal === 'editProfile' && '✏️ Chỉnh sửa hồ sơ'}
                {activeModal === 'settings' && '⚙️ Cài đặt'}
                {activeModal === 'rewards' && '⭐ Flow Rewards'}
                {activeModal === 'places' && '📍 Địa điểm đã lưu'}
                {activeModal === 'payment' && '💳 Thanh toán'}
                {activeModal === 'notif' && '🔔 Thông báo'}
                {activeModal === 'support' && '❓ Trợ giúp'}
                {activeModal === 'logout' && '🚪 Đăng xuất'}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Modal Content based on type */}
            {activeModal === 'editProfile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                   <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', position: 'relative' }}>
                     👦🏻
                     <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10b981', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '2px solid white' }}>📷</div>
                   </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Họ và tên</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '4px', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Số điện thoại</label>
                  <input 
                    type="text" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '4px', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Email</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '4px', boxSizing: 'border-box' }} 
                  />
                </div>
                <button onClick={handleSaveProfile} style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', marginTop: '8px', cursor: 'pointer' }}>Lưu thay đổi</button>
              </div>
            )}

            {activeModal === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Ngôn ngữ</div>
                  <select 
                    value={settings.language} 
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    style={{ border: 'none', background: 'transparent', color: '#3b82f6', fontWeight: '600', fontSize: '14px', textAlign: 'right', outline: 'none', cursor: 'pointer' }}
                  >
                    <option>Tiếng Việt</option>
                    <option>English</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Chủ đề</div>
                  <div 
                    onClick={() => setSettings({...settings, theme: settings.theme === 'Sáng (Light)' ? 'Tối (Dark)' : 'Sáng (Light)'})}
                    style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {settings.theme}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Chia sẻ vị trí</div>
                  <div onClick={() => setSettings({...settings, location: !settings.location})} style={{ width: '44px', height: '24px', borderRadius: '12px', background: settings.location ? '#10b981' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: settings.location ? '22px' : '2px', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'rewards' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>2,450 điểm</div>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Bạn đang là Thành viên Hạng Vàng. Còn 550 điểm để lên Hạng Kim Cương!</p>
                <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', textAlign: 'left' }}>
                  <div style={{ fontWeight: '700', marginBottom: '12px' }}>Đổi thưởng</div>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', minWidth: '120px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                       <div style={{ fontSize: '24px' }}>🎟️</div>
                       <div style={{ fontWeight: '700', fontSize: '13px', marginTop: '8px' }}>Voucher 20k</div>
                       <div style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>500 điểm</div>
                    </div>
                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', minWidth: '120px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                       <div style={{ fontSize: '24px' }}>🚇</div>
                       <div style={{ fontWeight: '700', fontSize: '13px', marginTop: '8px' }}>Vé Metro Free</div>
                       <div style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>1000 điểm</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'places' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '24px' }}>🏠</div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: '700', color: '#1e293b' }}>Nhà</div>
                     <div style={{ fontSize: '12px', color: '#64748b' }}>123 Lê Lợi, Q1</div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '24px' }}>💼</div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: '700', color: '#1e293b' }}>Công ty</div>
                     <div style={{ fontSize: '12px', color: '#64748b' }}>Tòa nhà Bitexco</div>
                   </div>
                </div>
                <button style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px' }}>+</span> Thêm địa điểm mới
                </button>
              </div>
            )}

            {activeModal === 'payment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '16px', borderRadius: '16px', border: '2px solid #10b981' }}>
                   <div style={{ background: '#a855f7', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>MoMo</div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: '700', color: '#1e293b' }}>Ví MoMo</div>
                     <div style={{ fontSize: '12px', color: '#64748b' }}>Liên kết • 0987***321</div>
                   </div>
                   <div style={{ color: '#10b981', fontSize: '20px', fontWeight: '800' }}>✓</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                   <div style={{ background: '#1e3a8a', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>VISA</div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: '700', color: '#1e293b' }}>Thẻ tín dụng</div>
                     <div style={{ fontSize: '12px', color: '#64748b' }}>**** 4567</div>
                   </div>
                </div>
                <button style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', marginTop: '8px', cursor: 'pointer' }}>+ Thêm phương thức thanh toán</button>
              </div>
            )}

            {activeModal === 'notif' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
                   <div style={{ fontWeight: '700', fontSize: '14px', color: '#065f46' }}>Chuyến đi hoàn tất!</div>
                   <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px', lineHeight: 1.5 }}>Bạn vừa hoàn thành chuyến đi 3.2km. +12 điểm xanh được cộng vào tài khoản.</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                   <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e3a8a' }}>Khuyến mãi ngày mới</div>
                   <div style={{ fontSize: '12px', color: '#1e40af', marginTop: '4px', lineHeight: 1.5 }}>Nhập mã SAIGON20 để giảm 20% cho chuyến đi tiếp theo (tối đa 20k).</div>
                </div>
              </div>
            )}

            {activeModal === 'support' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎧</div>
                <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px', color: '#1e293b' }}>Trung tâm trợ giúp</div>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Đội ngũ SaigonFlow luôn sẵn sàng hỗ trợ bạn 24/7.</p>
                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '14px', width: '100%', borderRadius: '12px', fontWeight: '700', marginBottom: '12px', cursor: 'pointer' }}>Gọi Hotline Miễn phí</button>
                <button style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '14px', width: '100%', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Chat với CSKH</button>
              </div>
            )}

            {activeModal === 'logout' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px', color: '#1e293b' }}>Đăng xuất?</div>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setActiveModal(null)} style={{ flex: 1, background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Hủy</button>
                  <button onClick={() => { setActiveModal(null); }} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Đăng xuất</button>
                </div>
              </div>
            )}
            
          </div>
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
        
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>{user.name}</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{user.badge}</p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveModal('editProfile')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '8px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Edit Profile</button>
          <button onClick={() => setActiveModal('settings')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '8px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Settings</button>
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
            { icon: '⭐', label: 'Flow Rewards', sub: '2,450 points', type: 'rewards' },
            { icon: '📍', label: 'Saved Places', sub: 'Home, Work, etc.', type: 'places' },
            { icon: '💳', label: 'Payment Methods', sub: 'Momo, Visa', type: 'payment' },
            { icon: '🔔', label: 'Notifications', sub: 'Alerts & Promos', type: 'notif' },
            { icon: '❓', label: 'Help & Support', sub: 'Contact us', type: 'support' }
          ].map((item, i, arr) => (
            <div onClick={() => setActiveModal(item.type)} key={i} style={{
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
          <button onClick={() => setActiveModal('logout')} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Log Out</button>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px' }}>SaigonFlow v1.0.0 (Tier 4 Build)</div>
        </div>
      </div>
    </div>
  )
}
