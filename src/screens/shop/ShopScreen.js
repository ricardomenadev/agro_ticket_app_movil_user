import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
  Alert,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

const STORE_URL = 'https://agronea.store';

const openStore = async () => {
  try {
    const supported = await Linking.canOpenURL(STORE_URL);
    if (supported) {
      await Linking.openURL(STORE_URL);
    } else {
      Alert.alert('Error', 'No se puede abrir el enlace. Visitá agronea.store desde tu navegador.');
    }
  } catch {
    Alert.alert('Error', 'Hubo un problema al abrir la tienda. Intentá nuevamente.');
  }
};

// ── PATRÓN DE CUADRADOS — identidad visual Agronea
// Mismo elemento que en los tickets y cards del web
const PatternGrid = ({ cols = 8, rows = 6, color = 'rgba(10,143,60,0.12)' }) => {
  const squares = Array.from({ length: cols * rows });
  return (
    <View style={[StyleSheet.absoluteFill, { flexDirection: 'row', flexWrap: 'wrap', padding: 5, gap: 4 }]}>
      {squares.map((_, i) => (
        <View
          key={i}
          style={{
            width: (screenWidth - 10 - (cols - 1) * 4) / cols,
            height: ((screenWidth * 0.55) - 10 - (rows - 1) * 4) / rows,
            borderRadius: 3,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
};

// ── CATEGORY CARD — mismo estilo que ProductCard del web
const CategoryCard = ({ icon, title, description, delay, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 400, delay,
        easing: Easing.out(Easing.ease), useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.categoryCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 },
      ]}
    >
      {/* Línea de acento verde→dorado — igual que ProductCard web */}
      <View style={styles.categoryCardAccent} />

      <View style={styles.categoryIconContainer}>
        <Ionicons name={icon} size={24} color="#4ade80" />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categoryDescription}>{description}</Text>
    </Animated.View>
  );
};

// ── FEATURE ITEM
const FeatureItem = ({ text, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 350, delay,
        easing: Easing.out(Easing.ease), useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.featureCheck}>
        <Ionicons name="checkmark" size={11} color="white" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
};

const ShopScreen = () => {
  const buttonScale = useRef(new Animated.Value(1)).current;
  const heroFade   = useRef(new Animated.Value(0)).current;
  const heroSlide  = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Entrada del hero
    Animated.parallel([
      Animated.timing(heroFade,  { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
      Animated.timing(heroSlide, {
        toValue: 0, duration: 500, delay: 100,
        easing: Easing.out(Easing.ease), useNativeDriver: true,
      }),
    ]).start();

    // Pulso sutil en el botón CTA
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 1.025, duration: 1200, useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1,     duration: 1200, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const categories = [
    { icon: 'ticket-outline',  title: 'Entradas',        description: 'Acceso general al evento y actividades' },
    { icon: 'shirt-outline',   title: 'Merchandising',   description: 'Remeras, gorras y productos oficiales' },
    { icon: 'gift-outline',    title: 'Souvenirs',       description: 'Recuerdos únicos de AGRONEA 2026' },
    { icon: 'car-outline',     title: 'Estacionamiento', description: 'Zonas seguras para vehículos y motos' },
  ];

  const features = [
    'Pago seguro con múltiples métodos',
    'Entrega inmediata de tickets digitales',
    'Soporte para consultas antes del evento',
    'Precios oficiales garantizados',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HERO — patrón de cuadrados + brillo radial + texto ── */}
        <View style={styles.heroContainer}>

          {/* Fondo base oscuro con gradiente verde sutil */}
          <LinearGradient
            colors={['#0a1a0a', '#080808', '#050505']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Patrón de cuadrados redondeados — identidad Agronea */}
          <PatternGrid cols={8} rows={6} color="rgba(10,143,60,0.1)" />

          {/* Brillo radial verde centrado */}
          <View style={styles.heroGlow} />

          {/* Contenido del hero */}
          <Animated.View
            style={[
              styles.heroContent,
              { opacity: heroFade, transform: [{ translateY: heroSlide }] },
            ]}
          >
            {/* Eyebrow */}
            <Text style={styles.heroEyebrow}>Tienda oficial · Agronea 2026</Text>

            {/* Título grande — igual que el web */}
            <Text style={styles.heroTitle}>
              TIENDA{'\n'}
              <Text style={styles.heroTitleAccent}>AGRONEA</Text>
            </Text>

            {/* Píldoras — mismo estilo que los tickets */}
            <View style={styles.heroPills}>
              {['28ª Edición', 'Jul 3–5 · 2026'].map((text) => (
                <View key={text} style={styles.heroPill}>
                  <Text style={styles.heroPillText}>{text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Línea cromática inferior — igual que en todos los componentes del web */}
          <View style={styles.heroLine} />

        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>

          {/* Metadata del evento — igual que el hero web */}
          <View style={styles.metaRow}>
            {[
              { label: 'Fecha', value: '3, 4 y 5 de Julio' },
              { label: 'Lugar', value: 'Ruta 16 km 264' },
              { label: 'Edición', value: '28ª' },
            ].map(({ label, value }) => (
              <View key={label} style={styles.metaItem}>
                <Text style={styles.metaLabel}>{label}</Text>
                <Text style={styles.metaValue}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.description}>
            Conseguí tus entradas y productos oficiales de AGRONEA 2026 desde nuestra tienda online. Rápido, seguro y desde donde estés.
          </Text>

          {/* Sección categorías */}
          <Text style={styles.sectionLabel}>¿QUÉ ENCONTRÁS?</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.title}
                icon={cat.icon}
                title={cat.title}
                description={cat.description}
                index={i}
                delay={200 + i * 80}
              />
            ))}
          </View>

          {/* Features card */}
          <View style={styles.featuresCard}>
            {features.map((f, i) => (
              <FeatureItem key={f} text={f} delay={500 + i * 70} />
            ))}
          </View>

          {/* CTA principal */}
          <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity onPress={openStore} activeOpacity={0.85} style={styles.buttonTouchable}>
              <LinearGradient
                colors={['#0A8F3C', '#064D20']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Ionicons name="bag-handle-outline" size={20} color="white" />
                <Text style={styles.buttonText}>IR A LA TIENDA</Text>
                <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.6)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* URL row */}
          <TouchableOpacity style={styles.urlRow} onPress={openStore} activeOpacity={0.7}>
            <Ionicons name="globe-outline" size={14} color="#0A8F3C" />
            <Text style={styles.urlText}>agronea.store</Text>
            <Ionicons name="open-outline" size={13} color="rgba(255,255,255,0.25)" />
          </TouchableOpacity>

          {/* Nota informativa */}
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={15} color="rgba(255,255,255,0.25)" />
            <Text style={styles.noteText}>
              Guardá el enlace en favoritos para acceder rápido antes del evento.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // ── HERO
  heroContainer: {
    height: screenWidth * 0.65, // proporcional al ancho de pantalla
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroGlow: {
    position: 'absolute',
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: screenWidth * 0.35,
    backgroundColor: 'transparent',
    // Brillo radial simulado con sombra
    shadowColor: '#0A8F3C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 80,
    alignSelf: 'center',
    top: '20%',
  },
  heroContent: {
    padding: 24,
    paddingBottom: 28,
  },
  heroEyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: 'rgba(10,143,60,0.85)',
    marginBottom: 8,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    lineHeight: 40,
    marginBottom: 12,
  },
  heroTitleAccent: {
    color: '#FFD700',
  },
  heroPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  heroPill: {
    backgroundColor: 'rgba(10,143,60,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(10,143,60,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  heroPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4ade80',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Línea cromática — igual que en el web
  heroLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    // LinearGradient no funciona en View nativo, simulamos con un degradé de color
    backgroundColor: '#0A8F3C',
    opacity: 0.8,
  },

  // ── BODY
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Metadata del evento
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  metaItem: {},
  metaLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.25)',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
  },

  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 21,
    marginBottom: 24,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 2,
    marginBottom: 12,
  },

  // Category cards — mismo estilo que ProductCard web
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryCard: {
    width: (screenWidth - 32 - 12) / 2,
    backgroundColor: '#0d1117',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(10,143,60,0.2)',
    overflow: 'hidden',
  },
  // Línea de acento igual que ProductCard web
  categoryCardAccent: {
    height: 2,
    marginHorizontal: -14,
    marginBottom: 12,
    marginTop: -14,
    backgroundColor: '#0A8F3C',
    opacity: 0.6,
  },
  categoryIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10,143,60,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(10,143,60,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    lineHeight: 16,
  },

  // Features card
  featuresCard: {
    backgroundColor: '#0d1117',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(10,143,60,0.2)',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0A8F3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },

  // Botón CTA
  buttonWrapper: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#0A8F3C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonTouchable: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 1,
  },

  // URL row
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginBottom: 16,
  },
  urlText: {
    fontSize: 14,
    color: '#0A8F3C',
    fontWeight: '600',
  },

  // Nota informativa
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#0d1117',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 70,
  },
  noteText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    lineHeight: 18,
    flex: 1,
  },
});

export default ShopScreen;