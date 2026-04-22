import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Segregation() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.title}>Waste Segregation ♻️</Text>

      {/* Intro */}
      <Text style={styles.text}>
        Waste segregation is the process of separating waste into different categories
        for proper recycling and disposal.
      </Text>

      {/* Types */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Types of Waste</Text>

        <Text style={styles.text}>
          🟢 Wet Waste: Food scraps, vegetable peels {"\n"}
          🔵 Dry Waste: Paper, plastic, metal {"\n"}
          🔴 Hazardous Waste: Batteries, chemicals
        </Text>
      </View>

      {/* Steps */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How to Segregate</Text>

        <Text style={styles.text}>
          • Use separate bins for wet and dry waste {"\n"}
          • Label your bins clearly {"\n"}
          • Clean recyclable items before storing {"\n"}
          • Dispose hazardous waste separately
        </Text>
      </View>

      {/* Benefits */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why It Matters</Text>

        <Text style={styles.text}>
          Proper segregation improves recycling efficiency, reduces landfill waste,
          and helps protect the environment 🌍
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },

  text: {
    marginTop: 8,
    fontSize: 16,
    color: "#475569",
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginTop: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
});