// src/components/exhibitors/profile/ExhibitorHeader.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown, Star, Bookmark, Share2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/colors";
import SmartImage from "../../common/SmartImage";

const ExhibitorHeader = ({ exhibitor, onBack }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Tu URL de ngrok para desarrollo
    const baseBackendUrl = __DEV__
      ? "https://19b278b633aa.ngrok-free.app" // Cambia solo esta línea cuando cambies ngrok
      : "https://api.agronea.store";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      return `${baseBackendUrl}${imagePath}`;
    }

    return imagePath;
  };

  return (
    <>
      {/* Banner del evento */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerOverlay}>
          <SmartImage
            source={require("../../../../assets/images/logos/agronea-logo.png")}
            style={styles.bannerImageInside}
            showLoading={false}
          />
          <View style={styles.textContainer}>
            <Text style={styles.bannerMainText}>
              AGRONEA 2025 - Expositores
            </Text>
            <Text style={styles.bannerSubText}>
              Conoce nuestros expositores destacados
            </Text>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        {/* Imagen de portada */}
        <SmartImage
          source={getImageUrl(exhibitor.coverPhoto)}
          style={styles.coverPhoto}
          showLoading={false}
          fallbackText=""
        />

        {/* Overlay degradado */}
        <LinearGradient
          colors={["rgba(18, 18, 18, 0.3)", "rgba(18, 18, 18, 0.7)", "#121212"]}
          style={styles.coverGradient}
        />

        {/* Botón atrás */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronDown size={24} color="white" />
        </TouchableOpacity>

        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <SmartImage
              source={getImageUrl(exhibitor.logo)}
              style={styles.logo}
              fallbackText={exhibitor.name}
            />
            {exhibitor.verified && (
              <View style={styles.verifiedBadge}>
                <Star size={12} color="#121212" />
              </View>
            )}
          </View>

          {/* Información del expositor */}
          <View style={styles.exhibitorInfo}>
            <Text style={styles.exhibitorName}>{exhibitor.name}</Text>
            <Text style={styles.exhibitorStand}>Stand {exhibitor.stand}</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    height: 80,
    position: "relative",
    backgroundColor: COLORS.primary + "10",
  },
  bannerImageInside: {
    width: 60,
    height: 60,
  },
  bannerOverlay: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
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
  header: {
    height: 160,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  headerContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.background,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  exhibitorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  exhibitorName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  exhibitorStand: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default ExhibitorHeader;
