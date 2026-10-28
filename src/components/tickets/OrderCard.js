// Una compra cargada en el teléfono: evento, número de compra y sus entradas/productos con miniatura del QR, Ver, Pasar y Recuperar
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { C } from "../feed/FeedCards";

const KIND = { event: "Entrada", parking: "Estacionamiento", product: "Producto" };
const ICON = { event: "ticket-outline", parking: "car-outline", product: "cube-outline" };

const dateOf = (e) => {
  if (!e) return null;
  if (!e.startDate) return e.date || null;
  const f = (d) => new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", timeZone: "America/Argentina/Buenos_Aires" });
  return e.endDate && f(e.endDate) !== f(e.startDate) ? `${f(e.startDate)} al ${f(e.endDate)}` : f(e.startDate);
};

const statusOf = (t) =>
  t.status === "USED"
    ? { label: t.type === "product" ? "Retirado" : "Usada", color: C.muted }
    : t.status === "PASSED"
      ? { label: "Pasada", color: "#c084fc" }
      : t.type === "product"
        ? { label: "Para retirar", color: C.gold }
        : { label: "A tu nombre", color: C.greenLight };

export default function OrderCard({ order, onOpen, onPass, onRecover, onRemove }) {
  const { event, tickets = [], orderNumber, paid } = order;
  const confirmRemove = () =>
    Alert.alert("¿Quitar esta compra del teléfono?", "Las entradas no se borran: las podés volver a cargar cuando quieras.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Quitar", style: "destructive", onPress: onRemove },
    ]);

  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Text style={s.eyebrow}>Compra {orderNumber}</Text>
          <Text style={s.title}>{event?.title || "Agronea"}</Text>
          {dateOf(event) ? (
            <Text style={s.meta}>
              {dateOf(event)}
              {event?.location ? ` · ${event.location}` : ""}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={confirmRemove} hitSlop={12} accessibilityLabel="Quitar esta compra del teléfono">
          <Ionicons name="trash-outline" size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      {!paid ? <Text style={s.warn}>El pago de esta compra todavía no se confirmó.</Text> : null}

      {tickets.map((t, i) => {
        const st = statusOf(t);
        const mine = t.status === "MINE";
        const showQr = mine && t.qrCode;
        return (
          <View key={t.id} style={s.row}>
            <TouchableOpacity style={s.rowMain} onPress={() => onOpen(t, i)} disabled={!showQr} activeOpacity={0.8}>
              {showQr ? (
                <View style={s.thumb} accessibilityLabel="Miniatura del QR">
                  <QRCode value={t.qrCode} size={58} ecl="L" />
                </View>
              ) : (
                <View style={[s.thumb, s.thumbIcon, t.type === "product" && { backgroundColor: "rgba(245,196,0,.14)" }]}>
                  <Ionicons name={ICON[t.type] || ICON.event} size={28} color={t.type === "product" ? C.gold : t.status === "PASSED" ? "#c084fc" : C.muted} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>
                  {KIND[t.type] || "Entrada"} {i + 1} · <Text style={{ color: st.color }}>{st.label}</Text>
                </Text>
                <Text style={s.rowName} numberOfLines={1}>
                  {t.type === "product" ? t.name : t.holderName}
                </Text>
                {t.status === "PASSED" ? <Text style={[s.tap, { color: "#c084fc" }]}>Le llegó por mail con su propio QR</Text> : null}
                {showQr ? <Text style={s.tap}>Lista para usar · funciona sin señal</Text> : null}
              </View>
            </TouchableOpacity>
            {showQr || t.canRecover ? (
              <View style={s.actions}>
                {showQr ? (
                  <TouchableOpacity style={s.view} onPress={() => onOpen(t, i)} activeOpacity={0.85}>
                    <Ionicons name="qr-code-outline" size={16} color="#06100a" />
                    <Text style={s.viewText}>Ver QR</Text>
                  </TouchableOpacity>
                ) : null}
                {t.canPass && mine ? (
                  <TouchableOpacity style={s.pass} onPress={() => onPass(t, i)} activeOpacity={0.85}>
                    <Ionicons name="paper-plane-outline" size={15} color="#160424" />
                    <Text style={s.passText}>Pasar</Text>
                  </TouchableOpacity>
                ) : t.canRecover ? (
                  <TouchableOpacity style={s.recover} onPress={() => onRecover(t)} activeOpacity={0.85}>
                    <Text style={s.recoverText}>Recuperar</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 20, padding: 14, gap: 10 },
  head: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  eyebrow: { color: C.greenLight, fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  title: { color: C.text, fontSize: 18, fontWeight: "800", marginTop: 2 },
  meta: { color: C.muted, fontSize: 12, marginTop: 2 },
  warn: { color: C.gold, fontSize: 13, backgroundColor: "rgba(245,196,0,.08)", borderRadius: 12, padding: 10 },
  row: { backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 12, gap: 12 },
  rowMain: { flexDirection: "row", alignItems: "center", gap: 12 },
  // miniatura del QR real sobre blanco: se ve que la entrada ya está en el teléfono
  thumb: { width: 72, height: 72, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  thumbIcon: { backgroundColor: "rgba(255,255,255,.06)" },
  rowLabel: { color: C.muted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  rowName: { color: C.text, fontSize: 16, fontWeight: "800", marginTop: 2, textTransform: "capitalize" },
  tap: { color: C.greenLight, fontSize: 12, marginTop: 3 },
  actions: { flexDirection: "row", gap: 8 },
  view: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", backgroundColor: C.greenLight, borderRadius: 12, paddingVertical: 10 },
  viewText: { color: "#06100a", fontWeight: "800", fontSize: 14 },
  pass: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", backgroundColor: "#c084fc", borderRadius: 12, paddingVertical: 10 },
  passText: { color: "#160424", fontWeight: "800", fontSize: 14 },
  recover: { flex: 1, alignItems: "center", borderColor: "#c084fc", borderWidth: 1, borderRadius: 12, paddingVertical: 9 },
  recoverText: { color: "#c084fc", fontWeight: "700", fontSize: 12 },
});
