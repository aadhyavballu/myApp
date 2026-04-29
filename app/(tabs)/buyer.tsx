import { Pressable, ScrollView, Text, View } from "react-native";

export default function BuyerDashboard() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#eff6ff",
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      
      {/* Header */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: "800",
          color: "#0f172a",
        }}
      >
        Buyer Dashboard 💙
      </Text>

      <Text
        style={{
          color: "#64748b",
          marginBottom: 16,
          marginTop: 6,
          fontSize: 14,
        }}
      >
        Manage your scrap collections efficiently
      </Text>

      {/* Today Summary */}
      <View
        style={{
          backgroundColor: "#dbeafe",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#93c5fd",
        }}
      >
        <Text style={{ fontWeight: "700", color: "#1d4ed8" }}>
          📊 Today’s Summary
        </Text>
        <Text style={{ color: "#1d4ed8", marginTop: 6 }}>
          3 new requests • 1 pickup completed • ₹2,400 earned today
        </Text>
      </View>

      {/* Cards */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {[
          { title: "Pending", value: "12", color: "#f59e0b" },
          { title: "Accepted", value: "40", color: "#10b981" },
          { title: "Investment", value: "₹1L", color: "#3b82f6" },
          { title: "Collections", value: "30", color: "#8b5cf6" },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              width: "48%",
              backgroundColor: "white",
              padding: 18,
              borderRadius: 18,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 3,
              borderWidth: 1,
              borderColor: "#e0f2fe",
            }}
          >
            <Text style={{ color: "#64748b", fontSize: 13 }}>
              {item.title}
            </Text>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: item.color,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text
        style={{
          marginTop: 18,
          fontSize: 18,
          fontWeight: "700",
          color: "#0f172a",
        }}
      >
        ⚡ Quick Actions
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: 12,
          justifyContent: "space-between",
        }}
      >
        {[
          { name: "New Pickup", color: "#3b82f6" },
          { name: "View Map", color: "#2563eb" },
          { name: "Payments", color: "#1d4ed8" },
        ].map((item, i) => (
          <Pressable
            key={i}
            style={{
              backgroundColor: item.color,
              padding: 14,
              borderRadius: 14,
              width: "31%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Activity */}
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          fontWeight: "700",
          color: "#0f172a",
        }}
      >
        🕒 Recent Activity
      </Text>

      <View style={{ marginTop: 10 }}>
        {[
          "✔ Pickup completed - Plastic waste (Hostel A)",
          "📦 New request from Hostel B",
          "💰 Payment received ₹800",
          "🚚 Vendor assigned for Metal scrap pickup",
          "📍 Location updated for Glass collection point",
          "🔔 New scrap listing available nearby",
          "♻️ Weekly summary generated successfully",
        ].map((item, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "white",
              padding: 12,
              borderRadius: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#dbeafe",
            }}
          >
            <Text style={{ color: "#64748b" }}>{item}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}