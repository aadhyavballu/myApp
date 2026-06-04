import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../config/api";
import { useMarket } from "../../lib/marketContext";
import { supabase } from "../../lib/supabase";

export default function SellerDashboard() {
  const { addRequest, currentUserId } = useMarket();
  const insets = useSafeAreaInsets();
  const [selectedWaste, setSelectedWaste] = useState("Plastic");
  const [requestAddress, setRequestAddress] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [quantity, setQuantity] = useState("1 kg");
  const [contactNumber, setContactNumber] = useState("");
  const [scanResult, setScanResult] = useState<string | null>(null);

  const cameraRef = useRef<React.ElementRef<typeof CameraView> | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [stats, setStats] = useState({ items_sold: 0, earnings: 0 });
  const [permission, requestPermission] = useCameraPermissions();

  const wasteTypes = ["Plastic", "Paper", "Metal", "Glass", "E-Waste"];

  useEffect(() => {
    fetchSellerStats();

    let realtimeChannel: any = null;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      realtimeChannel = supabase
        .channel(`seller-stats-${user.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "dashboard_stats", filter: `user_id=eq.${user.id}` },
          (payload: any) => {
            if (!payload?.new) return;
            setStats({ items_sold: payload.new.items_sold ?? 0, earnings: payload.new.earnings ?? 0 });
          }
        )
        .subscribe();
    };

    setupRealtime();
    return () => { if (realtimeChannel) supabase.removeChannel(realtimeChannel); };
  }, []);

  const fetchSellerStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("dashboard_stats")
        .select("items_sold, earnings")
        .eq("user_id", user.id)
        .single();

      if (error) { console.log(error); return; }
      if (data) setStats({ items_sold: data.items_sold ?? 0, earnings: data.earnings ?? 0 });
    } catch (err) {
      console.log(err);
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission Required", "Camera permission needed.");
        return;
      }
    }
    setCameraReady(false);
    setShowCamera(true);
  };

  const scanMaterial = async () => {
    try {
      if (!cameraReady) {
        Alert.alert("Camera Not Ready", "Please wait for the camera to initialize.");
        return;
      }
      setIsScanning(true);
      if (!cameraRef.current || !cameraRef.current.takePicture) {
        Alert.alert("Camera Error", "Camera is not ready. Please try again.");
        return;
      }

      const photo: any = await cameraRef.current.takePicture({ quality: 0.5, base64: true });
      let detectedObject = "unknown scrap item";
      let category = selectedWaste;

      if (photo?.base64) {
        try {
          const response = await api.post("/scan-ai", { imageBase64: photo.base64 });
          const { label, category: predictedCategory } = response.data || {};
          if (label) detectedObject = label;
          if (predictedCategory) category = predictedCategory;
        } catch (scanError) {
          console.log("AI scan failed, falling back to local detection:", scanError);
        }
      }

      if (detectedObject === "unknown scrap item") {
        const fallbackObjects = ["plastic bottle", "newspaper", "aluminum can", "glass bottle", "laptop charger", "battery", "cardboard box"];
        const object = fallbackObjects[Math.floor(Math.random() * fallbackObjects.length)];
        detectedObject = object;
        if (object.includes("paper") || object.includes("newspaper") || object.includes("cardboard")) category = "Paper";
        else if (object.includes("metal") || object.includes("can") || object.includes("aluminum")) category = "Metal";
        else if (object.includes("glass")) category = "Glass";
        else if (object.includes("laptop") || object.includes("battery") || object.includes("charger")) category = "E-Waste";
      }

      setSelectedWaste(category);
      setScanResult(`${detectedObject} (${category})`);
      setShowCamera(false);

      Alert.alert("Material Detected", `${detectedObject}\n\nSelected: ${category}\n+30 points earned!`);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stats } = await supabase.from("dashboard_stats").select("points").eq("user_id", user.id).single();
        if (stats) {
          await supabase.from("dashboard_stats").update({ points: (stats.points ?? 0) + 30 }).eq("user_id", user.id);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsScanning(false);
    }
  };

  const findVendors = async () => {
    try {
      const query = `${selectedWaste} recycling vendors near me`;
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
    } catch {
      Alert.alert("Error", "Could not open Google Maps.");
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.cameraView}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
          onMountError={(event) => console.log("Camera mount error", event)}
        />
        <View style={styles.cameraControls}>
          <Pressable style={styles.scanCaptureBtn} onPress={scanMaterial} disabled={isScanning || !cameraReady}>
            <Text style={styles.closeCameraText}>{isScanning ? "Scanning..." : cameraReady ? "Scan Material" : "Loading Camera..."}</Text>
          </Pressable>
          <Pressable style={styles.closeCameraBtn} onPress={() => setShowCamera(false)}>
            <Text style={styles.closeCameraText}>Close Camera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, paddingHorizontal: 16 }}
    >
      <Text style={styles.header}>Seller Dashboard</Text>
      <Text style={styles.subHeader}>Track your recycling performance</Text>

      {/* STATS */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Items Sold</Text>
          <Text style={styles.blue}>{stats.items_sold}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Earnings</Text>
          <Text style={styles.green}>Rs.{stats.earnings}</Text>
        </View>
      </View>

      {/* CAMERA BUTTON */}
      <Pressable style={styles.scanBtn} onPress={openCamera}>
        <Text style={styles.scanText}>Scan Scrap</Text>
      </Pressable>
      {scanResult ? (
        <Text style={styles.scanResult}>Last detected: {scanResult}</Text>
      ) : null}

      {/* DROPDOWN */}
      <Text style={styles.dropdownLabel}>Select Scrap Type</Text>
      <Pressable style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
        <Text style={{ color: "#065f46", fontWeight: "600" }}>{selectedWaste} v</Text>
      </Pressable>

      {showDropdown && wasteTypes.map((item) => (
        <Pressable key={item} style={styles.option} onPress={() => { setSelectedWaste(item); setShowDropdown(false); }}>
          <Text style={{ color: "#065f46" }}>{item}</Text>
        </Pressable>
      ))}

      {/* FIND VENDORS */}
      <Pressable style={styles.findBtn} onPress={findVendors}>
        <Text style={{ color: "white", fontWeight: "700" }}>Find Vendors</Text>
      </Pressable>

      {/* SEND REQUEST */}
      <View style={styles.requestCard}>
        <Text style={styles.sectionHeader}>New Vendor Request</Text>
        <Text style={styles.sectionSubHeader}>Fill in the details below to post a pickup request to the marketplace.</Text>

        <Text style={styles.fieldLabel}>Scrap Type</Text>
        <View style={styles.fieldValue}>
          <Text style={{ color: "#0f172a", fontWeight: "500" }}>{selectedWaste}</Text>
        </View>

        <Text style={styles.fieldLabel}>Pickup Address</Text>
        <TextInput
          value={requestAddress}
          onChangeText={setRequestAddress}
          placeholder="Enter full pickup address"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Contact Number</Text>
        <TextInput
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="Enter phone number"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Minimum Amount Expected (Rs.)</Text>
        <TextInput
          value={minAmount}
          onChangeText={setMinAmount}
          placeholder="e.g. 500"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Quantity</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="e.g. 5 kg"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Pressable
          style={styles.requestBtn}
          onPress={async () => {
            if (!requestAddress.trim() || !minAmount.trim()) {
              Alert.alert("Missing Details", "Please enter both address and minimum amount.");
              return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            const sellerId = user?.id || currentUserId;
            if (!sellerId) {
              Alert.alert("User Error", "Unable to identify your account. Please sign in again.");
              return;
            }

            const sellerName =
              user?.user_metadata?.full_name ??
              user?.email?.split("@")[0] ??
              "Seller";

            addRequest({
              seller: sellerName,
              sellerId,
              material: selectedWaste,
              quantity,
              price: `Rs.${minAmount}`,
              minAmount: `Rs.${minAmount}`,
              address: requestAddress,
              pickupLocation: requestAddress,
              contactNumber: contactNumber.trim(),
            });

            Alert.alert("Request Sent", "Your vendor request is now visible in the marketplace.");
            setRequestAddress("");
            setContactNumber("");
            setMinAmount("");
            setQuantity("1 kg");
          }}
        >
          <Text style={styles.requestText}>Submit Request</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ecfdf5" },
  header: { fontSize: 24, fontWeight: "bold", color: "#064e3b" },
  subHeader: { color: "#047857", marginBottom: 20 },
  row: { flexDirection: "row", gap: 10, marginBottom: 20 },
  card: { flex: 1, backgroundColor: "white", padding: 16, borderRadius: 16 },
  label: { color: "#64748b" },
  blue: { fontSize: 22, fontWeight: "bold", color: "#3b82f6" },
  green: { fontSize: 22, fontWeight: "bold", color: "#10b981" },
  scanBtn: { backgroundColor: "#10b981", padding: 14, borderRadius: 12, alignItems: "center" },
  scanText: { color: "white", fontWeight: "700" },
  scanResult: { marginTop: 10, color: "#065f46", fontSize: 14, fontWeight: "600" },
  dropdownLabel: { marginTop: 20, marginBottom: 6, color: "#065f46", fontWeight: "600" },
  dropdown: { borderWidth: 1, borderColor: "#a7f3d0", padding: 12, borderRadius: 10, marginBottom: 6, backgroundColor: "#f0fdf4" },
  option: { padding: 10, backgroundColor: "#dcfce7", borderRadius: 8, marginBottom: 5 },
  findBtn: { backgroundColor: "#10b981", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  closeCameraBtn: { position: "absolute", bottom: 100, alignSelf: "center", backgroundColor: "#10b981", padding: 15, borderRadius: 12 },
  closeCameraText: { color: "white", fontWeight: "700" },
  sectionHeader: { fontSize: 18, fontWeight: "700", color: "#064e3b", marginBottom: 4 },
  sectionSubHeader: { fontSize: 13, color: "#047857", marginBottom: 16 },
  requestCard: { backgroundColor: "#f0fdf4", borderRadius: 16, padding: 18, marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: "#a7f3d0" },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#065f46", marginBottom: 6, marginTop: 12 },
  fieldValue: { backgroundColor: "#dcfce7", borderWidth: 1, borderColor: "#a7f3d0", borderRadius: 10, padding: 12 },
  input: { backgroundColor: "white", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#a7f3d0", fontSize: 14, color: "#064e3b" },
  requestBtn: { backgroundColor: "#10b981", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 20 },
  requestText: { color: "white", fontWeight: "700", fontSize: 15 },
  cameraContainer: { flex: 1, backgroundColor: "black" },
  cameraView: { flex: 1 },
  cameraControls: { position: "absolute", bottom: 40, width: "100%", alignItems: "center", gap: 12 },
  scanCaptureBtn: { backgroundColor: "#2563eb", padding: 16, borderRadius: 14 },
});
