// Mercados: pizarra de granos (Rosario), hacienda (Cañuelas), dólar oficial y noticias de mercado.
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, SectionHeader, NewsCard, SampleBadge, trendOf } from "../components/feed/FeedCards";
import { NEWS_MARKETS, SAMPLE } from "../constants/feedSample";
import { useMarkets } from "../api/apiFeed";

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

const MarketsScreen = () => {
  const [tab, setTab] = useState("grains");
  const { markets, loading } = useMarkets();
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
          <Text style={styles.title}>Mercados</Text>
          <Text style={styles.subtitle}>Se actualiza solo durante el día · fuentes oficiales</Text>
        </View>

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

        <SectionHeader title="Noticias de mercado" />
        {SAMPLE ? <SampleBadge /> : null}
        {NEWS_MARKETS.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}

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
