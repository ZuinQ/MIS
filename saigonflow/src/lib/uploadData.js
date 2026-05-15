import dotenv from 'dotenv'

// Load env vars
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const fleetStatus = [
  { id: 'SF-101', type: 'E-Bike', status: 'In Use', power: '85%', location: 'Quận 1, TPHCM', lat: 10.7769, lng: 106.7009 },
  { id: 'SF-102', type: 'E-Bike', status: 'In Use', power: '42%', location: 'Quận 3, TPHCM', lat: 10.7821, lng: 106.6925 },
  { id: 'SF-103', type: 'E-Bike', status: 'Charging', power: '15%', location: 'Quận 1, TPHCM', lat: 10.7712, lng: 106.6983 },
  { id: 'SF-201', type: 'Shuttle Bus', status: 'In Use', power: '92%', location: 'Quận 1, TPHCM', lat: 10.7795, lng: 106.7052 },
  { id: 'SF-202', type: 'Shuttle Bus', status: 'In Use', power: '64%', location: 'Quận 3, TPHCM', lat: 10.7854, lng: 106.6876 }
]

async function upload() {
  console.log('🚀 Đang đẩy dữ liệu lên Supabase...')
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/fleet`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(fleetStatus)
    })

    if (response.ok) {
      console.log('✅ Thành công! Toàn bộ xe đã được cập nhật lên Supabase.')
    } else {
      const err = await response.json()
      console.error('❌ Lỗi:', err.message)
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message)
  }
}

upload()
