import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type FilterType = "day" | "week" | "month";

export default function Earnings() {
  const [filter, setFilter] = useState<FilterType>("month");

  const data = {
    day: [
      { label: "Today", amount: "₹1,200" },
      { label: "Yesterday", amount: "₹900" },
    ],
    week: [
      { label: "Week 1", amount: "₹5,000" },
      { label: "Week 2", amount: "₹6,500" },
    ],
    month: [
      { label: "January", amount: "₹10,000" },
      { label: "February", amount: "₹12,000" },
      { label: "March", amount: "₹15,000" },
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Header */}
      <Text style={styles.header}>Earnings</Text>
      <Text style={styles.subHeader}>
        Track your income from recycling
      </Text>

      {/* FILTER */}
      <View style={styles.filterRow}>
        {["day", "week", "month"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item as FilterType)}
            style={[
              styles.filterBtn,
              filter === item && styles.activeFilter,
            ]}
          >
            <Text
              style={{
                color: filter === item ? "white" : "#475569",
                fontWeight: "600",
              }}
            >
              {item.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* TOTAL */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalAmount}>₹75,000</Text>
        <Text style={styles.growth}>↑ 12% this period</Text>
      </View>

      {/* BREAKDOWN */}
      <View style={styles.card}>
        <Text style={styles.title}>Breakdown</Text>

        {data[filter].map((item, i) => (
          <View key={i} style={styles.row}>
            <Text>{item.label}</Text>
            <Text style={styles.bold}>{item.amount}</Text>
          </View>
        ))}
      </View>

      {/* REWARD CARD */}
      <View style={styles.rewardCard}>
        <Text style={styles.rewardTitle}>🎁 Rewards</Text>
        <Text style={styles.points}>1200 Points</Text>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.rewardText}>
          You’re close to unlocking ₹200 cashback!
        </Text>

        <Pressable style={styles.rewardButton}>
          <Text style={{ color: "white", fontWeight: "600" }}>
            Redeem Rewards
          </Text>
        </Pressable>
      </View>

      {/* REWARD ITEMS */}
      <View style={styles.card}>
        <Text style={styles.title}>Available Rewards</Text>

        <View style={styles.rewardGrid}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardName}>Flipkart ₹100 Coupon</Text>
            <Text style={styles.pointsSmall}>⚡ 250 pts</Text>
            <Pressable style={styles.redeemBtn}>
              <Text style={styles.redeemText}>Redeem</Text>
            </Pressable>
          </View>

          <View style={styles.rewardItem}>
            <Text style={styles.rewardName}>₹500 Cashback</Text>
            <Text style={styles.pointsSmall}>⚡ 1000 pts</Text>
            <Pressable style={styles.redeemBtn}>
              <Text style={styles.redeemText}>Redeem</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* LEADERBOARD */}
      <View style={styles.card}>
        <Text style={styles.title}>🏆 Eco Heroes</Text>

        {[
          { name: "Ninad", points: 2450 },
          { name: "P Durganandan V Bhat", points: 2103 },
          { name: "Nishal Nayak", points: 1876 },w
          { name: "Likhit Nayak", points: 1875 },
          { name: "Priyadarshan Nayak", points: 1870},
        ].map((user, i) => (
          <View key={i} style={styles.leaderRow}>
            <Text style={{ fontSize: 16 }}>
              👤 {i + 1}. {user.name}
            </Text>
            <Text style={styles.bold}>⚡ {user.points}</Text>
          </View>
        ))}

        <View style={styles.youRow}>
          <Text>You</Text>
          <Text style={styles.bold}>⚡ 1234</Text>
        </View>
      </View>

      {/* HOW TO EARN */}
      <View style={styles.earnCard}>
        <Text style={styles.title}>How to Earn Points 🌿</Text>

        <View style={styles.earnRow}>
          <View style={styles.earnBox}>
            <Text style={{ fontSize: 18 }}>♻️</Text>
            <Text style={styles.earnText}>Scan & Recycle</Text>
            <Text style={styles.earnPoints}>+10-50 pts</Text>
          </View>

          <View style={styles.earnBox}>
            <Text style={{ fontSize: 18 }}>🎁</Text>
            <Text style={styles.earnText}>Daily Login</Text>
            <Text style={styles.earnPoints}>+5 pts</Text>
          </View>

          <View style={styles.earnBox}>
            <Text style={{ fontSize: 18 }}>👥</Text>
            <Text style={styles.earnText}>Refer Friends</Text>
            <Text style={styles.earnPoints}>+100 pts</Text>
          </View>

          <View style={styles.earnBox}>
            <Text style={{ fontSize: 18 }}>🏆</Text>
            <Text style={styles.earnText}>Challenges</Text>
            <Text style={styles.earnPoints}>+25-200 pts</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },

  header: { fontSize: 26, fontWeight: "bold", color: "#0f172a" },
  subHeader: { color: "#64748b", marginBottom: 15 },

  filterRow: { flexDirection: "row", gap: 10, marginBottom: 15 },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
  },
  activeFilter: { backgroundColor: "#10b981" },

  totalCard: {
    backgroundColor: "#10b981",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
  },
  totalLabel: { color: "#d1fae5" },
  totalAmount: { fontSize: 30, fontWeight: "bold", color: "white" },
  growth: { color: "#bbf7d0", marginTop: 5 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "600" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bold: { fontWeight: "600" },

  rewardCard: {
    backgroundColor: "#8b5cf6",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
  },
  rewardTitle: { fontSize: 18, fontWeight: "600", color: "white" },
  points: { fontSize: 26, fontWeight: "bold", color: "white", marginTop: 5 },

  progressBar: {
    height: 8,
    backgroundColor: "#c4b5fd",
    borderRadius: 10,
    marginTop: 10,
  },
  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  rewardText: { color: "#ede9fe", marginTop: 10 },
  rewardButton: {
    marginTop: 12,
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  rewardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rewardItem: {
    width: "48%",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
  },
  rewardName: { fontWeight: "600" },
  pointsSmall: { marginTop: 5, color: "#64748b" },

  redeemBtn: {
    marginTop: 10,
    backgroundColor: "#10b981",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  redeemText: { color: "white", fontWeight: "600" },

  leaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  youRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    backgroundColor: "#d1fae5",
    padding: 10,
    borderRadius: 10,
  },

  earnCard: {
    backgroundColor: "#ecfdf5",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#10b981",
  },

  earnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },

  earnBox: {
    width: "48%",
    backgroundColor: "#d1fae5",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#10b981",
  },

  earnText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    color: "#065f46",
  },

  earnPoints: {
    fontSize: 13,
    color: "#047857",
    marginTop: 4,
    fontWeight: "500",
  },
});