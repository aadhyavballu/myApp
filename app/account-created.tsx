import { useRouter } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function AccountCreated() {

  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.emoji}>
        🎉
      </Text>

      <Text style={styles.title}>
        Account Created Successfully!
      </Text>

      <Text style={styles.subtitle}>
        Your account has been created.
        Please login to continue.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.buttonText}>
          Go To Login
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  emoji: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#065f46",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#047857",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 35,
  },

  button: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    elevation: 3,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

});