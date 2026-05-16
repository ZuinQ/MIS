import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# --- SAIGONFLOW COMPREHENSIVE MIS ANALYTICS SCRIPT ---
# This script fulfills Tier 3 & Tier 4 MIS requirements for Part 3 of the project.

# Set professional visualization style
plt.style.use('ggplot')
sns.set_palette("husl")

def run_comprehensive_analysis():
    # 1. Configuration: Path to your CSV files
    users_file = 'SF_Users_523H0088_523H0113.csv'
    trips_file = 'SF_Trips_Log_523H0088_523H0113.csv'
    vehicles_file = 'SF_Vehicles_523H0088_523H0113.csv'

    # Check if files exist
    for f in [users_file, trips_file, vehicles_file]:
        if not os.path.exists(f):
            print(f"Error: Could not find '{f}'.")
            return

    print("--- 🚀 Starting Comprehensive MIS Data Analysis ---")

    # 2. Loading and Merging (BPM Requirement: Data Joining)
    df_users = pd.read_csv(users_file)
    df_trips = pd.read_csv(trips_file)
    df_vehicles = pd.read_csv(vehicles_file)
    
    # Merge for rich analysis
    df_full = pd.merge(df_trips, df_users, on='UserID')
    df_full = pd.merge(df_full, df_vehicles[['VehicleID', 'Type', 'Battery_Level_Pct']], on='VehicleID')

    # --- 3A: FINANCIAL / FLEET UTILIZATION ---
    print("\n[3A] Analyzing Financials & Fleet Utilization...")
    vehicle_revenue = df_trips.groupby('VehicleID')['Fare_VND'].sum().sort_values(ascending=False).reset_index()
    
    # Top 10 and Bottom 10
    top_10 = vehicle_revenue.head(10)
    bottom_10 = vehicle_revenue.tail(10)

    fig, ax = plt.subplots(1, 2, figsize=(18, 8))
    sns.barplot(data=top_10, x='Fare_VND', y='VehicleID', ax=ax[0], palette='Greens_r')
    ax[0].set_title('Top 10 Most Profitable Vehicles')
    
    sns.barplot(data=bottom_10, x='Fare_VND', y='VehicleID', ax=ax[1], palette='Reds_r')
    ax[1].set_title('Bottom 10 Least Profitable Vehicles')
    plt.tight_layout()
    plt.savefig('MIS_3A_Financial_Analysis.png')
    print("- Saved: MIS_3A_Financial_Analysis.png")

    # --- 3A: CUSTOMER / ENVIRONMENTAL IMPACT ---
    print("[3A] Analyzing Customer Behavior & Weather Impact...")
    # Revenue by Weather and Transport Mode
    weather_mode = df_full.groupby(['Weather_Condition', 'Mode'])['Fare_VND'].sum().unstack()
    
    plt.figure(figsize=(12, 6))
    weather_mode.plot(kind='bar', stacked=True, figsize=(12, 6))
    plt.title('Revenue Distribution by Weather & Transport Mode')
    plt.ylabel('Total Revenue (VND)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('MIS_3A_Customer_Environmental_Impact.png')
    print("- Saved: MIS_3A_Customer_Environmental_Impact.png")

    # --- 3A: INTERNAL PROCESS (Station Net Flow) ---
    print("[3A] Analyzing Station Net Flow (Sources vs Sinks)...")
    starts = df_trips['Start_Station'].value_counts()
    ends = df_trips['End_Station'].value_counts()
    net_flow = (starts - ends).fillna(0).sort_values()
    
    plt.figure(figsize=(14, 8))
    net_flow.plot(kind='barh', color=(net_flow > 0).map({True: 'g', False: 'r'}))
    plt.title('Station Net Flow (Positive = Source, Negative = Sink)')
    plt.xlabel('Net Flow (Departures - Arrivals)')
    plt.tight_layout()
    plt.savefig('MIS_3A_Internal_Process_Station_Flow.png')
    print("- Saved: MIS_3A_Internal_Process_Station_Flow.png")

    # --- 3B: PREDICTIVE ANALYTICS CHALLENGE ---
    print("\n[3B] Generating Predictive Insights (Churn Prediction)...")
    # Predicting Churn based on Age and Loyalty Points
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=df_users, x='Age', y='Loyalty_Points', hue='Has_Churned', palette='coolwarm')
    plt.title('Predictive Challenge: Churn Risk by Age & Loyalty')
    plt.axvline(x=25, color='gray', linestyle='--') # Theoretical threshold
    plt.tight_layout()
    plt.savefig('MIS_3B_Predictive_Analysis_Churn.png')
    print("- Saved: MIS_3B_Predictive_Analysis_Churn.png")

    # --- 3C: PRESCRIPTIVE SUMMARY ---
    print("\n[3C] Final Prescriptive Recommendations for Management:")
    print("-" * 50)
    
    # Logic-based recommendations
    highest_revenue_mode = df_trips.groupby('Mode')['Fare_VND'].sum().idxmax()
    lowest_battery_veh = df_vehicles.loc[df_vehicles['Battery_Level_Pct'].idxmin()]['VehicleID']
    sink_station = net_flow.idxmin()
    source_station = net_flow.idxmax()

    print(f"1. FLEET STRATEGY: Focus investment on {highest_revenue_mode} as it generates the most revenue.")
    print(f"2. MAINTENANCE ALERT: Immediate service required for Vehicle {lowest_battery_veh} (Lowest Battery).")
    print(f"3. LOGISTICS REBALANCING: Move vehicles from '{source_station}' (Excess) to '{sink_station}' (Deficit).")
    print(f"4. MARKETING ACTION: Target 'Casual' users under age 25 with 15% vouchers to reduce Churn risk.")
    print("-" * 50)

    print("\n--- ✅ Comprehensive Analysis Complete! ---")
    print("Please submit all 'MIS_3*.png' files for your Part 3 submission.")

if __name__ == "__main__":
    run_comprehensive_analysis()
