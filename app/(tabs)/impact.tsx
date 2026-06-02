import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import { supabase } from "../../lib/supabase";

const screenWidth = Dimensions.get("window").width - 32;

export default function Impact() {
  const insets = useSafeAreaInsets();
  const [itemsSold, setItemsSold] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    let realtimeChannel: any;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      realtimeChannel = supabase
        .channel(`impact-stats-${user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "dashboard_stats", filter: `user_id=eq.${user.id}` },
          (payload: any) => {
            if (payload.new?.items_sold !== undefined)
              setItemsSold(payload.new.items_sold || 0);
          }
        )
        .subscribe();
    };

    setupRealtime();
    return () => { if (realtimeChannel) supabase.removeChannel(realtimeChannel); };
  }, []);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("dashboard_stats")
      .select("items_sold")
      .eq("user_id", user.id)
      .single();

    if (data) setItemsSold(data.items_sold || 0);
    setLoading(false);
  };

  // FORMULAS
  const co2Saved       = +(itemsSold * 6.6).toFixed(1);
  const energySaved    = +(itemsSold * 5.5).toFixed(1);
  const waterSaved     = itemsSold * 100;
  const treesProtected = Math.floor(itemsSold / 3);
  const landfill       = +(itemsSold * 2.5).toFixed(1);
  const impactScore    = itemsSold >= 50 ? "A+" : itemsSold >= 30 ? "A" : itemsSold >= 15 ? "B+" : itemsSold >= 5 ? "B" : "C";

  const chartData = {
    labels: ["CO₂\n(kg)", "Energy\n(kWh)", "Water\n(×10L)", "Trees", "Landfill\n(kg)"],
    datasets: [{
      data: [co2Saved, energySaved, waterSaved / 10, treesProtected, landfill].map((v) => v || 0),
    }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ecfdf5",
    backgroundGradientTo: "#ecfdf5",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: () => "#065f46",
    barPercentage: 0.6,
    propsForLabels: { fontSize: 10 },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#047857" }}>Loading impact data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}>

      <Text style={styles.title}>Environmental Impact 🌍</Text>
      <Text style={styles.subtitle}>Track your positive contribution to the planet</Text>

      {/* ITEMS SOLD BANNER */}
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Total Items Recycled</Text>
        <Text style={styles.bannerValue}>{itemsSold}</Text>
        <Text style={styles.bannerSub}>All calculations below are based on this</Text>
      </View>

      {/* TOP CARDS */}
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: "#10b981" }]}>
          <Text style={styles.cardTitle}>CO₂ Saved</Text>
          <Text style={styles.bigText}>{co2Saved} kg</Text>
          <Text style={styles.smallText}>≈ {(co2Saved / 0.21).toFixed(0)} km driven</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#059669" }]}>
          <Text style={styles.cardTitle}>Trees Protected</Text>
          <Text style={styles.bigText}>{treesProtected}</Text>
          <Text style={styles.smallText}>1 tree per 3 items</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#047857" }]}>
          <Text style={styles.cardTitle}>Impact Score</Text>
          <Text style={styles.bigText}>{impactScore}</Text>
          <Text style={styles.smallText}>Based on items sold</Text>
        </View>
      </View>

      {/* SMALL METRICS */}
      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <Text style={styles.metric}>{energySaved} kWh</Text>
          <Text style={styles.metricLabel}>Energy Saved</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.metric}>{waterSaved.toLocaleString("en-IN")} L</Text>
          <Text style={styles.metricLabel}>Water Saved</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.metric}>{landfill} kg</Text>
          <Text style={styles.metricLabel}>Landfill Avoided</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.metric}>{co2Saved} kg</Text>
          <Text style={styles.metricLabel}>CO₂ Reduced</Text>
        </View>
      </View>

      {/* BAR CHART */}
      <View style={styles.chartBox}>
        <Text style={styles.sectionTitle}>📊 Impact Overview</Text>
        {itemsSold > 0 ? (
          <BarChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={{ borderRadius: 12, marginTop: 8 }}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        ) : (
          <Text style={{ color: "#047857", marginTop: 12, textAlign: "center" }}>
            Start recycling to see your impact chart! ♻️
          </Text>
        )}
      </View>

      {/* MATERIAL IMPACT BARS */}
      <View style={styles.chartBox}>
        <Text style={styles.sectionTitle}>Impact by Material</Text>
        {[
          { label: "Plastic",  pct: Math.min(Math.round((itemsSold * 0.4) * 10), 100) },
          { label: "Paper",    pct: Math.min(Math.round((itemsSold * 0.25) * 10), 100) },
          { label: "Metal",    pct: Math.min(Math.round((itemsSold * 0.2) * 10), 100) },
          { label: "Glass",    pct: Math.min(Math.round((itemsSold * 0.1) * 10), 100) },
          { label: "E-Waste",  pct: Math.min(Math.round((itemsSold * 0.05) * 10), 100) },
        ].map((item, i) => (
          <View key={i} style={styles.barRow}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <Text style={styles.barLabel}>{item.pct}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${item.pct}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {/* BADGES */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, itemsSold >= 25 && styles.badgeEarned]}>
          <Text style={styles.badgeTitle}>♻️ Eco Warrior</Text>
          <Text style={styles.badgeText}>{Math.min(itemsSold, 25)}/25 items</Text>
        </View>
        <View style={[styles.badge, treesProtected >= 10 && styles.badgeEarned]}>
          <Text style={styles.badgeTitle}>🌳 Tree Guardian</Text>
          <Text style={styles.badgeText}>{treesProtected}/10 trees</Text>
        </View>
        <View style={[styles.badge, co2Saved >= 100 && styles.badgeEarned]}>
          <Text style={styles.badgeTitle}>🌫️ Carbon Hero</Text>
          <Text style={styles.badgeText}>{co2Saved}/100 kg CO₂</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ecfdf5" },

  title: { fontSize: 24, fontWeight: "bold", color: "#064e3b" },
  subtitle: { color: "#047857", marginBottom: 16 },

  banner: {
    backgroundColor: "#065f46",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    alignItems: "center",
  },
  bannerLabel: { color: "#a7f3d0", fontSize: 13 },
  bannerValue: { color: "white", fontSize: 48, fontWeight: "900" },
  bannerSub: { color: "#6ee7b7", fontSize: 11, marginTop: 4 },

  row: { flexDirection: "row", gap: 10 },
  card: { flex: 1, padding: 14, borderRadius: 16, marginBottom: 10 },
  cardTitle: { color: "white", fontSize: 11 },
  bigText: { color: "white", fontSize: 20, fontWeight: "bold" },
  smallText: { color: "white", fontSize: 10, marginTop: 2 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 4 },
  smallCard: { width: "48%", backgroundColor: "#f0fdf4", padding: 14, borderRadius: 12, marginBottom: 10 },
  metric: { fontSize: 16, fontWeight: "bold", color: "#065f46" },
  metricLabel: { color: "#047857", fontSize: 12 },

  chartBox: { backgroundColor: "#f0fdf4", padding: 16, borderRadius: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#065f46" },

  barRow: { marginTop: 10 },
  barLabel: { fontSize: 12, color: "#065f46" },
  barBg: { height: 8, backgroundColor: "#d1fae5", borderRadius: 10, marginTop: 4 },
  barFill: { height: 8, backgroundColor: "#10b981", borderRadius: 10 },

  badgeRow: { flexDirection: "row", gap: 10, marginTop: 15, marginBottom: 10 },
  badge: { flex: 1, backgroundColor: "#f0fdf4", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#d1fae5" },
  badgeEarned: { backgroundColor: "#d1fae5", borderColor: "#10b981" },
  badgeTitle: { fontWeight: "600", color: "#065f46", fontSize: 12 },
  badgeText: { fontSize: 11, color: "#047857", marginTop: 3 },
});
