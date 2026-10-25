// Mercados: pizarra de granos (Rosario), hacienda (Cañuelas) y noticias de mercado.
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, SectionHeader, NewsCard, SampleBadge } from "../components/feed/FeedCards";
import { MARKETS, NEWS_MARKETS, SAMPLE } from "../constants/feedSample";

const TABS = [
  { id: "grains", label: "Granos", eyebrow: "PIZARRA ROSARIO · $ POR TONELADA" },
  { id: "cattle", label: "Hacienda", eyebrow: "MERCADO DE CAÑUELAS · $ POR KG VIVO" },
];

const money = (n) => (n == null ? "$ —" : `$ ${Math.round(n).toLocaleString("es-AR")}`);

const Row = ({ item, last }) => {
  const color = item.change > 0 ? C.greenLight : item.change < 0 ? C.down : C.muted;
  const arrow = item.change > 0 ? "▲" : item.change < 0 ? "▼" : "=";
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={styles.rowSub}>{item.place}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.rowPrice}>{money(item.price)}</Text>
        <Text style={[styles.rowChange, { color }]}>{arrow} {Math.abs(item.change).toFixed(1).replace(".", ",")} %</Text>
      </View>
    </View>
  );
};

const MarketsScreen = () => {
  const [tab, setTab] = useState("grains");
  const current = TABS.find((t) => t.id === tab);
  const items = MARKETS[tab];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Mercados</Text>
          <Text style={styles.subtitle}>Se actualiza todos los días · fuentes oficiales</Text>
        </View>

        {SAMPLE ? <SampleBadge /> : null}

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
        <View style={styles.board}>
          {items.map((item, i) => (
            <Row key={item.id} item={item} last={i === items.length - 1} />
          ))}
        </View>

        <SectionHeader title="Noticias de mercado" />
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
});

export default MarketsScreen;
