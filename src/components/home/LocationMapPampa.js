import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Platform, Animated, Easing } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { COLORS } from '../../styles/theme';

const LocationPampa = () => {
  // Referencias para animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada con delay para que aparezca después de Charata
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Animación pulsante para el botón
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Función para abrir ubicación en la app de mapas (necesitarás las coordenadas exactas)
  const openMaps = () => {
    // Coordenadas aproximadas para Pampa del Infierno - deberás actualizarlas con las exactas del predio
    const latitude = '-25.9333';
    const longitude = '-61.0833';
    const label = 'Expo AgroNea Pampa del Infierno 2025';
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });
    
    Linking.openURL(url);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.header}>
        <MapPin size={24} color={styles.pampaColors.primary} />
        <Text style={styles.title}>EXPO AGRONEA - PAMPA DEL INFIERNO</Text>
      </View>
      
      <Text style={styles.subtitle}>Ruta 16, km 264 - Pampa del Infierno | Departamento Almirante Brown | Chaco</Text>
      
      <TouchableOpacity 
        style={styles.mapContainer}
        activeOpacity={0.9}
        onPress={openMaps}
      >
        <Image 
          source={require('../../../assets/images/LogoAgroneaPampa.png')} 
          style={styles.mapImage}
          resizeMode="contain"
        />
        <View style={styles.mapOverlay}>
          {/* <MapPin size={42} color={styles.pampaColors.primary} /> */}
        </View>
      </TouchableOpacity>
      
      <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: styles.pampaColors.primary }]}
          activeOpacity={0.8}
          onPress={openMaps}
        >
          <Navigation size={18} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>CÓMO LLEGAR</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Colores específicos para Pampa del Infierno basados en la imagen
  pampaColors: {
    primary: '#E53E3E', // Rojo de la imagen
    secondary: '#FF8C42', // Naranja/amarillo de la imagen
    accent: '#C53030', // Rojo más oscuro
  },
  container: {
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  mapContainer: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(229, 62, 62, 0.08)', // Overlay con color rojizo
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LocationPampa;