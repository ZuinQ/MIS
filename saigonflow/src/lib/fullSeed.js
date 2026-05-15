import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

async function seed() {
  console.log('🚀 Đang khởi tạo môi trường Demo SaigonFlow (Tier 4 Content)...')

  // 1. Hồ sơ người dùng mặc định cho Demo
  const profiles = [
    { 
      full_name: "Minh Nguyễn", 
      email: "minh.nguyen@email.com", 
      phone: "0987 654 321", 
      balance: 500000, 
      badge: "Thành viên Hạng Vàng 🌟" 
    }
  ]

  // 2. Danh sách xe (Fleet) - Đầy đủ tọa độ để hiện thị Map
  const fleet = [
    { id: "V0712", type: "E-Bike", status: "In Use", power: "68%", location: "Q1 - Bến Thành", lat: 10.7724, lng: 106.6981 },
    { id: "V1103", type: "E-Bike", status: "In Use", power: "85%", location: "Q1 - Nguyễn Huệ", lat: 10.7743, lng: 106.7042 },
    { id: "V0321", type: "E-Bike", status: "Idle", power: "32%", location: "Q1 - Thảo Cầm Viên", lat: 10.7876, lng: 106.7052 },
    { id: "V0556", type: "E-Bike", status: "In Use", power: "82%", location: "Q3 - Hồ Con Rùa", lat: 10.7828, lng: 106.6958 },
    { id: "V2080", type: "Shuttle Bus", status: "Charging", power: "11%", location: "Q1 - Bến xe buýt Hàm Nghi", lat: 10.7715, lng: 106.7046 },
    { id: "V0992", type: "E-Bike", status: "Idle", power: "94%", location: "Q1 - Dinh Độc Lập", lat: 10.7770, lng: 106.6953 }
  ]

  // 3. Hệ thống cảnh báo (Alerts) cho Dashboard
  const alerts = [
    { vehicle_id: "V0321", type: "Critical Battery", msg: "Low Battery: E-Bike V0321 (32%) - Prediction: Shutdown in 15m", status: "Pending" },
    { vehicle_id: "V2080", type: "Critical Battery", msg: "Low Battery: Shuttle Bus V2080 (11%) - Dispatch needed", status: "Pending" },
    { vehicle_id: "V0712", type: "Maintenance Due", msg: "Preventive Maintenance: V0712 - Scheduled", status: "Resolved" }
  ]

  // 4. Lịch sử chuyến đi mẫu (Trips)
  const trips = [
    { user_email: "minh.nguyen@email.com", vehicle_id: "V0712", origin: "Ga Bến Thành", destination: "Ga Ba Son", status: "Completed", cost: 15000 },
    { user_email: "minh.nguyen@email.com", vehicle_id: "V1103", origin: "Thảo Điền", destination: "Quận 1", status: "Completed", cost: 35000 },
    { user_email: "minh.nguyen@email.com", vehicle_id: "V0556", origin: "Hồ Con Rùa", destination: "Diamond Plaza", status: "Completed", cost: 5000 }
  ]

  const call = async (table, body, method = 'POST') => {
    return fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: method,
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(body)
    })
  }

  try {
    console.log('- Đang dọn dẹp dữ liệu cũ...')
    await fetch(`${supabaseUrl}/rest/v1/alerts?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })
    await fetch(`${supabaseUrl}/rest/v1/trips?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })
    await fetch(`${supabaseUrl}/rest/v1/fleet?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })
    await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.minh.nguyen@email.com`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })

    console.log('- Đang nạp hồ sơ người dùng mẫu...')
    await call('profiles', profiles)

    console.log('- Đang nạp danh sách xe và trạng thái...')
    await call('fleet', fleet)
    
    console.log('- Đang nạp hệ thống cảnh báo vận hành...')
    await call('alerts', alerts)

    console.log('- Đang nạp lịch sử giao dịch/chuyến đi...')
    await call('trips', trips)

    console.log('✅ HOÀN TẤT! Môi trường Demo đã sẵn sàng 100%.')
  } catch (e) {
    console.error('❌ Lỗi:', e.message)
  }
}

seed()
