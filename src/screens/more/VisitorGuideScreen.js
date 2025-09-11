import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Image,
} from "react-native";
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
  const handleAlojamiento = () => {
  navigation.navigate("Accommodation");
};

  const handleEmergencias = () => {
  navigation.navigate("Emergency");
};

  const handleProveedores = () => {
  navigation.navigate("Providers");
};

  const handleGoogleMaps = () => {
    Linking.openURL("https://maps.google.com/?q=Charata,Chaco,Argentina");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header con logo */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logos/agronea-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Guía del Visitante</Text>
          <Text style={styles.headerSubtitle}>
            Todo lo que necesitas para tu visita a Charata
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Servicios Esenciales</Text>

          <CategoryCard
            title="Alojamiento"
            icon="bed"
            description="Hoteles, posadas y alojamientos disponibles en la ciudad y alrededores."
            onPress={handleAlojamiento}
          />

          {/* <CategoryCard
            title="Emergencias"
            icon="medkit"
            description="Hospitales, farmacias y servicios de emergencia disponibles."
            onPress={handleEmergencias}
          /> */}

          <CategoryCard
            title="Proveedores"
            icon="business"
            description="Proveedores locales, servicios y comercios de la región."
            onPress={handleProveedores}
          />

          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Mapa de Charata</Text>
            <Text style={styles.mapDescription}>
              Explora la ciudad y encuentra los mejores lugares
            </Text>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={handleGoogleMaps}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: 50,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    lineHeight: 20,
  },
  mapContainer: {
    marginTop: 32,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  mapDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  mapButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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