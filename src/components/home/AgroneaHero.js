// Carrusel de Agronea arriba del inicio: la marca (mensaje de la vitrina del panel), la tienda oficial,
// la última novedad de Agronea si hay y Agronea TV. Pasa solo cada 5 segundos.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions, Linking, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../../context/StoreContext";
import { useShowcase } from "../../api/apiFeed";
import { C } from "../feed/FeedCards";

// Redes de Agronea (mismos links que el pie del inicio)
const SOCIAL = [
  { id: "yt", icon: "logo-youtube", eyebrow: "AGRONEA TV", title: "Reviví lo mejor de Agronea", text: "Charlas, demostraciones y entrevistas en nuestro canal.", cta: "Ver el canal", url: "https://www.youtube.com/@agroneaproducciones", colors: ["#b31217", "#3b0b0b"] },
  { id: "ig", icon: "logo-instagram", eyebrow: "INSTAGRAM", title: "Seguinos en @agroneachaco", text: "Fotos, videos y todas las novedades del evento.", cta: "Seguir", url: "https://www.instagram.com/agroneachaco/", colors: ["#c13584", "#5b1a8b"] },
  { id: "fb", icon: "logo-facebook", eyebrow: "FACEBOOK", title: "Sumate a Agronea Chaco", text: "Enterate primero de fechas, entradas y sorteos.", cta: "Ir a la página", url: "https://www.facebook.com/agroneachaco", colors: ["#1877f2", "#0b3a7a"] },
];

