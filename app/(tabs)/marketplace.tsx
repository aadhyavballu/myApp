import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Status, useMarket } from "../../lib/marketContext";

export default function Marketplace() {
  const [filter, setFilter] = useState<Status | "all" | "my-requests">("all");
  const { requests, updateStatus, currentUserId, deleteRequest } = useMarket();
  const insets = useSafeAreaInsets();
  const [localUserId, setLocalUserId] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setLocalUserId(user.id);
    });
  }, []);

  const userId = currentUserId || localUserId;

  const filteredData = requests.filter((item) => {
    if (filter === "my-requests") {
      return item.sellerId === userId;
    }
    const matchesStatus = filter === "all" || item.status === filter;
    const isNotOwnRequest = item.sellerId !== userId;
    return matchesStatus && isNotOwnRequest;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}>
      
      <Text style={styles.header}>Marketplace</Text>
      <Text style={styles.subHeader}>
        Connect with sellers and manage scrap
      </Text>

      {/* FILTER TABS */}
      <View style={styles.tabs}>
        {["all", "pending", "accepted", "rejected", "my-requests"].map((tab) => (
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
              {tab === "my-requests" ? "MY REQUESTS" : tab.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LIST */}
      {filteredData.length === 0 && (
        <Text style={{ color: "#64748b", textAlign: "center", marginTop: 20 }}>
          {filter === "my-requests" ? "No requests yet" : "No requests available"}
        </Text>
      )}
      {filteredData.map((item) => (
        <View key={item.id} style={styles.card}>
          
          <View style={styles.rowBetween}>
            <Text style={styles.material}>{item.material}</Text>
            <Text style={getStatusStyle(item.status)}>
              {item.status === "accepted" ? "SOLD" : item.status.toUpperCase()}
            </Text>
          </View>

          <Text>Seller: {item.seller}</Text>
          <Text>Quantity: {item.quantity}</Text>

          <Text style={styles.price}>{item.price}</Text>

          {/* ACTION BUTTONS */}
          {item.sellerId === userId ? (
            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Delete Request",
                    "Are you sure you want to delete this request?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteRequest(item.id),
                      },
                    ]
                  )
                }
                style={[styles.button, { backgroundColor: "#ef4444", width: "100%" }]}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          ) : item.status === "pending" ? (
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
          ) : null}

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