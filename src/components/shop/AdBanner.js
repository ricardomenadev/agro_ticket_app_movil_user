// Publicidad de Agronea (foto, título y texto del panel: Vitrina). Se guarda en el teléfono, así que se ve sin señal.
// compact: franja finita y discreta para debajo del QR de una entrada (no le tiene que robar protagonismo al QR)
import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useShowcase } from "../../api/apiFeed";
import { C } from "../feed/FeedCards";

export default function AdBanner({ compact }) {
  const showcase = useShowcase();
  const photo = showcase?.images?.[0]?.url || showcase?.images?.[0];
  const title = showcase?.settings?.title || "Agronea";
  const subtitle = showcase?.settings?.subtitle || "El evento del agro del Norte Argentino";
  if (compact) {
    return (
      <View style={styles.strip}>
        <Image source={require("../../../assets/images/logo_agronea_producciones.png")} style={styles.stripLogo} resizeMode="contain" accessibilityLabel="Agronea Producciones" />
        <Text style={styles.stripText} numberOfLines={1}>{title}</Text>
      </View>
    );
  }
  const content = (
    <LinearGradient colors={photo ? ["rgba(0,0,0,0.15)", "rgba(0,0,0,0.85)"] : ["#0b3d1f", "#0a0a0a"]} style={styles.adInner}>
      <View style={styles.adLogoCard}>
        <Image source={require("../../../assets/images/logo_agronea_producciones.png")} style={styles.adLogo} resizeMode="contain" accessibilityLabel="Agronea Producciones" />
      </View>
      <Text style={styles.adTitle}>{title}</Text>
      <Text style={styles.adText}>{subtitle}</Text>
    </LinearGradient>
  );
  return photo ? (
    <ImageBackground source={{ uri: typeof photo === "string" ? photo : photo.url }} style={styles.ad} imageStyle={{ borderRadius: 18 }}>
      {content}
    </ImageBackground>
  ) : (
    <View style={styles.ad}>{content}</View>
  );
}

const styles = StyleSheet.create({
  ad: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: C.border },
  adInner: { padding: 20, alignItems: "center", gap: 6, minHeight: 170, justifyContent: "center" },
  // logo original sobre blanco, como en la web
  adLogoCard: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 6 },
  adLogo: { width: 180, height: 90 },
  adTitle: { color: C.gold, fontSize: 18, fontWeight: "800", textAlign: "center" },
  adText: { color: C.soft, fontSize: 13, textAlign: "center", lineHeight: 18 },
  strip: { flexDirection: "row", alignItems: "center", gap: 10, borderTopWidth: 1, borderTopColor: "#eef0ee", paddingTop: 10 },
  stripLogo: { width: 64, height: 26, opacity: 0.85 },
  stripText: { flex: 1, color: "#8a978e", fontSize: 12 },
});