const W = Dimensions.get("window").width - 36 - 4; // menos el borde dorado
const H = 220;
const API_BASE = "https://api.agronea.store";
const photo = (url) => (!url || /placeholder/.test(url) ? null : /^https?:/.test(url) ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`);

const Cta = ({ label, onPress, center }) => (
  <TouchableOpacity onPress={onPress} style={[styles.cta, center && styles.selfCenter]} activeOpacity={0.85} accessibilityRole="button">
    <Text style={styles.ctaText}>{label}</Text>
    <Ionicons name="arrow-forward" size={16} color="#000" />
  </TouchableOpacity>
);

const AgroneaHero = ({ agroneaNews }) => {
  const navigation = useNavigation();
  const showcase = useShowcase();
  const { products } = useStore();
  const scroller = useRef(null);
  const [page, setPage] = useState(0);

  const featured = useMemo(
    () => (products || []).filter((p) => !/^(ticket|parking)_/.test(p.sku || "") && photo(p.imagen) && p.precio > 0).sort((a, b) => Number(b.destacado) - Number(a.destacado))[0],
    [products]
  );
  const showcasePhoto = showcase?.images?.[0]?.url || showcase?.images?.[0];

  const slides = [
    <ImageBackground key="brand" source={showcasePhoto ? { uri: typeof showcasePhoto === "string" ? showcasePhoto : showcasePhoto.url } : null} style={styles.slide} imageStyle={styles.radius}>
      <LinearGradient colors={showcasePhoto ? ["rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"] : ["#0f6e3f", "#0a0a0a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.slideInner, styles.radius, styles.centered]}>
        <View style={[styles.logoCard, styles.selfCenter]}>
          <Image source={require("../../../assets/images/logo_agronea_producciones.png")} style={styles.logo} resizeMode="contain" accessibilityLabel="Agronea Producciones" />
        </View>
        <Text style={[styles.title, styles.textCenter]} numberOfLines={1}>{showcase?.settings?.title || "Agronea"}</Text>
        <Text style={[styles.text, styles.textCenter]} numberOfLines={2}>{showcase?.settings?.subtitle || "El evento del agro del Norte Argentino"}</Text>
        <Cta label="Conocé el evento" center onPress={() => navigation.navigate("More", { screen: "Event" })} />
      </LinearGradient>
    </ImageBackground>,

    featured ? (
      <View key="shop" style={[styles.slide, styles.radius, styles.row, { backgroundColor: "#111" }]}>
        <Image source={{ uri: photo(featured.imagen) }} style={styles.productImg} resizeMode="cover" />
        <View style={styles.side}>
          <Text style={styles.eyebrow}>TIENDA OFICIAL</Text>
          <Text style={styles.title} numberOfLines={2}>Productos Agronea</Text>
          <Text style={styles.text} numberOfLines={2}>Termos, mates, bolsos y más. Comprá desde la app.</Text>
          <Cta label="Ver productos" onPress={() => navigation.navigate("Shop")} />
        </View>
      </View>
    ) : null,

    agroneaNews ? (
      <LinearGradient key="news" colors={["#3a2f00", "#0a0a0a"]} style={[styles.slide, styles.radius, styles.slideInner]}>
        <Text style={styles.eyebrow}>NOVEDAD DE AGRONEA</Text>
        <Text style={styles.title} numberOfLines={3}>{agroneaNews.title}</Text>
        {agroneaNews.url ? <Cta label="Ver más" onPress={() => Linking.openURL(agroneaNews.url).catch(() => {})} /> : null}
      </LinearGradient>
    ) : null,

    ...SOCIAL.map((s) => (
      <LinearGradient key={s.id} colors={s.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.slide, styles.radius, styles.slideInner]}>
        <View style={styles.socialRow}>
          <View style={styles.socialIcon}>
            <Ionicons name={s.icon} size={34} color="#fff" />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.socialEyebrow}>{s.eyebrow}</Text>
            <Text style={styles.title} numberOfLines={2}>{s.title}</Text>
            <Text style={styles.socialText} numberOfLines={2}>{s.text}</Text>
          </View>
        </View>
        <Cta label={s.cta} onPress={() => Linking.openURL(s.url).catch(() => {})} />
      </LinearGradient>
    )),
  ].filter(Boolean);

  // Borde dorado que "respira": el bloque de Agronea es lo que más se ve del inicio
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const glow = pulse.interpolate({ inputRange: [0, 1], outputRange: ["rgba(245,196,0,0.25)", "rgba(245,196,0,0.95)"] });

  // Pasa solo; si la persona lo desliza, sigue desde ahí
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => {
      setPage((p) => {
        const next = (p + 1) % slides.length;
        scroller.current?.scrollTo({ x: next * W, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <View>
      <Animated.View style={[styles.frame, { borderColor: glow }]}>
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / W))}
        style={{ width: W }}
      >
        {slides}
      </ScrollView>
      </Animated.View>
      {slides.length > 1 ? (
        <View style={styles.dots}>
          {slides.map((s, i) => (
            <View key={s.key} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  slide: { width: W, height: H, overflow: "hidden" },
  radius: { borderRadius: 20 },
  slideInner: { flex: 1, padding: 18, justifyContent: "center", gap: 6 },
  row: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: C.border },
  side: { flex: 1, padding: 16, gap: 6 },
  logoCard: { alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 },
  logo: { width: 150, height: 75 },
  eyebrow: { color: C.gold, fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  title: { color: C.text, fontSize: 19, fontWeight: "800" },
  text: { color: C.soft, fontSize: 13, lineHeight: 18 },
  productImg: { width: H * 0.85, height: H, backgroundColor: "#fff" },
  frame: { borderWidth: 2, borderRadius: 22, overflow: "hidden" },
  centered: { alignItems: "center" },
  selfCenter: { alignSelf: "center" },
  textCenter: { textAlign: "center" },
  socialRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  socialIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  socialEyebrow: { color: "#fff", opacity: 0.85, fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  socialText: { color: "#fff", opacity: 0.9, fontSize: 13, lineHeight: 18 },
  cta: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: C.gold, borderRadius: 10, paddingHorizontal: 12, minHeight: 38, marginTop: 4 },
  ctaText: { color: "#000", fontWeight: "800", fontSize: 13 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.borderStrong },
  dotActive: { backgroundColor: C.gold, width: 18 },
});

export default AgroneaHero;
