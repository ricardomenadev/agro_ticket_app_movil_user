// QR de una entrada en grande, sobre blanco, para mostrar en la puerta (funciona sin señal).
// Arriba el logo de Agronea; abajo, discreta, la firma de Wesyx (quien hizo el sistema), como en el PDF y la imagen de la web.
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";

const dotted = (v) => String(v || "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function TicketQrModal({ ticket, label, eventTitle, onClose }) {
  const { width } = useWindowDimensions();
  if (!ticket) return null;
  const size = Math.min(width - 96, 300);
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.safe}>
        <View style={s.top}>
          <Image source={require("../../../assets/images/logo_agronea_producciones.png")} style={s.logo} resizeMode="contain" accessibilityLabel="Agronea Producciones" />
          <TouchableOpacity style={s.close} onPress={onClose} hitSlop={14} accessibilityLabel="Cerrar">
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
        <TouchableOpacity style={s.credit} onPress={() => Linking.openURL("https://wesyx.com").catch(() => {})} activeOpacity={0.7} accessibilityLabel="Sistema desarrollado por Wesyx, abrir wesyx.com">
          <Text style={s.creditLabel}>SISTEMA DESARROLLADO POR</Text>
          <Image source={require("../../../assets/images/wesyx-logo.png")} style={s.wesyx} resizeMode="contain" />
          <Text style={s.creditText}>wesyx.com · WhatsApp +54 9 379-4739888</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  // solo el logo, centrado; la X queda arriba a la derecha sin correrlo
  top: { alignItems: "center", paddingTop: 28 },
  close: { position: "absolute", top: 8, right: 20 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 6 },
  kind: { color: C.green, fontSize: 12, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  name: { color: "#06100a", fontSize: 28, fontWeight: "800", textAlign: "center", textTransform: "capitalize" },
  dni: { color: "#5f7567", fontSize: 15 },
  qr: { marginTop: 16, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: "#e5e7eb" },
  code: { marginTop: 14, color: C.green, fontSize: 15, fontWeight: "800", letterSpacing: 2 },
  logo: { width: 190, height: 70 },
  credit: { alignItems: "center", gap: 3, marginHorizontal: 24, paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, borderTopColor: "#eef0ee" },
  creditLabel: { color: "#9aa69e", fontSize: 9, fontWeight: "700", letterSpacing: 1.5 },
  wesyx: { width: 120, height: 40 },
  creditText: { color: "#9aa69e", fontSize: 11 },
  hint: { marginTop: 8, color: "#5f7567", fontSize: 13, textAlign: "center" },
});
