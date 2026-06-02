import { Tabs } from "expo-router";
import { BookOpen, DollarSign, Home, Leaf, ShoppingBag, User, Users } from "lucide-react-native";
import { MarketProvider } from "../../lib/marketContext";

export default function TabLayout() {
  return (
    <MarketProvider>
      <Tabs
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#e2e8f0",
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      {/* SELLER */}
      <Tabs.Screen
        name="seller"
        options={{
          title: "Seller",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />

      {/* BUYER */}
      <Tabs.Screen
        name="buyer"
        options={{
          title: "Buyer",
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />

      {/* MARKETPLACE */}
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />

      {/* EARNINGS */}
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, size }) => (
            <DollarSign color={color} size={size} />
          ),
        }}
      />

      {/* IMPACT */}
      <Tabs.Screen
        name="impact"
        options={{
          title: "Impact",
          tabBarIcon: ({ color, size }) => (
            <Leaf color={color} size={size} />
          ),
        }}
      />

      {/* LEARN */}
      <Tabs.Screen
        name="education"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  </MarketProvider>
  );
}