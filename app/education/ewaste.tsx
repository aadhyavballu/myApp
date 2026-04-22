import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function EWaste() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.title}>E-Waste Management ⚡</Text>

      {/* Intro */}
      <Text style={styles.text}>
        E-waste includes discarded electronic devices such as mobile phones,
        laptops, batteries, TVs, and chargers.
      </Text>

      {/* Why Important */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why Proper Disposal Matters</Text>
        <Text style={styles.text}>
          Improper disposal releases toxic chemicals like lead and mercury,
          which harm the environment and human health.
        </Text>
      </View>

      {/* Steps */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Safe Disposal Steps</Text>
        <Text style={styles.text}>
          • Never throw electronics in regular trash {"\n"}
          • Use authorized recycling centers {"\n"}
          • Remove personal data before disposing {"\n"}
          • Donate or repair if possible
        </Text>
      </View>

      {/* Impact */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Environmental Impact</Text>
        <Text style={styles.text}>
          Recycling e-waste helps recover valuable materials like gold,
          copper, and reduces pollution 🌍
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
    marginBottom: 10,
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