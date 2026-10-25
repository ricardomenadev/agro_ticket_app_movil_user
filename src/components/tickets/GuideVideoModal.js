// Video instructivo (vertical, sin sonido) que viene dentro de la app: se ve aunque no haya señal
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";

export default function GuideVideoModal({ visible, source, title, onClose }) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={s.safe}>
        <View style={s.top}>
          <Text style={s.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={14} accessibilityLabel="Cerrar video">
            <Ionicons name="close" size={28} color={C.text} />
          </TouchableOpacity>
        </View>
        {visible ? <Video source={source} style={s.video} resizeMode={ResizeMode.CONTAIN} shouldPlay isMuted useNativeControls isLooping={false} /> : null}
        <TouchableOpacity style={s.btn} onPress={onClose} activeOpacity={0.85}>
          <Text style={s.btnText}>Entendido</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#06100a" },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10 },
  title: { color: C.text, fontSize: 16, fontWeight: "700", flex: 1 },
  video: { flex: 1 },
  btn: { margin: 18, minHeight: 50, borderRadius: 14, backgroundColor: C.greenLight, alignItems: "center", justifyContent: "center" },
  btnText: { color: C.bg, fontWeight: "800", fontSize: 15 },
});
