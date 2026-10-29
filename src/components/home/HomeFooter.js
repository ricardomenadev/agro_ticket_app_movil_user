// Cierre del inicio, igual al footer de agronea.store: postal del predio con WhatsApp y Cómo llegar, oficina
// con "abierto ahora" (hora de Argentina), horarios de la semana, redes, la publicidad de Wesyx y los legales.
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";
import { useShowcase } from "../../api/apiFeed";

const API_BASE = "https://api.agronea.store";
const WHATSAPP = "https://wa.me/5493794222011";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Caseros+539,+Charata,+Chaco";
const WESYX = "https://wesyx.com";
const WESYX_WHATSAPP = "https://wa.me/5493794739888";
const TERMS = "https://agronea.store/terminos";
const PRIVACY = "https://agronea.store/privacidad";

const SOCIAL = [
  { name: "Instagram", user: "@agroneachaco", icon: "logo-instagram", color: "#dd2a7b", url: "https://www.instagram.com/agroneachaco/" },
  { name: "Facebook", user: "agroneachaco", icon: "logo-facebook", color: "#1877f2", url: "https://www.facebook.com/agroneachaco" },
  { name: "YouTube", user: "Agronea TV", icon: "logo-youtube", color: "#ff0000", url: "https://www.youtube.com/@agroneaproducciones" },
  { name: "X", user: "@AgroneaChaco", icon: "logo-x", color: "#000000", url: "https://x.com/AgroneaChaco" },
  { name: "LinkedIn", user: "Agronea Producciones", icon: "logo-linkedin", color: "#0a66c2", url: "https://www.linkedin.com/in/agronea-producciones-07b095162", wide: true },
];

