import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const CategoryCard = ({ title, icon, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={styles.categoryIcon}>
        <Ionicons name={icon} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.categoryDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
};

const VisitorGuideScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/charata-city.jpg")}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Guía del Visitante</Text>
          <Text style={styles.headerSubtitle}>
            Todo lo que necesitas para disfrutar Charata
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Servicios Esenciales</Text>

        <CategoryCard
          title="Alojamiento"
          icon="bed"
          description="Hoteles, posadas y alojamientos disponibles en la ciudad y alrededores."
          onPress={() => console.log("Alojamiento")}
        />

        <CategoryCard
          title="Gastronomía"
          icon="restaurant"
          description="Restaurantes, bares y lugares para comer en Charata."
          onPress={() => console.log("Gastronomía")}
        />

        <CategoryCard
          title="Transporte"
          icon="car"
          description="Opciones de transporte público, taxis y remises en la ciudad."
          onPress={() => console.log("Transporte")}
        />

        <Text style={styles.sectionTitle}>Turismo</Text>

        <CategoryCard
          title="Lugares de Interés"
          icon="location"
          description="Atractivos turísticos y lugares para visitar en la región."
          onPress={() => console.log("Lugares de Interés")}
        />

        <CategoryCard
          title="Actividades"
          icon="bicycle"
          description="Actividades recreativas y tours disponibles."
          onPress={() => console.log("Actividades")}
        />

        <Text style={styles.sectionTitle}>Información Útil</Text>

        <CategoryCard
          title="Emergencias"
          icon="medkit"
          description="Hospitales, farmacias y servicios de emergencia."
          onPress={() => console.log("Emergencias")}
        />

        <CategoryCard
          title="Servicios Bancarios"
          icon="card"
          description="Bancos, cajeros automáticos y casas de cambio."
          onPress={() => console.log("Servicios Bancarios")}
        />

        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Mapa de Charata</Text>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              Linking.openURL(
                "https://maps.google.com/?q=Charata,Chaco,Argentina"
              )
            }
          >
            <Ionicons
              name="map"
              size={20}
              color="white"
              style={styles.mapIcon}
            />
            <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 200,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  headerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginTop: 24,
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    backgroundColor: `${COLORS.primary}20`,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  mapContainer: {
    marginTop: 32,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  mapButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  mapIcon: {
    marginRight: 8,
  },
  mapButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default VisitorGuideScreen;
