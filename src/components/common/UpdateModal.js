// src/components/common/UpdateModal.js

import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { COLORS } from "../../styles/theme";

const API_URL = __DEV__
  ? "http://192.168.1.244:5000/api"
  : "https://api.agronea.store/api";

const IOS_URL     = "https://apps.apple.com/us/app/agronea-producciones/id6752037646";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.agroapp.user";

// Compara versiones semánticas: "1.2.0" > "1.1.5" → true
const isNewerVersion = (latest, current) => {
  const parse = (v) => v.split(".").map(Number);
  const [la, lb, lc] = parse(latest);
  const [ca, cb, cc] = parse(current);
  if (la !== ca) return la > ca;
  if (lb !== cb) return lb > cb;
  return lc > cc;
};

const UpdateModal = ({ onDismiss }) => {
  const [visible,       setVisible]       = useState(false);
  const [forceUpdate,   setForceUpdate]   = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const scaleAnim = React.useRef(new Animated.Value(0.85)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_URL}/app/version`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) return;

      const json    = await response.json();
      const data    = json.data;
      const current = Constants.expoConfig?.version || "0.0.0";

      if (isNewerVersion(data.latestVersion, current)) {
        setForceUpdate(data.forceUpdate || false);
        setUpdateMessage(data.updateMessage || "");
        setVisible(true);
        animateIn();
      } else {
        // Sin update → avisar al padre para que arranque el timer del video
        onDismiss?.();
      }
    } catch {
      // Si falla el check, no bloqueamos nada — avisar al padre igual
      onDismiss?.();
    }
  };

  const animateIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const handleUpdate = () => {
    const url = Platform.OS === "ios" ? IOS_URL : ANDROID_URL;
    Linking.openURL(url);
  };

  const handleDismiss = () => {
    // Animar salida
    Animated.parallel([
      Animated.timing(scaleAnim,   { toValue: 0.9, duration: 180, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0,   duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      onDismiss?.(); // avisar al padre para que arranque el timer del video
    });
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={s.overlay}>
        <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>

          {/* Franja superior verde */}
          <View style={s.topStripe}>
            <Image
              source={require("../../../assets/images/logo_agronea_2026.png")}
              style={s.logo}
              resizeMode="contain"
            />
          </View>

          {/* Ícono de update */}
          <View style={s.iconWrapper}>
            <View style={s.iconCircle}>
              <Ionicons name="arrow-up-circle-outline" size={32} color={COLORS.primary} />
            </View>
          </View>

          {/* Contenido */}
          <View style={s.content}>
            <Text style={s.title}>¡Nueva versión disponible!</Text>
            <Text style={s.message}>{updateMessage}</Text>

            {/* Qué incluye — bloque visual */}
            <View style={s.featuresList}>
              {[
                { icon: "sparkles-outline",      text: "Nuevas funcionalidades" },
                { icon: "newspaper-outline",      text: "Últimas novedades del evento" },
                { icon: "shield-checkmark-outline", text: "Mejoras de estabilidad" },
              ].map((f) => (
                <View key={f.text} style={s.featureRow}>
                  <View style={s.featureIcon}>
                    <Ionicons name={f.icon} size={14} color={COLORS.primary} />
                  </View>
                  <Text style={s.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Botones */}
          <View style={s.buttons}>
            <TouchableOpacity style={s.btnPrimary} onPress={handleUpdate} activeOpacity={0.85}>
              <Ionicons name="download-outline" size={18} color="#fff" />
              <Text style={s.btnPrimaryText}>Actualizar ahora</Text>
            </TouchableOpacity>

            {/* Si es forceUpdate, no mostramos el botón de "Ahora no" */}
            {!forceUpdate && (
              <TouchableOpacity style={s.btnSecondary} onPress={handleDismiss} activeOpacity={0.75}>
                <Text style={s.btnSecondaryText}>Ahora no</Text>
              </TouchableOpacity>
            )}
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "100%",
    maxWidth: 360,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },

  // Franja verde superior
  topStripe: {
    backgroundColor: COLORS.primary,
    paddingVertical: 24,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 50,
  },

  // Ícono flotante
  iconWrapper: {
    alignItems: "center",
    marginTop: -22,
    marginBottom: 4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary + "30",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  // Contenido
  content: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A2E1C",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: "#6B8A6E",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 16,
  },

  // Features
  featuresList: {
    width: "100%",
    backgroundColor: "#F5F7F5",
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    fontSize: 13,
    color: "#1A2E1C",
    fontWeight: "500",
  },

  // Botones
  buttons: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  btnSecondary: {
    paddingVertical: 10,
    alignItems: "center",
  },
  btnSecondaryText: {
    fontSize: 14,
    color: "#6B8A6E",
    fontWeight: "500",
  },
});

export default UpdateModal;