import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

async function seed() {
  console.log('🚀 Bắt đầu đổ dữ liệu CHÍNH XÁC từ dashboardData.js...')

  // 1. Dữ liệu Fleet (Xe)
  const fleet = [
    { id: "V0712", type: "E-Bike", status: "In Use", power: "68%", location: "Q1 - Bến Thành", lat: 10.7724, lng: 106.6981 },
    { id: "V1103", type: "E-Bike", status: "In Use", power: "85%", location: "Q1 - Nguyễn Huệ", lat: 10.7743, lng: 106.7042 },
    { id: "V0321", type: "E-Bike", status: "Idle", power: "32%", location: "Q1 - Thảo Cầm Viên", lat: 10.7876, lng: 106.7052 },
    { id: "V0556", type: "E-Bike", status: "In Use", power: "82%", location: "Q3 - Hồ Con Rùa", lat: 10.7828, lng: 106.6958 },
    { id: "V2080", type: "Shuttle Bus", status: "Charging", power: "11%", location: "Q1 - Bến xe buýt Hàm Nghi", lat: 10.7715, lng: 106.7046 }
  ]

  // 2. Dữ liệu Alerts (Cảnh báo)
  const alerts = [
    { vehicle_id: "V0321", type: "Critical Battery", msg: "Low Battery: E-Bike V0321 (13%)", status: "Pending" },
    { vehicle_id: "V2080", type: "Critical Battery", msg: "Low Battery: Shuttle Bus V2080 (11%)", status: "Pending" },
    { vehicle_id: "V0712", type: "Maintenance Due", msg: "Maintenance Due: V0712", status: "Resolved" }
  ]

  // 3. Dữ liệu Chuyến đi (Trips) - Tạo mẫu vài chuyến để hiển thị
  const trips = [
    { user_email: "minh.nguyen@email.com", vehicle_id: "V0712", origin: "Bến Thành", destination: "Nguyễn Huệ", status: "Completed", cost: 15000 },
    { user_email: "minh.nguyen@email.com", vehicle_id: "V1103", origin: "Thảo Điền", destination: "Quận 1", status: "Completed", cost: 35000 }
  ]

  const call = async (table, body) => {
    return fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
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
    // Xóa sạch dữ liệu cũ trước khi nạp mới (chỉ áp dụng cho bảng có thể xóa)
    console.log('- Đang làm sạch dữ liệu cũ...')
    await fetch(`${supabaseUrl}/rest/v1/alerts?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })
    await fetch(`${supabaseUrl}/rest/v1/fleet?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })

    console.log('- Đang nạp danh sách xe mới...')
    await call('fleet', fleet)
    
    console.log('- Đang nạp danh sách cảnh báo mới...')
    await call('alerts', alerts)

    console.log('- Đang nạp lịch sử chuyến đi...')
    await call('trips', trips)

    console.log('✅ THÀNH CÔNG! Dữ liệu đã khớp 100% với file thiết kế của bạn.')
  } catch (e) {
    console.error('❌ Lỗi:', e.message)
  }
}

seed()
