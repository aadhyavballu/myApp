import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function Earnings() {
  const insets = useSafeAreaInsets();
  const [points, setPoints] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [top3, setTop3] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const ACTION_POINTS = { scan: 30, login: 5, refer: 100, challenge: 50 };

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const { data: existing } = await supabase
      .from("dashboard_stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("dashboard_stats").insert({
        user_id: user.id,
        username: user.email?.split("@")[0] ?? "User",
        points: 0,
        earnings: 0,
        items_sold: 0,
      });
    }

    const { data: myStats, error } = await supabase
      .from("dashboard_stats")
      .select("points, earnings")
      .eq("user_id", user.id)
      .single();

    if (!error && myStats) {
      setPoints(myStats.points ?? 0);
      setEarnings(myStats.earnings ?? 0);
    }

    const { data: all } = await supabase
      .from("dashboard_stats")
      .select("user_id, username, points")
      .order("points", { ascending: false });

    if (all) {
      const unique = all.filter((r, i, arr) => arr.findIndex((x) => x.user_id === r.user_id) === i);
      const rank = unique.findIndex((r) => r.user_id === user.id) + 1;
      setMyRank(rank || null);
      setTop3(
        unique
          .filter((r) => r.user_id !== user.id)
          .slice(0, 3)
          .map((r) => ({ ...r, actualRank: unique.findIndex((x) => x.user_id === r.user_id) + 1 }))
      );
    }
  };

  const updatePoints = async (newPoints: number) => {
    if (!userId) return;
    await supabase.from("dashboard_stats").update({ points: newPoints }).eq("user_id", userId);
    setPoints(newPoints);
    await loadData();
  };

  const earnPoints = async (type: keyof typeof ACTION_POINTS) => {
    await updatePoints(points + ACTION_POINTS[type]);
  };

  const redeemPoints = async (cost: number, name: string) => {
    if (points < cost) {
      Alert.alert("Not enough points", `You need ${cost} pts to redeem ${name}.`);
      return;
    }
    Alert.alert(`Redeem ${name}`, `Confirm redemption of ${cost} points?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => updatePoints(points - cost) },
    ]);
  };

  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);

  const rankLabel: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };

  const filteredMonths = selectedMonth === "All Months"
    ? monthlyData
    : monthlyData.filter((m) => m.month === selectedMonth);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}>

      <Text style={styles.header}>Earnings</Text>
      <Text style={styles.subHeader}>Track your income from recycling</Text>

      {/* TOTAL */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalAmount}>Rs.{earnings.toLocaleString("en-IN")}</Text>
        <Text style={styles.growth}>{monthlyData.length} month(s) of activity</Text>
      </View>

      {/* BREAKDOWN */}
      <View style={styles.card}>
        <Text style={styles.title}>Breakdown</Text>

        <Pressable style={styles.dropdownBtn} onPress={() => setShowMonthDropdown((v) => !v)}>
          <Text style={styles.dropdownBtnText}>{selectedMonth} v</Text>
        </Pressable>

        {showMonthDropdown && (
          <>
            <View style={styles.dropdownList}>
              {["All Months", ...monthlyData.map((m) => m.month)].map((m) => (
                <Pressable
                  key={m}
                  style={[styles.dropdownOption, selectedMonth === m && styles.dropdownOptionActive]}
                  onPress={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                >
                  <Text style={{ color: selectedMonth === m ? "white" : "#0f172a" }}>{m}</Text>
                </Pressable>
              ))}
            </View>

            {filteredMonths.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={{ color: "#475569" }}>{item.month}</Text>
                <Text style={styles.bold}>Rs.{item.amount.toLocaleString("en-IN")}</Text>
              </View>
            ))}

            <View style={[styles.row, { borderTopWidth: 1, borderTopColor: "#e2e8f0", marginTop: 10, paddingTop: 10 }]}>
              <Text style={{ fontWeight: "700" }}>Total</Text>
              <Text style={[styles.bold, { color: "#10b981" }]}>
                Rs.{filteredMonths.reduce((s, m) => s + m.amount, 0).toLocaleString("en-IN")}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* REWARD CARD */}
      <View style={styles.rewardCard}>
        <Text style={styles.rewardTitle}>Rewards</Text>
        <Text style={styles.pointsText}>{points} Points</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min((points / 1000) * 100, 100)}%` }]} />
        </View>
        <Text style={styles.rewardText}>
          {points >= 1000 ? "You can redeem Rs.500 cashback now!" : `${1000 - points} more points for Rs.500 cashback`}
        </Text>
        <Pressable style={styles.rewardButton} onPress={() => redeemPoints(1000, "Rs.500 Cashback")}>
          <Text style={{ color: "white", fontWeight: "600" }}>Redeem Rewards</Text>
        </Pressable>
      </View>

      {/* AVAILABLE REWARDS */}
      <View style={styles.card}>
        <Text style={styles.title}>Available Rewards</Text>
        <View style={styles.rewardGrid}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardName}>Flipkart Rs.100 Coupon</Text>
            <Text style={styles.pointsSmall}>250 pts</Text>
            <Pressable style={styles.redeemBtn} onPress={() => redeemPoints(250, "Flipkart Rs.100 Coupon")}>
              <Text style={styles.redeemText}>Redeem</Text>
            </Pressable>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardName}>Rs.500 Cashback</Text>
            <Text style={styles.pointsSmall}>1000 pts</Text>
            <Pressable style={styles.redeemBtn} onPress={() => redeemPoints(1000, "Rs.500 Cashback")}>
              <Text style={styles.redeemText}>Redeem</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* LEADERBOARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Eco Heroes Leaderboard</Text>

        {/* TOP 3 OTHERS */}
        {top3.map((user, i) => (
          <View key={i} style={styles.leaderRow}>
            <View style={styles.leaderLeft}>
              <View style={[
                styles.rankBadge,
                user.actualRank === 1 && { backgroundColor: "#fbbf24" },
                user.actualRank === 2 && { backgroundColor: "#94a3b8" },
                user.actualRank === 3 && { backgroundColor: "#b45309" },
              ]}>
                <Text style={styles.rankBadgeText}>#{user.actualRank}</Text>
              </View>
              <Text style={styles.leaderName}>{user.username}</Text>
            </View>
            <Text style={styles.leaderPoints}>{user.points} pts</Text>
          </View>
        ))}

        {/* DIVIDER */}
        <View style={styles.leaderDivider} />

        {/* YOUR RANK */}
        <View style={styles.youRow}>
          <View style={styles.leaderLeft}>
            <View style={[styles.rankBadge, { backgroundColor: "#10b981" }]}>
              <Text style={styles.rankBadgeText}>#{myRank ?? "—"}</Text>
            </View>
            <Text style={{ fontWeight: "700", color: "#065f46" }}>You</Text>
          </View>
          <Text style={[styles.leaderPoints, { color: "#065f46" }]}>{points} pts</Text>
        </View>
      </View>

      {/* HOW TO EARN */}
      <View style={styles.earnCard}>
        <Text style={styles.title}>How to Earn Points</Text>
        <View style={styles.earnRow}>
          {[
            { label: "Scan & Recycle", range: "+30 pts", tappable: true, type: undefined },
            { label: "Daily Login", type: "login" as const, range: "+5 pts", tappable: true },
            { label: "Refer Friends", type: "refer" as const, range: "+100 pts", tappable: true },
            { label: "Challenges", type: "challenge" as const, range: "+50 pts", tappable: true },
          ].map((action, i) => (
            <Pressable
              key={i}
              style={[styles.earnBox, !action.tappable && { opacity: 0.6 }]}
              onPress={async () => {
                if (!action.tappable) {
                  Alert.alert("Scan to Earn", "Go to Seller tab and scan scrap to earn +30 points!");
                  return;
                }

                if (action.type === "challenge") {
                  Alert.alert(
                    "Challenges Coming Soon",
                    "We will notify you when new challenges are available to complete."
                  );
                  return;
                }

                if (action.type === "refer") {
                  await Share.share({
                    message:
                      "Join me on RecycleHub — the smart scrap management app! Download and sign up here: https://recyclehub.app/login",
                    title: "Refer a Friend — RecycleHub",
                  });
                  return;
                }

                if (action.type === "login") {
                  Alert.alert("Daily Login", "Login bonus is awarded automatically each day when you log in.");
                  return;
                }
              }}
            >
              <Text style={styles.earnText}>{action.label}</Text>
              <Text style={styles.earnPoints}>{action.range}</Text>
            </Pressable>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { fontSize: 26, fontWeight: "bold", color: "#0f172a" },
  subHeader: { color: "#64748b", marginBottom: 15 },

  totalCard: { backgroundColor: "#10b981", padding: 20, borderRadius: 18, marginBottom: 15 },
  totalLabel: { color: "#d1fae5" },
  totalAmount: { fontSize: 30, fontWeight: "bold", color: "white" },
  growth: { color: "#bbf7d0", marginTop: 5 },

  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "600" },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  bold: { fontWeight: "600" },

  rewardCard: { backgroundColor: "#8b5cf6", padding: 18, borderRadius: 18, marginBottom: 15 },
  rewardTitle: { fontSize: 18, fontWeight: "600", color: "white" },
  pointsText: { fontSize: 26, fontWeight: "bold", color: "white", marginTop: 5 },

  progressBar: { height: 8, backgroundColor: "#c4b5fd", borderRadius: 10, marginTop: 10 },
  progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 10 },
  rewardText: { color: "#ede9fe", marginTop: 10 },
  rewardButton: { marginTop: 12, backgroundColor: "#10b981", padding: 10, borderRadius: 10, alignItems: "center" },

  rewardGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  rewardItem: { width: "48%", backgroundColor: "#f1f5f9", padding: 12, borderRadius: 12 },
  rewardName: { fontWeight: "600" },
  pointsSmall: { marginTop: 5, color: "#64748b" },

  redeemBtn: { marginTop: 10, backgroundColor: "#10b981", padding: 8, borderRadius: 8, alignItems: "center" },
  redeemText: { color: "white", fontWeight: "600" },

  dropdownBtn: { marginTop: 12, backgroundColor: "#f1f5f9", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  dropdownBtnText: { fontWeight: "600", color: "#065f46" },
  dropdownList: { marginTop: 6, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, overflow: "hidden" },
  dropdownOption: { padding: 10, backgroundColor: "#f8fafc" },
  dropdownOptionActive: { backgroundColor: "#10b981" },

  leaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  leaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  leaderName: { fontSize: 15, fontWeight: "500", color: "#0f172a" },
  leaderPoints: { fontSize: 14, fontWeight: "700", color: "#10b981" },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#e2e8f0", justifyContent: "center", alignItems: "center" },
  rankBadgeText: { fontSize: 12, fontWeight: "700", color: "white" },
  leaderDivider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 8 },
  youRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#d1fae5", padding: 10, borderRadius: 10 },

  earnCard: { backgroundColor: "#ecfdf5", padding: 18, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: "#10b981" },
  earnRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 12 },
  earnBox: { width: "48%", backgroundColor: "#d1fae5", padding: 14, borderRadius: 14, marginBottom: 10, alignItems: "center", borderWidth: 1, borderColor: "#10b981" },
  earnText: { fontSize: 14, fontWeight: "600", marginTop: 6, color: "#065f46" },
  earnPoints: { fontSize: 13, color: "#047857", marginTop: 4, fontWeight: "500" },
});
