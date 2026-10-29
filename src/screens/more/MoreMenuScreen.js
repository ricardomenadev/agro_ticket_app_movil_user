// Más: info para el visitante, contacto y legales. "El evento" y "Expositores" aparecen solo cuando
// se prenden desde el panel (Menú de la app); las pantallas siguen en la app aunque estén ocultas.
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../../components/feed/FeedCards";
import { useAppSettings } from "../../api/apiFeed";

const PRIVACY_URL = "https://agronea.store/privacidad";

const Item = ({ title, subtitle, icon, onPress, last }) => (
  <TouchableOpacity style={[styles.item, !last && styles.itemBorder]} onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
    <View style={styles.icon}>
      <Ionicons name={icon} size={20} color={C.gold} />
    </View>
    <View style={styles.itemText}>
      <Text style={styles.itemTitle}>{title}</Text>
      {subtitle ? <Text style={styles.itemSub}>{subtitle}</Text> : null}
    </View>
    <Ionicons name="chevron-forward" size={18} color={C.muted} />
  </TouchableOpacity>
);

const Group = ({ title, items }) =>
  items.length ? (
    <View style={{ gap: 8 }}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((it, i) => (
          <Item key={it.title} {...it} last={i === items.length - 1} />
        ))}
      </View>
    </View>
  ) : null;

const MoreMenuScreen = ({ navigation }) => {
  const { showEvent, showExhibitors } = useAppSettings();
  const go = (screen) => () => navigation.navigate(screen);

  const edition = [
    showEvent && { title: "El evento", subtitle: "Todo sobre la edición", icon: "calendar-outline", onPress: go("Event") },
    showExhibitors && { title: "Expositores", subtitle: "Quiénes participan", icon: "storefront-outline", onPress: go("Exhibitors") },
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require("../../../assets/logoAgronea2.png")} style={styles.logo} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Más</Text>
            <Text style={styles.subtitle}>Agronea Producciones · Charata, Chaco</Text>
          </View>
        </View>

        <Group title="La edición" items={edition} />
        <Group
          title="Para tu visita"
          items={[
            { title: "Guía del visitante", icon: "compass-outline", onPress: go("VisitorGuide") },
            { title: "Información importante", icon: "information-circle-outline", onPress: go("ImportantInfo") },
          ]}
        />
        <Group title="Ayuda" items={[{ title: "Contacto", subtitle: "WhatsApp y mail", icon: "chatbubble-ellipses-outline", onPress: go("Contact") }]} />
        <Group
          title="Acerca de"
          items={[
            { title: "Términos y condiciones", icon: "document-text-outline", onPress: go("TermsConditions") },
            { title: "Política de privacidad", icon: "shield-checkmark-outline", onPress: () => Linking.openURL(PRIVACY_URL).catch(() => {}) },
            { title: "Versión de la app", icon: "phone-portrait-outline", onPress: go("AppVersion") },
          ]}
        />
        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 22 },
  header: { flexDirection: "row", alignItems: "center", gap: 14 },
  logo: { width: 56, height: 56 },
  title: { color: C.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 2 },
  groupTitle: { color: C.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: "700", textTransform: "uppercase", marginLeft: 4 },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, overflow: "hidden" },
  item: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 60, paddingHorizontal: 14, paddingVertical: 12 },
  itemBorder: { borderBottomColor: C.border, borderBottomWidth: 1 },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(245,196,0,0.12)", alignItems: "center", justifyContent: "center" },
  itemText: { flex: 1, gap: 2 },
  itemTitle: { color: C.text, fontSize: 15, fontWeight: "600" },
  itemSub: { color: C.muted, fontSize: 12 },
});

export default MoreMenuScreen;
