// QR de una entrada en grande, sobre blanco, para mostrar en la puerta (funciona sin señal), con la publicidad de Agronea abajo
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";
import AdBanner from "../shop/AdBanner";

const dotted = (v) => String(v || "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function TicketQrModal({ ticket, label, eventTitle, onClose }) {
  const { width } = useWindowDimensions();
  if (!ticket) return null;
  const size = Math.min(width - 96, 300);
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.safe}>
        <View style={s.top}>
          <Text style={s.eyebrow}>{label} · {eventTitle}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={14} accessibilityLabel="Cerrar">
            <Ionicons name="close" size={28} color="#06100a" />
          </TouchableOpacity>
        </View>
        <View style={s.body}>
          <Text style={s.kind}>{ticket.name}</Text>
          <Text style={s.name}>{ticket.holderName}</Text>
          {ticket.holderDni ? <Text style={s.dni}>DNI {dotted(ticket.holderDni)}</Text> : null}
          <View style={s.qr}>
            <QRCode value={ticket.qrCode} size={size} ecl="M" />
          </View>
          <Text style={s.code}>{ticket.code}</Text>
          <Text style={s.hint}>
            {ticket.type === "product" ? "Mostralo para retirar tu producto." : "Mostralo en la puerta. Subí el brillo de la pantalla."}
          </Text>
        </View>
        <View style={s.ad}>
          <AdBanner compact />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 },
  eyebrow: { flex: 1, color: C.green, fontSize: 12, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 6 },
  kind: { color: C.green, fontSize: 12, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  name: { color: "#06100a", fontSize: 28, fontWeight: "800", textAlign: "center", textTransform: "capitalize" },
  dni: { color: "#5f7567", fontSize: 15 },
  qr: { marginTop: 16, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: "#e5e7eb" },
  code: { marginTop: 14, color: C.green, fontSize: 15, fontWeight: "800", letterSpacing: 2 },
  ad: { paddingHorizontal: 24, paddingBottom: 10 },
  hint: { marginTop: 8, color: "#5f7567", fontSize: 13, textAlign: "center" },
});
