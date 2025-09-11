import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Modal,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/theme";

// Importamos los componentes que mantenemos
import CountdownTimer from "../components/home/CountdownTimer";
import FeaturedExhibitors from "../components/home/FeaturedExhibitors";
import LocationMap from "../components/home/LocationMap";
import LocationMapPampa from "../components/home/LocationMapPampa";
import AgroneaTV from "../components/home/AgroneaTv";
import HomeFooter from "../components/home/HomeFooter";
import { LinearGradient } from 'expo-linear-gradient';
import RandomImagesCarousel from '../components/home/RandomImagesCarousel';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HomeScreen = () => {
  // Cambiar la inicialización del scrollY para evitar el error
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = 60;

  // Función para manejar el scroll sin usar Animated.event
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Banner del evento - Ahora dentro del scroll */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../assets/logoAgronea2.png")}
            style={styles.bannerImageInside}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.bannerMainText}>AGRONEA 2025</Text>
            <Text style={styles.bannerSubText}>
              La experiencia agropecuaria más grande del Norte Argentino
            </Text>
          </View>
        </View>

        {/* Logo AGRONEA PRODUCCIONES */}
        <View style={styles.logoSection}>
          <Image
            source={require("../../assets/logoAgronea2.png")}
            style={styles.logoAgronea}
            resizeMode="contain"
          />
          
        </View>

        {/* Divisor con gradiente */}
        <LinearGradient
          colors={["transparent", COLORS.primary, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientDivider}
        />

        <CountdownTimer
          targetDate="2025-09-12T00:00:00"
          eventTitle="AGRONEA Pampa 2025"
          eventLocation="Pampa del Infierno, Chaco"
        />

        <FeaturedExhibitors />

        {/* Componente para Agronea TV */}
        <AgroneaTV />

        {/* expositores */}
        <RandomImagesCarousel />

        {/* Componente para mapa y ubicación */}
        {/* <LocationMap /> */}

        {/* Componente para mapa y ubicación */}
        <LocationMapPampa />

        {/* Footer con información de contacto */}
        <HomeFooter />

        {/* Espacio adicional al final del scroll */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 0,
  },

  // BANNER SIMPLIFICADO
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

  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 40,
  },

  logoSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  logoAgronea: {
    width: 270,
    height: 270,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  gradientDivider: {
  height: 2,
  marginVertical: 20,
  marginHorizontal: 40,
},
});

export default HomeScreen;
