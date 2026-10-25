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

const InfoCard = ({ icon, title, description, color = COLORS.primary }) => {
  return (
    <View style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
    </View>
  );
};

// Card de WESYX con el nuevo lenguaje visual — fondo oscuro + acento naranja
const WesyxCard = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.wesyxCard} onPress={onPress} activeOpacity={0.9}>
      {/* Encabezado con logo tipográfico */}
      <View style={styles.wesyxHeader}>
        <Text style={styles.wesyxLogo}>
          WESY<Text style={styles.wesyxX}>X</Text>
        </Text>
        <Text style={styles.wesyxSub}>SOFTWARE DESIGN</Text>
        <View style={styles.wesyxDivider} />
      </View>

      {/* Features */}
      <View style={styles.wesyxFeatures}>
        {[
          'Desarrollo móvil nativo iOS & Android',
          'Backend escalable y APIs',
          'Sitios web y e-commerce',
        ].map((f) => (
          <View key={f} style={styles.wesyxFeatureRow}>
            <View style={styles.wesyxFeatureDot} />
            <Text style={styles.wesyxFeatureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Botones de contacto */}
      <View style={styles.wesyxButtons}>
        <TouchableOpacity
          style={styles.wesyxBtnWhatsapp}
          onPress={() => Linking.openURL('https://wa.me/+5493794739888?text=Hola, me interesa desarrollar una app para mi empresa')}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-whatsapp" size={16} color="white" />
          <Text style={styles.wesyxBtnText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wesyxBtnWeb}
          onPress={() => Linking.openURL('https://wesyx.com')}
          activeOpacity={0.85}
        >
          <Ionicons name="globe-outline" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.wesyxBtnTextWeb}>wesyx.com</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const AppVersionScreen = () => {
  const appVersion = "1.1.0";
  const buildNumber = "18";
  const releaseDate = "Abril 2026";

  const handleDeveloperContact = () => {
    Alert.alert(
      "Contactar Desarrollador",
      "¿Cómo te gustaría contactar a WESYX?",
      [
        { text: "WhatsApp", onPress: () => Linking.openURL('https://wa.me/+5493794739888') },
        { text: "Sitio Web", onPress: () => Linking.openURL('https://wesyx.com') },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const handleSupport = () => {
    Linking.openURL('https://wa.me/5493794222011?text=Hola, necesito soporte técnico para la app AGRONEA');
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
          <Text style={styles.appName}>AGRONEA PRODUCCIONES</Text>
          <Text style={styles.appTagline}>Conectando el campo argentino</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la App</Text>

          <InfoCard
            icon="information-circle"
            title={`Versión ${appVersion}`}
            description={`Build ${buildNumber} - Lanzamiento ${releaseDate}`}
            color="#2196F3"
          />
          <InfoCard
            icon="shield-checkmark"
            title="Estado de la App"
            description="Funcionando correctamente - Última actualización disponible"
            color="#4CAF50"
          />
          <InfoCard
            icon="rocket"
            title="Nuevas Funcionalidades"
            description="Expositores, eventos, noticias y tienda oficial"
            color="#FF9800"
          />
        </View>

        {/* ── SECCIÓN WESYX ── */}
        <View style={styles.wesyxSection}>
          <View style={styles.wesyxSectionHeader}>
            <View style={styles.wesyxAccentLine} />
            <Text style={styles.wesyxSectionTitle}>Desarrollado por</Text>
            <View style={styles.wesyxAccentLine} />
          </View>
          <WesyxCard onPress={handleDeveloperContact} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte Técnico</Text>

          <TouchableOpacity style={styles.supportItem} onPress={handleSupport}>
            <Ionicons name="headset" size={24} color="#25D366" />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>¿Problemas con la app?</Text>
              <Text style={styles.supportDescription}>
                Contáctanos por WhatsApp para soporte técnico inmediato
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 AGRONEA PRODUCCIONES S.R.L</Text>
          <Text style={styles.footerSubtext}>Sistema desarrollado por WESYX Software Design</Text>
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
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // ── SECCIÓN WESYX ──
  wesyxSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  wesyxSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  wesyxAccentLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FF6B1A40',
  },
  wesyxSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  wesyxCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    borderTopWidth: 2,
    borderTopColor: '#FF6B1A',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftColor: '#FF6B1A20',
    borderRightColor: '#FF6B1A20',
    borderBottomColor: '#FF6B1A20',
    padding: 20,
    gap: 16,
  },
  wesyxHeader: {
    alignItems: 'center',
    gap: 4,
  },
  wesyxLogo: {
    fontSize: 28,
    
    color: 'white',
    letterSpacing: 4,
    fontFamily: 'Orbitron-Bold',
  },
  wesyxX: {
    color: '#FF6B1A',
  },
  wesyxSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 5,
    fontFamily: 'Orbitron-Bold',
  },
  wesyxDivider: {
    width: 32,
    height: 2,
    backgroundColor: '#FF6B1A',
    borderRadius: 2,
    marginTop: 8,
  },
  wesyxFeatures: {
    gap: 8,
  },
  wesyxFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wesyxFeatureDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FF6B1A',
  },
  wesyxFeatureText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  wesyxButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  wesyxBtnWhatsapp: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 12,
  },
  wesyxBtnWeb: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,107,26,0.15)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B1A40',
  },
  wesyxBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  wesyxBtnTextWeb: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },

  // Soporte y footer
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  supportContent: {
    flex: 1,
    marginLeft: 16,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 100,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default AppVersionScreen;