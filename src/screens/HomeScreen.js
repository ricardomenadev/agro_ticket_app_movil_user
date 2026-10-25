import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/theme";

import CountdownTimer from "../components/home/CountdownTimer";
import AgroneaTV from "../components/home/AgroneaTv";
import RandomImagesCarousel from "../components/home/RandomImagesCarousel";
import LocationMap from "../components/home/LocationMap";
import HomeFooter from "../components/home/HomeFooter";
import VideoModal from "../components/home/VideoModal";
import MediaAliadosCarousel from "../components/home/MediaAliadosCarousel";
import CronogramaModal from "../components/home/CronogramaModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ─── Precio dinámico según fecha ──────────────────────────────────────────────
// Antes del 3 de julio → precio anticipado $10.000
// Desde el 3 de julio  → precio en puerta $15.000
// No requiere update de la app — se calcula en tiempo real

const getPriceInfo = () => {
  const now      = new Date();
  const cutoff   = new Date("2026-07-03T00:00:00"); // 3 de julio 00:00
  const isEarly  = now < cutoff;

  return {
    mainPrice:    isEarly ? "$10.000" : "$15.000",
    otherPrice:   isEarly ? "$15.000" : null,      // precio tachado (solo en anticipado)
    badgeLabel:   isEarly ? "PRECIO ANTICIPADO" : "PRECIO GENERAL",
    priceNote:    isEarly
      ? "Hasta el 2 de julio · Después $15.000"
      : "Precio de los días del evento · 3, 4 y 5 de julio",
  };
};

// ─── Partículas flotantes — fondo del banner ─────────────────────────────────
// Estrellitas que flotan sutilmente en loop, siempre activas

const FLOAT_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  // Posiciones y tamaños fijos para evitar cambios en cada render
  left:  [8, 18, 30, 42, 55, 65, 75, 85, 92, 50][i],
  size:  [4, 6, 3, 5, 7, 4, 6, 3, 5, 4][i],
  delay: [0, 300, 600, 900, 200, 500, 100, 700, 400, 800][i],
  duration: [2800, 3200, 2600, 3400, 3000, 2900, 3100, 2700, 3300, 2500][i],
}));

const FloatingParticles = () => {
  const anims = useRef(FLOAT_PARTICLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(FLOAT_PARTICLES[i].delay),
          Animated.timing(anim, {
            toValue: 1, duration: FLOAT_PARTICLES[i].duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0, duration: FLOAT_PARTICLES[i].duration,
            useNativeDriver: true,
          }),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {FLOAT_PARTICLES.map((p, i) => (
        <Animated.Text
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: 10,
            fontSize: p.size,
            color: "#4ADE80",
            opacity: anims[i].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.7, 0] }),
            transform: [{
              translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -60] }),
            }],
          }}
        >
          ✦
        </Animated.Text>
      ))}
    </View>
  );
};

// ─── Banner de entradas ───────────────────────────────────────────────────────

