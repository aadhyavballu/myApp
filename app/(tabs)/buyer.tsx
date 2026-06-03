import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMarket } from "../../lib/marketContext";
import { supabase, supabaseAnonKey, supabaseUrl } from "../../lib/supabase";

export default function BuyerDashboard() {
  const { requests, acceptedRequests } = useMarket();
  const insets = useSafeAreaInsets();

  const pendingCount = requests.filter((item) => item.status === "pending").length;
  const acceptedCount = acceptedRequests.length;
  const collectionsCount = requests.length;

  const openPickup = async (item: { material: string; pickupLocation: string }) => {
    const porterURL = `https://porter.in`;
    try {
      await Linking.openURL(porterURL);
      Alert.alert("Pickup Service", `Book a pickup for:\n${item.material}\nLocation: ${item.pickupLocation}`);
    } catch {
      Alert.alert("Error", "Could not open Porter.");
    }
  };

  const openPayment = async (item: any) => {
    const amount = parseInt(item.price.replace("Rs.", "").replace("₹", "").replace(",", ""), 10) || 0;

    if (!item.sellerId) {
      Alert.alert("Error", "Seller information missing.");
      return;
    }

    if (amount <= 0) {
      Alert.alert("Error", "Invalid amount for this payment.");
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `Pay Rs.${amount} to ${item.seller} for ${item.material}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed to Pay",
          onPress: async () => {
            try {
              const orderResponse = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({ amount }),
              });

              const order = await orderResponse.json();

              if (!orderResponse.ok || !order?.id) {
                throw new Error(order?.message || "Unable to create Razorpay order.");
              }

              const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";

              const paymentData = await RazorpayCheckout.open({
                key: razorpayKey,
                amount: String(amount * 100),
                currency: "INR",
                order_id: order.id,
                name: "RecycleHub",
                description: `Payment for ${item.material}`,
                prefill: {
                  name: item.seller,
                  email: "buyer@example.com",
                  contact: "9999999999",
                },
                theme: { color: "#2563eb" },
              });

              if (paymentData?.razorpay_payment_id) {
                await supabase
                  .from("dashboard_stats")
                  .select("earnings, items_sold, impact")
                  .eq("user_id", item.sellerId)
                  .single()
                  .then(async ({ data: sellerStats, error }) => {
                    if (error || !sellerStats) return;

                    await supabase
                      .from("dashboard_stats")
                      .update({
                        earnings: (sellerStats.earnings || 0) + amount,
                        items_sold: (sellerStats.items_sold || 0) + 1,
                        impact: (sellerStats.impact || 0) + 1,
                      })
                      .eq("user_id", item.sellerId);
                  });

                Alert.alert("Payment Successful", "Razorpay payment completed.");
              }
            } catch (error: any) {
              console.log("Razorpay payment error:", error);
              Alert.alert("Payment Failed", error?.message || "Could not complete the payment.");
            }
          },
        },
      ]
    );
  };

  const openGoogleMaps = async (item: { pickupLocation: string }) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.pickupLocation)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Could not open Google Maps.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#eff6ff" }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}
    >
      <Text style={{ fontSize: 30, fontWeight: "800", color: "#0f172a" }}>
        Buyer Dashboard
      </Text>

      <Text style={{ color: "#64748b", marginBottom: 16, marginTop: 6, fontSize: 14 }}>
        Manage your scrap collections efficiently
      </Text>

      {/* Today Summary */}
      <View style={{ backgroundColor: "#dbeafe", padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: "#93c5fd" }}>
        <Text style={{ fontWeight: "700", color: "#1d4ed8" }}>Today&apos;s Summary</Text>
        <Text style={{ color: "#1d4ed8", marginTop: 6 }}>
          {pendingCount} pending  •  {acceptedCount} accepted  •  {collectionsCount} total requests
        </Text>
      </View>

      {/* Cards */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {[
          { title: "Pending", value: pendingCount.toString(), color: "#f59e0b" },
          { title: "Accepted", value: acceptedCount.toString(), color: "#10b981" },
          { title: "Collections", value: collectionsCount.toString(), color: "#3b82f6" },
          { title: "Active", value: acceptedCount.toString(), color: "#8b5cf6" },
        ].map((item, index) => (
          <View
            key={index}
            style={{ width: "48%", backgroundColor: "white", padding: 18, borderRadius: 18, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: "#e0f2fe" }}
          >
            <Text style={{ color: "#64748b", fontSize: 13 }}>{item.title}</Text>
            <Text style={{ fontSize: 24, fontWeight: "800", color: item.color }}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Accepted Requests */}
      <Text style={{ marginTop: 18, fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
        Accepted Requests
      </Text>

      {acceptedRequests.length === 0 ? (
        <View style={{ marginTop: 10, backgroundColor: "white", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#dbeafe" }}>
          <Text style={{ color: "#64748b" }}>
            No accepted requests yet. Accept a request in the market to see it here.
          </Text>
        </View>
      ) : (
        acceptedRequests.map((item) => (
          <View key={item.id} style={{ marginTop: 12, backgroundColor: "white", padding: 16, borderRadius: 18, borderWidth: 1, borderColor: "#dbeafe" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>{item.material}</Text>
            <Text style={{ color: "#475569", marginTop: 6 }}>Seller: {item.seller}</Text>
            <Text style={{ color: "#475569" }}>Quantity: {item.quantity}</Text>
            <Text style={{ color: "#10b981", fontWeight: "700", marginTop: 6 }}>{item.price}</Text>
            <Text style={{ color: "#64748b", marginTop: 8 }}>Pickup at: {item.pickupLocation}</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
              <Pressable onPress={() => openPickup(item)} style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 12, flex: 1, marginRight: 6, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "700" }}>Pickup</Text>
              </Pressable>
              <Pressable onPress={() => openPayment(item)} style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 12, flex: 1, marginHorizontal: 6, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "700" }}>Payment</Text>
              </Pressable>
              <Pressable onPress={() => openGoogleMaps(item)} style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 12, flex: 1, marginLeft: 6, alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "700" }}>View Map</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
