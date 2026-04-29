import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 CHANGE THIS TO YOUR IP
  const BASE_URL = "http://192.168.1.5:5000";

  const handleLogin = async () => {
    console.log("✅ Button working");

    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      if (res.data.token) {
        // ✅ Save token
        await AsyncStorage.setItem("token", res.data.token);

        // ✅ Navigate after success
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login Failed", res.data.message);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
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
        Welcome Back 👋
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
          backgroundColor: "#ffffff",
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
          backgroundColor: "#ffffff",
          padding: 15,
          borderRadius: 14,
          marginBottom: 20,
          fontSize: 15,
        }}
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={({ pressed }) => [
          {
            backgroundColor: loading ? "#6ee7b7" : "#10b981",
            padding: 16,
            borderRadius: 14,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
    </View>
  );
}