import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 CHANGE THIS TO YOUR IP
  const BASE_URL = "http://192.168.1.5:5000";

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/signup`, {
        name,
        email,
        password,
      });

      Alert.alert("Success", res.data.message);

      if (res.data.message === "User created successfully") {
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#ecfdf5",
        padding: 20,
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: "800",
          marginBottom: 6,
          color: "#065f46",
          textAlign: "center",
        }}
      >
        ✨ Create Account ✨
      </Text>

      <Text
        style={{
          textAlign: "center",
          color: "#047857",
          marginBottom: 20,
        }}
      >
        🌱 Join our smart scrap management platform 🌱
      </Text>

      {/* Name */}
      <TextInput
        placeholder="👤 Name"
        placeholderTextColor="#94a3b8"
        value={name}
        onChangeText={setName}
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

      {/* Email */}
      <TextInput
        placeholder="📧 Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      {/* Password */}
      <TextInput
        placeholder="🔒 Password"
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

      {/* Button */}
      <Pressable
        onPress={handleSignup}
        disabled={loading}
        style={({ pressed }) => [
          {
            backgroundColor: loading ? "#6ee7b7" : "#10b981",
            padding: 16,
            borderRadius: 14,
            elevation: 3,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            marginBottom: 25,
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
          {loading ? "Creating..." : "🚀 Create Account"}
        </Text>
      </Pressable>

      {/* About Section (unchanged) */}
      <View
        style={{
          backgroundColor: "#dcfce7",
          borderRadius: 22,
          padding: 20,
          elevation: 4,
          borderWidth: 1,
          borderColor: "#86efac",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "900",
            color: "#064e3b",
            marginBottom: 10,
          }}
        >
          🌿 About Us
        </Text>

        <Text style={{ color: "#14532d", fontSize: 16, lineHeight: 24 }}>
          🌱 We are a technology-driven platform focused on transforming scrap management...
        </Text>
      </View>
    </ScrollView>
  );
}