import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../styles/theme';

const LocationMap = () => {
  const pinScale = useRef(new Animated.Value(1)).current;
  const haloScale = useRef(new Animated.Value(1)).current;
  const haloOpacity = useRef(new Animated.Value(0.7)).current;
  // Segunda onda de radar con delay para efecto más rico
  const halo2Scale = useRef(new Animated.Value(1)).current;
  const halo2Opacity = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada del componente
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pin: pulso suave
    Animated.loop(
      Animated.sequence([
        Animated.timing(pinScale, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pinScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Halo 1: onda de radar principal
    Animated.loop(
      Animated.parallel([
        Animated.timing(haloScale, {
          toValue: 2.8,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(haloOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Halo 2: segunda onda con delay para efecto de pulso continuo
    setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(halo2Scale, {
            toValue: 2.8,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(halo2Opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 1000); // 1 segundo de delay entre ondas
  }, []);

  const openMaps = () => {
    const lat = '-27.262216476969268';
    const lng = '-61.20339774210497';
    const label = 'Expo Agronea Charata 2026';
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });
    Linking.openURL(url);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Encabezado de sección */}
      <View style={styles.sectionHeader}>
        <View style={styles.accentLine} />
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <View style={styles.accentLine} />
      </View>

      {/* Card principal */}
      <View style={styles.card}>
        {/* Mapa con pin encima — ocupa todo el ancho del card */}
        <TouchableOpacity
          style={styles.mapTouchable}
          activeOpacity={0.95}
          onPress={openMaps}
        >
          <Image
            source={require('../../../assets/images/mapa_charata.jpg')}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Gradiente oscuro en la parte inferior del mapa para que el badge se lea */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.mapGradient}
          />

          {/* Pin animado con doble onda de radar */}
          <View style={styles.pinWrapper}>
            <Animated.View
              style={[
                styles.halo,
                { transform: [{ scale: haloScale }], opacity: haloOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.halo,
                { transform: [{ scale: halo2Scale }], opacity: halo2Opacity },
              ]}
            />
            <Animated.View
              style={[styles.pinContainer, { transform: [{ scale: pinScale }] }]}
            >
              <Ionicons name="location" size={30} color="white" />
            </Animated.View>
          </View>

          {/* Badge de ubicación flotante sobre el gradiente inferior del mapa */}
          <View style={styles.locationBadge}>
            <Ionicons name="navigate-circle" size={16} color={COLORS.primary} />
            <Text style={styles.locationBadgeText}>RN89 km 72.5 · Charata, Chaco</Text>
          </View>

          {/* Hint de tap */}
          <View style={styles.tapHint}>
            <Ionicons name="finger-print-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.tapHintText}>Toca para abrir en Maps</Text>
          </View>
        </TouchableOpacity>

        {/* Fila de info debajo del mapa */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>3, 4 y 5 Jul 2026</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>9 hs a 18 hs</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Ionicons name="sunny-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>Al aire libre</Text>
          </View>
        </View>

        {/* Botón Cómo llegar */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={openMaps}
        >
          <LinearGradient
            colors={[COLORS.primary, '#06732F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Ionicons name="navigate-outline" size={18} color="white" />
            <Text style={styles.buttonText}>CÓMO LLEGAR</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  accentLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary + '60',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Sombra verde sutil
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  mapTouchable: {
    height: 220,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  // Pin centrado en el predio — ajustar top/left si hace falta
  pinWrapper: {
    position: 'absolute',
    top: '50%',
    left: '44%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '55',
  },
  pinContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 7,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 36,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tapHint: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  tapHintText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default LocationMap;