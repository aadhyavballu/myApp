import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Impact() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* HEADER */}
      <Text style={styles.title}>Environmental Impact 🌍</Text>
      <Text style={styles.subtitle}>
        Track your positive contribution to the planet
      </Text>

      {/* TOP CARDS */}
      <View style={styles.row}>
        
        <View style={[styles.card, { backgroundColor: "#3b82f6" }]}>
          <Text style={styles.cardTitle}>Plastic Recycled</Text>
          <Text style={styles.bigText}>32 kg</Text>
          <Text style={styles.smallText}>+5.2 kg this month</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#10b981" }]}>
          <Text style={styles.cardTitle}>CO₂ Saved</Text>
          <Text style={styles.bigText}>211 kg</Text>
          <Text style={styles.smallText}>≈ 890 km driven</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#059669" }]}>
          <Text style={styles.cardTitle}>Trees Protected</Text>
          <Text style={styles.bigText}>42</Text>
          <Text style={styles.smallText}>+7 this month</Text>
        </View>

      </View>

      {/* SMALL METRICS */}
      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <Text style={styles.metric}>1,245 kWh</Text>
          <Text style={styles.metricLabel}>Energy Saved</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.metric}>3,456 L</Text>
          <Text style={styles.metricLabel}>Water Saved</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.metric}>89 kg</Text>
          <Text style={styles.metricLabel}>Landfill Avoided</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.metric}>A+</Text>
          <Text style={styles.metricLabel}>Impact Score</Text>
        </View>
      </View>

      {/* FAKE CHART SECTION */}
      <View style={styles.chartBox}>
        <Text style={styles.sectionTitle}>Monthly Impact Trend</Text>
        <View style={styles.fakeChart}>
          <Text style={{ color: "#64748b" }}>
            📊 Chart will be added using Recharts (later step)
          </Text>
        </View>
      </View>

      {/* MATERIAL IMPACT */}
      <View style={styles.chartBox}>
        <Text style={styles.sectionTitle}>Impact by Material</Text>

        {["Plastic", "Paper", "Metal", "Glass", "E-Waste"].map((item, i) => (
          <View key={i} style={styles.barRow}>
            <Text style={styles.barLabel}>{item}</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${(i + 1) * 20}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {/* BADGES */}
      <View style={styles.badgeRow}>

        <View style={styles.badge}>
          <Text style={styles.badgeTitle}>Eco Warrior</Text>
          <Text style={styles.badgeText}>25kg recycled</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeTitle}>Tree Guardian</Text>
          <Text style={styles.badgeText}>42/50 trees</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeTitle}>Carbon Hero</Text>
          <Text style={styles.badgeText}>211/500 kg CO₂</Text>
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },

  title: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },
  subtitle: { color: "#64748b", marginBottom: 20 },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },

  cardTitle: { color: "white", fontSize: 12 },
  bigText: { color: "white", fontSize: 22, fontWeight: "bold" },
  smallText: { color: "white", fontSize: 10 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  smallCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  metric: { fontSize: 16, fontWeight: "bold" },
  metricLabel: { color: "#64748b", fontSize: 12 },

  chartBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginTop: 15,
  },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },

  fakeChart: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  barRow: {
    marginTop: 10,
  },

  barLabel: {
    fontSize: 12,
    color: "#475569",
  },

  barBg: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    marginTop: 4,
  },

  barFill: {
    height: 8,
    backgroundColor: "#10b981",
    borderRadius: 10,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  badge: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
  },

  badgeTitle: { fontWeight: "600" },
  badgeText: { fontSize: 12, color: "#64748b" },
});