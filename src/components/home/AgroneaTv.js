import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@agroneaproducciones';

// Cuando tengas el video nuevo, cambiá solo esta línea:
// const VIDEO_SOURCE = require('../../../assets/videos/agronea_tv.mp4');
const VIDEO_SOURCE = require('../../../assets/videos/agronea2026publi.mp4');

const AgroneaTV = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 1.04, duration: 1100, useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1, duration: 1100, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const openChannel = () => Linking.openURL(YOUTUBE_CHANNEL_URL);

  // Proporción 16:9 para el player
  const playerWidth = screenWidth - 32;
  const playerHeight = (playerWidth * 9) / 16;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Encabezado de sección */}
      <View style={styles.sectionHeader}>
        <View style={styles.accentLine} />
        <Text style={styles.sectionTitle}>Agronea TV</Text>
        <View style={styles.accentLine} />
      </View>

      {/* Card principal */}
      <View style={styles.card}>

        {/* Player de video local */}
        <View style={[styles.playerContainer, { height: playerHeight }]}>
          <Video
            source={VIDEO_SOURCE}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            // El usuario puede tocar para activar sonido si quiere
          />
          {/* Badge "SIN SONIDO" para que el usuario sepa que está muted */}
          <View style={styles.mutedBadge}>
            <Ionicons name="volume-mute" size={12} color="white" />
            <Text style={styles.mutedText}>SIN SONIDO</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.channelIcon}>
              <Ionicons name="logo-youtube" size={20} color="#FF0000" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.channelName}>Agronea TV</Text>
              <Text style={styles.channelSub}>Canal oficial de AGRONEA</Text>
            </View>
          </View>

          <View style={styles.bullets}>
            {[
              'Novedades y noticias del sector agroindustrial',
              'Videos y capacitaciones de ediciones anteriores',
              'Entrevistas y demostraciones a campo',
            ].map((item) => (
              <View key={item} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Botón canal */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity onPress={openChannel} activeOpacity={0.85} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#FF0000', '#CC0000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Ionicons name="logo-youtube" size={20} color="white" />
                <Text style={styles.buttonText}>VISITAR CANAL</Text>
                <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    zIndex: 0,        // asegura q no flote sobre otros componentes
  elevation: 0,
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
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  playerContainer: {
  width: '100%',
  backgroundColor: '#000',
  position: 'relative',
  zIndex: 0,
},
  video: {
    width: '100%',
    height: '100%',
  },
  mutedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mutedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoSection: {
    padding: 16,
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.2)',
  },
  infoText: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  channelSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bullets: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 19,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    gap: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default AgroneaTV;