// Horarios de la oficina: lun a vie 8-12 y 16-20, sábado 8-12 (0 = domingo). Igual que en la web.
const HOURS = { 0: [], 1: [[8, 12], [16, 20]], 2: [[8, 12], [16, 20]], 3: [[8, 12], [16, 20]], 4: [[8, 12], [16, 20]], 5: [[8, 12], [16, 20]], 6: [[8, 12]] };
const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// ¿Está abierta la oficina ahora? Si no, cuándo abre. Con la hora de Argentina (UTC-3, sin horario de verano).
export const officeStatus = (date = new Date()) => {
  const ar = new Date(date.getTime() - 3 * 36e5);
  const d = ar.getUTCDay();
  const h = ar.getUTCHours() + ar.getUTCMinutes() / 60;
  if (HOURS[d].some(([a, b]) => h >= a && h < b)) return { day: d, open: true, text: "Abierto ahora" };
  for (let i = 0; i < 8; i++) {
    const dd = (d + i) % 7;
    const slot = HOURS[dd].find(([a]) => i > 0 || a > h);
    if (slot) {
      const when = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DAYS[dd].toLowerCase()}`;
      return { day: d, open: false, text: `Cerrado · abre ${when} a las ${slot[0]} h` };
    }
  }
  return { day: d, open: false, text: "Cerrado" };
};

const open = (url) => Linking.openURL(url).catch(() => {});
const photoUrl = (p) => {
  const url = typeof p === "string" ? p : p?.url;
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url.replace("http://localhost:5000", API_BASE) : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const Card = ({ title, extra, children }) => (
  <View style={s.card}>
    <View style={s.cardHead}>
      <Text style={s.cardTitle}>{title}</Text>
      {extra}
    </View>
    {children}
  </View>
);

const HomeFooter = () => {
  const showcase = useShowcase();
  const photo = photoUrl(showcase?.images?.[0]);
  const [status, setStatus] = useState(officeStatus());

  useEffect(() => {
    const t = setInterval(() => setStatus(officeStatus()), 60000);
    return () => clearInterval(t);
  }, []);

  const postal = (
    <LinearGradient colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.55)", C.bg]} locations={[0, 0.45, 1]} style={s.postalShade}>
      <Text style={s.eyebrow}>— AGRONEA PRODUCCIONES</Text>
      <Text style={s.postalTitle}>
        Nos vemos <Text style={{ color: C.greenLight }}>en el campo.</Text>
      </Text>
      <Text style={s.postalText}>¿Dudas con tu compra, tus entradas o un pedido? Escribinos y te ayudamos.</Text>
    </LinearGradient>
  );

  return (
    <View style={s.wrap}>
      {photo ? (
        <ImageBackground source={{ uri: photo }} style={s.postal} imageStyle={s.postalImg}>
          {postal}
        </ImageBackground>
      ) : (
        <View style={[s.postal, { backgroundColor: C.greenDeep }]}>{postal}</View>
      )}

      <View style={{ gap: 10 }}>
        <TouchableOpacity style={s.waBtn} onPress={() => open(WHATSAPP)} activeOpacity={0.85} accessibilityRole="link">
          <Ionicons name="logo-whatsapp" size={22} color="#032b12" />
          <View>
            <Text style={s.waText}>Escribinos por WhatsApp</Text>
            <Text style={s.waSub}>+54 9 379 422-2011</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={s.mapBtn} onPress={() => open(MAPS)} activeOpacity={0.85} accessibilityRole="link">
          <Ionicons name="location" size={20} color={C.gold} />
          <View>
            <Text style={s.mapText}>Cómo llegar</Text>
            <Text style={s.mapSub}>Caseros 539, Charata</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Card
        title="OFICINA"
        extra={
          <View style={[s.pill, { backgroundColor: status.open ? "rgba(74,222,128,0.15)" : "rgba(250,204,21,0.12)" }]}>
            <View style={[s.dot, { backgroundColor: status.open ? C.greenLight : "#facc15" }]} />
            <Text style={[s.pillText, { color: status.open ? C.greenLight : "#facc15" }]}>{status.text}</Text>
          </View>
        }
      >
        <Text style={s.officeTitle}>Caseros 539</Text>
        <Text style={s.officeSub}>Charata, Chaco · pagar y retirar pedidos</Text>
      </Card>

      <Card title="HORARIOS">
        <View style={{ gap: 4 }}>
          {[1, 2, 3, 4, 5, 6, 0].map((n) => {
            const today = status.day === n;
            const txt = HOURS[n].length ? HOURS[n].map(([a, b]) => `${a} a ${b} h`).join(" · ") : "Cerrado";
            return (
              <View key={n} style={[s.dayRow, today && s.dayRowToday]}>
                <Text style={[s.dayName, today && { color: C.text }]}>
                  {DAYS[n]}
                  {today ? " · hoy" : ""}
                </Text>
                <Text style={[s.dayHours, today && { color: C.greenLight, fontWeight: "700" }, !HOURS[n].length && { color: "#555" }]}>{txt}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Card title="SEGUINOS">
        <View style={s.socialGrid}>
          {SOCIAL.map((r) => (
            <TouchableOpacity key={r.name} style={[s.social, r.wide && s.socialWide]} onPress={() => open(r.url)} activeOpacity={0.8} accessibilityRole="link" accessibilityLabel={`${r.name} de Agronea`}>
              <View style={[s.socialIcon, { backgroundColor: r.color }, r.color === "#000000" && { borderWidth: 1, borderColor: "#333" }]}>
                <Ionicons name={r.icon} size={17} color="#fff" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.socialName} numberOfLines={1}>{r.name}</Text>
                <Text style={s.socialUser} numberOfLines={1}>{r.user}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Publicidad de Wesyx, quien hizo y administra el sistema */}
      <LinearGradient colors={["#170c05", "#0a0705", C.bg]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.wesyx}>
        <Image source={require("../../../assets/images/wesyx-logo.png")} style={s.wesyxLogo} resizeMode="contain" accessibilityLabel="Wesyx Software Design" />
        <Text style={s.wesyxEyebrow}>SISTEMA DESARROLLADO Y ADMINISTRADO POR</Text>
        <Text style={s.wesyxTitle}>¿Necesitás un sistema como este?</Text>
        <Text style={s.wesyxText}>Tiendas online, apps, entradas con QR y sistemas a medida para tu empresa o evento.</Text>
        <View style={s.wesyxRow}>
          <TouchableOpacity style={s.wesyxBtn} onPress={() => open(WESYX)} activeOpacity={0.85} accessibilityRole="link">
            <Text style={s.wesyxBtnText}>wesyx.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.wesyxWa} onPress={() => open(WESYX_WHATSAPP)} activeOpacity={0.85} accessibilityRole="link">
            <Ionicons name="logo-whatsapp" size={14} color={C.greenLight} />
            <Text style={s.wesyxWaText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={s.legal}>
        <Text style={s.copy}>© {new Date().getFullYear()} AGRONEA PRODUCCIONES S.R.L · Todos los derechos reservados</Text>
        <View style={s.legalRow}>
          <TouchableOpacity onPress={() => open(TERMS)} hitSlop={8}>
            <Text style={s.legalLink}>Términos y condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => open(PRIVACY)} hitSlop={8}>
            <Text style={s.legalLink}>Políticas de privacidad</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={s.brand} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">AGRONEA</Text>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: { gap: 14, marginTop: 10 },
  postal: { height: 230, borderRadius: 22, overflow: "hidden", justifyContent: "flex-end" },
  postalImg: { borderRadius: 22 },
  postalShade: { flex: 1, justifyContent: "flex-end", padding: 16, gap: 6 },
  eyebrow: { color: C.greenLight, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  postalTitle: { color: C.text, fontSize: 32, fontWeight: "900", lineHeight: 33 },
  postalText: { color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 19 },
  waBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 56, borderRadius: 16, backgroundColor: "#25d366" },
  waText: { color: "#032b12", fontWeight: "800", fontSize: 15 },
  waSub: { color: "rgba(3,43,18,0.75)", fontWeight: "700", fontSize: 11 },
  mapBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 56, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)" },
  mapText: { color: C.text, fontWeight: "800", fontSize: 15 },
  mapSub: { color: "rgba(255,255,255,0.6)", fontWeight: "700", fontSize: 11 },
  card: { backgroundColor: "#0e100f", borderColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderRadius: 22, padding: 16, gap: 10 },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  cardTitle: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 1 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { fontSize: 11, fontWeight: "800" },
  officeTitle: { color: C.text, fontSize: 20, fontWeight: "800" },
  officeSub: { color: "rgba(255,255,255,0.55)", fontSize: 12 },
  dayRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 11, paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderColor: "transparent" },
  dayRowToday: { borderColor: "rgba(74,222,128,0.25)", backgroundColor: "rgba(74,222,128,0.1)" },
  dayName: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "700" },
  dayHours: { color: "rgba(255,255,255,0.55)", fontSize: 12.5 },
  socialGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  social: { flexBasis: "48%", flexGrow: 1, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0a0b0b", padding: 10 },
  socialWide: { flexBasis: "100%" },
  socialIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  socialName: { color: C.text, fontSize: 12.5, fontWeight: "700" },
  socialUser: { color: "rgba(255,255,255,0.5)", fontSize: 11 },
  wesyx: { borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,107,26,0.3)", padding: 16, alignItems: "center", gap: 6 },
  wesyxLogo: { width: 150, height: 50 },
  wesyxEyebrow: { color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textAlign: "center" },
  wesyxTitle: { color: C.text, fontSize: 17, fontWeight: "800", textAlign: "center" },
  wesyxText: { color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 18, textAlign: "center" },
  wesyxRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  wesyxBtn: { backgroundColor: "#ff6b1a", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9 },
  wesyxBtnText: { color: "#000", fontSize: 12, fontWeight: "800" },
  wesyxWa: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(37,211,102,0.45)", paddingHorizontal: 12, paddingVertical: 8 },
  wesyxWaText: { color: C.greenLight, fontSize: 12, fontWeight: "700" },
  legal: { alignItems: "center", gap: 8, paddingTop: 6 },
  copy: { color: "rgba(255,255,255,0.45)", fontSize: 11, textAlign: "center" },
  legalRow: { flexDirection: "row", gap: 16 },
  legalLink: { color: "#d4c9ff", fontSize: 12 },
  brand: { color: "rgba(74,222,128,0.14)", fontSize: 74, fontWeight: "900", textAlign: "center", letterSpacing: -2, marginTop: -4 },
});

export default HomeFooter;
