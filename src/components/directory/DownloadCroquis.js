// src/components/directory/DownloadCroquis.jsx
//
// Banner llamativo para guardar/compartir el croquis oficial del predio.
// Usa expo-asset para resolver el archivo local empaquetado y expo-sharing
// para abrir la hoja nativa de compartir, donde el usuario puede elegir
// "Guardar en Fotos" / "Guardar imagen" (o mandarlo por WhatsApp, etc.).
//
// IMPORTANTE — por qué NO usamos expo-media-library acá:
// Guardar directo a la galería con MediaLibrary arrastra permisos de lectura
// (READ_MEDIA_IMAGES, etc.) que en el app.json bloqueamos a propósito para no
// chocar con la política de Fotos y Videos de Google Play. Con esos permisos
// bloqueados, el chequeo interno de MediaLibrary nunca resuelve a "granted" y
// el guardado falla. expo-sharing no necesita NINGÚN permiso en iOS ni Android,
// así que resuelve el problema y el riesgo de tienda de una sola vez.
//
// El feedback de error se muestra con un modal propio con la identidad de
// Agronea, en vez del Alert nativo (blanco y negro).

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../../styles/theme';

const PLANO = require('../../../assets/images/agroneacroquis.jpg');

// ─── Config visual del feedback ──────────────────────────────────────────────
// Con expo-sharing el único caso que puede fallar es que el dispositivo no
// pueda abrir la hoja de compartir. No hay caso de permiso (no pedimos ninguno)
// ni de éxito (cuando se abre la hoja no sabemos si el usuario guardó o canceló;
// la hoja en sí es el feedback).
const FEEDBACK_CONFIG = {
  error: {
    color: '#C0392B',
    icon: 'alert-circle',
    title: 'No se pudo abrir',
    message: 'No pudimos abrir el menú para guardar el croquis. Intentá de nuevo en un momento.',
    primaryLabel: 'Entendido',
  },
};

// ─── Modal de feedback con identidad Agronea ─────────────────────────────────
const FeedbackModal = ({ type, visible, onClose }) => {
  // Animación de entrada: el ícono "rebota" y la tarjeta hace fade+scale
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!type) return null;
  const cfg = FEEDBACK_CONFIG[type];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalCard,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Ícono grande con halo del color del caso */}
          <View style={[styles.iconHalo, { backgroundColor: cfg.color + '1A' }]}>
            <View style={[styles.iconCircle, { backgroundColor: cfg.color }]}>
              <Ionicons name={cfg.icon} size={34} color="#fff" />
            </View>
          </View>

          <Text style={styles.modalTitle}>{cfg.title}</Text>
          <Text style={styles.modalMessage}>{cfg.message}</Text>

          {/* Botón */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: cfg.color }]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>{cfg.primaryLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const DownloadCroquis = () => {
  const [saving, setSaving] = useState(false);
  // feedback: null | 'error'
  const [feedback, setFeedback] = useState(null);

  const handleDownload = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // 1. Resolver el asset empaquetado a un archivo físico
      const asset = Asset.fromModule(PLANO);
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      if (!uri) throw new Error('No se pudo resolver la ruta del croquis (uri vacío)');

      // 2. Chequear que el dispositivo pueda compartir (siempre true en celulares,
      //    pero conviene chequearlo por si acaso)
      if (!(await Sharing.isAvailableAsync())) {
        setFeedback('error');
        return;
      }

      // 3. Abrir la hoja nativa de compartir. El usuario elige qué hacer:
      //    "Guardar en Fotos" / "Guardar imagen", mandarlo por WhatsApp, etc.
      //    mimeType es para Android, UTI es el equivalente para iOS.
      await Sharing.shareAsync(uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Guardá o compartí el croquis del predio',
        UTI: 'public.jpeg',
      });
    } catch (e) {
      console.error('[DownloadCroquis] Error al compartir:', e?.message, e);
      setFeedback('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} onPress={handleDownload} disabled={saving}>
        <LinearGradient
          colors={[COLORS.primary, '#07702f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.iconBox}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="map" size={26} color="#fff" />
            )}
          </View>
          <View style={styles.texts}>
            <Text style={styles.title}>Descargá el croquis del predio</Text>
            <Text style={styles.sub}>Guardalo en tus fotos y orientate sin internet</Text>
          </View>
          <Ionicons name="download-outline" size={22} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <FeedbackModal
        type={feedback}
        visible={feedback !== null}
        onClose={() => setFeedback(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1 },
  title: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },

  // ─── Modal de feedback ───
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingTop: 26,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  iconHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1A2E1C',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#5B6B5C',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 22,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default DownloadCroquis;