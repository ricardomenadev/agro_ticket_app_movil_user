import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Linking,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const ContactItem = ({ icon, title, subtitle, onPress, color = COLORS.primary }) => {
  return (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      <View style={[styles.contactIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
};

const ContactScreen = () => {
  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/5493794222011');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:agroneacharata@gmail.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+5493794222011');
  };

  const handleLocation = () => {
    Linking.openURL('https://maps.app.goo.gl/rKai7BcMQEF3x6Z46');
  };

  const handleWebsite = () => {
    Linking.openURL('https://expoagronea.com');
  };

  const handleSocial = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logoAgronea2.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Contacto</Text>
          <Text style={styles.headerSubtitle}>
            Estamos aquí para ayudarte
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <ContactItem 
            icon="logo-whatsapp"
            title="WhatsApp"
            subtitle="+54 379 4222011"
            onPress={handleWhatsApp}
            color="#25D366"
          />

          <ContactItem 
            icon="call"
            title="Teléfono"
            subtitle="+54 379 4222011"
            onPress={handlePhone}
            color="#4CAF50"
          />

          <ContactItem 
            icon="mail"
            title="Email"
            subtitle="agroneacharata@gmail.com"
            onPress={handleEmail}
            color="#FF9800"
          />

          <ContactItem 
            icon="globe"
            title="Sitio Web"
            subtitle="expoagronea.com"
            onPress={handleWebsite}
            color="#2196F3"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oficinas</Text>
          
          <ContactItem 
            icon="location"
            title="Dirección"
            subtitle="Caseros 474 - Charata, Chaco"
            onPress={handleLocation}
            color="#F44336"
          />

          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleHeader}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={styles.scheduleTitle}>Horarios de Atención</Text>
            </View>
            <Text style={styles.scheduleText}>
              Lunes a viernes: 8:00 a 12:00hs | 16:00 a 20:00hs{'\n'}
              Sábados: 8:00 a 12:00hs{'\n'}
              Domingos: Cerrado
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redes Sociales</Text>
          
          <View style={styles.socialGrid}>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#FF000020' }]}
              onPress={() => handleSocial('https://www.youtube.com/@agroneaproducciones')}
            >
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <Text style={styles.socialText}>YouTube</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#E1306C20' }]}
              onPress={() => handleSocial('https://www.instagram.com/agroneachaco/?hl=es')}
            >
              <Ionicons name="logo-instagram" size={24} color="#E1306C" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#1877F220' }]}
              onPress={() => handleSocial('https://www.facebook.com/agroneachaco')}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#0A66C220' }]}
              onPress={() => handleSocial('https://www.linkedin.com/in/agronea-producciones-07b095162')}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Necesitas Ayuda?</Text>
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Nuestro equipo está disponible para resolver cualquier consulta sobre 
              nuestros eventos, entradas, estacionamiento y servicios.
            </Text>
            <Text style={styles.helpText}>
              La forma más rápida de contactarnos es a través de WhatsApp, donde 
              podremos atenderte de manera inmediata.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 70,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scheduleContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  helpContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
});

export default ContactScreen;