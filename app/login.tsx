import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("✅ Button working");

    // simple validation (optional)
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    // 🚀 DIRECT NAVIGATION (NO BACKEND)
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={input}
      />

      {/* ✅ BUTTON */}
      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          btn,
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Login
        </Text>
      </Pressable>

    </View>
  );
}

const input = {
  borderWidth: 1,
  borderColor: "#e2e8f0",
  padding: 14,
  borderRadius: 12,
  marginBottom: 15,
};

const btn = {
  backgroundColor: "#10b981",
  padding: 15,
  borderRadius: 12,
};