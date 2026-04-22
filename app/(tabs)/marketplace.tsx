import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Status = "pending" | "accepted" | "rejected";

interface ScrapItem {
  id: string;
  seller: string;
  material: string;
  quantity: string;
  price: string;
  status: Status;
}

export default function Marketplace() {
  const [filter, setFilter] = useState<Status | "all">("all");

  const [data, setData] = useState<ScrapItem[]>([
    {
      id: "1",
      seller: "Ravi",
      material: "Plastic",
      quantity: "5 kg",
      price: "₹200",
      status: "pending",
    },
    {
      id: "2",
      seller: "Anita",
      material: "Metal",
      quantity: "10 kg",
      price: "₹500",
      status: "accepted",
    },
    {
      id: "3",
      seller: "Kiran",
      material: "Paper",
      quantity: "3 kg",
      price: "₹120",
      status: "pending",
    },
  ]);

  const updateStatus = (id: string, newStatus: Status) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredData =
    filter === "all" ? data : data.filter((item) => item.status === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      <Text style={styles.header}>Marketplace</Text>
      <Text style={styles.subHeader}>
        Connect with sellers and manage scrap
      </Text>

      {/* FILTER TABS */}
      <View style={styles.tabs}>
        {["all", "pending", "accepted", "rejected"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setFilter(tab as any)}
            style={[
              styles.tab,
              filter === tab && styles.activeTab,
            ]}
          >
            <Text
              style={{
                color: filter === tab ? "white" : "#475569",
              }}
            >
              {tab.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LIST */}
      {filteredData.map((item) => (
        <View key={item.id} style={styles.card}>
          
          <View style={styles.rowBetween}>
            <Text style={styles.material}>{item.material}</Text>
            <Text style={getStatusStyle(item.status)}>
              {item.status.toUpperCase()}
            </Text>
          </View>

          <Text>Seller: {item.seller}</Text>
          <Text>Quantity: {item.quantity}</Text>

          <Text style={styles.price}>{item.price}</Text>

          {/* ACTION BUTTONS */}
          {item.status === "pending" && (
            <View style={styles.actions}>
              
              <Pressable
                onPress={() => updateStatus(item.id, "rejected")}
                style={[styles.button, { backgroundColor: "#ef4444" }]}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>

              <Pressable
                onPress={() => updateStatus(item.id, "accepted")}
                style={[styles.button, { backgroundColor: "#10b981" }]}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </Pressable>

            </View>
          )}

        </View>
      ))}
    </ScrollView>
  );
}

const getStatusStyle = (status: Status) => {
  switch (status) {
    case "pending":
      return { color: "#f59e0b" };
    case "accepted":
      return { color: "#10b981" };
    case "rejected":
      return { color: "#ef4444" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subHeader: {
    color: "#64748b",
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeTab: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  material: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    width: "48%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});