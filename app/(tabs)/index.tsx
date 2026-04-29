import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        router.replace("/(tabs)");
      } else {
        setChecking(false);
      }
    };

    checkLogin();
  }, []);

  // 🔄 Show loader while checking
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <View style={styles.logoBox}>
        <Text style={styles.logo}></Text>
      </View>

      <Text style={styles.title}>RecycleHub</Text>
      <Text style={styles.subtitle}>
        Turn Waste into Value 
      </Text>

      <Link href="/login" asChild>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.btnText}>Login</Text>
        </Pressable>
      </Link>

      <Link href="/signup" asChild>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Create Account</Text>
        </Pressable>
      </Link>

      <View style={styles.highlight}>
        <Text style={styles.highlightText}>
          💡 Earn money while saving the planet!
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { alignItems: "center", padding: 20 },

  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  logo: { fontSize: 42, color: "white" },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#065f46",
  },

  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 20,
  },

  primaryBtn: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 14,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },

  btnText: { color: "white", fontWeight: "600", fontSize: 16 },

  secondaryBtn: {
    borderWidth: 2,
    borderColor: "#10b981",
    padding: 15,
    borderRadius: 14,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },

  secondaryText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 16,
  },

  highlight: {
    backgroundColor: "#d1fae5",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
  },

  highlightText: {
    textAlign: "center",
    color: "#065f46",
    fontWeight: "600",
  },
});