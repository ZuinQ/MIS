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
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('email', user.email)
      .single()
    if (profile) {
      setBalance(profile.balance)
    } else {
      setBalance(150000) // Dummy fallback
    }

    const { data: trips } = await supabase
      .from('trips')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })
    
    if (trips && trips.length > 0) {
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
    } else {
      // Dummy fallback transactions
      setTransactions([
        { id: 1, type: 'E-bike Rental', detail: 'Ga Bến Thành → Thảo Điền', date: 'Hôm nay 08:30', amount: '-5,000₫', icon: '⚡', color: '#10b981', isPos: false },
        { id: 2, type: 'Metro Ticket', detail: 'Line 1', date: 'Hôm nay 08:15', amount: '-20,000₫', icon: '🚇', color: '#8b5cf6', isPos: false },
        { id: 3, type: 'Top-up FlowPass', detail: 'Momo', date: 'Hôm qua 15:20', amount: '+200,000₫', icon: '💳', color: '#3b82f6', isPos: true },
        { id: 4, type: 'Shuttle Bus', detail: 'Tuyến #S05', date: '14/05/2026 17:45', amount: '-10,000₫', icon: '🚌', color: '#3b82f6', isPos: false }
      ])
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

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', position: 'relative', fontFamily: 'Inter, sans-serif' }}>
      {showToast && (
        <div style={{
          position: 'fixed', top: '20px', left: '20px', right: '20px',
          background: '#1e293b', color: 'white', padding: '16px',
          borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 2000
        }}>
          <div style={{ width: '24px', height: '24px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>✓</div>
          <div style={{ fontWeight: '600', fontSize: '13px' }}>{toastMsg}</div>
        </div>
      )}

      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => nav('home')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>←</button>
          <span style={{ fontWeight: '800', fontSize: '18px' }}>FlowPass Wallet</span>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</div>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>Current Balance</div>
          <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>{balance.toLocaleString('vi-VN')}₫</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => handleTopUp(100000)} style={{ flex: 1, background: 'white', color: '#0d9488', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>+ Top Up</button>
            <button onClick={handleTransfer} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Transfer</button>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>Quick Top-up</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[50000, 100000, 200000].map(amt => (
              <button key={amt} onClick={() => handleTopUp(amt)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>{amt.toLocaleString('vi-VN')}₫</button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>Recent Activity</div>
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          {transactions.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Chưa có giao dịch nào</div>
          ) : (
            transactions.slice(0, 5).map((t, idx) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: idx !== transactions.slice(0, 5).length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{t.type}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: t.isPos ? '#10b981' : '#1e293b' }}>{t.amount}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{t.detail}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
