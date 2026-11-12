// Video emergente (publicidad) que se carga en el panel: App → Menú y versión → Video emergente.
// Sale una vez cada tantos días (lo elige el panel), arranca sin sonido y siempre se puede cerrar sin ir a WhatsApp.
import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { fetchPromo, API_ROOT } from "../../api/apiFeed";
import { C } from "../feed/FeedCards";

const SEEN_KEY = "agronea.promoSeen";
const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000); // día local

// Se muestra si nunca la vio, si el video es otro, o si ya pasaron los días que pide el panel
export const shouldShow = (promo, seen, day) => Boolean(promo?.url) && (!seen || seen.url !== promo.url || day - seen.day >= promo.everyDays);

export default function PromoVideoModal() {
  const [promo, setPromo] = useState(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const alive = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const p = await fetchPromo();
        const seen = JSON.parse((await AsyncStorage.getItem(SEEN_KEY)) || "null");
        if (!alive.current || !shouldShow(p, seen, today())) return;
        await AsyncStorage.setItem(SEEN_KEY, JSON.stringify({ url: p.url, day: today() }));
        setPromo(p);
      } catch {
        // Sin señal o sin video: no se muestra nada
      }
    })();
    return () => { alive.current = false; };
  }, []);

  if (!promo) return null;
  const close = () => setPromo(null);
  const openWhatsApp = () => {
    close();
    Linking.openURL(promo.whatsappUrl).catch(() => {});
  };

  return (
    <Modal visible animationType="fade" onRequestClose={close} statusBarTranslucent>
      <SafeAreaView style={s.safe}>
        <View style={s.videoBox}>
          <Video
            source={{ uri: API_ROOT + promo.url }}
            style={s.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted={muted}
            onReadyForDisplay={() => setLoading(false)}
          />
          {loading ? <ActivityIndicator style={StyleSheet.absoluteFill} color={C.greenLight} /> : null}
          <View style={s.top}>
            <TouchableOpacity style={s.chip} onPress={() => setMuted(!muted)} accessibilityLabel={muted ? "Activar sonido" : "Silenciar"}>
              <Ionicons name={muted ? "volume-mute" : "volume-high"} size={18} color={muted ? "#fff" : C.greenLight} />
              <Text style={s.chipText}>{muted ? "Activar sonido" : "Sonido"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.close} onPress={close} hitSlop={12} accessibilityLabel="Cerrar video">
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={s.whatsapp} onPress={openWhatsApp} activeOpacity={0.85}>
          <Ionicons name="logo-whatsapp" size={22} color="#000" />
          <Text style={s.whatsappText}>{promo.buttonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.later} onPress={close}>
          <Text style={s.laterText}>Ahora no</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  videoBox: { flex: 1 },
  video: { flex: 1 },
  top: { position: "absolute", top: 8, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.55)" },
  chipText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.55)" },
  whatsapp: { flexDirection: "row", gap: 8, marginHorizontal: 18, marginTop: 12, minHeight: 52, borderRadius: 14, backgroundColor: "#25D366", alignItems: "center", justifyContent: "center" },
  whatsappText: { color: "#000", fontWeight: "800", fontSize: 16 },
  later: { minHeight: 48, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  laterText: { color: "rgba(255,255,255,0.75)", fontWeight: "600", fontSize: 15 },
});
