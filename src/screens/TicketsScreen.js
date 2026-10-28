// Mis entradas: las compras de agronea.store se cargan con número de compra + DNI + mail y quedan en el teléfono
// (se ven sin señal). Desde acá se ve el QR de cada una y se pasan a otra persona.
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C } from "../components/feed/FeedCards";
import { useMyOrders, lookupOrder, fetchOrder, passTicket, recoverTicket } from "../api/apiMyTickets";
import OrderCard from "../components/tickets/OrderCard";
import TicketQrModal from "../components/tickets/TicketQrModal";
import PassTicketSheet from "../components/tickets/PassTicketSheet";
import GuideVideoModal from "../components/tickets/GuideVideoModal";
import QuotaSheet from "../components/tickets/QuotaSheet";
import { useMyInvitations, useMyQuotas, lookupInvitation, quotaTokenFrom } from "../api/apiInvitations";

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

const TicketsScreen = ({ route, navigation }) => {
  const { orders, refreshing, refresh, reload, upsert, remove } = useMyOrders();
  useFocusEffect(React.useCallback(() => void reload(), [reload]));
  const linkToken = route?.params?.token;
  const linkInvite = route?.params?.invite;
  const invitations = useMyInvitations();
  const quotas = useMyQuotas();
  const [quotaToken, setQuotaToken] = useState(null); // cupo abierto (link de la empresa)
  const [inv, setInv] = useState({ code: "", dni: "", link: "" });
  const [invLoading, setInvLoading] = useState(false);
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

  // Llegó desde el link del mail: se carga esa compra sola, sin pedir los datos
  useEffect(() => {
    if (!linkToken) return;
    navigation?.setParams({ token: undefined });
    (async () => {
      try {
        const order = await fetchOrder(linkToken);
        await upsert(linkToken, order);
        setMsg({ ok: true, text: `Listo: cargamos tu compra ${order.orderNumber}. Quedó guardada en este teléfono.` });
      } catch (err) {
        setMsg({ ok: false, text: err.message });
      }
    })();
  }, [linkToken, navigation, upsert]);

  // Al abrir (con señal) se revisa que las invitaciones guardadas sigan vigentes: la empresa puede haber sacado a alguien
  const checkedInvitations = React.useRef(false);
  useEffect(() => {
    if (checkedInvitations.current || !invitations.items?.length) return;
    checkedInvitations.current = true;
    invitations.items.forEach(async (i) => {
      try {
        const fresh = await lookupInvitation({ code: i.code, dni: i.dni });
        if (i.cancelled || fresh.used !== i.used) await invitations.upsert({ ...i, ...fresh, cancelled: false });
      } catch (err) {
        if (err.status === 409 && !i.cancelled) await invitations.upsert({ ...i, cancelled: true });
      }
    });
  }, [invitations]);

  // Llegó desde el link de un cupo (agronea.store/i/<token>): se abre el cupo
  useEffect(() => {
    if (!linkInvite) return;
    navigation?.setParams({ invite: undefined });
    setQuotaToken(linkInvite);
  }, [linkInvite, navigation]);

  const loadInvitation = async () => {
    if (!inv.code.trim() || !inv.dni.trim()) return setMsg({ ok: false, text: "Escribí el código de la invitación y tu DNI." });
    setInvLoading(true);
    try {
      const found = await lookupInvitation({ code: inv.code, dni: inv.dni });
      await invitations.upsert(found);
      setInv((v) => ({ ...v, code: "", dni: "" }));
      setMsg({ ok: true, text: `Listo: tu invitación de ${found.company || "Agronea"} quedó guardada en este teléfono.` });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setInvLoading(false);
    }
  };

  const openQuotaFromLink = () => {
    const token = quotaTokenFrom(inv.link);
    if (!token) return setMsg({ ok: false, text: "Pegá el link de invitaciones que te llegó por mail (agronea.store/i/...)." });
    setInv((v) => ({ ...v, link: "" }));
    setQuotaToken(token);
  };

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

          {/* Invitaciones guardadas en el teléfono */}
          {invitations.items?.map((i) => (
            <TouchableOpacity
              key={i.code}
              style={[styles.invCard, i.cancelled && { opacity: 0.55 }]}
              activeOpacity={0.85}
              disabled={i.cancelled}
              onPress={() =>
                setShowing({
                  ticket: { name: `Invitación · ${i.company || "Agronea"}`, holderName: i.name, holderDni: i.dni, qrCode: i.qrCode, code: i.code, type: "INVITATION" },
                  label: "Invitación",
                  eventTitle: i.event?.title || "Agronea",
                })
              }
            >
              <View style={[styles.invIcon, { backgroundColor: "rgba(192,132,252,.15)" }]}>
                <Ionicons name="mail-open-outline" size={20} color="#c084fc" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.invEyebrow}>Invitación · {i.company || "Agronea"}</Text>
                <Text style={styles.invName}>{i.name}</Text>
                <Text style={[styles.invHint, i.cancelled && { color: "#f87171" }]}>
                  {i.cancelled ? "La empresa canceló esta invitación" : i.used ? `${i.event?.title} · Ya ingresó` : `${i.event?.title} · Tocá para ver el QR`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => invitations.remove(i.code)} hitSlop={12} accessibilityLabel="Quitar la invitación del teléfono">
                <Ionicons name="trash-outline" size={18} color={C.muted} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* Cupos de invitaciones de la empresa */}
          {quotas.items?.map((q) => (
            <TouchableOpacity key={q.token} style={styles.invCard} activeOpacity={0.85} onPress={() => setQuotaToken(q.token)}>
              <View style={[styles.invIcon, { backgroundColor: "rgba(245,196,0,.14)" }]}>
                <Ionicons name="people-outline" size={20} color={C.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.invEyebrow, { color: C.gold }]}>Invitaciones de tu empresa</Text>
                <Text style={styles.invName}>{q.company}</Text>
                <Text style={styles.invHint}>{q.eventTitle} · Ver la lista y anotar gente</Text>
              </View>
              <TouchableOpacity onPress={() => quotas.remove(q.token)} hitSlop={12} accessibilityLabel="Quitar el cupo del teléfono">
                <Ionicons name="trash-outline" size={18} color={C.muted} />
              </TouchableOpacity>
            </TouchableOpacity>
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
            <Field label="DNI" value={form.dni} onChangeText={set("dni")} placeholder="Con o sin puntos" keyboardType="number-pad" />
            <Field label="Mail" value={form.email} onChangeText={set("email")} placeholder="El mismo de la compra" keyboardType="email-address" autoCapitalize="none" returnKeyType="done" onSubmitEditing={load} />
            <TouchableOpacity style={styles.btn} onPress={load} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color={C.bg} /> : <Text style={styles.btnText}>Descargar mis entradas</Text>}
            </TouchableOpacity>
          </View>
          {/* Invitaciones: el invitado (código + DNI) y la empresa (su link) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>¿Te invitaron?</Text>
            <Text style={styles.cardText}>Escribí el código de tu invitación (está en el mail que te llegó, empieza con INV) y tu DNI.</Text>
            <Field label="Código de la invitación" value={inv.code} onChangeText={(v) => setInv((x) => ({ ...x, code: v.toUpperCase() }))} placeholder="Ej: INV-AB12-3C4D5E" autoCapitalize="characters" />
            <Field label="DNI" value={inv.dni} onChangeText={(v) => setInv((x) => ({ ...x, dni: v }))} placeholder="Con o sin puntos" keyboardType="number-pad" />
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#c084fc" }]} onPress={loadInvitation} disabled={invLoading} activeOpacity={0.85}>
              {invLoading ? <ActivityIndicator color="#160424" /> : <Text style={[styles.btnText, { color: "#160424" }]}>Cargar mi invitación</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>¿Tenés invitaciones para tu empresa?</Text>
            <Text style={styles.cardText}>Tocá el link que te llegó por mail o pegalo acá. Vas a ver la lista, anotar a tu gente y sacar a quien no vaya.</Text>
            <Field label="Link de invitaciones" value={inv.link} onChangeText={(v) => setInv((x) => ({ ...x, link: v }))} placeholder="agronea.store/i/..." autoCapitalize="none" />
            <TouchableOpacity style={[styles.btn, { backgroundColor: C.gold }]} onPress={openQuotaFromLink} activeOpacity={0.85}>
              <Text style={[styles.btnText, { color: "#2a1f00" }]}>Abrir mis invitaciones</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 110 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <TicketQrModal ticket={showing?.ticket} label={showing?.label} eventTitle={showing?.eventTitle} onClose={() => setShowing(null)} />
      {passing ? <PassTicketSheet key={passing.ticket.id} ticket={passing.ticket} index={passing.index} onSubmit={handlePass} onClose={() => setPassing(null)} /> : null}
      {quotaToken ? (
        <QuotaSheet token={quotaToken} onClose={() => setQuotaToken(null)} onSaveInvitation={invitations.upsert} onSeen={quotas.upsert} />
      ) : null}
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
  invCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 14 },
  invIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  invEyebrow: { color: "#c084fc", fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  invName: { color: C.text, fontSize: 16, fontWeight: "800", marginTop: 2, textTransform: "capitalize" },
  invHint: { color: C.muted, fontSize: 12, marginTop: 2 },
  btn: { minHeight: 50, borderRadius: 14, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center", marginTop: 4 },
  btnText: { color: C.bg, fontWeight: "800", fontSize: 15 },
});

export default TicketsScreen;
