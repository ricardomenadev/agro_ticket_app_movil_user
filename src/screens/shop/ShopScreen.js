import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Platform,
  Linking,
  Alert,
} from "react-native";
import {
  ShoppingCart,
  ExternalLink,
  Ticket,
  Car,
  Shirt,
  Gift,
  ArrowRight,
} from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "../../constants/colors";

const ShopScreen = ({ navigation }) => {
  // Función para abrir la tienda online
  const handleOpenStore = async () => {
    const url = "https://agronea.store";
    
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "No se puede abrir el enlace. Por favor, visita agronea.store desde tu navegador."
        );
      }
    } catch (error) {
      console.error("Error al abrir la tienda:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al abrir la tienda. Por favor, intenta nuevamente."
      );
    }
  };

  // Productos/categorías disponibles en la tienda
  const storeCategories = [
    {
      id: 1,
      icon: <Ticket size={32} color={COLORS.primary} />,
      title: "Entradas",
      description: "Acceso general al evento y actividades especiales",
    },
    // {
    //   id: 2,
    //   icon: <Car size={32} color={COLORS.primary} />,
    //   title: "Estacionamiento",
    //   description: "Para vehículos y motocicletas en zonas seguras",
    // },
    {
      id: 3,
      icon: <Shirt size={32} color={COLORS.primary} />,
      title: "Merchandising",
      description: "Remeras, gorras y productos oficiales del evento",
    },
    {
      id: 4,
      icon: <Gift size={32} color={COLORS.primary} />,
      title: "Souvenirs",
      description: "Recuerdos únicos y exclusivos de AGRONEA 2025",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner del evento */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../../assets/logoAgronea2.png")}
            style={styles.bannerImageInside}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.bannerMainText}>
              AGRONEA 2025 - Tienda Oficial
            </Text>
            <Text style={styles.bannerSubText}>
              Adquiere tus entradas y productos oficiales
            </Text>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.mainContent}>
          {/* Icono principal */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[COLORS.primary, '#B8860B']}
              style={styles.iconGradient}
            >
              <ShoppingCart size={48} color="white" />
            </LinearGradient>
          </View>

          {/* Título principal */}
          <Text style={styles.mainTitle}>
            ¡Bienvenido a nuestra Tienda Online!
          </Text>

          {/* Descripción */}
          <Text style={styles.description}>
            Para una experiencia de compra completa y segura, te invitamos a visitar nuestra tienda oficial en línea donde encontrarás todo lo que necesitas para AGRONEA 2025.
          </Text>

          {/* Categorías de productos */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>¿Qué puedes encontrar?</Text>
            
            <View style={styles.categoriesGrid}>
              {storeCategories.map((category) => (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryIcon}>
                    {category.icon}
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Características de la tienda */}
          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Pago seguro con múltiples métodos</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Entrega inmediata de tickets digitales</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Soporte 24/7 para consultas</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Precios oficiales garantizados</Text>
            </View>
          </View>

          {/* Botón principal */}
          <TouchableOpacity 
            style={styles.storeButton}
            onPress={handleOpenStore}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, '#B8860B']}
              style={styles.storeButtonGradient}
            >
              <ShoppingCart size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.storeButtonText}>Ir a la Tienda Online</Text>
              <ExternalLink size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* URL alternativa */}
          <TouchableOpacity 
            style={styles.urlContainer}
            onPress={handleOpenStore}
          >
            <Text style={styles.urlText}>agronea.store</Text>
            <ArrowRight size={16} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Nota adicional */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              💡 Tip: Guarda el enlace en tus favoritos para acceder rápidamente a futuras compras
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    height: 80,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerImageInside: {
    width: 60,
    height: 60,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerMainText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  bannerSubText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  categoriesSection: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIcon: {
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresSection: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  storeButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  storeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 12,
  },
  storeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 12,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 20,
  },
  urlText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  noteContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ShopScreen;