// src/components/common/ChatFAB.js
// Botón flotante (FAB) que abre el chat a pantalla completa.
// Incluye un globito (pop-up) que aparece/desaparece solo cada tanto,
// rotando entre varios mensajes para invitar al usuario a usar el asistente.
// Se monta en MainTabNavigator para estar disponible en todas las pantallas.
//
// IMPORTANTE — NO volver a meter esto en un <Modal>.
// El chat se muestra como overlay (Animated.View con position absolute) dentro
// de la Activity principal, NO como Modal.
//
// El bug del teclado (input tapado en Android) NO lo causaba el Modal — lo
// causaba que el KeyboardAvoidingView de ChatScreen estaba apagado en Android
// + el edge-to-edge de SDK 54 que rompió el "resize" automático del app.json.
// Ese bug se arregla en ChatScreen.js (KAV enabled en ambas plataformas).
//
// El overlay NO es lo que arregla el teclado, pero conviene mantenerlo: al vivir
// en la ventana principal (y no en la ventana separada que abre un Modal), el KAV
// lee los eventos del teclado por el camino más confiable. La animación de slide
// y el botón "atrás" de Android, que el Modal daba gratis, se recrean a mano acá.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../styles/theme';
import ChatScreen from '../../screens/ChatScreen';

// ─── Mensajes que rota el globito ─────────────────────────────────────────────
// Pensados para encaminar al usuario: que sepa que hay un asistente y qué
// puede preguntarle. Se muestran en orden, uno por aparición.
const BUBBLE_MESSAGES = [
  '¿Tenés dudas? Preguntame 👋',
  '¿Buscás un expositor? Te digo en qué stand está 📍',
  '¿Querés ver el cronograma de charlas? 🎤',
  'Consultá horarios, entradas y cómo llegar 🎟️',
  '¿Necesitás algo del evento? Estoy para ayudarte 🌾',
];

// ─── Tiempos del ciclo del globito (en ms) ───────────────────────────────────
const FIRST_DELAY_MS   = 3500;   // espera inicial antes de la 1ª aparición
const VISIBLE_MS       = 5000;   // cuánto queda visible cada mensaje
const HIDDEN_MS        = 8000;   // pausa entre un mensaje y el siguiente

// Alto de pantalla para la animación de entrada del chat (slide desde abajo)
const SCREEN_H = Dimensions.get('window').height;

