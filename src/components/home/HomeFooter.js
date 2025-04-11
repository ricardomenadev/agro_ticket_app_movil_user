import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated, Image } from 'react-native';
import { Mail, Phone, MapPin, Clock, Instagram, Youtube, Facebook, Twitter, Linkedin } from 'lucide-react-native';
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
          { transform: [{ scale: scaleAnim }], backgroundColor: color }
        ]}
      >
        <Icon size={18} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeFooter = () => {
  // Referencias para animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    // Secuencia de animaciones para entrada
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
  
  const openEmail = () => {
    Linking.openURL('mailto:agroneacharata@gmail.com');
  };
  
  const openPhone = () => {
    Linking.openURL('tel:03731421873');
  };
  
  const openMap = () => {
    Linking.openURL('https://maps.app.goo.gl/yourGoogleMapsLink');
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      {/* Logo como imagen en lugar de texto */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/images/logos/agronea-logo2.png')}
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoRow} onPress={openPhone}>
          <Phone size={16} color={COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>03731 42-1873</Text>
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
        <SocialButton Icon={Youtube} url="https://youtube.com/agroneaTV" color="#FF0000" />
        <SocialButton Icon={Instagram} url="https://instagram.com/agronea" color="#E1306C" />
        <SocialButton Icon={Facebook} url="https://facebook.com/agronea" color="#1877F2" />
        <SocialButton Icon={Twitter} url="https://twitter.com/agronea" color="#1DA1F2" />
        <SocialButton Icon={Linkedin} url="https://linkedin.com/company/agronea" color="#0A66C2" />
      </View>
      
      <View style={styles.eventInfoContainer}>
        <Text style={styles.eventDate}>4·5·6 DE JULIO</Text>
        <Text style={styles.eventLocation}>CHARATA | CHACO | ARGENTINA</Text>
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
  eventInfoContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
});

export default HomeFooter;