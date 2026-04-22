import { Text, View } from "react-native";

export default function BuyerDashboard() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16 }}>
      
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#0f172a" }}>
        Buyer Dashboard
      </Text>

      <Text style={{ color: "#64748b", marginBottom: 20 }}>
        Manage your scrap collections
      </Text>

      {/* Cards */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        
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
              padding: 16,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#64748b" }}>{item.title}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: item.color,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}