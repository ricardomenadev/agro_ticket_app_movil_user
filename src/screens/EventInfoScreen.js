import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Colores del tema
const COLORS = {
  primary: "#0A8F3C",
  secondary: "#FFD700",
  accent: "#FFD700",
  background: "#000000",
  surface: "#1A1A1A",
  text: "#FFFFFF",
  textSecondary: "#CCCCCC",
  success: "#4CAF50",
  warning: "#FF9800",
  info: "#9C27B0",
  error: "#F44336",
  // Colores específicos para Pampa del Infierno
  pampaRed: "#E53E3E",
  pampaOrange: "#FF8C42",
};

const InfoCard = ({ title, children, icon, borderColor }) => (
  <View style={[styles.infoCard, borderColor && { borderLeftColor: borderColor, borderLeftWidth: 3 }]}>
    <View style={styles.infoCardHeader}>
      <View style={[styles.infoCardIconContainer, borderColor && { backgroundColor: `${borderColor}20` }]}>
        <Ionicons name={icon} size={20} color={borderColor || COLORS.primary} />
      </View>
      <Text style={styles.infoCardTitle}>{title}</Text>
    </View>
    <View style={styles.infoCardContent}>{children}</View>
  </View>
);

const ContactButton = ({ icon, label, onPress, color = COLORS.primary }) => (
  <TouchableOpacity style={styles.contactButton} onPress={onPress}>
    <View style={[styles.contactButtonIcon, { backgroundColor: `${color}30` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.contactButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

const ComingSoonCard = ({ title, description, icon, color = COLORS.pampaRed }) => (
  <View style={[styles.comingSoonCard, { borderColor: `${color}40` }]}>
    <View style={styles.comingSoonHeader}>
      <View style={[styles.comingSoonIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.comingSoonTitle, { color }]}>{title}</Text>
    </View>
    <Text style={styles.comingSoonDescription}>{description}</Text>
    <View style={styles.comingSoonBadge}>
      <Ionicons name="time-outline" size={16} color={COLORS.accent} />
      <Text style={styles.comingSoonBadgeText}>PRÓXIMAMENTE</Text>
    </View>
  </View>
);

const EventInfoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: COLORS.pampaRed }]}>
        <Text style={styles.headerTitle}>Información del Evento</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={[`${COLORS.pampaRed}40`, `${COLORS.pampaRed}10`]}
          style={styles.eventHeader}
        >
          <View style={styles.eventLogoContainer}>
            <Image
              source={require("../../assets/logoAgronea2.png")}
              style={styles.eventLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.eventTitle}>EXPO AGRONEA - PAMPA DEL INFIERNO</Text>
          <Text style={styles.eventSubtitle}>Próximamente - 2025</Text>
          <View style={styles.eventLocation}>
            <Ionicons name="location-outline" size={16} color={COLORS.pampaOrange} />
            <Text style={styles.eventLocationText}>Pampa del Infierno, Chaco</Text>
          </View>
        </LinearGradient>

        <InfoCard 
          title="Sobre el Evento" 
          icon="information-circle-outline"
          borderColor={COLORS.pampaRed}
        >
          <Text style={styles.infoText}>
            Una nueva edición de Expo Agronea llegará a Pampa del Infierno, 
            trayendo toda la innovación y tecnología del sector agropecuario 
            a esta importante región productiva del Chaco.
          </Text>
          <Text style={styles.infoText}>
            El evento contará con exposiciones, charlas técnicas, demostraciones 
            de maquinaria y las últimas tendencias en AgTech, adaptadas a las 
            necesidades específicas de la zona.
          </Text>
        </InfoCard>

        <InfoCard 
          title="Programa de Actividades" 
          icon="calendar-outline"
          borderColor={COLORS.pampaRed}
        >
          <ComingSoonCard
            title="Cronograma de Charlas"
            description="Conferencias técnicas y capacitaciones especializadas para productores de la región."
            icon="school-outline"
            color={COLORS.pampaRed}
          />
          
          <ComingSoonCard
            title="Demostraciones en Campo"
            description="Pruebas en vivo de maquinaria agrícola y nuevas tecnologías aplicadas."
            icon="hardware-chip-outline"
            color={COLORS.pampaOrange}
          />
          
          <ComingSoonCard
            title="Exposición Comercial"
            description="Stands de empresas líderes del sector agropecuario y servicios."
            icon="business-outline"
            color={COLORS.pampaRed}
          />
          
          <ComingSoonCard
            title="Networking y Rueda de Negocios"
            description="Espacios de encuentro entre productores, empresarios y profesionales."
            icon="people-outline"
            color={COLORS.pampaOrange}
          />
        </InfoCard>

        <InfoCard 
          title="Ubicación del Evento" 
          icon="location-outline"
          borderColor={COLORS.pampaRed}
        >
          <View style={styles.locationInfo}>
            <View style={styles.locationItem}>
              <Ionicons name="map-outline" size={20} color={COLORS.pampaRed} />
              <Text style={styles.locationText}>
                Ruta 16, km 264{'\n'}
                Pampa del Infierno{'\n'}
                Departamento Almirante Brown, Chaco
              </Text>
            </View>
          </View>
        </InfoCard>

        <InfoCard 
          title="Mantente Informado" 
          icon="notifications-outline"
          borderColor={COLORS.pampaRed}
        >
          <Text style={styles.infoText}>
            Suscríbete a nuestras comunicaciones para recibir todas las novedades 
            sobre fechas, horarios y programación completa del evento.
          </Text>
          
          <View style={styles.contactButtons}>
            <ContactButton
              icon="logo-whatsapp"
              label="WhatsApp"
              color={COLORS.pampaRed}
              onPress={() => Linking.openURL('https://wa.me/5493794222011')}
            />
            <ContactButton
              icon="mail"
              label="Email"
              color={COLORS.pampaOrange}
              onPress={() => Linking.openURL("mailto:agroneacharata@gmail.com")}
            />
            <ContactButton
              icon="globe"
              label="Web"
              color={COLORS.pampaRed}
              onPress={() => Linking.openURL("https://www.expoagronea.com")}
            />
          </View>
        </InfoCard>

        <View style={styles.footerCard}>
          <Ionicons name="time-outline" size={32} color={COLORS.accent} />
          <Text style={styles.footerTitle}>¡Estamos Preparando Todo!</Text>
          <Text style={styles.footerText}>
            Pronto anunciaremos las fechas oficiales y el programa completo 
            de actividades para Expo Agronea Pampa del Infierno 2025.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  eventHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#111111",
  },
  eventLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  eventSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  eventLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventLocationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  infoCardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(10, 143, 60, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  infoCardContent: {
    padding: 16,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  comingSoonCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
  },
  comingSoonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  comingSoonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  comingSoonDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  comingSoonBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: "bold",
    marginLeft: 4,
  },
  locationInfo: {
    marginTop: 8,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  contactButton: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  contactButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  contactButtonLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 72,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default EventInfoScreen;