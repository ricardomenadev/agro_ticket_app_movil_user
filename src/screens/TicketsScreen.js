// Mis entradas: las compras de agronea.store se cargan con número de compra + DNI + mail y quedan en el teléfono
// (se ven sin señal). Desde acá se ve el QR de cada una y se pasan a otra persona.
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C } from "../components/feed/FeedCards";
import { useMyOrders, lookupOrder, passTicket, recoverTicket } from "../api/apiMyTickets";
import OrderCard from "../components/tickets/OrderCard";
import TicketQrModal from "../components/tickets/TicketQrModal";
import PassTicketSheet from "../components/tickets/PassTicketSheet";
import GuideVideoModal from "../components/tickets/GuideVideoModal";

const GUIDE = require("../../assets/videos/guia-entradas-app.mp4");
const GUIDE_POSTER = require("../../assets/videos/guia-entradas-app.jpg");
const GUIDE_SEEN = "myTickets.guideSeen";
const KIND = { event: "Entrada", parking: "Estacionamiento", product: "Producto" };

const Field = ({ label, ...props }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#5d7466" autoCorrect={false} style={styles.input} {...props} />
  </View>
);

const TicketsScreen = () => {
  const { orders, refreshing, refresh, upsert, remove } = useMyOrders();
  const [form, setForm] = useState({ orderNumber: "", dni: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }
  const [showing, setShowing] = useState(null); // { ticket, label, eventTitle }
  const [passing, setPassing] = useState(null); // { token, ticket, index }
  const [guide, setGuide] = useState(false);

  // El video se abre solo la primera vez que alguien entra sin compras cargadas
  useEffect(() => {
    if (orders === null || orders.length) return;
    AsyncStorage.getItem(GUIDE_SEEN).then((seen) => {
      if (!seen) setGuide(true);
    });
  }, [orders]);

  const closeGuide = () => {
    setGuide(false);
    AsyncStorage.setItem(GUIDE_SEEN, "1").catch(() => {});
  };

  const set = (key) => (v) => {
    setForm((f) => ({ ...f, [key]: key === "orderNumber" ? v.toUpperCase() : v }));
    setMsg(null);
  };

  const load = async () => {
    if (!form.orderNumber.trim() || !form.dni.trim() || !form.email.trim()) {
      return setMsg({ ok: false, text: "Completá los tres datos: número de compra, DNI y mail." });
    }
    setLoading(true);
    try {
      const { token, order } = await lookupOrder(form);
      await upsert(token, order);
      setForm({ orderNumber: "", dni: "", email: "" });
      setMsg({ ok: true, text: `Listo: ${order.tickets.length === 1 ? "quedó guardada" : `quedaron guardadas las ${order.tickets.length}`} en este teléfono.` });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePass = async (holder) => {
    try {
      const res = await passTicket(passing.token, passing.ticket.id, holder);
      await upsert(passing.token, res.order);
      setPassing(null);
      setMsg({
        ok: res.emailSent,
        text: res.emailSent
          ? `Listo: le mandamos la entrada a ${res.passedTo}.`
          : `La entrada ya está a su nombre, pero no pudimos mandar el mail a ${res.passedTo}.`,
      });
      return { ok: true };
    } catch (err) {
      if (err.status === 409) refresh();
      return { message: err.message, errors: err.errors };
    }
  };

  const handleRecover = async (token, ticket) => {
    try {
      const res = await recoverTicket(token, ticket.id);
      await upsert(token, res.order);
      setMsg({ ok: true, text: "La entrada volvió a tu nombre con un QR nuevo." });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };

  const hasOrders = orders?.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.greenLight} />}
        >
          <View>
            <Text style={styles.title}>Mis entradas</Text>
            <Text style={styles.subtitle}>Quedan guardadas en el teléfono: funcionan sin señal</Text>
          </View>

          {msg ? (
            <View style={[styles.notice, msg.ok ? styles.noticeOk : styles.noticeWarn]}>
              <Ionicons name={msg.ok ? "checkmark-circle" : "alert-circle"} size={18} color={msg.ok ? C.greenLight : C.gold} />
              <Text style={[styles.noticeText, { color: msg.ok ? "#d1fae5" : "#fde68a" }]}>{msg.text}</Text>
            </View>
          ) : null}

          {orders === null ? <ActivityIndicator color={C.greenLight} style={{ marginVertical: 20 }} /> : null}

          {orders?.map(({ token, order }) => (
            <OrderCard
              key={order.orderNumber}
              order={order}
              onOpen={(ticket, i) => setShowing({ ticket, label: `${KIND[ticket.type] || "Entrada"} ${i + 1}`, eventTitle: order.event?.title || "Agronea" })}
              onPass={(ticket, index) => setPassing({ token, ticket, index })}
              onRecover={(ticket) => handleRecover(token, ticket)}
              onRemove={() => remove(order.orderNumber)}
            />
          ))}

          {/* Video: cómo cargarlas */}
          <TouchableOpacity style={styles.video} onPress={() => setGuide(true)} activeOpacity={0.85}>
            <View style={styles.poster}>
              <Image source={GUIDE_POSTER} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <View style={styles.play}>
                <Ionicons name="play" size={16} color="#000" />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.videoTitle}>¿Cómo cargo mis entradas?</Text>
              <Text style={styles.videoText}>Mirá el video: de dónde sacar los datos, cómo cargarlas y cómo pasarlas.</Text>
            </View>
          </TouchableOpacity>

          {/* Cargar una compra */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{hasOrders ? "Cargar otra compra" : "¿Compraste en agronea.store?"}</Text>
            <Text style={styles.cardText}>
              Escribí estos tres datos y te traemos tus entradas y productos. Los encontrás en el <Text style={styles.strong}>mail de tu compra</Text>: el número de compra está arriba de todo; el DNI y el mail son los que pusiste al comprar.
            </Text>
            <Field label="Número de compra" value={form.orderNumber} onChangeText={set("orderNumber")} placeholder="Ej: ORD-0615-VJ9PSE" autoCapitalize="characters" />
            <Field label="DNI" value={form.dni} onChangeText={set("dni")} placeholder="Sin puntos" keyboardType="number-pad" />
            <Field label="Mail" value={form.email} onChangeText={set("email")} placeholder="El mismo de la compra" keyboardType="email-address" autoCapitalize="none" returnKeyType="done" onSubmitEditing={load} />
            <TouchableOpacity style={styles.btn} onPress={load} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color={C.bg} /> : <Text style={styles.btnText}>Descargar mis entradas</Text>}
            </TouchableOpacity>
          </View>
          <View style={{ height: 110 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <TicketQrModal ticket={showing?.ticket} label={showing?.label} eventTitle={showing?.eventTitle} onClose={() => setShowing(null)} />
      {passing ? <PassTicketSheet key={passing.ticket.id} ticket={passing.ticket} index={passing.index} onSubmit={handlePass} onClose={() => setPassing(null)} /> : null}
      <GuideVideoModal visible={guide} source={GUIDE} title="Tus entradas en la app" onClose={closeGuide} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 16 },
  title: { color: C.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 2 },
  notice: { flexDirection: "row", gap: 8, alignItems: "flex-start", borderRadius: 14, borderWidth: 1, padding: 12 },
  noticeOk: { borderColor: "rgba(74,222,128,.3)", backgroundColor: "rgba(74,222,128,.08)" },
  noticeWarn: { borderColor: "rgba(245,196,0,.3)", backgroundColor: "rgba(245,196,0,.07)" },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19 },
  video: { flexDirection: "row", gap: 12, alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: "rgba(74,222,128,.3)", backgroundColor: "rgba(74,222,128,.06)", padding: 10 },
  poster: { width: 60, height: 96, borderRadius: 12, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: C.greenDeep },
  play: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", paddingLeft: 2 },
  videoTitle: { color: C.text, fontSize: 15, fontWeight: "800" },
  videoText: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 10 },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  cardText: { color: C.muted, fontSize: 13, lineHeight: 19 },
  strong: { color: C.text, fontWeight: "700" },
  label: { color: C.muted, fontSize: 11, marginBottom: 6 },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: C.borderStrong, backgroundColor: C.bg, color: C.text, paddingHorizontal: 14, fontSize: 15 },
  btn: { minHeight: 50, borderRadius: 14, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center", marginTop: 4 },
  btnText: { color: C.bg, fontWeight: "800", fontSize: 15 },
});

export default TicketsScreen;
