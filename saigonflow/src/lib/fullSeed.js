import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

async function seed() {
  console.log('🚀 Bắt đầu quá trình đổ dữ liệu tổng thể (Full Seeding)...')

  // 1. Seed Profile
  const profile = {
    full_name: 'Minh Nguyễn',
    email: 'minh.nguyen@email.com',
    phone: '0987 654 321',
    balance: 500000,
    badge: 'Thành viên Hạng Vàng 🌟'
  }

  // 2. Seed Fleet (10 vehicles)
  const fleet = [
    { id: 'SF-101', type: 'E-Bike', status: 'In Use', power: '85%', location: 'Quận 1, TPHCM', lat: 10.7769, lng: 106.7009 },
    { id: 'SF-102', type: 'E-Bike', status: 'Available', power: '98%', location: 'Quận 3, TPHCM', lat: 10.7821, lng: 106.6925 },
    { id: 'SF-103', type: 'E-Bike', status: 'Charging', power: '15%', location: 'Quận 1, TPHCM', lat: 10.7712, lng: 106.6983 },
    { id: 'SF-104', type: 'E-Bike', status: 'Maintenance', power: '0%', location: 'Quận 1, TPHCM', lat: 10.7750, lng: 106.7030 },
    { id: 'SF-105', type: 'E-Bike', status: 'Available', power: '76%', location: 'Quận 2, TPHCM', lat: 10.8010, lng: 106.7350 },
    { id: 'SF-201', type: 'Shuttle Bus', status: 'In Use', power: '92%', location: 'Quận 1, TPHCM', lat: 10.7795, lng: 106.7052 },
    { id: 'SF-202', type: 'Shuttle Bus', status: 'Available', power: '100%', location: 'Quận 3, TPHCM', lat: 10.7854, lng: 106.6876 },
    { id: 'SF-203', type: 'Shuttle Bus', status: 'In Use', power: '54%', location: 'Quận 4, TPHCM', lat: 10.7600, lng: 106.7050 },
    { id: 'SF-204', type: 'Shuttle Bus', status: 'Maintenance', power: '12%', location: 'Quận 7, TPHCM', lat: 10.7300, lng: 106.7200 },
    { id: 'SF-205', type: 'Shuttle Bus', status: 'Available', power: '88%', location: 'Quận 1, TPHCM', lat: 10.7720, lng: 106.7080 }
  ]

  // 3. Seed Alerts
  const alerts = [
    { vehicle_id: 'SF-103', type: 'Critical Battery', msg: 'Battery dropped below 15% at Station A', status: 'Pending' },
    { vehicle_id: 'SF-204', type: 'Maintenance Due', msg: 'Brake pads replacement required', status: 'Resolved' },
    { vehicle_id: 'SF-104', type: 'GPS Signal Lost', msg: 'Vehicle offline for 30 mins', status: 'Pending' }
  ]

  // Helper to call Supabase REST
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
    console.log('- Đang tạo hồ sơ người dùng...')
    await call('profiles', [profile])
    
    console.log('- Đang tạo danh sách xe (10 xe)...')
    await call('fleet', fleet)
    
    console.log('- Đang tạo danh sách cảnh báo...')
    await call('alerts', alerts)

    console.log('✅ HOÀN TẤT! Database của bạn đã sẵn sàng với dữ liệu thực tế.')
  } catch (e) {
    console.error('❌ Lỗi seeding:', e.message)
  }
}

seed()
