import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated, Image } from 'react-native';
import { Mail, Phone, MapPin, Clock, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../styles/theme';

const SocialButton = ({ Icon, url, color }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      onPressIn={() => {
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start();
      }}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.socialButton,
          { transform: [{ scale: scaleAnim }], backgroundColor: color },
        ]}
      >
        <Icon size={18} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Botón especial para X — usa SVG inline porque lucide no tiene el logo oficial
const XButton = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL('https://x.com/AgroneaChaco')}
      onPressIn={() => {
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start();
      }}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.socialButton,
          { transform: [{ scale: scaleAnim }], backgroundColor: '#000000' },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="white">
          <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeFooter = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openEmail = () => Linking.openURL('mailto:agroneacharata@gmail.com');
  const openWhatsApp = () => Linking.openURL('https://wa.me/5493794222011');
  const openMap = () => Linking.openURL('https://maps.app.goo.gl/rKai7BcMQEF3x6Z46');

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/logos/logoAgronea2.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Conectando el campo argentino desde 1997</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoRow} onPress={openWhatsApp}>
          <Phone size={16} color={COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>+54 379 4222011</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoRow} onPress={openEmail}>
          <Mail size={16} color={COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>agroneacharata@gmail.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoRow} onPress={openMap}>
          <MapPin size={16} color={COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>Caseros 539 - Charata | Chaco</Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <Clock size={16} color={COLORS.primary} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoText}>Lunes a viernes: 8 a 12hs. | 16 a 20hs.</Text>
            <Text style={styles.infoText}>Sábados: 8 a 12hs.</Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.socialSection}>
        <SocialButton Icon={Youtube}   url="https://www.youtube.com/@agroneaproducciones"               color="#FF0000" />
        <SocialButton Icon={Instagram} url="https://www.instagram.com/agroneachaco/?hl=es"              color="#E1306C" />
        <SocialButton Icon={Facebook}  url="https://www.facebook.com/agroneachaco"                      color="#1877F2" />
        <SocialButton Icon={Linkedin}  url="https://www.linkedin.com/in/agronea-producciones-07b095162" color="#0A66C2" />
        <XButton />
      </View>

      <View style={styles.corporateInfoContainer}>
        <Text style={styles.companyName}>AGRONEA PRODUCCIONES</Text>
        <Text style={styles.companyExperience}>27 AÑOS CONECTANDO EL CAMPO ARGENTINO</Text>
      </View>

      {/* ── WESYX — bloque "desarrollado por", discreto al final ── */}
      <View style={styles.wesyxContainer}>
        <View style={styles.wesyxContent}>
          <Text style={styles.wesyxTagline}>DESARROLLADO POR</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://wesyx.com')} style={{ alignItems: 'center' }}>
            <Text style={styles.wesyxLogo}>
              WESY<Text style={styles.wesyxX}>X</Text>
            </Text>
            <Text style={styles.wesyxSub}>SOFTWARE DESIGN</Text>
          </TouchableOpacity>
        </View>
      </View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 0,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  logoImage: {
    width: 600,
    height: 300,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: -20,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  socialSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  corporateInfoContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  companyExperience: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 16,
  },

  // WESYX
  wesyxContainer: {
    marginHorizontal: -24,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 2,
    borderTopColor: '#FF6B1A',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B1A',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  wesyxContent: {
    alignItems: 'center',
    gap: 4,
  },
  wesyxLogo: {
    fontSize: 22,
    fontFamily: 'Orbitron-Bold',
    color: 'white',
    letterSpacing: 3,
  },
  wesyxX: {
    color: '#FF6B1A',
  },
  wesyxSub: {
    fontSize: 9,
    fontFamily: 'Orbitron-Bold',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 5,
    fontWeight: '500',
  },
  wesyxDivider: {
    width: 32,
    height: 2,
    backgroundColor: '#FF6B1A',
    borderRadius: 2,
    marginVertical: 6,
  },
  wesyxWeb: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
  },
  wesyxTagline: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 4,
  },
});

export default HomeFooter;