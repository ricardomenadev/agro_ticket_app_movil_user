// Link del cupo de invitaciones de una empresa, en la app: lugares libres, registrarse, compartir y sacar con la contraseña.
// Lo usan el invitado (se registra y guarda su QR) y el responsable de la empresa (ve la lista y saca gente).
import React, { useCallback, useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Share, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";
import { fetchQuota, registerGuest, removeGuest, quotaLink } from "../../api/apiInvitations";

const REFRESH_MS = 30000;
const EMPTY = { firstName: "", lastName: "", dni: "", phone: "", email: "" };
const FIELDS = [
  ["firstName", "Nombre", { autoCapitalize: "words" }],
  ["lastName", "Apellido", { autoCapitalize: "words" }],
  ["dni", "DNI (con o sin puntos)", { keyboardType: "number-pad" }],
  ["phone", "Teléfono con código de área", { keyboardType: "phone-pad" }],
  ["email", "Mail (ahí llega la invitación)", { keyboardType: "email-address", autoCapitalize: "none" }],
];

export default function QuotaSheet({ token, onClose, onSaveInvitation, onSeen }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [keep, setKeep] = useState(true);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }
  const [removing, setRemoving] = useState(null); // { guest, code }

  const load = useCallback(async () => {
    try {
      const d = await fetchQuota(token);
      setData(d);
      setError(null);
      onSeen?.({ token, company: d.quota.company, eventTitle: d.event.title });
    } catch (err) {
      setError(err.message);
    }
  }, [token, onSeen]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const share = () =>
    Share.share({
      message: `¡Hola! Te invitamos a ${data.event.title} de parte de ${data.quota.company}. Registrate en este link y te llega tu invitación con QR al instante: ${quotaLink(token)}`,
    });

  const register = async () => {
    setSending(true);
    setMsg(null);
    try {
      const inv = await registerGuest(token, form);
      if (keep) await onSaveInvitation?.(inv);
      setForm(EMPTY);
      setErrors({});
      setMsg({ ok: true, text: `Listo: invitación a nombre de ${inv.name}.${keep ? " Quedó guardada en Entradas." : ""} También le llegó por mail.` });
      load();
    } catch (err) {
      setErrors(err.errors || {});
      setMsg({ ok: false, text: err.message });
    } finally {
      setSending(false);
    }
  };

  const confirmRemove = async () => {
    try {
      const res = await removeGuest(token, removing.guest.id, removing.code);
      setMsg({ ok: true, text: res.freedSlot ? `Sacamos a ${removing.guest.name}: el lugar quedó libre.` : `Sacamos a ${removing.guest.name}. Como ya había ingresado, el lugar no vuelve.` });
      setRemoving(null);
      load();
    } catch (err) {
      setRemoving((r) => ({ ...r, error: err.message }));
    }
  };

  const s = data?.summary;
  const blocked = data && (data.quota.status !== "ACTIVE" || s.free === 0);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={st.safe}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={st.top}>
            <Text style={st.eyebrow} numberOfLines={1}>{data ? `Invitaciones de ${data.quota.company}` : "Invitaciones"}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={14} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color={C.text} />
            </TouchableOpacity>
          </View>

          {!data ? (
            <View style={st.center}>{error ? <Text style={st.err}>{error}</Text> : <ActivityIndicator color={C.greenLight} />}</View>
          ) : (
            <ScrollView contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
              <Text style={st.title}>{data.event.title}</Text>
              <View style={st.card}>
                <Text style={st.big}>{s.free} {s.free === 1 ? "lugar libre" : "lugares libres"}</Text>
                <Text style={st.muted}>{s.occupied} de {s.capacity} ocupados · Registrados {s.registered} · Ingresaron {s.checkedIn}</Text>
                <TouchableOpacity style={st.share} onPress={share} activeOpacity={0.85}>
                  <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                  <Text style={st.shareText}>Compartir el link</Text>
                </TouchableOpacity>
              </View>

              {msg ? <Text style={[st.msg, { color: msg.ok ? C.greenLight : C.gold }]}>{msg.text}</Text> : null}

              <View style={st.card}>
                <Text style={st.cardTitle}>Registrate</Text>
                {blocked ? (
                  <Text style={st.muted}>{data.quota.status !== "ACTIVE" ? "Este cupo ya no recibe inscripciones." : "No quedan lugares en este cupo."}</Text>
                ) : (
                  <>
                    {FIELDS.map(([key, label, props]) => (
                      <View key={key}>
                        <Text style={st.label}>{label}</Text>
                        <TextInput
                          value={form[key]}
                          onChangeText={(v) => {
                            setForm((f) => ({ ...f, [key]: v }));
                            setErrors((e) => ({ ...e, [key]: undefined }));
                          }}
                          style={[st.input, errors[key] && st.inputErr]}
                          placeholderTextColor="#5d7466"
                          autoCorrect={false}
                          {...props}
                        />
                        {errors[key] ? <Text style={st.fieldErr}>{errors[key]}</Text> : null}
                      </View>
                    ))}
                    <TouchableOpacity style={st.check} onPress={() => setKeep((k) => !k)} activeOpacity={0.8}>
                      <Ionicons name={keep ? "checkbox" : "square-outline"} size={22} color={C.greenLight} />
                      <Text style={st.checkText}>Es para mí: guardar la invitación en este teléfono</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={st.btn} onPress={register} disabled={sending} activeOpacity={0.85}>
                      {sending ? <ActivityIndicator color={C.bg} /> : <Text style={st.btnText}>Registrarme y recibir mi QR</Text>}
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={st.card}>
                <Text style={st.cardTitle}>Lista de invitados</Text>
                <Text style={st.muted}>Para sacar a alguien hace falta la contraseña que le llegó por mail al responsable de la empresa.</Text>
                {data.guests.length === 0 ? <Text style={st.muted}>Todavía no se anotó nadie.</Text> : null}
                {data.guests.map((g) => (
                  <View key={g.id} style={st.guest}>
                    <View style={{ flex: 1 }}>
                      <Text style={st.guestName}>{g.name}</Text>
                      <Text style={[st.muted, { color: g.checkedInAt ? C.gold : C.greenLight }]}>{g.checkedInAt ? "✓ Ingresó" : "Registrado"}</Text>
                    </View>
                    {g.removable ? (
                      <TouchableOpacity onPress={() => setRemoving({ guest: g, code: "" })} hitSlop={10} accessibilityLabel={`Sacar a ${g.name}`} style={st.x}>
                        <Ionicons name="close" size={18} color="#f87171" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))}
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          )}

          {removing ? (
            <View style={st.removeBox}>
              <Text style={st.cardTitle}>Sacar a {removing.guest.name}</Text>
              <Text style={st.muted}>Poné la contraseña del mail del responsable. Si todavía no ingresó, el lugar vuelve al cupo.</Text>
              <TextInput
                value={removing.code}
                onChangeText={(v) => setRemoving((r) => ({ ...r, code: v.toUpperCase(), error: null }))}
                style={st.input}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="Contraseña"
                placeholderTextColor="#5d7466"
              />
              {removing.error ? <Text style={st.fieldErr}>{removing.error}</Text> : null}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity style={[st.btn, st.btnGhost]} onPress={() => setRemoving(null)}>
                  <Text style={[st.btnText, { color: C.text }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[st.btn, { flex: 1, backgroundColor: "#f87171" }]} onPress={confirmRemove}>
                  <Text style={[st.btnText, { color: "#2a0505" }]}>Sacar de la lista</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10 },
  eyebrow: { flex: 1, color: C.greenLight, fontSize: 12, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  content: { padding: 18, gap: 14 },
  title: { color: C.text, fontSize: 24, fontWeight: "800" },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 10 },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  big: { color: C.text, fontSize: 26, fontWeight: "800" },
  muted: { color: C.muted, fontSize: 13, lineHeight: 19 },
  share: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 46, borderRadius: 12, backgroundColor: "#25d366", marginTop: 4 },
  shareText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  msg: { fontSize: 14, lineHeight: 20 },
  label: { color: C.muted, fontSize: 11, marginBottom: 6 },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: C.borderStrong, backgroundColor: C.bg, color: C.text, paddingHorizontal: 14, fontSize: 15 },
  inputErr: { borderColor: "#f87171" },
  fieldErr: { color: "#f87171", fontSize: 12, marginTop: 4 },
  err: { color: C.gold, fontSize: 15, textAlign: "center" },
  check: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  checkText: { color: C.soft, fontSize: 13, flex: 1 },
  btn: { minHeight: 50, borderRadius: 14, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: C.borderStrong },
  btnText: { color: C.bg, fontWeight: "800", fontSize: 15 },
  guest: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  guestName: { color: C.text, fontSize: 15, fontWeight: "700", textTransform: "capitalize" },
  x: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(248,113,113,.15)", alignItems: "center", justifyContent: "center" },
  removeBox: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#1a1206", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "rgba(245,196,0,.45)", padding: 18, gap: 10 },
});
