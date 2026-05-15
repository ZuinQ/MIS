import pandas as pd
import random
from datetime import datetime, timedelta
import numpy as np

def generate_random_datetime(start_date, end_date):
    """Generates a random datetime between two dates."""
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    
    # Weight towards commute hours (7-9 AM, 5-7 PM)
    hour_choices = [7, 8, 9, 17, 18, 19] * 3 + list(range(6, 23))
    random_time = timedelta(hours=random.choice(hour_choices), 
                            minutes=random.randint(0, 59), 
                            seconds=random.randint(0, 59))
    return random_date + random_time

def main():
    print("Generating SaigonFlow Mobility Data...")

    # --- Group ID Input & Seeding ---
    student_id_1 = input("Enter Student ID for Member 1: ").strip()
    student_id_2 = input("Enter Student ID for Member 2: ").strip()
    
    if not student_id_1 or not student_id_2:
        print("Error: Both Student IDs must be provided. Exiting.")
        return
        
    # Set seed based on student IDs to generate unique but reproducible data per group
    combined_seed = f"{student_id_1}_{student_id_2}"
    random.seed(combined_seed)
    np.random.seed(abs(hash(combined_seed)) % (10**8))
    
    print(f"\nGenerating unique dataset for Group: {student_id_1} & {student_id_2}...")

    # --- 1. Locations / Stations in HCMC ---
    stations = [
        "Ben Thanh Station (D1)", "Opera House (D1)", "Ba Son (D1)", 
        "Thao Dien (Thu Duc)", "Suoi Tien Terminal (Thu Duc)", 
        "High Tech Park (Thu Duc)", "Crescent Mall (D7)", "e-Town (Tan Binh)"
    ]

    # --- 2. Users Dataset ---
    num_users = 2200 # Number of dataset
    user_data = []
    for i in range(num_users):
        user_id = f"U{str(i+1).zfill(4)}"
        age = random.randint(18, 55)
        preferred_mode = random.choices(["E-Bike", "Shuttle", "Metro/Bus"], weights=[0.5, 0.2, 0.3])[0]
        loyalty_points = random.randint(0, 5000)
        # Churn indicator for predictive modeling (1 = churned, 0 = active)
        churned = 1 if random.random() < 0.15 else 0 
        
        user_data.append([user_id, age, preferred_mode, loyalty_points, churned])
        
    users_df = pd.DataFrame(user_data, columns=["UserID", "Age", "Preferred_Mode", "Loyalty_Points", "Has_Churned"])

    # --- 3. Vehicles Dataset ---
    num_vehicles = 2100 # Number of fleet
    vehicle_data = []
    ebike_ids = []
    shuttle_ids = []
    
    for i in range(num_vehicles):
        v_id = f"V{str(i+1).zfill(4)}"
        v_type = "E-Bike" if i < 1850 else "Shuttle Bus" # 1850 e-bikes, 250 shuttles
        
        if v_type == "E-Bike":
            ebike_ids.append(v_id)
        else:
            shuttle_ids.append(v_id)
            
        battery_pct = random.randint(10, 100)
        last_maintenance = generate_random_datetime(datetime(2025, 8, 1), datetime(2025, 10, 1)).strftime("%Y-%m-%d")
        vehicle_data.append([v_id, v_type, battery_pct, last_maintenance])
        
    vehicles_df = pd.DataFrame(vehicle_data, columns=["VehicleID", "Type", "Battery_Level_Pct", "Last_Maintenance_Date"])

    # --- 4. Trip Logs Dataset (Includes variables for Predictive Analytics) ---
    num_trips = 10000 # Increased to accommodate the larger user/vehicle base
    trip_data = []
    start_period = datetime(2025, 8, 1)
    end_period = datetime(2025, 10, 31)

    for i in range(num_trips):
        trip_id = f"TRP{str(i+1).zfill(5)}"
        user = random.choice(user_data)[0]
        trip_time = generate_random_datetime(start_period, end_period)
        
        # Features for predictive analytics
        day_of_week = trip_time.strftime("%A")
        is_weekend = 1 if day_of_week in ["Saturday", "Sunday"] else 0
        
        # Weather simulation
        weather = random.choices(["Clear", "Cloudy", "Heavy Rain", "Light Rain"], weights=[0.4, 0.4, 0.1, 0.1])[0]
        temp_celsius = random.randint(26, 35)

        mode = random.choices(["E-Bike", "Shuttle", "Metro/Bus"], weights=[0.6, 0.15, 0.25])[0]
        start_stn = random.choice(stations)
        
        # Ensure end station is different
        end_stn = random.choice([s for s in stations if s != start_stn])
        
        # Duration, Fare, and Vehicle ID mapping logic
        if mode == "E-Bike":
            vehicle_id = random.choice(ebike_ids)
            duration_mins = random.randint(5, 45)
            fare = duration_mins * 1500 # 1,500 VND per minute
        elif mode == "Shuttle":
            vehicle_id = random.choice(shuttle_ids)
            duration_mins = random.randint(30, 90)
            fare = 40000 # Fixed fare
        else: # Metro/Bus
            vehicle_id = "N/A" # Public transit does not use company fleet vehicles
            duration_mins = random.randint(15, 60)
            fare = random.choice([7000, 15000, 20000]) # Standard public transit fares

        trip_data.append([
            trip_id, user, vehicle_id, mode, trip_time.strftime("%Y-%m-%d %H:%M:%S"), 
            start_stn, end_stn, duration_mins, fare, 
            day_of_week, is_weekend, weather, temp_celsius
        ])

    trips_df = pd.DataFrame(trip_data, columns=[
        "TripID", "UserID", "VehicleID", "Mode", "Timestamp", 
        "Start_Station", "End_Station", "Duration_Mins", "Fare_VND",
        "DayOfWeek", "Is_Weekend", "Weather_Condition", "Temp_Celsius"
    ])

    # --- Preview and Save ---
    print("\n--- Preview: Trips Data (Features for Predictive Modeling) ---")
    print(trips_df.head())
    
    print("\n--- Preview: User Data ---")
    print(users_df.head())

    # Dynamically name files using Student IDs
    file_suffix = f"_{student_id_1}_{student_id_2}.csv"
    
    trips_df.to_csv(f"SF_Trips_Log{file_suffix}", index=False)
    users_df.to_csv(f"SF_Users{file_suffix}", index=False)
    vehicles_df.to_csv(f"SF_Vehicles{file_suffix}", index=False)

    print("\nUnique synthetic data files generated successfully:")
    print(f"- SF_Trips_Log{file_suffix}")
    print(f"- SF_Users{file_suffix}")
    print(f"- SF_Vehicles{file_suffix}")

if __name__ == "__main__":
    main()