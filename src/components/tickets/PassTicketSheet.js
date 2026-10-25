// Pasar una entrada a otra persona: le llega a su nombre por mail y el QR anterior deja de servir
import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";

const FIELDS = [
  ["firstName", "Nombre", { autoCapitalize: "words" }],
  ["lastName", "Apellido", { autoCapitalize: "words" }],
  ["dni", "DNI", { keyboardType: "number-pad" }],
  ["email", "Mail (ahí le llega la entrada)", { keyboardType: "email-address", autoCapitalize: "none", autoCorrect: false }],
];

export default function PassTicketSheet({ ticket, index, onSubmit, onClose }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", dni: "", email: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setSending(true);
    setMsg("");
    const res = await onSubmit(form);
    setSending(false);
    if (res?.ok) return;
    setErrors(res?.errors || {});
    setMsg(res?.message || "No pudimos pasar la entrada.");
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={s.backdrop} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 12 }}>
            <View style={s.head}>
              <Text style={s.eyebrow}>Pasar entrada {index + 1}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={14} accessibilityLabel="Cerrar">
                <Ionicons name="close" size={24} color={C.text} />
              </TouchableOpacity>
            </View>
            <Text style={s.title}>¿Quién va a usar esta entrada?</Text>
            <Text style={s.text}>Le llega por mail a su nombre, con su propio QR. El QR que tenés ahora deja de servir. Mientras no la use, la podés recuperar.</Text>
            {FIELDS.map(([key, label, props]) => (
              <View key={key}>
                <Text style={s.label}>{label}</Text>
                <TextInput
                  value={form[key]}
                  onChangeText={(v) => {
                    setForm((f) => ({ ...f, [key]: v }));
                    setErrors((e) => ({ ...e, [key]: undefined }));
                  }}
                  style={[s.input, errors[key] && s.inputError]}
                  placeholderTextColor="#5d7466"
                  {...props}
                />
                {errors[key] ? <Text style={s.error}>{errors[key]}</Text> : null}
              </View>
            ))}
            {msg ? <Text style={s.msg}>{msg}</Text> : null}
            <TouchableOpacity style={s.btn} onPress={submit} disabled={sending} activeOpacity={0.85}>
              {sending ? <ActivityIndicator color="#160424" /> : <Text style={s.btnText}>Pasar entrada</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,.7)" },
  sheet: { maxHeight: "92%", backgroundColor: "#120d18", borderTopLeftRadius: 26, borderTopRightRadius: 26, borderColor: "rgba(192,132,252,.45)", borderWidth: 1, padding: 18, paddingBottom: 34 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { color: "#c084fc", fontSize: 12, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: C.text, fontSize: 20, fontWeight: "800" },
  text: { color: C.muted, fontSize: 13, lineHeight: 19 },
  label: { color: C.muted, fontSize: 11, marginBottom: 6 },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: C.borderStrong, backgroundColor: C.bg, color: C.text, paddingHorizontal: 14, fontSize: 15 },
  inputError: { borderColor: "#f87171" },
  error: { color: "#f87171", fontSize: 12, marginTop: 4 },
  msg: { color: C.gold, fontSize: 13 },
  btn: { minHeight: 50, borderRadius: 14, backgroundColor: "#c084fc", alignItems: "center", justifyContent: "center", marginTop: 4 },
  btnText: { color: "#160424", fontWeight: "800", fontSize: 15 },
});
