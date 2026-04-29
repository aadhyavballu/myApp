import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SellerDashboard() {
  const [selectedWaste, setSelectedWaste] = useState("Plastic");
  const [showDropdown, setShowDropdown] = useState(false);

  const wasteTypes = ["Plastic", "Paper", "Metal", "Glass", "E-Waste"];

  const findVendors = () => {
    alert(`Searching vendors for: ${selectedWaste} ♻️`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

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

      {/* SCAN BUTTON */}
      <Pressable style={styles.scanBtn}>
        <Text style={styles.scanText}>📸 Scan (Available on Mobile)</Text>
      </Pressable>

      {/* MAP SECTION */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>🌿 Recycling Map</Text>

        <Text style={styles.mapSubtitle}>
          Find nearby recycling centers
        </Text>

        <View style={styles.mapBox}>
          <Text style={{ color: "#065f46", fontWeight: "600" }}>
            📍 Interactive Map
          </Text>
          <Text style={{ fontSize: 12, color: "#047857" }}>
            Showing nearby vendors
          </Text>
        </View>

        {/* DROPDOWN */}
        <Text style={styles.dropdownLabel}>Select Scrap Type</Text>

        <Pressable
          onPress={() => setShowDropdown(!showDropdown)}
          style={styles.dropdown}
        >
          <Text style={{ color: "#065f46", fontWeight: "600" }}>
            {selectedWaste} ⌄
          </Text>
        </Pressable>

        {/* OPTIONS */}
        {showDropdown && (
          <View>
            {wasteTypes.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedWaste(item);
                  setShowDropdown(false);
                }}
                style={styles.option}
              >
                <Text style={{ color: "#065f46" }}>{item}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* FIND BUTTON */}
        <Pressable style={styles.findBtn} onPress={findVendors}>
          <Text style={{ color: "white", fontWeight: "700" }}>
            🔍 Find Vendors
          </Text>
        </Pressable>

      </View>

    </ScrollView>
  );
}

/* ✅ FIXED STYLES (THIS WAS MISSING BEFORE) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecfdf5",
    padding: 16,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#064e3b",
  },

  subHeader: {
    color: "#047857",
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
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  scanText: {
    color: "white",
    fontWeight: "700",
  },

  mapContainer: {
    marginTop: 25,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#064e3b",
  },

  mapSubtitle: {
    color: "#047857",
    marginBottom: 12,
  },

  mapBox: {
    height: 150,
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  dropdownLabel: {
    marginBottom: 6,
    color: "#065f46",
    fontWeight: "600",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#a7f3d0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "#f0fdf4",
  },

  option: {
    padding: 10,
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    marginBottom: 5,
  },

  findBtn: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});