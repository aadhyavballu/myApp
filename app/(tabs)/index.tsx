import { useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Home() {

  // 📊 STATE (your dynamic data)
  const [transactions, setTransactions] = useState([
    { month: "Jan", amount: 2500, type: "Plastic" },
    { month: "Feb", amount: 2900, type: "Paper" },
    { month: "Mar", amount: 3200, type: "Metal" },
    { month: "Apr", amount: 3700, type: "Glass" },
    { month: "May", amount: 4100, type: "Plastic" },
    { month: "Jun", amount: 4500, type: "Paper" },
  ]);

  // ➕ simulate selling item (for testing)
  const addSale = () => {
    const newEntry = {
      month: "Jun",
      amount: Math.floor(Math.random() * 2000) + 1000,
      type: ["Plastic", "Paper", "Metal", "Glass", "E-Waste"][
        Math.floor(Math.random() * 5)
      ],
    };
    setTransactions([...transactions, newEntry]);
  };

  // 📈 monthly totals
  const monthlyData = ["Jan","Feb","Mar","Apr","May","Jun"].map(month =>
    transactions
      .filter(t => t.month === month)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // 🥧 material distribution
  const materialTypes = ["Plastic","Paper","Metal","Glass","E-Waste"];
  const pieData = materialTypes.map(type => {
    const total = transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: type,
      population: total || 1,
      color:
        type === "Plastic" ? "#3b82f6" :
        type === "Paper" ? "#10b981" :
        type === "Metal" ? "#f59e0b" :
        type === "Glass" ? "#8b5cf6" :
        "#ef4444",
      legendFontColor: "#333",
      legendFontSize: 12,
    };
  });

  // 💰 totals
  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalItems = transactions.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>RecycleHub ♻️</Text>
      </View>

      {/* STATS */}
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text>Total Items</Text>
          <Text style={styles.statValue}>{totalItems}</Text>
        </View>

        <View style={styles.statCard}>
          <Text>Total Earnings</Text>
          <Text style={styles.statValue}>₹{totalEarnings}</Text>
        </View>
      </View>

      {/* BUTTON (simulate new sale) */}
      <Pressable style={styles.button} onPress={addSale}>
        <Text style={{ color: "white" }}>Add Random Sale</Text>
      </Pressable>

      {/* GRAPH */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Performance</Text>

        <LineChart
          data={{
            labels: ["Jan","Feb","Mar","Apr","May","Jun"],
            datasets: [{ data: monthlyData }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(16,185,129,${opacity})`,
          }}
        />
      </View>

      {/* PIE CHART */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Material Distribution</Text>

        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          chartConfig={{
            color: () => "#000",
          }}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 20 },

  header: { alignItems: "center", marginBottom: 20 },

  title: { fontSize: 28, fontWeight: "bold" },

  row: { flexDirection: "row", gap: 10 },

  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  cardTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },
});