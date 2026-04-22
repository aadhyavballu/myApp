import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SellerDashboard() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Seller Dashboard</Text>
      <Text style={styles.subHeader}>
        Track your recycling performance ♻️
      </Text>

      {/* CARDS */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Items Sold</Text>
          <Text style={styles.blue}>120</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Earnings</Text>
          <Text style={styles.green}>₹45,000</Text>
        </View>
      </View>

      {/* DISABLED SCAN BUTTON */}
      <Pressable style={styles.scanBtn}>
        <Text style={styles.scanText}>📸 Scan (Available on Mobile)</Text>
      </Pressable>

      {/* ✅ ADDED: RECYCLING MAP SECTION */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Recycling Map</Text>
        <Text style={styles.mapSubtitle}>
          Find nearby recycling centers
        </Text>

        {/* Fake Map UI */}
        <View style={styles.mapBox}>
          <Text style={{ color: "#64748b" }}>📍 Interactive Map</Text>
          <Text style={{ fontSize: 12, color: "#94a3b8" }}>
            Showing nearby vendors
          </Text>
        </View>

        {/* Waste Type Selector */}
        <View style={styles.selectBox}>
          <Text style={{ color: "#64748b" }}>Select waste types...</Text>
        </View>

        <Pressable style={styles.findBtn}>
          <Text style={{ color: "white", fontWeight: "600" }}>
            Find Vendors
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },

  subHeader: {
    color: "#64748b",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
  },

  label: {
    color: "#64748b",
  },

  blue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3b82f6",
  },

  green: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#10b981",
  },

  scanBtn: {
    backgroundColor: "#94a3b8",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  scanText: {
    color: "white",
    fontWeight: "600",
  },

  /* ✅ NEW STYLES */
  mapContainer: {
    marginTop: 25,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },

  mapSubtitle: {
    color: "#64748b",
    marginBottom: 12,
  },

  mapBox: {
    height: 150,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  findBtn: {
    backgroundColor: "#94a3b8",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});