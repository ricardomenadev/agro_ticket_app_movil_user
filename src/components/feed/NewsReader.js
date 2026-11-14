// Noticia abierta dentro de la app: foto con marco Agronea (con el crédito del diario), título, la bajada del diario,
// compartir, y "Leer la nota completa" en un navegador dentro de la app (no se sale de Agronea).
import React, { createContext, useCallback, useContext, useState } from "react";
import { Modal, View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useShare } from "../share/ShareProvider";

const G = { bg: "#000", card: "#121212", green: "#0A8F3C", greenLight: "#4ade80", gold: "#F5C400", text: "#fff", muted: "#a3a3a3", soft: "#d4d4d4" };

const ReaderContext = createContext(() => {});
/** open({ item, label }) abre la noticia; `share` arma la imagen para compartir. */
export const useNewsReader = () => useContext(ReaderContext);

const longDate = (d) => {
  const s = d ? new Date(d).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }) : "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const NewsReaderProvider = ({ children, shareOf }) => {
  const [news, setNews] = useState(null);
  const share = useShare();
  const open = useCallback((item, label) => setNews({ item, label }), []);
  const close = () => setNews(null);
  const item = news?.item;

  const readFull = () =>
    item?.url && WebBrowser.openBrowserAsync(item.url, { toolbarColor: "#000000", controlsColor: G.gold, showTitle: true }).catch(() => {});

  return (
    <ReaderContext.Provider value={open}>
      {children}
      <Modal visible={!!item} animationType="slide" onRequestClose={close}>
        {item ? (
          <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
            <View style={s.top}>
              <TouchableOpacity onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cerrar">
                <Ionicons name="close" size={28} color={G.text} />
              </TouchableOpacity>
              <Text style={s.topTitle}>Noticias del agro</Text>
              <TouchableOpacity onPress={() => share(shareOf(item, news.label))} hitSlop={12} accessibilityRole="button" accessibilityLabel="Compartir">
                <Ionicons name="share-social" size={24} color={G.text} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={s.content}>
              {item.imageUrl ? (
                // Marco Agronea: degradé verde-dorado alrededor de la foto, y el crédito del diario siempre visible
                <LinearGradient colors={[G.gold, G.green]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.frame}>
                  <View style={s.photoWrap}>
                    <Image source={{ uri: item.imageUrl }} style={s.photo} resizeMode="cover" accessibilityIgnoresInvertColors />
                    <Text style={s.credit}>Foto: {item.source}</Text>
                  </View>
                </LinearGradient>
              ) : null}
              <View style={s.tagRow}>
                {news.label ? <Text style={s.pill}>{news.label}</Text> : null}
                <Text style={s.date}>{longDate(item.publishedAt)}</Text>
              </View>
              <Text style={s.title}>{item.title}</Text>
              {item.summary ? <Text style={s.summary}>{item.summary}</Text> : null}
              <Text style={s.source}>Fuente: {item.source}</Text>
              {item.url ? (
                <TouchableOpacity style={s.full} onPress={readFull} activeOpacity={0.85} accessibilityRole="button">
                  <Ionicons name="reader-outline" size={20} color="#000" />
                  <Text style={s.fullText}>Leer la nota completa</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={s.wa} onPress={() => share(shareOf(item, news.label))} activeOpacity={0.85} accessibilityRole="button">
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={s.waText}>Compartir por WhatsApp</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        ) : null}
      </Modal>
    </ReaderContext.Provider>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: G.bg },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#262626" },
  topTitle: { color: G.muted, fontSize: 13, fontWeight: "700", letterSpacing: 1 },
  content: { padding: 18, gap: 14, paddingBottom: 40 },
  frame: { borderRadius: 20, padding: 3 },
  photoWrap: { borderRadius: 17, overflow: "hidden", backgroundColor: G.card },
  photo: { width: "100%", aspectRatio: 16 / 9 },
  credit: { position: "absolute", right: 8, bottom: 8, color: "#fff", fontSize: 10, fontWeight: "600", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, overflow: "hidden" },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  pill: { fontSize: 11, letterSpacing: 1, fontWeight: "800", color: "#000", backgroundColor: G.gold, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
  date: { color: G.muted, fontSize: 12 },
  title: { color: G.text, fontSize: 24, fontWeight: "800", lineHeight: 30 },
  summary: { color: G.soft, fontSize: 16, lineHeight: 24 },
  source: { color: G.greenLight, fontSize: 13, fontWeight: "700" },
  full: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 52, borderRadius: 14, backgroundColor: G.gold, marginTop: 6 },
  fullText: { color: "#000", fontSize: 16, fontWeight: "800" },
  wa: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 52, borderRadius: 14, backgroundColor: "#25D366" },
  waText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
