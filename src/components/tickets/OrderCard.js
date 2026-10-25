// Una compra cargada en el teléfono: evento, número de compra y sus entradas/productos con Pasar y Recuperar
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
        return (
          <View key={t.id} style={s.row}>
            <TouchableOpacity style={s.rowMain} onPress={() => onOpen(t, i)} disabled={!t.qrCode} activeOpacity={0.8}>
              <View style={[s.icon, t.type === "product" && { backgroundColor: "rgba(245,196,0,.14)" }]}>
                <Ionicons name={ICON[t.type] || ICON.event} size={20} color={t.type === "product" ? C.gold : C.greenLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>
                  {KIND[t.type] || "Entrada"} {i + 1} · <Text style={{ color: st.color }}>{st.label}</Text>
                </Text>
                <Text style={s.rowName} numberOfLines={1}>
                  {t.type === "product" ? t.name : t.holderName}
                </Text>
                {t.status === "PASSED" ? <Text style={[s.tap, { color: "#c084fc" }]}>Le llegó por mail con su propio QR</Text> : null}
                {mine && t.qrCode ? <Text style={s.tap}>Tocá para ver el QR</Text> : null}
              </View>
            </TouchableOpacity>
            {t.canPass && mine ? (
              <TouchableOpacity style={s.pass} onPress={() => onPass(t, i)} activeOpacity={0.85}>
                <Text style={s.passText}>Pasar</Text>
              </TouchableOpacity>
            ) : t.canRecover ? (
              <TouchableOpacity style={s.recover} onPress={() => onRecover(t)} activeOpacity={0.85}>
                <Text style={s.recoverText}>Recuperar</Text>
              </TouchableOpacity>
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
  row: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 10 },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(74,222,128,.14)", alignItems: "center", justifyContent: "center" },
  rowLabel: { color: C.muted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  rowName: { color: C.text, fontSize: 15, fontWeight: "700", marginTop: 1, textTransform: "capitalize" },
  tap: { color: C.greenLight, fontSize: 11, marginTop: 2 },
  pass: { backgroundColor: "#c084fc", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 },
  passText: { color: "#160424", fontWeight: "800", fontSize: 13 },
  recover: { borderColor: "#c084fc", borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  recoverText: { color: "#c084fc", fontWeight: "700", fontSize: 12 },
});
