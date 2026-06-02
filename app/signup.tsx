import { useRouter } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";

import { supabase } from "../lib/supabase";

const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    console.log("EMAIL STARTING");

    const res = await fetch(
      "https://vceleermtpmvunihnkes.supabase.co/functions/v1/send-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("EMAIL FAILED:", data);
      return;
    }

    console.log("EMAIL SENT SUCCESS:", data);
  } catch (err) {
    console.log("EMAIL ERROR:", err);
  }
};

export default function Signup() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {

    if (loading) return;

    console.log("SIGNUP STARTED");

    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      // CREATE AUTH USER
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

      console.log("DATA: user created");
      if (error) {

        Alert.alert(
          "Signup Failed",
          error.message
        );

        return;
      }

      // IF USER CREATED
      if (data.user) {

        // CREATE DEFAULT DASHBOARD STATS
        const { error: statsError } =
          await supabase
            .from("dashboard_stats")
            .insert([
              {
                user_id: data.user.id,
                username: name,
                items_sold: 0,
                earnings: 0,
                impact: 0,
                points: 0,
              },
            ]);

        if (statsError) console.log("STATS ERROR:", statsError?.message);

        // CREATE FIRST ACTIVITY
        const { error: activityError } =
          await supabase
            .from("activities")
            .insert([{ user_id: data.user.id, message: "Account created successfully" }]);

        if (activityError) console.log("ACTIVITY ERROR:", activityError?.message);

        // SEND WELCOME EMAIL ONLY AFTER SUCCESSFUL USER CREATION
        await sendWelcomeEmail(email, name);
      }

      Alert.alert(
        "Success",
        "Account created successfully!"
      );

      // REDIRECT
      router.replace("/account-created");

    } catch (err) {
      console.log("SIGNUP CRASH:", err instanceof Error ? err.message : "Unknown error");
      Alert.alert("Unexpected Error", "Something went wrong.");
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

      <Text
        style={{
          fontSize: 30,
          fontWeight: "800",
          marginBottom: 6,
          color: "#065f46",
          textAlign: "center",
        }}
      >
        ✨ Create Account
      </Text>

      <Text
        style={{
          textAlign: "center",
          color: "#047857",
          marginBottom: 20,
        }}
      >
        Join our smart scrap management platform
      </Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#94a3b8"
        value={name}
        onChangeText={setName}
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
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
        onPress={handleSignup}
        disabled={loading}
        style={({ pressed }) => [{
          backgroundColor: loading ? "#6ee7b7" : "#10b981",
          padding: 16,
          borderRadius: 14,
          elevation: 3,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          marginBottom: 15,
        }]}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "700", fontSize: 16 }}>
          {loading ? "Creating Account..." : "Create Account"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/login")}
        style={{ marginBottom: 25 }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#047857",
          }}
        >
          Already have an account?{" "}

          <Text
            style={{
              fontWeight: "700",
              color: "#10b981",
            }}
          >
            Login
          </Text>

        </Text>
      </Pressable>

    </ScrollView>
  );
}