import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const awardDailyLoginPoints = async (userId: string) => {
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("dashboard_stats")
      .select("points, last_login_date")
      .eq("user_id", userId)
      .single();

    if (!data) return;

    if (data.last_login_date === today) return; // already claimed today

    await supabase
      .from("dashboard_stats")
      .update({ points: (data.points ?? 0) + 5, last_login_date: today })
      .eq("user_id", userId);

    Alert.alert("Daily Login Bonus", "+5 points added for logging in today!");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert("Login Failed", "Incorrect email or password.");
      return;
    }

    if (data.user) await awardDailyLoginPoints(data.user.id);

    router.replace("/(tabs)");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#ecfdf5",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "800",
          marginBottom: 20,
          color: "#065f46",
          textAlign: "center",
        }}
      >
        Welcome Back
      </Text>

      <Text
        style={{
          textAlign: "center",
          color: "#047857",
          marginBottom: 25,
        }}
      >
        Login to continue to your dashboard
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#a7f3d0",
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 14,
          marginBottom: 15,
          fontSize: 15,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#a7f3d0",
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 14,
          marginBottom: 20,
          fontSize: 15,
        }}
      />

      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [{
          backgroundColor: "#10b981",
          padding: 16,
          borderRadius: 14,
          elevation: 3,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        }]}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          Login
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/signup")}
        style={{ marginTop: 20 }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#047857",
          }}
        >
          Don't have an account?{" "}
          <Text
            style={{
              fontWeight: "700",
              color: "#10b981",
            }}
          >
            Sign Up
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}