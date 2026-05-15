export const dashboardData = {
  "stats": {
    "totalRevenue": "321,817,500₫",
    "activeCommuters": "1,876",
    "fleetEfficiency": "92.4%",
    "customerRating": "4.8/5"
  },
  "chartData": [
    {
      "name": "06:00",
      "trips": 2565,
      "revenue": 83260500,
      "batt": 54
    },
    {
      "name": "09:00",
      "trips": 1757,
      "revenue": 55710500,
      "batt": 54
    },
    {
      "name": "12:00",
      "trips": 883,
      "revenue": 28444000,
      "batt": 54
    },
    {
      "name": "15:00",
      "trips": 1636,
      "revenue": 53274500,
      "batt": 54
    },
    {
      "name": "18:00",
      "trips": 2614,
      "revenue": 84327000,
      "batt": 54
    },
    {
      "name": "21:00",
      "trips": 545,
      "revenue": 16801000,
      "batt": 54
    }
  ],
  "alerts": [
    {
      "type": "Critical",
      "msg": "Low Battery: E-Bike V0001 (13%)",
      "time": "Just now",
      "color": "#ef4444"
    },
    {
      "type": "Critical",
      "msg": "Low Battery: E-Bike V0004 (11%)",
      "time": "Just now",
      "color": "#ef4444"
    },
    {
      "type": "Warning",
      "msg": "High Demand: Bến Thành Station",
      "time": "5m ago",
      "color": "#f59e0b"
    },
    {
      "type": "Info",
      "msg": "Maintenance Due: V0001",
      "time": "15m ago",
      "color": "#3b82f6"
    }
  ],
  "fleetStatus": [
    {
      "id": "V0712",
      "type": "E-Bike",
      "status": "In Use",
      "power": "68%",
      "location": "Q1 - Bến Thành",
      "lat": 10.7724,
      "lng": 106.6981
    },
    {
      "id": "V1103",
      "type": "E-Bike",
      "status": "In Use",
      "power": "85%",
      "location": "Q1 - Nguyễn Huệ",
      "lat": 10.7743,
      "lng": 106.7042
    },
    {
      "id": "V0321",
      "type": "E-Bike",
      "status": "Idle",
      "power": "32%",
      "location": "Q1 - Thảo Cầm Viên",
      "lat": 10.7876,
      "lng": 106.7052
    },
    {
      "id": "V0556",
      "type": "E-Bike",
      "status": "In Use",
      "power": "82%",
      "location": "Q3 - Hồ Con Rùa",
      "lat": 10.7828,
      "lng": 106.6958
    },
    {
      "id": "V2080",
      "type": "Shuttle Bus",
      "status": "Charging",
      "power": "11%",
      "location": "Q1 - Bến xe buýt Hàm Nghi",
      "lat": 10.7715,
      "lng": 106.7046
    }
  ]
};
