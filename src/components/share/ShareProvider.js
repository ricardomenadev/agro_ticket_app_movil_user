// Compartir como imagen con el sello de Agronea: noticias, precios, resultados de la calculadora.
// Uso: const share = useShare(); share({ eyebrow, title, photo, rows, note, source }).
// Muestra la tarjeta armada, y "Compartir" la convierte en imagen y abre WhatsApp / el menú del teléfono.
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";

const G = { green: "#0A8F3C", greenDark: "#0b5d2a", gold: "#F5C400", bg: "#0b0f0c", card: "#151a16", text: "#fff", muted: "#a3a3a3" };
const APP_URL = "https://agronea.store";

const ShareContext = createContext(() => {});
export const useShare = () => useContext(ShareContext);

/** La tarjeta que se convierte en imagen. Ancho fijo para que siempre salga igual. */
export const ShareCard = ({ eyebrow, title, photo, rows = [], note, source }) => (
  <View style={s.card} collapsable={false}>
    <View style={s.head}>
      <Image source={require("../../../assets/images/logo_agronea_producciones.png")} style={s.logo} resizeMode="contain" />
    </View>
    <View style={s.body}>
      {eyebrow ? <Text style={s.eyebrow}>{eyebrow}</Text> : null}
      {photo ? <Image source={{ uri: photo }} style={s.photo} resizeMode="cover" /> : null}
      {title ? <Text style={s.title}>{title}</Text> : null}
      {rows.length ? (
        <View style={s.board}>
          {rows.map((r, i) => (
            <View key={`${r.label}-${i}`} style={[s.row, i < rows.length - 1 && s.rowBorder]}>
              <Text style={[s.rowLabel, r.strong && s.strong]} numberOfLines={2}>{r.label}</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[s.rowValue, r.strong && s.strongValue]}>{r.value}</Text>
                {r.sub ? <Text style={[s.rowSub, r.color && { color: r.color }]}>{r.sub}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
      {note ? <Text style={s.note}>{note}</Text> : null}
      {source ? <Text style={s.source}>{source}</Text> : null}
    </View>
    <View style={s.foot}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.footBig}>Bajá gratis la app Agronea</Text>
        <Text style={s.footSmall}>Noticias y precios del campo, día a día</Text>
        <Text style={s.footSmall}>Google Play · App Store · agronea.store</Text>
      </View>
      <View style={s.qr}>
        <QRCode value={APP_URL} size={58} backgroundColor="#fff" color="#000" />
      </View>
    </View>
  </View>
);

export const ShareProvider = ({ children }) => {
  const [card, setCard] = useState(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const share = useCallback((props) => setCard(props), []);

  const send = async () => {
    setBusy(true);
    try {
      const uri = await captureRef(ref, { format: "png", quality: 1, width: 1080 });
      if (!(await Sharing.isAvailableAsync())) throw new Error("sin compartir");
      await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Compartir con Agronea" });
      setCard(null);
    } catch (e) {
      Alert.alert("No se pudo compartir", "Probá de nuevo en un momento.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ShareContext.Provider value={share}>
      {children}
      <Modal visible={!!card} transparent animationType="slide" onRequestClose={() => setCard(null)}>
        <View style={s.backdrop}>
          <ScrollView contentContainerStyle={s.sheet}>
            <Text style={s.sheetTitle}>Así se va a ver</Text>
            <View ref={ref} collapsable={false}>{card ? <ShareCard {...card} /> : null}</View>
            <TouchableOpacity style={s.btn} onPress={send} disabled={busy} accessibilityRole="button">
              {busy ? <ActivityIndicator color="#fff" /> : <Ionicons name="logo-whatsapp" size={22} color="#fff" />}
              <Text style={s.btnText}>Compartir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancel} onPress={() => setCard(null)} accessibilityRole="button">
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ShareContext.Provider>
  );
};

/** Botoncito redondo de compartir, para poner arriba de fotos o al lado de títulos. */
export const ShareButton = ({ onPress, style }) => (
  <TouchableOpacity style={[s.shareBtn, style]} onPress={onPress} hitSlop={10} accessibilityRole="button" accessibilityLabel="Compartir">
    <Ionicons name="share-social" size={16} color="#fff" />
  </TouchableOpacity>
);

const s = StyleSheet.create({
  card: { width: 340, backgroundColor: G.bg, overflow: "hidden" }, // sin bordes redondeados: en WhatsApp las esquinas transparentes se ven feas
  head: { backgroundColor: "#fff", alignItems: "center", paddingVertical: 10 },
  logo: { width: 170, height: 64 },
  body: { padding: 16, gap: 10 },
  eyebrow: { color: G.gold, fontSize: 10, letterSpacing: 1.5, fontWeight: "800" },
  photo: { width: "100%", height: 170, borderRadius: 12, backgroundColor: G.card },
  title: { color: G.text, fontSize: 18, fontWeight: "800", lineHeight: 23 },
  board: { backgroundColor: G.card, borderRadius: 12, borderWidth: 1, borderColor: "#262626" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 9 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#262626" },
  rowLabel: { color: G.text, fontSize: 13, fontWeight: "600", flexShrink: 1 },
  rowValue: { color: G.text, fontSize: 15, fontWeight: "800" },
  rowSub: { color: G.muted, fontSize: 10 },
  strong: { color: G.gold, fontWeight: "800" },
  strongValue: { color: G.gold, fontSize: 18 },
  note: { color: G.text, fontSize: 12, lineHeight: 17 },
  source: { color: G.muted, fontSize: 10 },
  foot: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: G.green, padding: 14 },
  footBig: { color: "#fff", fontSize: 15, fontWeight: "900" },
  footSmall: { color: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: "600" },
  qr: { backgroundColor: "#fff", padding: 4, borderRadius: 6 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.94)" },
  sheet: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 14 },
  sheetTitle: { color: G.muted, fontSize: 13, fontWeight: "600" },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, width: 340, minHeight: 52, borderRadius: 14, backgroundColor: "#25D366" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  cancel: { minHeight: 44, justifyContent: "center", paddingHorizontal: 20 },
  cancelText: { color: G.muted, fontSize: 15, fontWeight: "600" },
  shareBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
});
