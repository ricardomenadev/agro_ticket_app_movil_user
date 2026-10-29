// Mercados y noticias. Precios: pizarra de granos (Rosario), hacienda (Cañuelas) y dólar oficial.
// Noticias: todas las del feed en grilla, por sección (NEA, País, Economía).
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C, NewsTile, NewsEmpty, Chips, NEWS_SECTIONS, trendOf } from "../components/feed/FeedCards";
import { useMarkets, useNews } from "../api/apiFeed";

const TABS = [
  { id: "grains", label: "Granos", eyebrow: "PIZARRA ROSARIO · $ POR TONELADA", source: "Bolsa de Comercio de Rosario" },
  { id: "cattle", label: "Hacienda", eyebrow: "MERCADO DE CAÑUELAS · $ POR KG VIVO (PROMEDIO)", source: "Mercado Agroganadero de Cañuelas" },
  { id: "dollar", label: "Dólar", eyebrow: "DÓLAR OFICIAL · BANCO NACIÓN", source: "Cotización oficial" },
];

const money = (n) => (n == null ? "$ —" : `$ ${Math.round(n).toLocaleString("es-AR")}`);

const Row = ({ item, last }) => {
  const t = trendOf(item);
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View>
        <Text style={styles.rowName}>{item.name}</Text>
        {item.heads ? <Text style={styles.rowSub}>{item.heads.toLocaleString("es-AR")} cabezas</Text> : null}
        {item.estimated ? <Text style={styles.rowSub}>Sin cotización · precio estimado</Text> : null}
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.rowPrice}>{money(item.price)}</Text>
        <Text style={[styles.rowChange, { color: t.color }]}>{t.text}</Text>
      </View>
    </View>
  );
};

const Board = ({ children }) => <View style={styles.board}>{children}</View>;

const VIEWS = [
  { id: "prices", label: "Precios" },
  { id: "news", label: "Noticias" },
];
const NEWS_FILTERS = [{ id: "all", label: "Todas" }, ...NEWS_SECTIONS];

const MarketsScreen = ({ route }) => {
  const [tab, setTab] = useState("grains");
  const [view, setView] = useState("prices");
  const [section, setSection] = useState("all");
  const { markets, loading } = useMarkets();
  const { news, loading: newsLoading } = useNews();

  // Desde el inicio se llega con { view, section } (p. ej. "Ver más del NEA")
  useEffect(() => {
    if (route?.params?.view) setView(route.params.view);
    if (route?.params?.section) setSection(route.params.section);
  }, [route?.params]);

  const labelOf = Object.fromEntries(NEWS_SECTIONS.map((s) => [s.id, s.label]));
  // En "Todas" se mezclan las secciones, de la más nueva a la más vieja
  const newsList = (section === "all" ? NEWS_SECTIONS.map((s) => s.id) : [section])
    .flatMap((id) => (news?.[id] || []).map((n) => ({ ...n, label: labelOf[id] })))
    .sort((a, b) => (section === "all" ? new Date(b.publishedAt) - new Date(a.publishedAt) : 0));
  const newsRows = [];
  for (let i = 0; i < newsList.length; i += 2) newsRows.push(newsList.slice(i, i + 2));
  const current = TABS.find((t) => t.id === tab);
  const block = markets?.[tab];

  const renderBoard = () => {
    if (!markets) {
      return (
        <Board>
          <View style={styles.loading}>
            {loading ? <ActivityIndicator color={C.greenLight} /> : <Text style={styles.rowSub}>No se pudieron cargar los precios. Probá de nuevo con señal.</Text>}
          </View>
        </Board>
      );
    }
    if (tab === "dollar") {
      const d = markets.dollar;
      return (
        <Board>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowName}>Compra</Text>
            <Text style={styles.rowPrice}>{money(d?.buy)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowName}>Venta</Text>
            <Text style={styles.rowPrice}>{money(d?.sell)}</Text>
          </View>
        </Board>
      );
    }
    const items = block?.items || [];
    return (
      <Board>
        {items.length ? (
          items.map((item, i) => <Row key={item.id} item={item} last={i === items.length - 1} />)
        ) : (
          <View style={styles.loading}>
            <Text style={styles.rowSub}>Sin datos por ahora.</Text>
          </View>
        )}
      </Board>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Mercados y noticias</Text>
          <Text style={styles.subtitle}>Precios y noticias del agro, al día</Text>
        </View>

        <View style={styles.segment}>
          {VIEWS.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.segBtn, view === v.id && styles.segBtnOn]}
              onPress={() => setView(v.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: view === v.id }}
            >
              <Text style={[styles.tabText, view === v.id && styles.tabTextActive]}>{v.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {view === "news" ? (
          <>
            <Chips options={NEWS_FILTERS} value={section} onChange={setSection} />
            {newsRows.length ? (
              newsRows.map((row) => (
                <View key={row[0].id} style={styles.newsRow}>
                  {row.map((n) => (
                    <NewsTile key={n.id} item={n} label={n.label} />
                  ))}
                  {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
                </View>
              ))
            ) : (
              <NewsEmpty loading={newsLoading} />
            )}
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Se actualiza solo durante el día · fuentes oficiales</Text>
            <View style={styles.tabs}>
              {TABS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tab, tab === t.id && styles.tabActive]}
                  onPress={() => setTab(t.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: tab === t.id }}
                >
                  <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.eyebrow}>{current.eyebrow}</Text>
            {renderBoard()}
            <Text style={styles.source}>
              Fuente: {current.source}
              {block?.date ? ` · ${block.date}` : ""}
            </Text>

            {/* Las noticias viven en Noticias: acá solo el atajo, para no repetirlas */}
            <TouchableOpacity style={styles.newsLink} onPress={() => { setSection("economy"); setView("news"); }} activeOpacity={0.85} accessibilityRole="button">
              <Ionicons name="newspaper-outline" size={20} color={C.gold} />
              <Text style={styles.newsLinkText}>Noticias de economía y mercados</Text>
              <Ionicons name="chevron-forward" size={18} color={C.gold} />
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 14 },
  title: { color: C.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 2 },
  segment: { flexDirection: "row", backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 14, padding: 4 },
  segBtn: { flex: 1, minHeight: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  segBtnOn: { backgroundColor: C.borderStrong },
  newsRow: { flexDirection: "row", gap: 12 },
  newsLink: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: C.gold, paddingHorizontal: 16, marginTop: 6 },
  newsLinkText: { flex: 1, color: C.gold, fontWeight: "700", fontSize: 14 },
  tabs: { flexDirection: "row", gap: 8, backgroundColor: C.card, borderRadius: 14, padding: 4 },
  tab: { flex: 1, minHeight: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: C.green },
  tabText: { color: C.muted, fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: C.text, fontWeight: "700" },
  eyebrow: { color: C.gold, fontSize: 11, letterSpacing: 2, fontWeight: "600" },
  board: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, overflow: "hidden" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder: { borderBottomColor: C.border, borderBottomWidth: 1 },
  rowName: { color: C.text, fontSize: 15, fontWeight: "700" },
  rowSub: { color: C.muted, fontSize: 11 },
  rowPrice: { color: C.text, fontSize: 17, fontWeight: "800" },
  rowChange: { fontSize: 12 },
  loading: { padding: 24, alignItems: "center" },
  source: { color: C.muted, fontSize: 11, marginTop: -6 },
});

export default MarketsScreen;
