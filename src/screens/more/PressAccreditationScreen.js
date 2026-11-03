// Acreditación de prensa: el mismo formulario que agronea.store/acreditacion-prensa.
// Se abre o cierra desde el panel (Prensa → interruptor); cerrada muestra un aviso con el contacto.
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Linking, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../../components/feed/FeedCards";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "https://api.agronea.store/api/mobile").replace(/\/mobile$/, "");
const ROLES = ["Periodista", "Fotógrafo", "Camarógrafo", "Editor", "Productor", "Conductor", "Locutor", "Community manager", "Otro"];
const EMPTY_MEMBER = { fullName: "", dni: "", email: "", phone: "", role: "" };
const MAX_MEMBERS = 10;
const CONTACT = { whatsapp: "https://wa.me/5493794222011", email: "agroneacharata@gmail.com" };

const Field = ({ label, error, ...props }) => (
  <View style={{ gap: 6 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#5b5b5b" style={[styles.input, error && styles.inputError]} accessibilityLabel={label} {...props} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const Chips = ({ options, value, onChange, error, label }) => (
  <View style={{ gap: 6 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chips}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <TouchableOpacity key={o.value} onPress={() => onChange(o.value)} style={[styles.chip, on && styles.chipOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
            <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const Contact = () => (
  <View style={{ gap: 10, alignSelf: "stretch" }}>
    <TouchableOpacity style={[styles.contactBtn, { borderColor: "rgba(74,222,128,0.35)" }]} onPress={() => Linking.openURL(CONTACT.whatsapp).catch(() => {})}>
      <Ionicons name="logo-whatsapp" size={18} color={C.greenLight} />
      <Text style={[styles.contactText, { color: C.greenLight }]}>+54 9 3794 222011</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`mailto:${CONTACT.email}`).catch(() => {})}>
      <Ionicons name="mail-outline" size={18} color={C.soft} />
      <Text style={styles.contactText}>{CONTACT.email}</Text>
    </TouchableOpacity>
  </View>
);

const Notice = ({ icon, color, title, text, children }) => (
  <View style={styles.notice}>
    <View style={[styles.noticeIcon, { backgroundColor: `${color}22` }]}>
      <Ionicons name={icon} size={30} color={color} />
    </View>
    <Text style={styles.noticeTitle}>{title}</Text>
    <Text style={styles.noticeText}>{text}</Text>
    {children}
  </View>
);

const PressAccreditationScreen = () => {
  const [state, setState] = useState(null); // { open, events } | { error }
  const [form, setForm] = useState({ eventId: "", mediaName: "", website: "" });
  const [members, setMembers] = useState([{ ...EMPTY_MEMBER }]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);

  const load = useCallback(async () => {
    setState(null);
    try {
      const res = await fetch(`${API_URL}/press/events`);
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setState(data);
      if (data.events?.length === 1) setForm((f) => ({ ...f, eventId: data.events[0].id }));
    } catch {
      setState({ error: true });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setMember = (i, name, value) => {
    setMembers((list) => list.map((m, k) => (k === i ? { ...m, [name]: value } : m)));
    setErrors((e) => ({ ...e, [`members.${i}`]: { ...(e[`members.${i}`] || {}), [name]: undefined } }));
  };

  const submit = async () => {
    setMessage(null);
    if (!form.eventId) return setErrors({ eventId: "Elegí el evento" });
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/press/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, members }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.errors || {});
        setMessage(json.message || "No se pudo enviar. Probá de nuevo.");
        if (res.status === 403) load(); // la cerraron mientras completaba
        return;
      }
      setSent({ media: form.mediaName.trim(), count: members.length });
    } catch {
      setMessage("Sin conexión. Revisá internet y probá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (!state) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={C.gold} />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={[styles.screen, styles.center, { padding: 18 }]}>
        <Notice icon="cloud-offline-outline" color={C.muted} title="No pudimos cargar la acreditación" text="Revisá tu conexión y probá de nuevo.">
          <TouchableOpacity style={styles.primary} onPress={load}>
            <Text style={styles.primaryText}>Reintentar</Text>
          </TouchableOpacity>
        </Notice>
      </View>
    );
  }

  if (sent) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Notice
          icon="checkmark"
          color={C.greenLight}
          title="¡Solicitud enviada!"
          text={`Recibimos la solicitud de ${sent.media} para ${sent.count === 1 ? "1 integrante" : `${sent.count} integrantes`}. Cuando la revisemos, a cada uno le llega un mail con su carnet y su QR.`}
        >
          <Contact />
        </Notice>
      </ScrollView>
    );
  }

  if (!state.open || !state.events?.length) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Notice
          icon="newspaper-outline"
          color={C.gold}
          title="La acreditación de prensa está cerrada"
          text="Se abre unas semanas antes de cada edición de Agronea. Cuando estén las fechas, vas a poder pedirla desde acá."
        >
          <Text style={styles.small}>¿Sos de un medio y tenés una consulta?</Text>
          <Contact />
        </Notice>
      </ScrollView>
    );
  }

  const memberErr = (i, name) => errors[`members.${i}`]?.[name];

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Completá los datos del medio y de cada integrante. Cuando aprobemos la solicitud, a cada uno le llega su carnet con QR por mail.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>El medio</Text>
          {state.events.length > 1 ? (
            <Chips label="EVENTO" options={state.events.map((e) => ({ value: e.id, label: e.title }))} value={form.eventId} onChange={(eventId) => setForm({ ...form, eventId })} error={errors.eventId} />
          ) : (
            <Text style={styles.eventBox}>
              Evento: <Text style={{ color: C.text, fontWeight: "700" }}>{state.events[0].title}</Text>
            </Text>
          )}
          <Field label="NOMBRE DEL MEDIO" value={form.mediaName} onChangeText={(mediaName) => setForm({ ...form, mediaName })} maxLength={120} placeholder="Radio Charata FM 98.5" error={errors.mediaName} />
          <Field label="WEB O RED SOCIAL (OPCIONAL)" value={form.website} onChangeText={(website) => setForm({ ...form, website })} maxLength={200} autoCapitalize="none" keyboardType="url" placeholder="radiocharata.com.ar" error={errors.website} />
        </View>

        {members.map((m, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>{i === 0 ? "Responsable" : `Integrante ${i + 1}`}</Text>
              {i > 0 && (
                <TouchableOpacity onPress={() => setMembers((list) => list.filter((_, k) => k !== i))} style={styles.remove} accessibilityLabel={`Quitar integrante ${i + 1}`}>
                  <Ionicons name="trash-outline" size={16} color={C.muted} />
                </TouchableOpacity>
              )}
            </View>
            <Field label="NOMBRE Y APELLIDO" value={m.fullName} onChangeText={(v) => setMember(i, "fullName", v)} maxLength={100} autoCapitalize="words" error={memberErr(i, "fullName")} />
            <Field label="DNI" value={m.dni} onChangeText={(v) => setMember(i, "dni", v)} keyboardType="number-pad" maxLength={12} placeholder="30123456" error={memberErr(i, "dni")} />
            <Field label="MAIL" value={m.email} onChangeText={(v) => setMember(i, "email", v)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={150} placeholder="donde le llega el carnet" error={memberErr(i, "email")} />
            <Field label="TELÉFONO" value={m.phone} onChangeText={(v) => setMember(i, "phone", v)} keyboardType="phone-pad" maxLength={30} placeholder="3731 456789" error={memberErr(i, "phone")} />
            <Chips label="ROL" options={ROLES.map((r) => ({ value: r, label: r }))} value={m.role} onChange={(v) => setMember(i, "role", v)} error={memberErr(i, "role")} />
          </View>
        ))}

        {members.length < MAX_MEMBERS && (
          <TouchableOpacity style={styles.add} onPress={() => setMembers((list) => [...list, { ...EMPTY_MEMBER }])}>
            <Ionicons name="add" size={18} color={C.gold} />
            <Text style={styles.addText}>Sumar integrante</Text>
          </TouchableOpacity>
        )}

        {message || errors.members ? <Text style={styles.alert}>{errors.members || message}</Text> : null}

        <TouchableOpacity style={[styles.primary, sending && { opacity: 0.6 }]} onPress={submit} disabled={sending} accessibilityRole="button">
          {sending ? <ActivityIndicator color="#000" /> : <Text style={styles.primaryText}>Enviar solicitud</Text>}
        </TouchableOpacity>
        <Text style={styles.small}>Usamos estos datos solo para la acreditación.</Text>
        <View style={{ height: 110 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  center: { alignItems: "center", justifyContent: "center" },
  content: { padding: 18, gap: 14 },
  intro: { color: C.soft, fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 14 },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { color: C.text, fontSize: 17, fontWeight: "800" },
  remove: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  label: { color: C.muted, fontSize: 11, letterSpacing: 1.2, fontWeight: "700" },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: "#0b0b0b", color: C.text, paddingHorizontal: 14, fontSize: 16 },
  inputError: { borderColor: "rgba(248,113,113,0.7)" },
  error: { color: "#fca5a5", fontSize: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { minHeight: 38, paddingHorizontal: 14, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: "#0b0b0b" },
  chipOn: { borderColor: "rgba(245,196,0,0.6)", backgroundColor: "rgba(245,196,0,0.12)" },
  chipText: { color: C.soft, fontSize: 14 },
  chipTextOn: { color: C.gold, fontWeight: "700" },
  eventBox: { color: C.soft, fontSize: 14, borderRadius: 12, borderWidth: 1, borderColor: "rgba(74,222,128,0.25)", backgroundColor: "rgba(74,222,128,0.06)", padding: 12 },
  add: { flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", minHeight: 48, borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(245,196,0,0.45)" },
  addText: { color: C.gold, fontWeight: "700", fontSize: 15 },
  alert: { color: "#fecaca", backgroundColor: "rgba(248,113,113,0.12)", borderColor: "rgba(248,113,113,0.3)", borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14 },
  primary: { minHeight: 54, borderRadius: 16, backgroundColor: C.gold, alignItems: "center", justifyContent: "center", alignSelf: "stretch", paddingHorizontal: 20 },
  primaryText: { color: "#000", fontWeight: "800", fontSize: 16 },
  small: { color: C.muted, fontSize: 12, textAlign: "center" },
  notice: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 22, padding: 22, gap: 12, alignItems: "center", alignSelf: "stretch" },
  noticeIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  noticeTitle: { color: C.text, fontSize: 20, fontWeight: "800", textAlign: "center" },
  noticeText: { color: C.soft, fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 6 },
  contactBtn: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", minHeight: 46, borderRadius: 999, borderWidth: 1, borderColor: C.border, paddingHorizontal: 16 },
  contactText: { color: C.soft, fontSize: 14, fontWeight: "600" },
});

export default PressAccreditationScreen;
