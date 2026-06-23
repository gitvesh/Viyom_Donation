import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure the output directory is the graphs directory
output_dir = os.path.dirname(os.path.abspath(__file__))

print("Starting Graph Generation for Viyom Platform Performance Evaluation...")

# ----------------------------------------------------
# Graph 1: API Response Times Under Different User Loads
# ----------------------------------------------------
print("1. Generating Response Time Comparison Bar Chart...")
data = {
    'Endpoint': ['Login', 'Sectors', 'Active Pools', 'Create Order', 'Verify Payment', 'Donation History'],
    '10 Users (ms)': [185, 62, 68, 412, 245, 78],
    '25 Users (ms)': [228, 88, 95, 578, 298, 112],
    '50 Users (ms)': [367, 143, 152, 894, 412, 189]
}

df = pd.DataFrame(data)
df_melted = df.melt(id_vars='Endpoint', var_name='Load', value_name='Response Time (ms)')

plt.figure(figsize=(12, 6))
sns.set_theme(style="whitegrid")
palette = sns.color_palette("viridis", 3)

ax = sns.barplot(data=df_melted, x='Endpoint', y='Response Time (ms)', hue='Load', palette=palette)
plt.title('Viyom Platform - API Response Times Under Variable User Loads', fontsize=14, fontweight='bold', pad=15)
plt.xlabel('API Endpoint', fontsize=12, fontweight='bold')
plt.ylabel('Average Response Time (ms)', fontsize=12, fontweight='bold')
plt.xticks(rotation=15, ha='right')
plt.legend(title='Concurrent Users', frameon=True)
plt.tight_layout()

rt_path = os.path.join(output_dir, 'response_time_comparison.png')
plt.savefig(rt_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"   Saved: {rt_path}")


# ----------------------------------------------------
# Graph 2: API Throughput vs Concurrent Users
# ----------------------------------------------------
print("2. Generating Throughput Line Graph...")
throughput_data = {
    'Endpoint': ['Sectors (GET)', 'Pools (GET)', 'Login (POST)', 'Create Order (POST)', 'History (GET)'],
    '10 Users': [14.8, 13.2, 5.4, 3.8, 10.2],
    '25 Users': [28.4, 26.1, 11.2, 7.2, 20.8],
    '50 Users': [42.1, 39.8, 18.6, 9.4, 36.4]
}

df_tp = pd.DataFrame(throughput_data)
users = [10, 25, 50]

plt.figure(figsize=(10, 5.5))
markers = ['o', 's', '^', 'D', 'v']
for i, endpoint in enumerate(throughput_data['Endpoint']):
    row = df_tp[df_tp['Endpoint'] == endpoint].iloc[0]
    values = [row['10 Users'], row['25 Users'], row['50 Users']]
    plt.plot(users, values, marker=markers[i % len(markers)], linewidth=2, label=endpoint)

plt.title('API Throughput (Transactions Per Second) vs Concurrent Users', fontsize=14, fontweight='bold', pad=15)
plt.xlabel('Concurrent Users', fontsize=12, fontweight='bold')
plt.ylabel('Throughput (Requests/Second)', fontsize=12, fontweight='bold')
plt.xticks([10, 25, 50])
plt.legend(loc='upper left', frameon=True)
plt.grid(True, alpha=0.3, linestyle='--')
plt.tight_layout()

tp_path = os.path.join(output_dir, 'throughput_comparison.png')
plt.savefig(tp_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"   Saved: {tp_path}")


# ----------------------------------------------------
# Graph 3: Error Rate by Test Scenario
# ----------------------------------------------------
print("3. Generating Error Rate Bar Chart...")
error_data = {
    'Scenario': ['Public Endpoints\n(25 Users)', 'Auth Flow\n(10 Users)', 'Donor Journey\n(25 Users)', 'Admin Journey\n(10 Users)', 'Stress Test\n(50 Users)'],
    'Error Rate (%)': [0.0, 0.0, 0.5, 0.0, 1.1]
}

df_err = pd.DataFrame(error_data)
colors = ['#2ecc71' if x < 0.5 else '#f39c12' if x < 1.0 else '#e74c3c' for x in df_err['Error Rate (%)']]

plt.figure(figsize=(9, 5))
bars = plt.bar(df_err['Scenario'], df_err['Error Rate (%)'], color=colors, edgecolor='black', linewidth=0.7)
plt.axhline(y=2.0, color='red', linestyle='--', alpha=0.7, label='Acceptable Threshold (2%)')
plt.title('Error Rate by Test Scenario — Viyom Platform', fontsize=13, fontweight='bold', pad=15)
plt.xlabel('Test Scenario', fontsize=11, fontweight='bold')
plt.ylabel('Error Rate (%)', fontsize=11, fontweight='bold')
plt.ylim(0, 3.0)
plt.legend(frameon=True)
for bar, val in zip(bars, df_err['Error Rate (%)']):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05, f'{val}%', ha='center', fontsize=10, fontweight='bold')
plt.tight_layout()

err_path = os.path.join(output_dir, 'error_rate_scenarios.png')
plt.savefig(err_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"   Saved: {err_path}")


# ----------------------------------------------------
# Graph 4: Blockchain Overhead Pie Chart
# ----------------------------------------------------
print("4. Generating Blockchain Overhead Pie Chart...")
labels = ['SHA-256 Hash\nGeneration', 'Web3j RPC\nConnection', 'Transaction\nSubmission', 'Block\nConfirmation (Async)']
sizes = [5, 20, 30, 45]
colors = ['#3498db', '#9b59b6', '#e67e22', '#e74c3c']
explode = (0, 0, 0.05, 0.1)

fig, ax = plt.subplots(figsize=(7.5, 6.5))
wedges, texts, autotexts = ax.pie(sizes, explode=explode, labels=labels, colors=colors,
                                   autopct='%1.1f%%', shadow=True, startangle=140,
                                   textprops={'fontsize': 10})
plt.setp(autotexts, size=10, weight="bold")
plt.setp(texts, size=10)
ax.set_title('Blockchain Pipeline Overhead Distribution\n(Async — No Impact on HTTP Response)', 
             fontsize=12, fontweight='bold', pad=15)
plt.tight_layout()

oh_path = os.path.join(output_dir, 'blockchain_overhead_pie.png')
plt.savefig(oh_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"   Saved: {oh_path}")

print("\nAll publication-ready charts successfully generated and saved in the graphs/ directory!")
