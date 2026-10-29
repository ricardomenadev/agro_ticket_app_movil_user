// Piezas del rediseño: encabezados de sección, tarjetas de precio y de noticia.
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Fondo negro: el verde y el dorado quedan solo como acentos, para que resalten
export const C = {
  bg: "#000000",
  card: "#121212",
  border: "#262626",
  borderStrong: "#3a3a3a",
  green: "#0A8F3C",
  greenLight: "#4ade80",
  greenDeep: "#0b2414",
  gold: "#F5C400",
  text: "#ffffff",
  muted: "#a3a3a3",
  soft: "#d4d4d4",
  down: "#fb923c",
  photo: "#1f1f1f",
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

/** Variación del día: el % si ya hay día anterior guardado; si no, la tendencia que publica la fuente. */
export const trendOf = (item) => {
  const dir = item.change != null ? Math.sign(item.change) : item.trend === "up" ? 1 : item.trend === "down" ? -1 : 0;
  const color = dir > 0 ? C.greenLight : dir < 0 ? C.down : C.muted;
  const arrow = dir > 0 ? "▲" : dir < 0 ? "▼" : "=";
  const label = item.change != null ? `${Math.abs(item.change).toFixed(1).replace(".", ",")} %` : dir > 0 ? "subió" : dir < 0 ? "bajó" : "sin cambios";
  return { color, text: `${arrow} ${label}` };
};

export const PriceCard = ({ item, place, unit }) => {
  const t = trendOf(item);
  return (
    <View style={s.priceCard}>
      <Text style={s.muted12}>{item.name} · {place}</Text>
      <Text style={s.price}>{money(item.price)}{item.estimated ? <Text style={s.muted11}> (est.)</Text> : null}</Text>
      <Text style={[s.change, { color: t.color }]}>{t.text} · por {unit}</Text>
    </View>
  );
};

export const PriceCardEmpty = () => (
  <View style={s.priceCard}>
    <Text style={s.muted12}>Cargando precios…</Text>
    <Text style={s.price}>$ —</Text>
  </View>
);

const CATEGORY = { agronea: "AGRONEA", agricultura: "AGRICULTURA", ganaderia: "GANADERÍA", inta: "INTA", economia: "ECONOMÍA", otros: "CAMPO" };

const ago = (date) => {
  const min = Math.max(1, Math.round((Date.now() - new Date(date)) / 60000));
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
};

/** Noticia del feed (o de ejemplo con tag/ago). Al tocarla abre la nota en el navegador. */
export const NewsCard = ({ item, big }) => {
  const tag = item.tag || [CATEGORY[item.category] || "CAMPO", item.region === "nea" ? "NEA" : null].filter(Boolean).join(" · ");
  const when = item.ago || (item.publishedAt ? ago(item.publishedAt) : "");
  const photo = item.imageUrl ? (
    <Image source={{ uri: item.imageUrl }} style={big ? s.newsPhotoBig : s.newsPhoto} resizeMode="cover" accessibilityIgnoresInvertColors />
  ) : (
    <View style={big ? s.newsPhotoBig : s.newsPhoto}>
      <Ionicons name="leaf-outline" size={big ? 34 : 22} color={C.muted} />
    </View>
  );
  return (
    <TouchableOpacity style={[s.newsCard, big && s.newsCardBig]} onPress={() => openNews(item)} disabled={!item.url} activeOpacity={0.85} accessibilityRole="link">
      {photo}
      <View style={big ? s.newsBodyBig : s.newsBody}>
        <View style={s.tagRow}>
          {item.featured ? <Text style={s.featured}>DESTACADA</Text> : null}
          <Text style={[s.tag, item.category === "agronea" && { color: C.gold }]} numberOfLines={1}>{tag}</Text>
        </View>
        <Text style={big ? s.newsTitleBig : s.newsTitle} numberOfLines={big ? 4 : 3}>{item.title}</Text>
        <Text style={s.muted11}>{item.source}{when ? ` · ${when}` : ""}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Secciones de noticias del feed, en el orden en que se muestran
export const NEWS_SECTIONS = [
  { id: "nea", label: "NEA", more: "Ver más del NEA" },
  { id: "national", label: "País", more: "Ver más del agro en el país" },
  { id: "economy", label: "Economía", more: "Ver más de economía" },
];
/** La principal de una sección: la más nueva que tenga foto (si ninguna tiene, la más nueva). */
export const leadOf = (list) => (list || []).find((n) => n.imageUrl) || list?.[0] || null;

const openNews = (item) => item.url && Linking.openURL(item.url).catch(() => {});

/** Portada: foto de fondo con el título encima. `half` es la versión chica que va de a dos. */
export const NewsCover = ({ item, label, half }) => (
  <TouchableOpacity style={[s.cover, half && s.coverHalf]} onPress={() => openNews(item)} disabled={!item.url} activeOpacity={0.9} accessibilityRole="link">
    {item.imageUrl ? (
      <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
    ) : (
      <View style={[StyleSheet.absoluteFill, s.coverEmpty]}>
        <Ionicons name="leaf-outline" size={half ? 28 : 40} color={C.borderStrong} />
      </View>
    )}
    <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.92)"]} locations={[0, 0.55]} style={[s.coverBody, half && s.coverBodyHalf]}>
      <Text style={s.coverPill}>{label}</Text>
      <Text style={half ? s.coverTitleHalf : s.coverTitle} numberOfLines={half ? 4 : 3}>{item.title}</Text>
      {half ? null : <Text style={s.muted11}>{item.source}{item.publishedAt ? ` · ${ago(item.publishedAt)}` : ""}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

/** Noticia en la grilla de dos columnas de Mercados y noticias. */
export const NewsTile = ({ item, label }) => (
  <TouchableOpacity style={s.tile} onPress={() => openNews(item)} disabled={!item.url} activeOpacity={0.85} accessibilityRole="link">
    {item.imageUrl ? (
      <Image source={{ uri: item.imageUrl }} style={s.tilePhoto} resizeMode="cover" accessibilityIgnoresInvertColors />
    ) : (
      <View style={[s.tilePhoto, s.coverEmpty]}>
        <Ionicons name="leaf-outline" size={26} color={C.borderStrong} />
      </View>
    )}
    <Text style={s.tag} numberOfLines={1}>{label} · {item.source}</Text>
    <Text style={s.tileTitle} numberOfLines={4}>{item.title}</Text>
  </TouchableOpacity>
);

/** Fila de pastillas para elegir sección (NEA, País, Economía…). */
export const Chips = ({ options, value, onChange }) => (
  <View style={s.chips}>
    {options.map((o) => (
      <TouchableOpacity
        key={o.id}
        style={[s.chip, value === o.id && s.chipOn]}
        onPress={() => onChange(o.id)}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === o.id }}
        hitSlop={6}
      >
        <Text style={[s.chipText, value === o.id && s.chipTextOn]}>{o.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const NewsEmpty = ({ loading }) => (
  <View style={s.sample}>
    <Text style={[s.sampleText, { color: C.muted }]}>{loading ? "Cargando noticias…" : "Sin noticias por ahora. Probá más tarde."}</Text>
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
  newsPhoto: { width: 72, height: 72, borderRadius: 12, backgroundColor: C.photo, alignItems: "center", justifyContent: "center" },
  newsPhotoBig: { height: 150, backgroundColor: C.photo, alignItems: "center", justifyContent: "center" },
  newsBody: { flex: 1, gap: 4 },
  newsBodyBig: { padding: 14, gap: 6 },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featured: { fontSize: 10, letterSpacing: 1.5, fontWeight: "700", color: C.bg, backgroundColor: C.gold, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, overflow: "hidden" },
  tag: { fontSize: 10, letterSpacing: 1.5, fontWeight: "600", color: C.greenLight },
  newsTitle: { color: C.text, fontSize: 14, fontWeight: "700", lineHeight: 19 },
  newsTitleBig: { color: C.text, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  cover: { height: 260, borderRadius: 20, overflow: "hidden", backgroundColor: C.photo, borderColor: C.border, borderWidth: 1, justifyContent: "flex-end" },
  coverHalf: { flex: 1, height: 200, borderRadius: 16 },
  coverEmpty: { backgroundColor: C.photo, alignItems: "center", justifyContent: "center" },
  coverBody: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 48, gap: 5 },
  coverBodyHalf: { paddingHorizontal: 10, paddingBottom: 10, paddingTop: 32 },
  coverPill: { alignSelf: "flex-start", fontSize: 10, letterSpacing: 1, fontWeight: "800", color: C.bg, backgroundColor: C.gold, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, overflow: "hidden" },
  coverTitle: { color: C.text, fontSize: 17, fontWeight: "800", lineHeight: 22 },
  coverTitleHalf: { color: C.text, fontSize: 13, fontWeight: "700", lineHeight: 17 },
  tile: { flex: 1, gap: 5 },
  tilePhoto: { width: "100%", aspectRatio: 1, borderRadius: 12, backgroundColor: C.photo },
  tileTitle: { color: C.text, fontSize: 13, fontWeight: "600", lineHeight: 17 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { minHeight: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: C.borderStrong, justifyContent: "center" },
  chipOn: { backgroundColor: C.gold, borderColor: C.gold },
  chipText: { color: C.muted, fontSize: 13, fontWeight: "600" },
  chipTextOn: { color: C.bg, fontWeight: "700" },
  sample: { backgroundColor: "rgba(245,196,0,0.12)", borderColor: "rgba(245,196,0,0.4)", borderWidth: 1, borderRadius: 12, padding: 10 },
  sampleText: { color: C.gold, fontSize: 12, textAlign: "center" },
});
