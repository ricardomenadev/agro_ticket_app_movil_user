// Piezas del rediseño: encabezados de sección, tarjetas de precio y de noticia.
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const C = {
  bg: "#06100a",
  card: "#0d1a12",
  border: "#213a2a",
  borderStrong: "#2f4a39",
  green: "#0A8F3C",
  greenLight: "#4ade80",
  greenDeep: "#0b2414",
  gold: "#F5C400",
  text: "#ffffff",
  muted: "#9fb3a6",
  soft: "#cfe6d6",
  down: "#fb923c",
};

const money = (n) => (n == null ? "$ —" : `$ ${Math.round(n).toLocaleString("es-AR")}`);

export const SectionHeader = ({ title, action, onAction }) => (
  <View style={s.sectionRow}>
    <Text style={s.sectionTitle}>{title}</Text>
    {action ? (
      <TouchableOpacity onPress={onAction} hitSlop={12}>
        <Text style={s.sectionAction}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export const PriceCard = ({ item }) => {
  const color = item.change > 0 ? C.greenLight : item.change < 0 ? C.down : C.muted;
  const arrow = item.change > 0 ? "▲" : item.change < 0 ? "▼" : "=";
  return (
    <View style={s.priceCard}>
      <Text style={s.muted12}>{item.name} · {item.place}</Text>
      <Text style={s.price}>{money(item.price)}</Text>
      <Text style={[s.change, { color }]}>{arrow} {Math.abs(item.change).toFixed(1).replace(".", ",")} % por {item.unit}</Text>
    </View>
  );
};

export const NewsCard = ({ item, big }) => (
  <View style={[s.newsCard, big && s.newsCardBig]}>
    {big ? <View style={s.newsPhotoBig}><Text style={s.muted12}>foto</Text></View> : <View style={s.newsPhoto}><Text style={s.muted11}>foto</Text></View>}
    <View style={big ? s.newsBodyBig : s.newsBody}>
      <View style={s.tagRow}>
        {item.featured ? <Text style={s.featured}>DESTACADA</Text> : null}
        <Text style={[s.tag, item.featured && { color: C.muted }]}>{item.tag}</Text>
      </View>
      <Text style={big ? s.newsTitleBig : s.newsTitle}>{item.title}</Text>
      <Text style={s.muted11}>{item.source} · {item.ago}</Text>
    </View>
  </View>
);

export const SampleBadge = () => (
  <View style={s.sample}>
    <Text style={s.sampleText}>Datos de ejemplo · se actualizan solos cuando esté conectado el servidor</Text>
  </View>
);

const s = StyleSheet.create({
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: "700" },
  sectionAction: { color: C.greenLight, fontSize: 13 },
  priceCard: { flex: 1, backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 12 },
  price: { color: C.text, fontSize: 18, fontWeight: "800", marginTop: 4 },
  change: { fontSize: 12, marginTop: 2 },
  muted12: { color: C.muted, fontSize: 12 },
  muted11: { color: C.muted, fontSize: 11 },
  newsCard: { flexDirection: "row", gap: 12, backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 10 },
  newsCardBig: { flexDirection: "column", padding: 0, overflow: "hidden", borderRadius: 18 },
  newsPhoto: { width: 72, height: 72, borderRadius: 12, backgroundColor: "#1d3a27", alignItems: "center", justifyContent: "center" },
  newsPhotoBig: { height: 150, backgroundColor: "#1d3a27", alignItems: "center", justifyContent: "center" },
  newsBody: { flex: 1, gap: 4 },
  newsBodyBig: { padding: 14, gap: 6 },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featured: { fontSize: 10, letterSpacing: 1.5, fontWeight: "700", color: C.bg, backgroundColor: C.gold, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, overflow: "hidden" },
  tag: { fontSize: 10, letterSpacing: 1.5, fontWeight: "600", color: C.greenLight },
  newsTitle: { color: C.text, fontSize: 14, fontWeight: "700", lineHeight: 19 },
  newsTitleBig: { color: C.text, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  sample: { backgroundColor: "rgba(245,196,0,0.12)", borderColor: "rgba(245,196,0,0.4)", borderWidth: 1, borderRadius: 12, padding: 10 },
  sampleText: { color: C.gold, fontSize: 12, textAlign: "center" },
});
