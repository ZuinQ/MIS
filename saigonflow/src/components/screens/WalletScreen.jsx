import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function WalletScreen({ user, nav }) {
  const [balance, setBalance] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAllModal, setShowAllModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [user.email])

  async function fetchData() {
    setIsLoading(true)
    // 1. Fetch Balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('email', user.email)
      .single()
    if (profile) setBalance(profile.balance)

    // 2. Fetch Transactions from Trips table
    const { data: trips } = await supabase
      .from('trips')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })
    
    if (trips) {
      const tripTx = trips.map(t => ({
        id: t.id,
        type: t.vehicle_id.includes('Bus') ? 'Shuttle Bus' : 'E-bike Rental',
        detail: `${t.origin} → ${t.destination}`,
        date: new Date(t.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        amount: `-${t.cost.toLocaleString()}₫`,
        icon: t.vehicle_id.includes('Bus') ? '🚌' : '⚡',
        color: t.vehicle_id.includes('Bus') ? '#3b82f6' : '#10b981',
        isPos: false
      }))
      setTransactions(tripTx)
    }
    setIsLoading(false)
  }

  const handleTopUp = async (amount) => {
    const newBalance = balance + amount
    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('email', user.email)
    
    if (!error) {
      setBalance(newBalance)
      setToastMsg(`Đã nạp thành công ${amount.toLocaleString('vi-VN')}₫`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      
      // Add a virtual top-up tx for immediate feedback
      const topUpTx = {
        id: Date.now(),
        type: 'Quick Top-up',
        detail: 'Momo Wallet',
        date: 'Vừa xong',
        amount: `+${amount.toLocaleString('vi-VN')}₫`,
        icon: '💳',
        color: '#3b82f6',
        isPos: true
      }
      setTransactions(prev => [topUpTx, ...prev])
    }
  }

  const handleTransfer = async () => {
    const amount = 50000
    if (balance < amount) {
      setToastMsg('Số dư không đủ để chuyển!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    
    const newBalance = balance - amount
    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('email', user.email)

    if (!error) {
      setBalance(newBalance)
      setToastMsg(`Đã chuyển thành công ${amount.toLocaleString('vi-VN')}₫`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      
      setTransactions(prev => [{
        id: Date.now(),
        type: 'Transfer',
        detail: 'Đến: 098***123',
        date: 'Vừa xong',
        amount: `-${amount.toLocaleString()}₫`,
        icon: '💸',
        color: '#f59e0b',
        isPos: false
      }, ...prev])
    }
  }

  const handleTopUp = async (amount) => {
    const { data: profile } = await supabase.from('profiles').select('balance, email').limit(1).single()
    if (profile) {
      const newBalance = profile.balance + amount
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('email', profile.email)
      
      if (!error) {
        setBalance(newBalance)
        const newTx = {
          id: Date.now(),
          type: 'Quick Top-up',
          detail: 'Momo Wallet',
          date: 'Vừa xong',
          amount: `+${amount.toLocaleString('vi-VN')}₫`,
          icon: '💳',
          color: '#3b82f6',
          isPos: true
        }
        setTransactions(prev => [newTx, ...prev])
        setToastMsg(`Đã nạp thành công ${amount.toLocaleString('vi-VN')}₫`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      }
    }
  }

  const handleTransfer = async () => {
    const amount = 50000
    if (balance < amount) {
      setToastMsg('Số dư không đủ để chuyển!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    
    const newBalance = balance - amount
    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('email', user.email)

    if (!error) {
      setBalance(newBalance)
      setToastMsg(`Đã chuyển thành công ${amount.toLocaleString('vi-VN')}₫`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      
      setTransactions(prev => [{
        id: Date.now(),
        type: 'Transfer',
        detail: 'Đến: 098***123',
        date: 'Vừa xong',
        amount: `-${amount.toLocaleString()}₫`,
        icon: '💸',
        color: '#f59e0b',
        isPos: false
      }, ...prev])
    }
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
          <div style={{ width: '24px', height: '24px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>✓</div>
          <div style={{ fontWeight: '600', fontSize: '13px' }}>{toastMsg}</div>
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'white', borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => nav('home')} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#f1f5f9', border: 'none',
            color: '#1e293b', fontSize: '16px', cursor: 'pointer'
          }}>←</button>
          <span style={{ fontWeight: '800', fontSize: '18px' }}>FlowPass Wallet</span>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚙️</div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto', paddingBottom: '40px' }}>
        {/* Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
          borderRadius: '24px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(16,185,129,0.3)',
          marginBottom: '20px'
        }}>
          {/* Card Decoration */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Current Balance</div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', backdropFilter: 'blur(4px)' }}>
                NFC Ready 📱
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px' }}>
              {balance.toLocaleString('vi-VN')}₫
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleTopUp(100000)} style={{
                flex: 1, background: 'white', color: '#0d9488',
                border: 'none', padding: '12px', borderRadius: '12px',
                fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>+ Top Up</button>
              <button onClick={handleTransfer} style={{
                flex: 1, background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '12px',
                fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}>Transfer</button>
            </div>
          </div>
        </div>

        {/* Quick Top-up */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>Quick Top-up</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[50000, 100000, 200000].map(amt => (
              <button key={amt} onClick={() => handleTopUp(amt)} style={{
                background: 'white', border: '1px solid #e2e8f0',
                padding: '12px 0', borderRadius: '12px',
                color: '#475569', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>{amt.toLocaleString('vi-VN')}₫</button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>Recent Activity</div>
            <div onClick={() => setShowAllModal(true)} style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', cursor: 'pointer' }}>View All →</div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            {transactions.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Chưa có giao dịch nào</div>
            ) : (
              transactions.slice(0, 5).map((t, idx) => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px',
                  borderBottom: idx !== Math.min(transactions.length, 5) - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                  }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{t.type}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{t.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: t.isPos ? '#10b981' : '#1e293b' }}>{t.amount}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{t.isPos ? 'Thành công' : t.detail}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <button onClick={() => setShowAllModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>←</button>
            <span style={{ fontWeight: '800', fontSize: '18px' }}>Tất cả giao dịch</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {transactions.map((t, idx) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{t.type}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{t.date} • {t.detail}</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: t.isPos ? '#10b981' : '#1e293b' }}>{t.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
