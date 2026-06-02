import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [stats, setStats] = useState({ itemsSold: 0, earnings: 0, impact: 0, points: 0 });
  const [activities, setActivities] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboard();

    let statsChannel: any;
    let activityChannel: any;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      activityChannel = supabase
        .channel(`activities-${user.id}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "activities", filter: `user_id=eq.${user.id}` },
          (payload: any) => setActivities((prev) => [payload.new.message, ...prev])
        )
        .subscribe();

      statsChannel = supabase
        .channel(`stats-${user.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "dashboard_stats", filter: `user_id=eq.${user.id}` },
          (payload: any) => {
            const data = payload.new;
            setStats({ itemsSold: data?.items_sold || 0, earnings: data?.earnings || 0, impact: data?.impact || 0, points: data?.points || 0 });
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (activityChannel) supabase.removeChannel(activityChannel);
      if (statsChannel) supabase.removeChannel(statsChannel);
    };
  }, []);

  const fetchDashboard = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) { console.log(error); return; }

    const { data: dashboardData, error: dashboardError } = await supabase.from("dashboard_stats").select("*").eq("user_id", user.id).single();
    if (dashboardError) console.log(dashboardError);
    if (dashboardData?.username) setName(dashboardData.username);
    setEmail(user.email || "");

    if (dashboardData) {
      setStats({ itemsSold: dashboardData.items_sold || 0, earnings: dashboardData.earnings || 0, impact: dashboardData.impact || 0, points: dashboardData.points || 0 });
    } else {
      setStats({ itemsSold: 0, earnings: 0, impact: 0, points: 0 });
    }

    const { data: activityData, error: activityError } = await supabase
      .from("activities").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
    if (activityError) console.log(activityError);
    setActivities(activityData ? activityData.map((item: any) => item.message) : []);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.appName}>{name || "RecycleHub"}</Text>
        </View>

        <Pressable onPress={() => setDropdownVisible((v) => !v)}>
          <UserCircle size={32} color="#065f46" />
        </Pressable>

        <Modal visible={dropdownVisible} transparent animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownName}>{name || "User"}</Text>
              <Text style={styles.dropdownEmail}>{email}</Text>
              <View style={styles.dropdownDivider} />
              <Pressable onPress={async () => { setDropdownVisible(false); await supabase.auth.signOut(); router.replace("/login"); }}>
                <Text style={styles.dropdownLogout}>Logout</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { label: "Items Sold", value: stats.itemsSold, color: "#10b981" },
          { label: "Earnings", value: `Rs.${stats.earnings}`, color: "#3b82f6" },
          { label: "Impact", value: stats.impact, color: "#8b5cf6" },
          { label: "Points", value: stats.points, color: "#f59e0b" },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {[
          { label: "Seller", route: "/(tabs)/seller" },
          { label: "Buyer", route: "/(tabs)/buyer" },
          { label: "Marketplace", route: "/(tabs)/marketplace" },
          { label: "Earnings", route: "/(tabs)/earnings" },
          { label: "Impact", route: "/(tabs)/impact" },
          { label: "Learn", route: "/(tabs)/education" },
        ].map((a, i) => (
          <Pressable key={i} style={styles.actionBtn} onPress={() => router.push(a.route as any)}>
            <Text style={styles.actionText}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ABOUT US */}
      <Text style={styles.sectionTitle}>About Us</Text>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>RecycleHub</Text>
        <Text style={styles.aboutText}>
          RecycleHub is a smart scrap management platform that connects sellers and buyers to make recycling easy, rewarding, and impactful.
        </Text>
        <View style={styles.aboutDivider} />
        <Text style={styles.aboutMission}>Our Mission</Text>
        <Text style={styles.aboutText}>
          To reduce waste and build a cleaner planet by turning everyday scrap into value — one pickup at a time.
        </Text>
        <View style={styles.aboutDivider} />
        <View style={styles.aboutStats}>
          {[
            { label: "Users", value: "10K+" },
            { label: "Kg Recycled", value: "50K+" },
            { label: "Cities", value: "20+" },
          ].map((s, i) => (
            <View key={i} style={styles.aboutStatItem}>
              <Text style={styles.aboutStatValue}>{s.value}</Text>
              <Text style={styles.aboutStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 80, paddingRight: 20 },
  dropdown: { backgroundColor: "white", borderRadius: 12, padding: 16, minWidth: 200, elevation: 8, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10 },
  dropdownName: { fontWeight: "700", fontSize: 15, color: "#065f46" },
  dropdownEmail: { fontSize: 12, color: "#64748b", marginTop: 2 },
  dropdownDivider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 10 },
  dropdownLogout: { color: "#ef4444", fontWeight: "600", fontSize: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 14, color: "#047857" },
  appName: { fontSize: 26, fontWeight: "900", color: "#065f46" },
  statsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  statCard: { width: "48%", backgroundColor: "white", padding: 16, borderRadius: 16, marginBottom: 10, elevation: 2 },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { color: "#64748b", fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#065f46", marginBottom: 12 },
  actionsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  actionBtn: { width: "48%", backgroundColor: "#10b981", padding: 14, borderRadius: 14, alignItems: "center", marginBottom: 10 },
  actionText: { color: "white", fontWeight: "600", fontSize: 14 },
  activityItem: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 8, elevation: 1 },
  activityText: { color: "#475569" },
  aboutCard: { backgroundColor: "white", borderRadius: 16, padding: 18, marginBottom: 20, elevation: 2 },
  aboutTitle: { fontSize: 20, fontWeight: "800", color: "#065f46", marginBottom: 8 },
  aboutMission: { fontSize: 15, fontWeight: "700", color: "#047857", marginBottom: 6 },
  aboutText: { color: "#475569", lineHeight: 22, fontSize: 14 },
  aboutDivider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 12 },
  aboutStats: { flexDirection: "row", justifyContent: "space-around", marginTop: 4 },
  aboutStatItem: { alignItems: "center" },
  aboutStatValue: { fontSize: 20, fontWeight: "800", color: "#10b981" },
  aboutStatLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
});
