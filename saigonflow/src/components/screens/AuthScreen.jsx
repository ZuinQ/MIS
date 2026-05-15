import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AuthScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Simple Login: Check if profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single()

        if (error || !data) {
          setError('Email không tồn tại hoặc thông tin sai!')
        } else {
          onLoginSuccess(data)
        }
      } else {
        // Register: Create new profile with 500k
        const { data, error } = await supabase
          .from('profiles')
          .insert([{
            full_name: fullName,
            email: email,
            phone: phone,
            balance: 500000,
            badge: 'Thành viên mới 🌱'
          }])
          .select()
          .single()

        if (error) {
          setError('Lỗi khi đăng ký: ' + error.message)
        } else {
          onLoginSuccess(data)
        }
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(160deg, #065f46 0%, #0d9488 60%, #0284c7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        padding: '32px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚴‍♂️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>SaigonFlow</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
            {isLogin ? 'Chào mừng bạn quay trở lại' : 'Bắt đầu hành trình xanh của bạn'}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Họ và tên</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="minh.nguyen@email.com"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Mật khẩu</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Số điện thoại</label>
              <input 
                type="text" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
              />
            </div>
          )}

          {error && <div style={{ color: '#fca5a5', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '12px', border: 'none', 
              background: 'white', color: '#0d9488', fontWeight: '800', fontSize: '16px', 
              marginTop: '10px', cursor: 'pointer', transition: '0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký ngay')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'white', fontWeight: '700', marginLeft: '8px', cursor: 'pointer' }}
          >
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>

        {/* Demo Credentials Hint */}
        <div style={{
          marginTop: '32px',
          padding: '12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '11px',
          textAlign: 'center',
          border: '1px dashed rgba(255,255,255,0.3)'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '4px', color: '#fcd34d' }}>💡 THÔNG TIN TEST (DÀNH CHO HỘI ĐỒNG)</div>
          <div>Email: <span style={{ fontWeight: '700' }}>minh.nguyen@email.com</span></div>
          <div>Mật khẩu: <span style={{ fontWeight: '700' }}>123456</span></div>
        </div>
      </div>
    </div>
  )
}
