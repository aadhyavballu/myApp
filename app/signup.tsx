import { useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Signup() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        Sign Up
      </Text>

      <TextInput placeholder="Name" style={input} />
      <TextInput placeholder="Email" style={input} />
      <TextInput placeholder="Password" secureTextEntry style={input} />

      <Pressable
        onPress={() => router.replace("/(tabs)")} // ✅ GO TO HOME
        style={btn}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Create Account
        </Text>
      </Pressable>
    </View>
  );
}

const input = {
  borderWidth: 1,
  padding: 14,
  borderRadius: 12,
  marginBottom: 15,
};

const btn = {
  backgroundColor: "#10b981",
  padding: 15,
  borderRadius: 12,
};