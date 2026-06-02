import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)");
      } else {
        setChecking(false);
      }
    });
  }, []);

  if (checking) return null;

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoIcon}>♻️</Text>
      </View>

      <Text style={styles.appName}>RecycleHub</Text>
      <Text style={styles.tagline}>Turn Waste into Value 🌱</Text>

      <Text style={styles.sub}>
        Join thousands making the planet cleaner — one scrap at a time.
      </Text>

      <Pressable
        style={styles.loginBtn}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </Pressable>

      <Pressable
        style={styles.signupBtn}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.signupText}>Create Account</Text>
      </Pressable>

      <Text style={styles.footer}>
        💡 Earn money while saving the planet!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 6,
  },
  logoIcon: { fontSize: 48 },

  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#065f46",
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#047857",
    marginTop: 8,
  },

  sub: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 36,
    lineHeight: 22,
  },

  loginBtn: {
    backgroundColor: "#10b981",
    width: "100%",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },

  loginText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  signupBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#10b981",
  },

  signupText: {
    color: "#10b981",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginTop: 32,
    color: "#047857",
    fontSize: 13,
    fontWeight: "500",
  },
});