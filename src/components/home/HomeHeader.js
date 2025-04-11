import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { COLORS } from '../../styles/theme';
import { Bell } from 'lucide-react-native';

const HomeHeader = () => {
  // Crear referencias para animaciones
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Iniciar animación al montar el componente
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Interpolaciones para animaciones
  const logoScale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.92, 1.03, 1]
  });

  const fadeIn = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Logo y título en una fila */}
        <View style={styles.brandContainer}>
          <Animated.View
            style={{
              transform: [{ scale: logoScale }]
            }}
          >
            <Image
              source={require('../../../assets/images/logos/agronea-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.titleContainer,
              { opacity: fadeIn }
            ]}
          >
            <Text style={styles.title}>Agronea </Text>
            <Text style={styles.title}>2025</Text>
          </Animated.View>
        </View>
        
        {/* Botón de notificaciones */}
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={22} color={COLORS.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    height: '100%', // Altura fija para evitar fluctuaciones
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 40,
    borderRadius: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#17823B', // Verde de Agronea
  },
  year: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#17823B',
    marginBottom: 4,
    marginLeft: 2,
  },
  
  notificationButton: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700', // Color dorado similar al de la web
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#17823B', // Verde sobre fondo dorado
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HomeHeader;