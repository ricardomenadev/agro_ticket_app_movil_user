// src/components/directory/StandMap.jsx
//
// Muestra el plano del predio con un pin verde pulsante sobre el stand.
// La vista arranca CENTRADA en el pin con un zoom suave, usando initialOffset
// (sin moveTo, que no centra bien con esta librería).

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

const PLANO = require('../../../assets/images/agroneacroquis.jpg');

// Dimensiones reales de la imagen del plano (ancho x alto en px).
const PLANO_W = 1600;
const PLANO_H = 1131;

// Zoom inicial suave (no tanto como antes)
const INITIAL_ZOOM = 1.35;

const StandMap = ({ standInfo }) => {
  const zoomRef = useRef(null);

  const pulse = useRef(new Animated.Value(0)).current;
  const [showHelp, setShowHelp] = useState(true);
  const helpOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [pulse]);

  useEffect(() => {
    if (!showHelp) return;
    helpOpacity.setValue(1);
    const t = setTimeout(() => {
      Animated.timing(helpOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setShowHelp(false));
    }, 4000);
    return () => clearTimeout(t);
  }, [showHelp, helpOpacity]);

  if (!standInfo?.mapPosition) return null;

  const { x, y } = standInfo.mapPosition;
  const pinLeft = `${x * 100}%`;
  const pinTop = `${y * 100}%`;

  // ── Cálculo del offset inicial para centrar la vista en el pin ──
  // initialOffsetX/Y mueve el contenido respecto al centro del viewport.
  // El pin está en (x, y) en porcentaje. La distancia desde el centro de la
  // imagen (0.5, 0.5) hasta el pin, en px y escalada por el zoom, es lo que
  // hay que desplazar (con signo negativo, porque mover el contenido a la
  // izquierda acerca un punto de la derecha al centro).
  const offsetX = -((x - 0.5) * PLANO_W) * INITIAL_ZOOM;
  const offsetY = -((y - 0.5) * PLANO_H) * INITIAL_ZOOM;

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 4.5] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  const resetView = () => {
    try { zoomRef.current?.zoomTo?.(1); } catch (e) {}
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.viewport}>
        <ReactNativeZoomableView
          ref={zoomRef}
          maxZoom={5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={INITIAL_ZOOM}
          initialOffsetX={offsetX}
          initialOffsetY={offsetY}
          bindToBorders={true}
          contentWidth={PLANO_W}
          contentHeight={PLANO_H}
          style={styles.zoomable}
        >
          <View style={styles.planoContainer}>
            <Image source={PLANO} style={styles.plano} resizeMode="contain" />

            <View style={[styles.pinAnchor, { left: pinLeft, top: pinTop }]}>
              <Animated.View
                style={[
                  styles.pulse,
                  { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
                ]}
              />
              <View style={styles.pinDot}>
                <Ionicons name="location" size={14} color="#fff" />
              </View>
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText}>Stand {standInfo.stand}</Text>
              </View>
            </View>
          </View>
        </ReactNativeZoomableView>

        {showHelp && (
          <Animated.View style={[styles.helpCard, { opacity: helpOpacity }]} pointerEvents="none">
            <View style={styles.helpRow}>
              <Ionicons name="finger-print-outline" size={18} color="#fff" />
              <Text style={styles.helpText}>Arrastrá con el dedo para moverte</Text>
            </View>
            <View style={styles.helpRow}>
              <Ionicons name="resize-outline" size={18} color="#fff" />
              <Text style={styles.helpText}>Pellizcá para acercar o alejar</Text>
            </View>
            <View style={styles.helpRow}>
              <Ionicons name="location" size={18} color={COLORS.primary} />
              <Text style={styles.helpText}>El punto verde es el stand que buscás</Text>
            </View>
          </Animated.View>
        )}

        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => setShowHelp(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="help" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Solo el botón de plano completo (saqué "Mi stand", era redundante) */}
        <TouchableOpacity style={styles.fullBtn} onPress={resetView} activeOpacity={0.8}>
          <Ionicons name="scan-outline" size={16} color="#fff" />
          <Text style={styles.fullBtnText}>Todo el plano</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  viewport: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zoomable: { flex: 1 },
  planoContainer: {
    width: PLANO_W,
    height: PLANO_H,
    position: 'relative',
  },
  plano: { width: '100%', height: '100%' },
  pinAnchor: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
  },
  pinDot: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinLabel: {
    position: 'absolute',
    bottom: 24,
    backgroundColor: '#111',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pinLabelText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  helpCard: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.78)',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  helpRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  helpText: { color: '#fff', fontSize: 13, fontWeight: '600', flex: 1 },

  helpBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fullBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  fullBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default StandMap;