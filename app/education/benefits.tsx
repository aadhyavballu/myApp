import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Benefits() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.title}>Benefits of Recycling 🌍</Text>

      {/* Intro */}
      <Text style={styles.text}>
        Recycling is one of the most effective ways to reduce waste and protect
        the environment.
      </Text>

      {/* Environmental */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌱 Environmental Benefits</Text>

        <Text style={styles.text}>
          • Reduces pollution {"\n"}
          • Conserves natural resources {"\n"}
          • Protects ecosystems and wildlife
        </Text>
      </View>

      {/* Economic */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Economic Benefits</Text>

        <Text style={styles.text}>
          • Creates job opportunities {"\n"}
          • Generates income from scrap {"\n"}
          • Reduces waste management costs
        </Text>
      </View>

      {/* Energy */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Energy Savings</Text>

        <Text style={styles.text}>
          Recycling materials uses less energy compared to producing new ones
          from raw materials.
        </Text>
      </View>

      {/* Impact */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌍 Overall Impact</Text>

        <Text style={styles.text}>
          Recycling helps fight climate change, reduces landfill waste, and
          builds a sustainable future for everyone.
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