// ─── Globito (pop-up) ─────────────────────────────────────────────────────────
const ChatBubble = ({ text, anim }) => {
  // anim: 0 = oculto, 1 = visible. Controla opacidad, escala y desplazamiento.
  const opacity = anim;
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <Animated.View
      style={[
        styles.bubble,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
      // El globito no intercepta toques: que el usuario toque el FAB directamente
      pointerEvents="none"
    >
      <Text style={styles.bubbleText}>{text}</Text>
      {/* Colita del globo apuntando al FAB (abajo a la derecha) */}
      <View style={styles.bubbleTail} />
    </Animated.View>
  );
};

const ChatFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [bubbleText, setBubbleText] = useState(BUBBLE_MESSAGES[0]);
  const insets = useSafeAreaInsets();

  // Animaciones
  const scaleAnim = useRef(new Animated.Value(1)).current;    // rebote del FAB
  const bubbleAnim = useRef(new Animated.Value(0)).current;   // globito (0/1)
  const overlayAnim = useRef(new Animated.Value(0)).current;  // overlay del chat (0 = oculto/abajo, 1 = visible)

  // Refs para timers (para poder limpiarlos al desmontar)
  const timersRef = useRef([]);
  const indexRef = useRef(0); // índice actual sin depender del estado en los timers

  // Limpia todos los timers pendientes
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Muestra el globito, lo mantiene, lo esconde y programa el siguiente
  const runBubbleCycle = useCallback(() => {
    // Si el chat está abierto, no mostramos el globito
    if (isOpen) return;

    // Actualizo el texto al mensaje actual
    setBubbleText(BUBBLE_MESSAGES[indexRef.current]);

    // Aparece
    Animated.timing(bubbleAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Después de VISIBLE_MS, desaparece
    const hideTimer = setTimeout(() => {
      Animated.timing(bubbleAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Avanza al siguiente mensaje (rota en bucle)
      indexRef.current = (indexRef.current + 1) % BUBBLE_MESSAGES.length;
      setBubbleIndex(indexRef.current);

      // Programa el siguiente ciclo tras la pausa
      const nextTimer = setTimeout(runBubbleCycle, HIDDEN_MS);
      timersRef.current.push(nextTimer);
    }, VISIBLE_MS);

    timersRef.current.push(hideTimer);
  }, [isOpen, bubbleAnim]);

  // Arranca el ciclo al montar (con un delay inicial) y lo limpia al desmontar
  useEffect(() => {
    const startTimer = setTimeout(runBubbleCycle, FIRST_DELAY_MS);
    timersRef.current.push(startTimer);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si se abre el chat: esconde el globito y pausa el ciclo.
  // Al cerrarse, lo reanuda.
  useEffect(() => {
    if (isOpen) {
      clearTimers();
      Animated.timing(bubbleAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }).start();
    } else {
      // reanuda con un pequeño delay al volver
      const resume = setTimeout(runBubbleCycle, HIDDEN_MS);
      timersRef.current.push(resume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Botón "atrás" de Android: si el chat está abierto, lo cierra en vez de salir
  // de la app. Con Modal esto lo hacía onRequestClose; al ser overlay hay que
  // manejarlo a mano.
  useEffect(() => {
    if (!isOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true; // consumimos el evento para que no cierre la app
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Abre el chat: monta el overlay y lo desliza hacia arriba
  const openChat = () => {
    setIsOpen(true);
    overlayAnim.setValue(0);
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleOpen = () => {
    // Rebote del FAB y, al terminar, abrimos el chat
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => openChat());
  };

  // Cierra el chat: desliza hacia abajo y recién al terminar desmonta el overlay.
  // Por eso setIsOpen(false) va en el callback del .start(): si lo pusiéramos
  // antes, el overlay se desmontaría de golpe y no se vería la animación de salida.
  const handleClose = () => {
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  // Desplazamiento vertical del overlay: entra desde abajo (SCREEN_H) hacia 0.
  const translateY = overlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_H, 0],
  });

  return (
    <>
      {/* Contenedor del FAB + globito.
          Lo ocultamos mientras el chat está abierto para que no quede flotando
          por encima del overlay. */}
      {!isOpen && (
        <Animated.View
          style={[
            styles.fabWrapper,
            {
              bottom: 60 + insets.bottom + 16,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Globito arriba del FAB */}
          <ChatBubble text={bubbleText} anim={bubbleAnim} />

          {/* Botón flotante */}
          <TouchableOpacity
            style={styles.fab}
            onPress={handleOpen}
            activeOpacity={0.9}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Chat a pantalla completa como overlay (NO Modal).
          Al vivir dentro de la Activity principal hereda el
          softwareKeyboardLayoutMode:"resize" del app.json, así que el
          teclado empuja el input solo en Android. */}
      {isOpen && (
        <Animated.View style={[styles.chatOverlay, { transform: [{ translateY }] }]}>
          <ChatScreen onClose={handleClose} />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    right: 20,
    zIndex: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Alinea el globito a la derecha, sobre el FAB
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Overlay del chat ───
  chatOverlay: {
    ...StyleSheet.absoluteFillObject, // cubre top/left/right/bottom = 0 del contenedor
    zIndex: 1000,    // por encima del FAB (999)
    elevation: 1000, // Android usa elevation para el stacking en Z
    backgroundColor: COLORS.card || '#FFFFFF', // evita ver el fondo durante el slide
  },

  // ─── Globito ───
  bubble: {
    maxWidth: 230,
    backgroundColor: COLORS.card || '#FFFFFF',
    borderRadius: 16,
    borderBottomRightRadius: 6,   // esquina hacia el FAB
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,             // separación del FAB
    borderWidth: 1,
    borderColor: COLORS.border || '#E0EBE1',
    // sombra propia del globito
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text || '#1A2E1C',
    fontWeight: '600',
  },
  // Colita del globo (triangulito) apuntando al FAB
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    right: 18,
    width: 12,
    height: 12,
    backgroundColor: COLORS.card || '#FFFFFF',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border || '#E0EBE1',
    transform: [{ rotate: '45deg' }],
  },
});

export default ChatFAB;