// Mis entradas: buscar las entradas de una compra web con el código del mail.
// shortcut: solo la pantalla; la búsqueda real se conecta cuando exista el endpoint en el backend.
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../components/feed/FeedCards";

const TicketsScreen = () => {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const search = () => {
    if (!code.trim()) return setMsg("Escribí el código que te llegó en el mail de compra.");
    setMsg("Muy pronto vas a poder ver tus entradas acá. Por ahora usá el link del mail de compra.");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={styles.title}>Mis entradas</Text>
            <Text style={styles.subtitle}>Quedan guardadas en el teléfono: funcionan sin señal</Text>
          </View>

          <View style={styles.empty}>
            <Ionicons name="ticket-outline" size={42} color={C.greenLight} />
            <Text style={styles.emptyTitle}>Todavía no tenés entradas en este teléfono</Text>
            <Text style={styles.emptyText}>Cuando compres desde la app o cargues tu código, aparecen acá con su QR.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>¿Compraste en la web?</Text>
            <Text style={styles.cardText}>Poné el código que te llegó en el mail de compra y te traemos todas tus entradas.</Text>
            <Text style={styles.label} nativeID="codeLabel">Código de compra</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={code}
                onChangeText={(t) => {
                  setCode(t.toUpperCase());
                  setMsg("");
                }}
                placeholder="Ej: ORD-0615-VJ9PSE"
                placeholderTextColor="#5d7466"
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabelledBy="codeLabel"
                style={styles.input}
                onSubmitEditing={search}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.btn} onPress={search} activeOpacity={0.85}>
                <Text style={styles.btnText}>Buscar</Text>
              </TouchableOpacity>
            </View>
            {msg ? <Text style={styles.msg}>{msg}</Text> : null}
          </View>
          <View style={{ height: 110 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 16 },
  title: { color: C.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 2 },
  empty: { alignItems: "center", gap: 8, paddingVertical: 28, borderRadius: 20, borderWidth: 1, borderColor: C.border, borderStyle: "dashed" },
  emptyTitle: { color: C.text, fontSize: 15, fontWeight: "700", textAlign: "center", paddingHorizontal: 20 },
  emptyText: { color: C.muted, fontSize: 13, textAlign: "center", paddingHorizontal: 24, lineHeight: 19 },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 10 },
  cardTitle: { color: C.text, fontSize: 15, fontWeight: "700" },
  cardText: { color: C.muted, fontSize: 13, lineHeight: 19 },
  label: { color: C.muted, fontSize: 11 },
  inputRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: C.borderStrong, backgroundColor: C.bg, color: C.text, paddingHorizontal: 14, fontSize: 15, letterSpacing: 1 },
  btn: { minHeight: 48, paddingHorizontal: 16, borderRadius: 12, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center" },
  btnText: { color: C.bg, fontWeight: "800", fontSize: 14 },
  msg: { color: C.gold, fontSize: 13, lineHeight: 19 },
});

export default TicketsScreen;
