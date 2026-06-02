import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Education() {
  const insets = useSafeAreaInsets();

  const resources = [
    {
      title: "Complete Guide to Plastic Recycling",
      category: "Plastic",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      link: "https://www.epa.gov/recycle/plastics",
    },
    {
      title: "Community Recycling Best Practices",
      category: "Community",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      link: "https://www.worldbank.org/en/topic/urbandevelopment/brief/solid-waste-management",
    },
    {
      title: "E-Waste Disposal Methods",
      category: "E-Waste",
      image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
      link: "https://www.unep.org/resources/report/global-e-waste-monitor",
    },
    {
      title: "Understanding Recycling Symbols",
      category: "Education",
      image: "https://images.unsplash.com/photo-1581090700227-1e8c0d1c7c38",
      link: "https://www.recyclenow.com/recycling-knowledge/recycling-symbols-explained",
    },
    {
      title: "Zero Waste Lifestyle Tips",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      link: "https://www.zerowastehome.com/",
    },
    {
      title: "Composting Made Easy",
      category: "Organic",
      image: "https://images.unsplash.com/photo-1598514982691-9f0a8c3b0f47",
      link: "https://www.epa.gov/recycle/composting-home",
    },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, padding: 15 }}>

      <Text style={styles.title}>Educational Resources</Text>
      <Text style={styles.subtitle}>
        Learn and explore recycling knowledge 🌱
      </Text>

      <View style={styles.grid}>
        {resources.map((item, index) => (
          <Pressable key={index} style={styles.card} onPress={() => openLink(item.link)}>
            
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.link}>View More ↗</Text>
            </View>

          </Pressable>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    color: "#64748b",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 120,
  },

  cardContent: {
    padding: 10,
  },

  category: {
    fontSize: 12,
    color: "#10b981",
    marginBottom: 4,
  },

  cardTitle: {
    fontWeight: "600",
    fontSize: 14,
  },

  link: {
    marginTop: 8,
    color: "#10b981",
    fontSize: 12,
  },
});