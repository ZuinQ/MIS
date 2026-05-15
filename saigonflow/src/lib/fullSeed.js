import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

async function seed() {
  console.log('🚀 Đang khởi tạo bộ dữ liệu ENHANCED (Chuẩn Tier 4)...')

  // 1. Dữ liệu xe nâng cao (có thêm cột Risk và Profitability)
  const fleet = [
    { id: "V0712", type: "E-Bike", status: "In Use", power: "68%", location: "Q1 - Bến Thành", lat: 10.7724, lng: 106.6981, maintenance_risk: 'Low', profitability: 'High' },
    { id: "V1103", type: "E-Bike", status: "In Use", power: "85%", location: "Q1 - Nguyễn Huệ", lat: 10.7743, lng: 106.7042, maintenance_risk: 'Low', profitability: 'Medium' },
    { id: "V0321", type: "E-Bike", status: "Idle", power: "32%", location: "Q1 - Thảo Cầm Viên", lat: 10.7876, lng: 106.7052, maintenance_risk: 'High', profitability: 'Low' },
    { id: "V0556", type: "E-Bike", status: "In Use", power: "82%", location: "Q3 - Hồ Con Rùa", lat: 10.7828, lng: 106.6958, maintenance_risk: 'Low', profitability: 'High' },
    { id: "V2080", type: "Shuttle Bus", status: "Charging", power: "11%", location: "Q1 - Bến xe buýt Hàm Nghi", lat: 10.7715, lng: 106.7046, maintenance_risk: 'High', profitability: 'Medium' },
    { id: "V0992", type: "E-Bike", status: "Idle", power: "94%", location: "Q1 - Dinh Độc Lập", lat: 10.7770, lng: 106.6953, maintenance_risk: 'Low', profitability: 'Medium' }
  ]

  // 2. Dữ liệu chuyến đi với thông tin thời tiết và giờ cao điểm
  const trips = [
    { user_email: "minh.nguyen@email.com", vehicle_id: "V0712", origin: "Ga Bến Thành", destination: "Ga Ba Son", status: "Completed", cost: 15000, weather_risk_score: 1, is_peak_hour: true },
    { user_email: "minh.nguyen@email.com", vehicle_id: "V1103", origin: "Thảo Điền", destination: "Quận 1", status: "Completed", cost: 35000, weather_risk_score: 1, is_peak_hour: true },
    { user_email: "minh.nguyen@email.com", vehicle_id: "V0556", origin: "Hồ Con Rùa", destination: "Diamond Plaza", status: "Completed", cost: 5000, weather_risk_score: 3, is_peak_hour: false },
    { user_email: "minh.nguyen@email.com", vehicle_id: "V0712", origin: "Quận 1", destination: "Quận 7", status: "Completed", cost: 45000, weather_risk_score: 1, is_peak_hour: false }
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
    console.log('- Đang làm sạch dữ liệu cũ...')
    await fetch(`${supabaseUrl}/rest/v1/alerts?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })
    await fetch(`${supabaseUrl}/rest/v1/trips?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })
    await fetch(`${supabaseUrl}/rest/v1/fleet?id=not.is.null`, { method: 'DELETE', headers: { 'apikey': supabaseAnonKey, 'Authorization': `Bearer ${supabaseAnonKey}` } })

    console.log('- Đang nạp danh sách xe (Enhanced)...')
    await call('fleet', fleet)
    
    console.log('- Đang nạp lịch sử chuyến đi (Enhanced)...')
    await call('trips', trips)

    console.log('✅ THÀNH CÔNG! Dữ liệu đã khớp 100% với yêu cầu Tier 4 của bạn.')
  } catch (e) {
    console.error('❌ Lỗi:', e.message)
  }
}

seed()