const TicketsBanner = () => {
  // Animación de pulso para el botón CTA
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  // Animación de entrada del banner completo
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada con slide + fade
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, duration: 500, delay: 300, useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, duration: 500, delay: 300, useNativeDriver: true,
      }),
    ]).start();

    // Pulso infinito en el botón
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[
      styles.ticketsBannerWrapper,
      { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => Linking.openURL("https://agronea.store")}
      >
        <LinearGradient
          colors={["#1A5C2A", "#0D3D1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ticketsBanner}
        >
          {/* Decoración círculos de fondo */}
          <View style={[styles.decor, { top: -30, right: 60, width: 120, height: 120 }]} />
          <View style={[styles.decor, { bottom: -20, right: -10, width: 80, height: 80 }]} />

          {/* Partículas flotantes sutiles — siempre activas */}
          <FloatingParticles />


          {/* Columna izquierda */}
          <View style={styles.ticketsBannerLeft}>
            {/* Badge "Disponible ahora" */}
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
              <Text style={styles.availableBadgeText}>{getPriceInfo().badgeLabel}</Text>
            </View>

            <Text style={styles.ticketsBannerTitle}>Entradas{"\n"}a la venta</Text>

            {/* Precio dinámico — se calcula según la fecha actual */}
            {(() => {
              const { mainPrice, otherPrice, priceNote } = getPriceInfo();
              return (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceAnticipado}>{mainPrice}</Text>
                    {otherPrice && (
                      <>
                        <View style={styles.priceSeparator} />
                        <View>
                          <Text style={styles.pricePuertaLabel}>En puerta</Text>
                          <Text style={styles.pricePuerta}>{otherPrice}</Text>
                        </View>
                      </>
                    )}
                  </View>
                  <Text style={styles.priceNote}>{priceNote}</Text>
                </>
              );
            })()}
          </View>

          {/* Columna derecha — CTA */}
          <View style={styles.ticketsBannerRight}>
            <Animated.View style={[styles.ctaWrapper, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.ctaBtn}>
                <Ionicons name="ticket-outline" size={20} color={COLORS.primary} />
                <Text style={styles.ctaBtnText}>Comprar</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
              </View>
            </Animated.View>
            <Text style={styles.ctaUrl}>agronea.store</Text>
          </View>

        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Banner de acceso al cronograma ──────────────────────────────────────────
// Mismo lenguaje visual que el banner de EventInfoScreen: gradiente verde +
// borde dorado que pulsa. Abre el CronogramaModal al tocarlo.

const CronogramaHomeBanner = ({ onPress }) => {
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(shine, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const borderColor = shine.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(201,162,39,0.35)", "rgba(201,162,39,0.9)"],
  });

  return (
    <Animated.View style={[styles.cronoBannerWrapper, { borderColor }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={["#1E5528", "#2D7A3A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cronoBanner}
        >
          <View style={styles.cronoBannerLeft}>
            <View style={styles.cronoBannerBadge}>
              <View style={styles.cronoBannerDot} />
              <Text style={styles.cronoBannerBadgeText}>3 DÍAS DE ACTIVIDADES</Text>
            </View>
            <Text style={styles.cronoBannerTitle}>Cronograma del evento</Text>
            <Text style={styles.cronoBannerSub}>
              Charlas, demostraciones, remate y espectáculos
            </Text>
          </View>
          <View style={styles.cronoBannerIcon}>
            <Ionicons name="calendar-outline" size={26} color={COLORS.card || "#fff"} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Pantalla principal ───────────────────────────────────────────────────────

const HomeScreen = () => {
  // Estado del modal de cronograma
  const [cronogramaVisible, setCronogramaVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HERO */}
        <View style={styles.heroContainer}>
          <Image
            source={require("../../assets/images/agronea2026publi.jpg")}
            style={styles.heroBg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.45)", COLORS.background]}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="calendar-outline" size={13} color={COLORS.secondary} />
              <Text style={styles.heroBadgeText}>3, 4 y 5 de Julio · Charata, Chaco</Text>
            </View>
            <Text style={styles.heroTagline}>
              La experiencia agropecuaria más grande del Norte Argentino
            </Text>
          </View>
        </View>

        {/* BANNER ENTRADAS */}
        <TicketsBanner />

        {/* COUNTDOWN */}
        <CountdownTimer
          targetDate="2026-07-03T00:00:00"
          eventTitle="AGRONEA 2026"
          eventDates="3, 4 y 5 de Julio"
          eventLocation="Charata, Chaco"
        />
        <RandomImagesCarousel />

        {/* ACCESO AL CRONOGRAMA — entre carrusel y Agronea TV */}
        <CronogramaHomeBanner onPress={() => setCronogramaVisible(true)} />

        <AgroneaTV />
        <MediaAliadosCarousel />

        <LocationMap />
        <HomeFooter />

        <View style={{ height: 40 }} />
      </ScrollView>
      <VideoModal />

      {/* Modal del cronograma — se monta una vez y se controla por estado */}
      <CronogramaModal
        visible={cronogramaVisible}
        onClose={() => setCronogramaVisible(false)}
      />
    </SafeAreaView>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { paddingBottom: 20 },

  // Hero
  heroContainer: { width: screenWidth, height: screenHeight * 0.42, position: "relative" },
  heroBg: { width: "100%", height: "100%" },
  heroGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: "45%" },
  heroContent: { position: "absolute", bottom: -10, left: 20, right: 20, gap: 8 },
  heroBadge: {
    flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.55)", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.secondary + "50",
  },
  heroBadgeText: { fontSize: 12, fontWeight: "700", color: COLORS.secondary },
  heroTagline: { fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: "500", lineHeight: 21 },

  // Banner entradas
  ticketsBannerWrapper: {
    marginHorizontal: 16, marginTop: 30, marginBottom: 4,
    borderRadius: 20, overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
  },
  ticketsBanner: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 20, paddingHorizontal: 20,
    gap: 16, overflow: "hidden",
  },
  decor: {
    position: "absolute", borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  // Columna izquierda
  ticketsBannerLeft: { flex: 1, gap: 6 },

  // Badge disponible
  availableBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  availableDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: "#4ADE80", // verde brillante
  },
  availableBadgeText: {
    fontSize: 10, fontWeight: "800",
    color: "#4ADE80", letterSpacing: 0.8,
  },

  ticketsBannerTitle: {
    fontSize: 22, fontWeight: "900",
    color: "#fff", letterSpacing: 0.2, lineHeight: 28,
  },

  // Precios
  priceRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 2 },
  priceAnticipado: { fontSize: 26, fontWeight: "900", color: "#4ADE80" },
  priceSeparator: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.2)" },
  pricePuertaLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: "600" },
  pricePuerta: { fontSize: 16, fontWeight: "700", color: "rgba(255,255,255,0.5)", textDecorationLine: "line-through" },

  priceNote: { fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: "500" },

  // CTA derecha
  ticketsBannerRight: { alignItems: "center", gap: 8 },
  ctaWrapper: { borderRadius: 16, overflow: "hidden" },
  ctaBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row", alignItems: "center", gap: 4,
  },
  ctaBtnText: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  ctaUrl: { fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: "500" },

  // ─── Banner cronograma (Home) ───
  cronoBannerWrapper: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    borderRadius: 18,
    borderWidth: 2,
    overflow: "hidden",
  },
  cronoBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
  },
  cronoBannerLeft: { flex: 1 },
  cronoBannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(201,162,39,0.22)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  cronoBannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F3E9C6" },
  cronoBannerBadgeText: { fontSize: 9, fontWeight: "800", color: "#F3E9C6", letterSpacing: 1 },
  cronoBannerTitle: { fontSize: 18, fontWeight: "900", color: COLORS.card || "#fff", letterSpacing: 0.2 },
  cronoBannerSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 3 },
  cronoBannerIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center", justifyContent: "center",
  },
});

export default HomeScreen;