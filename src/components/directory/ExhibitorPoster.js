import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';
import { getStandInfo } from '../../constants/standPositions';
import StandMap from './StandMap';

const { width, height } = Dimensions.get('window');

// Imagen de fallback cuando el expositor no tiene poster todavía
const FALLBACK_IMAGE = require('../../../assets/images/agronea2026publi.jpg');

const LinkButton = ({ icon, label, onPress, animatedValue }) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 0],
          }),
        },
      ],
    }}
  >
    <TouchableOpacity style={styles.linkBtn} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={20} color={COLORS.textSecondary} />
      <Text style={styles.linkBtnText}>{label}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const ExhibitorPoster = ({ exhibitor, visible, onClose }) => {
  const infoAnim = useRef(new Animated.Value(0)).current;
  const LINK_KEYS = ['whatsapp', 'email', 'instagram', 'facebook', 'youtube', 'linkedin', 'twitter', 'web'];
  const btnAnims = useRef(LINK_KEYS.map(() => new Animated.Value(0))).current;

  // ref del ScrollView + posición Y del mapa, para hacer scroll automático
  const scrollRef = useRef(null);
  const mapY = useRef(0);

  useEffect(() => {
    if (visible) {
      infoAnim.setValue(0);
      btnAnims.forEach(a => a.setValue(0));

      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 380,
        delay: 120,
        useNativeDriver: true,
      }).start();

      const staggerAnimations = btnAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 260,
          delay: 300 + i * 70,
          useNativeDriver: true,
        })
      );
      Animated.parallel(staggerAnimations).start();
    }
  }, [visible]);

  if (!exhibitor) return null;

  // Info de ubicación del stand (viene de standPositions.js)
  const standInfo = getStandInfo(exhibitor.id);
  const hasMap = !!standInfo?.mapPosition;

  // Hace scroll suave hasta el mapa
  const scrollToMap = () => {
    if (!hasMap) return;
    scrollRef.current?.scrollTo({ y: Math.max(mapY.current - 80, 0), animated: true });
  };

  const openWhatsApp = () => {
    if (!exhibitor.whatsapp) return;
    Linking.openURL(`https://wa.me/${exhibitor.whatsapp}`);
  };
  const openEmail = () => {
    if (!exhibitor.email) return;
    Linking.openURL(`mailto:${exhibitor.email}`);
  };
  const openInstagram = () => {
    if (!exhibitor.instagram) return;
    Linking.openURL(`instagram://user?username=${exhibitor.instagram}`)
      .catch(() => Linking.openURL(`https://instagram.com/${exhibitor.instagram}`));
  };
  const openFacebook = () => {
    if (!exhibitor.facebook) return;
    const url = exhibitor.facebook.startsWith('http')
      ? exhibitor.facebook
      : `https://facebook.com/${exhibitor.facebook}`;
    Linking.openURL(url);
  };
  const openYoutube = () => {
    if (!exhibitor.youtube) return;
    const url = exhibitor.youtube.startsWith('http')
      ? exhibitor.youtube
      : `https://youtube.com/@${exhibitor.youtube}`;
    Linking.openURL(url);
  };
  const openLinkedin = () => {
    if (!exhibitor.linkedin) return;
    const url = exhibitor.linkedin.startsWith('http')
      ? exhibitor.linkedin
      : `https://linkedin.com/company/${exhibitor.linkedin}`;
    Linking.openURL(url);
  };
  const openTwitter = () => {
    if (!exhibitor.twitter) return;
    const url = exhibitor.twitter.startsWith('http')
      ? exhibitor.twitter
      : `https://x.com/${exhibitor.twitter}`;
    Linking.openURL(url);
  };
  const openWeb = () => {
    if (!exhibitor.web) return;
    const url = exhibitor.web.startsWith('http')
      ? exhibitor.web
      : `https://${exhibitor.web}`;
    Linking.openURL(url);
  };

  const LINK_CONFIG = [
    { key: 'whatsapp',  icon: 'logo-whatsapp',  label: 'WhatsApp',  onPress: openWhatsApp },
    { key: 'email',     icon: 'mail-outline',    label: 'Email',     onPress: openEmail },
    { key: 'instagram', icon: 'logo-instagram',  label: 'Instagram', onPress: openInstagram },
    { key: 'facebook',  icon: 'logo-facebook',   label: 'Facebook',  onPress: openFacebook },
    { key: 'youtube',   icon: 'logo-youtube',    label: 'YouTube',   onPress: openYoutube },
    { key: 'linkedin',  icon: 'logo-linkedin',   label: 'LinkedIn',  onPress: openLinkedin },
    { key: 'twitter',   icon: 'logo-twitter',    label: 'Twitter/X', onPress: openTwitter },
    { key: 'web',       icon: 'globe-outline',   label: 'Web',       onPress: openWeb },
  ];

  const activeLinks = LINK_CONFIG.filter(l => exhibitor[l.key]);
  const hasLinks = activeLinks.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Poster del expositor */}
            <Image
              source={exhibitor.poster ?? FALLBACK_IMAGE}
              style={styles.posterImage}
              resizeMode="cover"
            />

            <Animated.View
              style={[
                styles.content,
                {
                  opacity: infoAnim,
                  transform: [
                    {
                      translateY: infoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [28, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.name}>{exhibitor.name}</Text>

              {/* Badge de stand TOCABLE — al tocar, baja al mapa */}
              {standInfo?.stand && (
                <TouchableOpacity
                  style={styles.standBadge}
                  onPress={scrollToMap}
                  activeOpacity={hasMap ? 0.6 : 1}
                  disabled={!hasMap}
                >
                  <Ionicons name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.standText}>Stand: {standInfo.stand}</Text>
                  {hasMap && (
                    <Ionicons name="chevron-down" size={14} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}

              {exhibitor.description ? (
                <Text style={styles.description}>{exhibitor.description}</Text>
              ) : null}

              {hasLinks && (
                <View style={styles.linksSection}>
                  <Text style={styles.linksSectionTitle}>Contacto</Text>
                  <View style={styles.linksRow}>
                    {activeLinks.map((link) => {
                      const animIndex = LINK_KEYS.indexOf(link.key);
                      return (
                        <LinkButton
                          key={link.key}
                          icon={link.icon}
                          label={link.label}
                          onPress={link.onPress}
                          animatedValue={btnAnims[animIndex]}
                        />
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Ubicación en el predio — guardamos su Y para el scroll */}
              {hasMap && (
                <View
                  style={styles.locationSection}
                  onLayout={(e) => { mapY.current = e.nativeEvent.layout.y; }}
                >
                  <Text style={styles.linksSectionTitle}>Ubicación en el predio</Text>
                  <StandMap standInfo={standInfo} />
                </View>
              )}

              <View style={styles.offlineNotice}>
                <Ionicons name="wifi-outline" size={13} color={COLORS.border} />
                <Text style={styles.offlineText}>
                  Algunos links pueden no funcionar sin conexión
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  closeBtn: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 18,
    padding: 8,
  },
  scroll: { flex: 1 },
  posterImage: { width, height: height * 0.55 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  standBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
  },
  standText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 20,
  },
  linksSection: { marginBottom: 20 },
  linksSectionTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  linksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linkBtn: {
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkBtnText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  locationSection: { marginBottom: 4 },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
  },
  offlineText: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
});

export default ExhibitorPoster;